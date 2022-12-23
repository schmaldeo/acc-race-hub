import fs from "fs";
import chokidar from "chokidar";
import { MongoClient } from "mongodb";
import { flatten, $set, $inc } from "mongo-dot-notation";
import yn from "yn";
import _pointsMap from "./pointsMap.json" assert { type: "json" };
import _carsMap from "./carsMap.json" assert { type: "json" };
import manufacturersChamp from "./manufacturersChamp.js";
import teamsChamp from "./teamsChamp.js";
import {
  ParsedLeaderboardEntry,
  ManufacturersElement,
  LeaderboardLines,
  EntrylistEntry,
  ClassesGroupped,
  ChampionshipEntry,
  Races,
} from "./types";

const carsMap: {[index: string]: string} = _carsMap;
const pointsMap: {[index: string]: number} = _pointsMap;

const raceResults = () => {
  if (!process.env.MONGO_URI) throw new Error("Mongo URI not specified");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  const db = client.db(process.env.MONGO_DB_NAME || "acc_race_hub");
  const raceCollection = db.collection<Races>(process.env.MONGO_RACE_COLLECTION_NAME || "race_results");
  const champCollection = db.collection<ChampionshipEntry>(process.env.MONGO_STANDINGS_COLLECTION_NAME || "drivers_standings");
  const entrylistCollection = db.collection<EntrylistEntry>(process.env.MONGO_ENTRYLIST_COLLECTION_NAME || "entrylist");
  const manufacturersCollection = db.collection(process.env.MONGO_CONSTRUCTORS_COLLECTION_NAME || "manufacturers_standings");

  const resultsFolder = process.env.RESULTS_FOLDER;
  if (!resultsFolder) throw new Error("No results folder provided in .env");
  chokidar.watch(resultsFolder, { ignoreInitial: true }).on("add", (file) => {
    // Reading the JSON file output by the server. It's encoded in UTF-16 LE,
    // therefore need to pass the argument for JSON.parse() to work correctly
    fs.readFile(`${file}`, "utf8", async (err, data) => {
      const dataParsed = JSON.parse(data.toString());

      // make sure it only processes race dumps
      if (dataParsed.sessionType === "R") {
        const leaderboard: ParsedLeaderboardEntry[] = [];
        const lbForManufacturers: ManufacturersElement[] = [];
        const laps = dataParsed.sessionResult.leaderBoardLines[0].timing.lapCount;
        dataParsed.sessionResult.leaderBoardLines.forEach((entry: LeaderboardLines, index: number) => {
          leaderboard.push(
            {
              playerId: entry.car.drivers[0].playerId,
              bestLap: entry.timing.bestLap,
              lapCount: entry.timing.lapCount,
              totalTime: entry.timing.totalTime,
            },
          );
          entry.timing.lapCount >= laps - 5 && index < 15 && lbForManufacturers.push({
            car: entry.car.carModel,
            place: index,
          });
        });

        const manufacturersStandings = manufacturersChamp(lbForManufacturers);

        const existingRaceEntry = await raceCollection.findOne({ race: dataParsed.serverName });
        if (existingRaceEntry) {
          raceCollection.updateOne(existingRaceEntry, flatten({
            results: $set(leaderboard),
          }));
        } else {
          raceCollection.insertOne({
            race: dataParsed.serverName,
            track: dataParsed.trackName,
            qualifyingResults: [],
            results: leaderboard,
          });
        }

        Object.keys(manufacturersStandings).forEach(async (manufacturer) => {
          const manufacturersFetched = await manufacturersCollection.find().toArray();
          const points = manufacturersStandings[manufacturer];
          if (!manufacturersFetched.find((e) => e.car === carsMap[manufacturer])) {
            manufacturersCollection.insertOne({
              car: carsMap[manufacturer],
              points,
            });
          } else {
            manufacturersCollection.updateOne({ car: carsMap[manufacturer] }, flatten({
              points: $inc(points),
            }));
          }
        });

        const classesGroupped: {
          [index: string]: ClassesGroupped[]
        } = { pro: [], silver: [], am: [] };

        // This is required due to how ACC indexes its classes
        const classes: {
          [index: number]: string;
        } = {
          0: "am",
          1: "silver",
          3: "pro",
        };
        const classesFetched = await entrylistCollection.find().toArray();

        classesFetched.forEach((driver) => {
          classesGroupped[classes[driver.drivers[0].driverCategory]].push({
            playerId: driver.drivers[0].playerID,
            place: leaderboard.indexOf(leaderboard.find((e) => e.playerId === driver.drivers[0].playerID) as ParsedLeaderboardEntry),
            result: null,
          });
        });

        Object.keys(classesGroupped).forEach((c) => {
          classesGroupped[c].forEach((driver) => {
            if (leaderboard.find((e) => e.playerId === driver.playerId)) {
              driver.result = leaderboard.find((e) => e.playerId === driver.playerId) || null;
            }
          });

          classesGroupped[c].sort((a, b) => {
            // Sort -1's at the end because these are DNS's
            if (leaderboard.indexOf(leaderboard.find((e) => e.playerId === a.playerId) as ParsedLeaderboardEntry) === -1) {
              return 1;
            } if (leaderboard.indexOf(leaderboard.find((e) => e.playerId === b.playerId) as ParsedLeaderboardEntry) === -1) {
              return -1;
            }
            return leaderboard.indexOf(leaderboard.find((e) => e.playerId === a.playerId) as ParsedLeaderboardEntry) - leaderboard.indexOf(leaderboard.find((e) => e.playerId === b.playerId) as ParsedLeaderboardEntry);
          });

          const best = classesGroupped[c]
            .filter((e) => e.result && e.result.lapCount > laps - 5)
            .reduce((prev, curr) => (prev.result && curr.result && prev.result.bestLap < curr.result.bestLap ? prev : curr));
          best.result!.fastestLap = true;

          classesGroupped[c].forEach(async (driver, index) => {
            const existing = await champCollection.findOne({ playerId: driver.playerId });
            if (driver.result) {
              // TODO make a smarter way of figuring out if a driver has DNF'd
              let dnf;
              driver.result.lapCount < laps - 10 ? dnf = true : dnf = false;

              let pointsToAward;
              if (!dnf && pointsMap[index + 1]) {
                driver.result.fastestLap ? pointsToAward = pointsMap[index + 1] + 3 : pointsToAward = pointsMap[index + 1];
              } else {
                pointsToAward = 0;
              }

              if (!existing) {
                champCollection.insertOne({
                  playerId: driver.playerId,
                  points: pointsToAward,
                  pointsWDrop: pointsToAward,
                  finishes: { [dataParsed.trackName]: [dnf ? "DNF" : index + 1, driver.result.fastestLap === true, pointsToAward] },
                });
              } else {
                const existingPoints = [];
                Object.values(existing.finishes).forEach((round) => {
                  pointsMap[round[0]] ? round[1] === true ? existingPoints.push(pointsMap[round[0]] + 3) : existingPoints.push(pointsMap[round[0]]) : existingPoints.push(0);
                });
                existingPoints.push(pointsToAward);
                const toDrop = existingPoints.indexOf(Math.min(...existingPoints));
                existingPoints.length > 1 && (existingPoints[toDrop] = 0);
                const dropPoints = existingPoints.reduce((prev, curr) => prev + curr, 0);
                const updated = {
                  points: $inc(pointsToAward),
                  pointsWDrop: dropPoints,
                  roundDropped: toDrop,
                  [`finishes.${dataParsed.trackName}`]: $set([dnf ? "DNF" : index + 1, driver.result.fastestLap === true, pointsToAward]),
                };
                champCollection.updateOne({ playerId: driver.playerId }, flatten(updated));
              }
            } else {
              if (!existing) {
                champCollection.insertOne({
                  playerId: driver.playerId,
                  points: 0,
                  pointsWDrop: 0,
                  finishes: { [dataParsed.trackName]: ["DNS", false, 0] },
                });
              } else {
                const existingPoints = [];
                Object.values(existing.finishes).forEach((round) => {
                  pointsMap[round[0]] ? round[1] === true ? existingPoints.push(pointsMap[round[0]] + 3) : existingPoints.push(pointsMap[round[0]]) : existingPoints.push(0);
                });
                existingPoints.push(0);
                const toDrop = existingPoints.indexOf(Math.min(...existingPoints));
                existingPoints.length > 1 && (existingPoints[toDrop] = 0);
                const dropPoints = existingPoints.reduce((prev, curr) => prev + curr, 0);

                const updated = {
                  pointsWDrop: dropPoints,
                  roundDropped: toDrop,
                  [`finishes.${dataParsed.trackName}`]: $set(["DNS", false, 0]),
                };
                champCollection.updateOne({ playerId: driver.playerId }, flatten(updated));
              }
            }
          });
        });
      }
    });
    yn(process.env.CALCULATE_TEAMS_POINTS) && setTimeout(() => teamsChamp(), 2000);
  });
};

export default raceResults;

import fs from "fs";
import chokidar from "chokidar";
import { MongoClient, ServerApiVersion } from "mongodb";
import { flatten, $set, $inc } from "mongo-dot-notation";
import pointsMap from "./pointsMap.json" assert { type: "json" };
import carsMap from "./carsMap.json" assert { type: "json" };
import manufacturersChamp from "./manufacturersChamp.js";
import teamsChamp from "./teamsChamp.js";

const raceResults = () => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
  );
  const db = client.db(process.env.MONGO_DB_NAME);
  const raceCollection = db.collection(process.env.MONGO_RACE_COLLECTION_NAME);
  const champCollection = db.collection(process.env.MONGO_STANDINGS_COLLECTION_NAME);
  const entrylistCollection = db.collection(process.env.MONGO_ENTRYLIST_COLLECTION_NAME);
  const manufacturersCollection = db.collection(process.env.MONGO_CONSTRUCTORS_COLLECTION_NAME);

  chokidar.watch(process.env.RESULTS_FOLDER, { ignoreInitial: true }).on("add", (file) => {
    // Reading the JSON file output by the server. It's encoded in UTF-16 LE,
    // therefore need to pass the argument for JSON.parse() to work correctly
    fs.readFile(`${file}`, "utf16le", async (err, data) => {
      const json = JSON.parse(data.toString());

      // make sure it only processes race dumps
      if (json.sessionType === "R") {
        // Push relevant info on finishing order to the array
        const leaderboard = [];
        const lbForManufacturers = [];
        const laps = json.sessionResult.leaderBoardLines[0].timing.lapCount;
        json.sessionResult.leaderBoardLines.forEach((entry, index) => {
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

        raceCollection.insertOne({
          race: json.serverName,
          track: json.trackName,
          results: leaderboard,
        });

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

        const classesGroupped = { pro: [], silver: [], am: [] };

        const classes = {
          0: "am",
          1: "silver",
          3: "pro",
        };
        const classesFetched = await entrylistCollection.find().toArray();
        classesFetched.forEach((driver) => {
          classesGroupped[classes[driver.drivers[0].driverCategory]].push({
            playerId: driver.drivers[0].playerID,
            place: leaderboard.indexOf(leaderboard.find((e) => e.playerId === driver.drivers[0].playerID)),
            result: null,
          });
        });

        Object.keys(classesGroupped).forEach((c) => {
          classesGroupped[c].forEach((driver) => {
            if (leaderboard.find((e) => e.playerId === driver.playerId)) {
              driver.result = leaderboard.find((e) => e.playerId === driver.playerId);
            }
          });

          classesGroupped[c].sort((a, b) => {
            if (leaderboard.indexOf(leaderboard.find((e) => e.playerId === a.playerId)) === -1) {
              return 1;
            } if (leaderboard.indexOf(leaderboard.find((e) => e.playerId === b.playerId)) === -1) {
              return -1;
            }
            return leaderboard.indexOf(leaderboard.find((e) => e.playerId === a.playerId)) - leaderboard.indexOf(leaderboard.find((e) => e.playerId === b.playerId));
          });

          const best = classesGroupped[c]
            .filter((e) => e.result)
            .filter((e) => e.result.lapCount > laps - 5)
            .reduce((prev, curr) => (prev.result.bestLap < curr.result.bestLap ? prev : curr));
          best.result.fastestLap = true;

          classesGroupped[c].forEach(async (driver, index) => {
            const existing = await champCollection.findOne({ playerId: driver.playerId });
            if (driver.result) {
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
                  finishes: { [json.trackName]: [dnf ? "DNF" : index + 1, driver.result.fastestLap === true, pointsToAward] },
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
                  [`finishes.${json.trackName}`]: $set([dnf ? "DNF" : index + 1, driver.result.fastestLap === true, pointsToAward]),
                };
                champCollection.updateOne({ playerId: driver.playerId }, flatten(updated));
              }
            } else {
              if (!existing) {
                champCollection.insertOne({
                  playerId: driver.playerId,
                  points: 0,
                  pointsWDrop: 0,
                  finishes: { [json.trackName]: ["DNS", false, 0] },
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
                  [`finishes.${json.trackName}`]: $set(["DNS", false, 0]),
                };
                champCollection.updateOne({ playerId: driver.playerId }, flatten(updated));
              }
            }
          });
        });
      }
    });
    setTimeout(() => teamsChamp(), 2000);
  });
};

export default raceResults;

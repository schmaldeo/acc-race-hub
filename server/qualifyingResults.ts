import fs from "fs";
import chokidar from "chokidar";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { flatten, $set } from "mongo-dot-notation";
import {
  QualifyingResults, LeaderboardLines, Lap, Races,
} from "./types";

dotenv.config();

const qualifyingResults = () => {
  if (!process.env.MONGO_URI) throw new Error("Mongo URI not specified");
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  const db = client.db(process.env.MONGO_DB_NAME || "acc_race_hub");
  const raceCollection = db.collection<Races>(process.env.MONGO_RACE_COLLECTION_NAME || "race_results");

  const resultsFolder = process.env.RESULTS_FOLDER;
  if (!resultsFolder) throw new Error("No results folder provided in .env");

  chokidar.watch(resultsFolder, { ignoreInitial: true }).on("add", (file) => {
    fs.readFile(file, "utf16le", async (err, data) => {
      const dataParsed = JSON.parse(data.toString());

      const leaderboard: QualifyingResults[] = [];

      if (dataParsed.sessionType === "Q") {
        dataParsed.sessionResult.leaderBoardLines.forEach((driver: LeaderboardLines) => {
          leaderboard.push({
            carId: driver.car.carId,
            playerId: driver.car.drivers[0].playerId,
            bestLap: driver.timing.bestLap,
            lapCount: driver.timing.lapCount,
            laps: [],
          });
        });

        leaderboard.forEach((driver) => {
          dataParsed.laps.forEach((lap: Lap) => {
            if (lap.carId === driver.carId) {
              if (lap.isValidForBest) {
                driver.laps.push(lap.laptime);
              }
            }
          });
          delete driver.carId;
        });
        leaderboard.sort((a, b) => a.bestLap - b.bestLap);
        const existing = await raceCollection.findOne({ race: dataParsed.serverName });
        if (existing) {
          raceCollection.updateOne(existing, flatten({ qualifyingResults: $set(leaderboard) }));
        } else {
          raceCollection.insertOne({
            race: dataParsed.serverName,
            track: dataParsed.trackName,
            results: [],
            qualifyingResults: leaderboard,
          });
        }
      }
    });
  });
};

export default qualifyingResults;

import fs from "fs";
import chokidar from "chokidar";
import { MongoClient } from "mongodb";
import { LeaderboardLines, Leaderboard, Lap } from "./types";

const classQuali = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("No Mongo URI provided");
  const client = new MongoClient(uri);
  const db = client.db(process.env.MONGO_DB_NAME);
  const collection = db.collection(process.env.MONGO_CLASS_QUALIFYING_COLLECTION_NAME || "class_qualifying");

  const leaderboard: Leaderboard[] = [];

  const resultsFolder = process.env.RESULTS_FOLDER;
  if (!resultsFolder) throw new Error("No results folder provided in .env");
  chokidar.watch(resultsFolder, { ignoreInitial: true }).on("add", async (file) => {
    // Reading the JSON file output by the server. It's encoded in UTF-16 LE,
    // therefore need to pass the argument for JSON.parse() to work correctly
    fs.readFile(`${file}`, "utf16le", (err, data) => {
      if (err) throw err;
      const json = JSON.parse(data.toString());
      json.sessionResult.leaderBoardLines.forEach((e: LeaderboardLines) => {
        leaderboard.push({
          carId: e.car.carId,
          name: `${e.car.drivers[0].firstName} ${e.car.drivers[0].lastName}`,
          playerId: e.car.drivers[0].playerId,
          bestLap: e.timing.bestLap,
          laps: [],
        });
      });

      leaderboard.forEach((driver) => {
        json.laps.forEach((lap: Lap) => {
          if (lap.carId === driver.carId) {
            if (lap.isValidForBest) {
              driver.laps.push(lap.laptime);
            }
          }
        });
        delete driver.carId;
      });

      client.connect(() => {
        leaderboard.forEach((driver) => {
          collection.findOne({ playerId: driver.playerId }, (error, doc) => {
            if (error) throw error;
            if (doc) {
              let newBestLap;
              if (driver.bestLap < doc.bestLap) {
                newBestLap = driver.bestLap;
              } else {
                newBestLap = doc.bestLap;
              }
              collection.updateOne(
                { playerId: driver.playerId },
                {
                  $push: { laps: { $each: driver.laps } },
                  $set: { bestLap: newBestLap },
                },
              );
            } else {
              collection.insertOne(driver);
            }
          });
        });
      });
    });
  });
};

export default classQuali;

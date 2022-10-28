import fs from "fs";
import chokidar from "chokidar";
import { MongoClient, ServerApiVersion } from "mongodb";
import { msToLaptime } from "./helpers.js";
import carsMap from "./carsMap.js";
import pointsMap from "./pointsMap.js";

const raceResults = () => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
  );
  const db = client.db(process.env.MONGO_DB_NAME);
  const raceCollection = db.collection(process.env.MONGO_RACE_COLLECTION_NAME);
  const champCollection = db.collection(process.env.MONGO_STANDINGS_COLLECTION_NAME);

  chokidar.watch(process.env.RESULTS_FOLDER, { ignoreInitial: true }).on("add", (file) => {
    // Reading the JSON file output by the server. It's encoded in UTF-16 LE,
    // therefore need to pass the argument for JSON.parse() to work correctly
    fs.readFile(`${file}`, "utf16le", (err, data) => {
      if (err) throw err;
      const json = JSON.parse(data.toString());

      // Make a leaderboard of each class for the race uploaded
      const leaderboard = [[], [], []];
      json.sessionResult.leaderBoardLines.forEach((entry) => {
        switch (entry.car.cupCategory) {
          case 0:
            leaderboard[0].push(
              {
                driver: entry.car.drivers[0],
                car: carsMap[entry.car.carModel],
                number: entry.car.raceNumber,
                class: "Pro",
                bestLap: msToLaptime(entry.timing.bestLap),
                lapCount: entry.timing.lapCount,
                totalTime: entry.timing.totalTime,
              },
            );
            break;
          case 2:
            leaderboard[1].push(
              {
                driver: entry.car.drivers[0],
                car: carsMap[entry.car.carModel],
                number: entry.car.raceNumber,
                class: "AM",
                bestLap: msToLaptime(entry.timing.bestLap),
                lapCount: entry.timing.lapCount,
                totalTime: entry.timing.totalTime,
              },
            );
            break;
          case 3:
            leaderboard[2].push(
              {
                driver: entry.car.drivers[0],
                car: carsMap[entry.car.carModel],
                number: entry.car.raceNumber,
                class: "Silver",
                bestLap: msToLaptime(entry.timing.bestLap),
                lapCount: entry.timing.lapCount,
                totalTime: entry.timing.totalTime,
              },
            );
            break;
          default:
            console.error("wrong class");
        }
      });

      client.connect(() => {
        // Insert race results into the DB
        raceCollection.insertOne({
          race: json.serverName,
          track: json.trackName,
          results: leaderboard,
        });

        // Calculate how many points a driver should get based on their class
        // and insert them into the standings collection or update their record
        leaderboard.forEach((c) => {
          c.forEach((driver, index) => {
            champCollection.findOne({ playerId: driver.driver.playerId }, (error, doc) => {
              if (error) throw error;

              let pointsToAward;
              if (pointsMap[index + 1]) {
                pointsToAward = pointsMap[index + 1];
              } else {
                pointsToAward = 0;
              }

              if (doc) {
                champCollection.updateOne(
                  { playerId: driver.driver.playerId },
                  {
                    $inc: { points: pointsToAward },
                  },
                );
              } else {
                champCollection.insertOne({
                  playerId: driver.driver.playerId,
                  name: `${driver.driver.firstName} ${driver.driver.lastName}`,
                  points: pointsToAward,
                  class: driver.class,
                  number: driver.number,
                });
              }
            });
          });
        });
      });
    });
  });
};

export default raceResults;

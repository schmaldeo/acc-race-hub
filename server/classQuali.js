import fs from "fs";
import chokidar from "chokidar";
import { MongoClient, ServerApiVersion } from "mongodb";

const classQuali = () => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
  );
  const db = client.db(process.env.MONGO_DB_NAME);
  const collection = db.collection(process.env.MONGO_COLLECTION_NAME);

  const leaderboard = [];

  chokidar.watch(process.env.RESULTS_FOLDER, { ignoreInitial: true }).on("add", async (file) => {
    // Reading the JSON file output by the server. It's encoded in UTF-16 LE,
    // therefore need to pass the argument for JSON.parse() to work correctly
    fs.readFile(`${file}`, "utf16le", (err, data) => {
      if (err) throw err;
      const json = JSON.parse(data.toString());
      // Loop through each player's laptimes and push the best ones into the leaderboard array.
      json.sessionResult.leaderBoardLines.forEach((e) => {
        leaderboard.push({
          carId: e.car.carId,
          name: `${e.car.drivers[0].firstName} ${e.car.drivers[0].lastName}`,
          playerId: e.car.drivers[0].playerId,
          bestLap: e.timing.bestLap,
        });
      });
      // Loop through laptimes and push all valid laps as an array
      // and amount of valid laps into each object in the leaderboard array (each driver).
      leaderboard.forEach((driver) => {
        driver.laps = [];
        json.laps.forEach((lap) => {
          if (lap.carId === driver.carId) {
            if (lap.isValidForBest) {
              driver.laps.push(lap.laptime);
            }
          }
        });
        driver.amountOfValidLaps = driver.laps.length;
        // delete carId because it's redundant and carries no useful information in the database
        delete driver.carId;
      });

      // Look for a driver in database, if exists - update, if doesn't - insert
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
                  $inc: { amountOfValidLaps: driver.amountOfValidLaps },
                  $set: { bestLap: newBestLap },
                },
              );
            } else {
              collection.insertOne(driver);
            }
          });
        });
        // Clear the leaderboard array after processing a file is done
        leaderboard.length = 0;
      });
    });
  });
};

export default classQuali;

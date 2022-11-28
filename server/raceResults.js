/* eslint-disable no-nested-ternary */
import fs from "fs";
import chokidar from "chokidar";
import { MongoClient, ServerApiVersion } from "mongodb";
import { flatten, $set, $inc } from "mongo-dot-notation";
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
  const entrylistCollection = db.collection(process.env.MONGO_ENTRYLIST_COLLECTION_NAME);

  chokidar.watch(process.env.RESULTS_FOLDER, { ignoreInitial: true }).on("add", (file) => {
    // Reading the JSON file output by the server. It's encoded in UTF-16 LE,
    // therefore need to pass the argument for JSON.parse() to work correctly
    fs.readFile(`${file}`, "utf16le", (err, data) => {
      if (err) throw err;
      const json = JSON.parse(data.toString());

      // make sure it only processes race dumps
      if (json.sessionType === "R") {
        // Push relevant info on finishing order to the array
        const leaderboard = [];
        const laps = json.sessionResult.leaderBoardLines[0].timing.lapCount;
        json.sessionResult.leaderBoardLines.forEach((entry) => {
          leaderboard.push(
            {
              playerId: entry.car.drivers[0].playerId,
              bestLap: entry.timing.bestLap,
              lapCount: entry.timing.lapCount,
              totalTime: entry.timing.totalTime,
            },
          );
        });

        client.connect(async () => {
          raceCollection.insertOne({
            race: json.serverName,
            track: json.trackName,
            results: leaderboard,
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
            classesGroupped[c].sort((a, b) => leaderboard.indexOf(a) - leaderboard.indexOf(b));
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
                // eslint-disable-next-line no-lonely-if
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
        });

        // client.connect(async () => {
        //   // Insert race results into the DB
        //   raceCollection.insertOne({
        //     race: json.serverName,
        //     track: json.trackName,
        //     results: leaderboard,
        //   });

        //   // Create a temporary array for each class to calculate points
        //   const tempLeaderboard = { pro: [], silver: [], am: [] };
        //   let el = [];

        //   // find out which class a driver is in by searching for them in the entrylistCollection, then push into the array
        //   leaderboard.forEach((driver) => {
        //     el.push(entrylistCollection.findOne(
        //       { drivers: { $elemMatch: { playerID: driver.playerId } } },
        //     ));
        //   });
        //   el = await Promise.all(el);

        // const classes = {
        //   0: "am",
        //   1: "silver",
        //   3: "pro",
        // };

        //   el.forEach((driver) => {
        //     tempLeaderboard[classes[driver.drivers[0].driverCategory]]
        //       .push(leaderboard.find((e) => e.playerId === driver.drivers[0].playerID));
        //   });

        //   // Find out which drivers are already in the championship standings collection in the database
        //   let driversAlreadyInTheChampionship = [];

        //   Object.keys(tempLeaderboard).forEach((arr) => {
        //     // find out who had purple in each class
        // const best = tempLeaderboard[arr]
        //   .filter((e) => e.lapCount > laps - 5)
        //   .reduce((prev, curr) => (prev.bestLap < curr.bestLap ? prev : curr));
        //     best.fastestLap = true;
        //     tempLeaderboard[arr].forEach((driver) => {
        //       driversAlreadyInTheChampionship
        //         .push(champCollection.findOne({ playerId: driver.playerId }));
        //     });
        //   });

        //   // filter this array out so that there's no null values to mess with Array.prototype.some() used later
        //   driversAlreadyInTheChampionship = (await Promise.all(driversAlreadyInTheChampionship)).filter((e) => e);

        // Object.keys(tempLeaderboard).forEach((arr) => {
        //   tempLeaderboard[arr].forEach(async (driver, index) => {
        //     // find out if a driver did not finish by checking if they were more than 10 laps down by the end, probably has to be changed
        //     let dnf;
        //     driver.lapCount < laps - 10 ? dnf = true : dnf = false;

        //     // calculate points to be awarded
        //     let pointsToAward;
        //     if (!dnf && pointsMap[index + 1]) {
        //       driver.fastestLap ? pointsToAward = pointsMap[index + 1] + 3 : pointsToAward = pointsMap[index + 1];
        //     } else {
        //       pointsToAward = 0;
        //     }

        //     // if driver is already in the championship standings collection update their entry, if they aren't add one
        //     if (!driversAlreadyInTheChampionship.some((e) => e.playerId === driver.playerId)) {
        //       champCollection.insertOne({
        //         playerId: driver.playerId,
        //         points: pointsToAward,
        //         pointsWDrop: pointsToAward,
        //         finishes: { [json.trackName]: [dnf ? "DNF" : index + 1, driver.fastestLap === true, pointsToAward] },
        //       });
        //     } else {
        //       const existing = await champCollection.findOne({ playerId: driver.playerId });
        //       const existingPoints = [];
        //       Object.values(existing.finishes).forEach((round) => {
        //         pointsMap[round[0]] ? existingPoints.push(pointsMap[round[0]]) : existingPoints.push(0);
        //       });
        //       existingPoints.push(pointsToAward);
        //       const toDrop = existingPoints.indexOf(Math.min(...existingPoints));
        //       existingPoints.length > 1 && (existingPoints[toDrop] = 0);
        //       const dropPoints = existingPoints.reduce((prev, curr) => prev + curr, 0);

        //       // console.log(toDrop);
        //       const updated = {
        //         points: $inc(pointsToAward),
        //         pointsWDrop: dropPoints,
        //         roundDropped: toDrop,
        //         [`finishes.${json.trackName}`]: $set([dnf ? "DNF" : index + 1, driver.fastestLap === true, pointsToAward]),
        //       };
        //       champCollection.updateOne({ playerId: driver.playerId }, flatten(updated));
        //     }
        //   });
        // });
        // });
      }
    });
  });
};

export default raceResults;

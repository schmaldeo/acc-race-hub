var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import chokidar from "chokidar";
import { MongoClient } from "mongodb";
const classQuali = () => {
    const uri = process.env.MONGO_URI;
    if (!uri)
        throw new Error("No Mongo URI provided");
    const client = new MongoClient(uri);
    const db = client.db(process.env.MONGO_DB_NAME);
    if (!process.env.MONGO_QUALI_COLLECTION_NAME)
        throw new Error("No collection name provided");
    const collection = db.collection(process.env.MONGO_QUALI_COLLECTION_NAME);
    const leaderboard = [];
    const resultsFolder = process.env.RESULT_FOLDER;
    if (!resultsFolder)
        throw new Error("no result folder provided");
    chokidar.watch(resultsFolder, { ignoreInitial: true }).on("add", (file) => __awaiter(void 0, void 0, void 0, function* () {
        // Reading the JSON file output by the server. It's encoded in UTF-16 LE,
        // therefore need to pass the argument for JSON.parse() to work correctly
        fs.readFile(`${file}`, "utf16le", (err, data) => {
            if (err)
                throw err;
            const json = JSON.parse(data.toString());
            // Loop through each player's laptimes and push the best ones into the leaderboard array.
            json.sessionResult.leaderBoardLines.forEach((e) => {
                leaderboard.push({
                    carId: e.car.carId,
                    name: `${e.car.drivers[0].firstName} ${e.car.drivers[0].lastName}`,
                    playerId: e.car.drivers[0].playerId,
                    bestLap: e.timing.bestLap,
                    laps: [],
                });
            });
            // Loop through laptimes and push all valid laps as an array
            // and amount of valid laps into each object in the leaderboard array (each driver).
            leaderboard.forEach((driver) => {
                json.laps.forEach((lap) => {
                    if (lap.carId === driver.carId) {
                        if (lap.isValidForBest) {
                            driver.laps.push(lap.laptime);
                        }
                    }
                });
                driver.amountOfValidLaps = driver.laps.length;
                // delete carId because it's redundant
                delete driver.carId;
            });
            // Look for a driver in database, if exists - update, if doesn't - insert
            client.connect(() => {
                leaderboard.forEach((driver) => {
                    collection.findOne({ playerId: driver.playerId }, (error, doc) => {
                        if (error)
                            throw error;
                        if (doc) {
                            // if newly pushed data contains the new fastest lap push it to db
                            let newBestLap;
                            if (driver.bestLap < doc.bestLap) {
                                newBestLap = driver.bestLap;
                            }
                            else {
                                newBestLap = doc.bestLap;
                            }
                            collection.updateOne({ playerId: driver.playerId }, {
                                $push: { laps: { $each: driver.laps } },
                                $inc: { amountOfValidLaps: driver.amountOfValidLaps },
                                $set: { bestLap: newBestLap },
                            });
                        }
                        else {
                            collection.insertOne(driver);
                        }
                    });
                });
            });
        });
    }));
};
export default classQuali;

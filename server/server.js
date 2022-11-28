/* eslint-disable import/no-extraneous-dependencies */
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import carsMap from "./carsMap.json" assert { type: "json" };

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Mongo URI not specified");
if (!process.env.MONGO_ENTRYLIST_COLLECTION_NAME) throw new Error("Entrylist collection not specified");
const client = new MongoClient(uri);
const db = client.db(process.env.MONGO_DB_NAME);
const entrylistCollection = db.collection(process.env.MONGO_ENTRYLIST_COLLECTION_NAME);

const server = () => {
  const app = express();
  const port = 4001;

  app.use(cors());

  app.get("/champ", (req, res) => {
    client.connect(async () => {
      const lb = {
        classStandings: { pro: [], silver: [], am: [] }, races: [],
      };
      const el = [];

      if (!process.env.MONGO_STANDINGS_COLLECTION_NAME) throw new Error("Standings collection not specified");
      const champStandings = await db.collection(process.env.MONGO_STANDINGS_COLLECTION_NAME)
        .find().toArray();
      champStandings.forEach((async (driver) => {
        el.push(entrylistCollection.findOne(
          { drivers: { $elemMatch: { playerID: driver.playerId } } },
        ));
      }));
      const entryListArr = await Promise.all(el);

      const classes = {
        0: lb.classStandings.am,
        1: lb.classStandings.silver,
        3: lb.classStandings.pro,
      };

      const season = await db.collection("seasons").find().toArray();
      lb.season = season[0].races;

      entryListArr.forEach((driver) => {
        const infoFromChamp = champStandings.find((e) => e.playerId === driver.drivers[0].playerID);
        classes[driver.drivers[0].driverCategory]
          .push({
            driver: driver.drivers[0],
            number: driver.raceNumber,
            car: carsMap[driver.forcedCarModel],
            points: infoFromChamp.points,
            pointsWDrop: infoFromChamp.pointsWDrop,
            roundDropped: infoFromChamp.roundDropped,
            finishes: infoFromChamp.finishes,
          });
      });

      const races = await db.collection(process.env.MONGO_RACE_COLLECTION_NAME).find().toArray();
      races.forEach((race) => lb.races.push(race.track));
      res.json(lb);
    });
  });

  app.get("/classquali", (req, res) => {
    client.connect(() => {
      db.collection(process.env.MONGO_QUALI_COLLECTION_NAME).find().toArray((error, data) => {
        if (error) throw error;
        res.json(data);
      });
    });
  });

  app.get("/raceresults", (req, res) => {
    client.connect(async () => {
      const fetchedData = await db.collection(process.env.MONGO_RACE_COLLECTION_NAME).find().toArray();
      let el = [];

      fetchedData.forEach((race) => {
        race.results.forEach((driver) => {
          el.push(entrylistCollection.findOne(
            { drivers: { $elemMatch: { playerID: driver.playerId } } },
          ));
        });
      });

      el = await Promise.all(el);

      const parsedResults = [];
      fetchedData.forEach((race) => {
        const lb = {
          pro: [], silver: [], am: [],
        };

        const classes = {
          0: lb.am,
          1: lb.silver,
          3: lb.pro,
        };

        Object.values(race.results).forEach((c) => {
          const driverDetails = el.find((e) => e.drivers[0].playerID === c.playerId);
          if (driverDetails) {
            classes[driverDetails.drivers[0].driverCategory]
              .push({
                driver: driverDetails.drivers[0],
                number: driverDetails.raceNumber,
                car: carsMap[driverDetails.forcedCarModel],
                bestLap: c.bestLap,
                lapCount: c.lapCount,
                totalTime: c.totalTime,
              });
          }
        });
        parsedResults.push({
          race: race.race,
          track: race.track,
          results: lb,
        });
      });

      res.json(parsedResults);
    });
  });

  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
};

export default server;

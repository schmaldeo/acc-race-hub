import express from "express";
import cors from "cors";
import { MongoClient, WithId } from "mongodb";
import * as dotenv from "dotenv";
import _carsMap from "./carsMap.json" assert { type: "json" };
import {
  EntrylistEntry,
  ServerChampionshipRes,
  DriverInServerChampionshipRes,
  ChampionshipEntry,
  Races,
  Team,
  Manufacturer,
  DriverInRaceResults,
  ParsedRaceResults,
} from "./types";

dotenv.config();

// Typing the carsMap import, otherwise getting a TS error about mismatched index type
const carsMap: {[index: number]: string} = _carsMap;

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Mongo URI not specified");
const client = new MongoClient(uri);
const db = client.db(process.env.MONGO_DB_NAME);
const entrylistCollection = db.collection<EntrylistEntry>(process.env.MONGO_ENTRYLIST_COLLECTION_NAME || "entrylist");
const raceCollection = db.collection<Races>(process.env.MONGO_RACE_COLLECTION_NAME || "race_results");
const standingsCollection = db.collection<ChampionshipEntry>(process.env.MONGO_STANDINGS_COLLECTION_NAME || "drivers_standings");
const manufacturersStandings = db.collection<Manufacturer>(process.env.MONGO_MANUFACTURERS_STANDINGS_COLLECTION_NAME || "manufacturers_standings");
const classQualifyingCollection = db.collection(process.env.MONGO_CLASS_QUALIFYING_COLLECTION_NAME || "class_qualifying");
const port = process.env.PORT || 4001;

const server = () => {
  const app = express();

  app.use(cors());

  // GET methods

  app.get("/champ", async (req, res) => {
    try {
      await client.connect();
      const lb: ServerChampionshipRes = {
        classStandings: { pro: [], silver: [], am: [] }, races: [],
      };
      const entrylistPromises: Promise<WithId<EntrylistEntry> | null>[] = [];

      const champStandings = await standingsCollection.find().toArray();
      champStandings.forEach(((driver) => {
        entrylistPromises.push(entrylistCollection.findOne(
          { drivers: { $elemMatch: { playerID: driver.playerId } } },
        ));
      }));
      const entryListArr = await Promise.all(entrylistPromises);

      // This is required due to how ACC indexes its classes
      const classes: {
        [index: number]: DriverInServerChampionshipRes[]
      } = {
        0: lb.classStandings.am,
        1: lb.classStandings.silver,
        3: lb.classStandings.pro,
      };

      const season = await db.collection("seasons").find().toArray();
      // TODO need to allow for multiple seasons, use URL params to retrieve which season is queried
      lb.season = season[0].races;

      entryListArr.forEach((driver) => {
        const infoFromChamp = driver && champStandings.find((e) => e.playerId === driver.drivers[0].playerID);
        infoFromChamp && driver && classes[driver.drivers[0].driverCategory]
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

      const races = await raceCollection.find().toArray();
      races.forEach((race) => lb.races.push(race.track));
      res.json(lb);
    } catch (err) {
      console.error(`Error fetching teams ${err}`);
      res.sendStatus(500);
    } finally {
      client.close();
    }
  });

  app.get("/teams", async (req, res) => {
    try {
      await client.connect();
      const data: {
        [c: string]: Team[]
      } = { pro: [], silver: [], am: [] };
      const fetchedData = await db.collection<Team>("teams").find().toArray();
      // Parsing the points into required format as well as adding drivers' points if theres 2 of them in a team
      // TODO allow more than 2 drivers in the team
      fetchedData.forEach((entry) => {
        if (entry.points.length === 2) {
          entry.pointsCalculated = {
            points: entry.points[0].points + entry.points[1].points,
            pointsWDrop: entry.points[0].pointsWDrop + entry.points[1].pointsWDrop,
          };
        } else {
          entry.pointsCalculated = {
            points: entry.points[0].points,
            pointsWDrop: entry.points[0].pointsWDrop,
          };
        }
      });
      data.pro = fetchedData.filter((e) => e.class === "pro");
      data.silver = fetchedData.filter((e) => e.class === "silver");
      data.am = fetchedData.filter((e) => e.class === "am");
      res.json(data);
    } catch (err) {
      console.error(`Error fetching teams ${err}`);
      res.sendStatus(500);
    } finally {
      client.close();
    }
  });

  app.get("/constructors", async (req, res) => {
    try {
      await client.connect();
      const data: WithId<Manufacturer>[] = await manufacturersStandings.find().toArray();
      data.sort((a, b) => b.points - a.points);
      res.json(data);
    } catch (err) {
      console.error(`Error fetching manufacturers ${err}`);
      res.sendStatus(500);
    } finally {
      client.close();
    }
  });

  app.get("/classquali", async (req, res) => {
    try {
      await client.connect();
      const data = await classQualifyingCollection.find().toArray();
      res.json(data);
    } catch (err) {
      console.error(`Error fetching class qualifying results ${err}`);
      res.sendStatus(500);
    } finally {
      client.close();
    }
  });

  app.get("/raceresults", async (req, res) => {
    try {
      await client.connect();
      const fetchedData = await raceCollection.find().toArray();
      const entrylistPromises: Promise<WithId<EntrylistEntry> | null>[] = [];

      fetchedData.forEach((race) => {
        race.results.forEach((driver) => {
          entrylistPromises.push(entrylistCollection.findOne(
            { drivers: { $elemMatch: { playerID: driver.playerId } } },
          ));
        });
      });

      const entrylist = await Promise.all(entrylistPromises);

      const parsedResults: ParsedRaceResults[] = [];
      fetchedData.forEach((race) => {
        const lb: {
          pro: DriverInRaceResults[];
          silver: DriverInRaceResults[];
          am: DriverInRaceResults[];
        } = {
          pro: [], silver: [], am: [],
        };

        // This is required due to how ACC indexes its classes
        const classes: {
          [index: number]: DriverInRaceResults[]
        } = {
          0: lb.am,
          1: lb.silver,
          3: lb.pro,
        };

        Object.values(race.results).forEach((c) => {
          const driverDetails = entrylist.find((e) => e && e.drivers[0].playerID === c.playerId);
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
    } catch (err) {
      console.error(`Error fetching race results ${err}`);
      res.sendStatus(500);
    } finally {
      client.close();
    }
  });

  app.listen(port, () => console.log(`listening on ${port}`));
};

export default server;

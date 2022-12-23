import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import teams from "./teams.json" assert {type: "json"};

dotenv.config();

if (!process.env.MONGO_URI) throw new Error("Mongo URI not specified");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

(async () => {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || "acc_race_hub");
  const collection = db.collection("teams");
  const entrylist = await db.collection("entrylist").find().toArray();
  Object.keys(teams).forEach((team) => {
    const classes = {
      0: 1,
      1: 2,
      3: 3,
    };
    const classesNamed = {
      1: "am",
      2: "am",
      3: "silver",
      4: "silver",
      5: "pro",
      6: "pro",
    };
    let points = 0;
    teams[team].forEach((driver) => {
      const entry = entrylist.find((e) => e.drivers[0].playerID === driver);
      points += classes[entry.drivers[0].driverCategory];
    });
    collection.insertOne({
      team,
      drivers: teams[team],
      class: classesNamed[points],
    });
  });
  console.log("Teams successfully inserted into the database");
  // TODO find out a way not to have to use this setTimeout
  setTimeout(() => client.close(), 3000);
})();

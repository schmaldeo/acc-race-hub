import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("No Mongo URI provided");
const client = new MongoClient(uri);

(async () => {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || "acc_race_hub");
  await db.createCollection("class_qualifying");
  await db.createCollection("race_results");
  await db.createCollection("drivers_standings");
  await db.createCollection("entrylist");
  await db.createCollection("manufacturers_standings");
  await db.createCollection("teams");
  await db.createCollection("seasons");
  console.log("Database created");
  client.close();
})();

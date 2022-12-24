import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) throw new Error("Mongo URI not specified");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// EXAMPLE: const tracks = ["barcelona", "imola"];
const tracks = [];
const season = 1;

(async () => {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || "acc_race_hub");
  const collection = db.collection("seasons");
  await collection.insertOne({
    season,
    races: tracks,
  });
  client.close();
})();

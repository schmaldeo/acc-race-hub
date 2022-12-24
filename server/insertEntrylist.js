import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import entrylist from "./entrylist.json" assert { type: "json" };

dotenv.config();

if (!process.env.MONGO_URI) throw new Error("Mongo URI not specified");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

(async () => {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || "acc_race_hub");
  const collection = db.collection(process.env.MONGO_ENTRYLIST_COLLECTION_NAME || "entrylist");
  await collection.insertMany(entrylist.entries);
  console.log("Entrylist successfully inserted");
  client.close();
})();

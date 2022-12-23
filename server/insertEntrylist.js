import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";
import entrylist from "./entrylist.json" assert { type: "json" };

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
);

(async () => {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || "acc_race_hub");
  const collection = db.collection("entrylist");
  await collection.insertMany(entrylist.entries);
  console.log("Entrylist successfully inserted");
  client.close();
})();

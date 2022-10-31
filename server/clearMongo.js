/* eslint-disable no-console */
import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
);

const main = async () => {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME);
  const collection = db.collection(process.env.MONGO_RACE_COLLECTION_NAME);
  await collection.deleteMany({});
  console.log("deleted");
  client.close();
};
main();

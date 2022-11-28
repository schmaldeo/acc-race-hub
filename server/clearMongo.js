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
  const standingsCollection = db.collection(process.env.MONGO_STANDINGS_COLLECTION_NAME);
  const raceCollection = db.collection(process.env.MONGO_RACE_COLLECTION_NAME);
  const constructorsCollection = db.collection(process.env.MONGO_CONSTRUCTORS_COLLECTION_NAME);
  const teamsCollection = db.collection("teams");
  const teamsStandingsCollection = db.collection(process.env.MONGO_TEAMS_STANDINGS_COLLECTION_NAME);
  await standingsCollection.deleteMany({});
  await raceCollection.deleteMany({});
  await constructorsCollection.deleteMany({});
  await teamsStandingsCollection.deleteMany({});
  // await teamsCollection.deleteMany({});
  console.log("deleted");
  client.close();
};
main();

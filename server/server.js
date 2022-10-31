import express from "express";
// eslint-disable-next-line import/no-extraneous-dependencies
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
);
const db = client.db(process.env.MONGO_DB_NAME);

const server = () => {
  const app = express();
  const port = 4001;

  app.use(cors());

  app.get("/champ", (req, res) => {
    client.connect(() => {
      db.collection(process.env.MONGO_STANDINGS_COLLECTION_NAME).find().toArray((error, data) => {
        if (error) throw error;
        res.json(data);
      });
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

  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
};

export default server;

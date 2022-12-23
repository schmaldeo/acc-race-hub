import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { flatten } from "mongo-dot-notation";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("URI not specified");
const client = new MongoClient(uri);
const db = client.db(process.env.MONGO_DB_NAME);

export default async function teamsChamp() {
  const teamsCollection = db.collection(process.env.MONGO_TEAMS_COLLECTION_NAME || "teams");
  // Use aggregation to retrieve amounts of points from each teammate
  const arr = await teamsCollection.aggregate([
    {
      $lookup: {
        from: "champ_standings",
        localField: "drivers",
        foreignField: "playerId",
        pipeline: [
          { $project: { points: { points: "$points", pointsWDrop: "$pointsWDrop" } } },
          { $replaceRoot: { newRoot: "$points" } },
        ],
        as: "points",
      },
    },
  ]).toArray();

  arr.forEach(async (e) => {
    await teamsCollection.updateOne({ _id: e._id }, flatten(e));
  });
}

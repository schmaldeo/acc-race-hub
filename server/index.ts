import * as dotenv from "dotenv";
import classQuali from "./classQuali";
import raceResults from "./raceResults.js";
import server from "./server.js";

dotenv.config();

server();
// classQuali();
raceResults();

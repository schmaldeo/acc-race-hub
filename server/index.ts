import * as dotenv from "dotenv";
import classQuali from "./classQuali.js";
import raceResults from "./raceResults.js";
import qualifyingResults from "./qualifyingResults.js";
import server from "./server.js";

dotenv.config();

server();
// classQuali();
raceResults();
qualifyingResults();

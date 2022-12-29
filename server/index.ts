import * as dotenv from "dotenv";
import classQuali from "./classQuali.js";
import raceResults from "./raceResults.js";
import qualifyingResults from "./qualifyingResults.js";
import server from "./server.js";
import checkVersion from "./checkVersion.js";

dotenv.config();

checkVersion();
server();
classQuali();
raceResults();
qualifyingResults();

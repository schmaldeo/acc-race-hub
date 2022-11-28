import * as dotenv from "dotenv";
import classQuali from "./classQuali";
import raceResults from "./raceResults.js";
import server from "./server.js";
import teamsChamp from "./teamsChamp.js";

dotenv.config();

server();
// classQuali();
raceResults();
teamsChamp();

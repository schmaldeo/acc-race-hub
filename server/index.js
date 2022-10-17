import fs from "fs";
import { msToLaptime } from "./helpers.js"

let leaderboard = [];

// Reading the JSON file output by the server. It's encoded in UTF-16 LE, therefore need to pass the argument for JSON.parse() to work correctly
fs.readFile("./test/220617_210306_Q.json", "utf16le", (err, data) => {
    if (err) throw err;
    const json = JSON.parse(data.toString());
    for (const e of json.sessionResult.leaderBoardLines) {
        leaderboard.push({
            "name": `${e.car.drivers[0].firstName} ${e.car.drivers[0].lastName}`,
            "laptime": msToLaptime(e.timing.bestLap)
        });
    };
    console.log(leaderboard);
});

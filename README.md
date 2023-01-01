# ACC Race Hub
## About
ACC Race Hub is a web app used for displaying race results and standings based on Assetto Corsa Competizione's Dedicated Server's dumps.   
It's using [React](https://reactjs.org/) as a front-end framework, [MUI](https://mui.com/) for UI (no CSS file is used in this project), [Express.js](https://expressjs.com/) for server code and [MongoDB](https://www.mongodb.com/) as a database, all written in [TypeScript](https://www.typescriptlang.org/). [Installer](https://github.com/schmatteo/acc-race-hub-installer) is also available, written in Rust.   
   
[Working demo available here](https://schmatteo.github.io/bskithub/)   

## Prerequisites
- **Node.js** v16.14.0 or higher
- **MongoDB**

## Front-end
### Features
- Display each race's results
- Display championship standings for drivers, teams and constructors
- All the results groupped into classes (Pro, Silver, AM)
- Toggle drop round
- Display class qualifying results

### Deployment
#### Using the installer (Windows only)
1. Download the installer from the [lastest release](https://github.com/schmatteo/acc-race-hub/releases/latest)
1. OPTIONAL: Put your logo192.png, logo512.png, favicon.ico and banner.png in the same directory as the installer
1. Run the installer
1. **Remember to specify all the environment variables** (for client it's `REACT_APP_BACKEND_URL` which is URL on which your server will be running). You can adjust them later in the .env file (however you would need to re-run `npm run build`), or alternatively you can re-run the installer
1. Deploy acc-race-hub-\<version>/client/build directory to a webserver 
#### Manual
1. Run `git clone https://github.com/schmatteo/acc_race_hub.git & cd acc-race-hub/client` or [download the ZIP](https://github.com/schmatteo/acc-race-hub/archive/refs/heads/master.zip) and open the terminal in `client` directory
1. Run `npm install`
1. OPTIONAL: Insert your own `favicon.ico` and logos into `public` folder
1. Fill the required environment variables in the `.env` file out
1. Run `npm run build`
1. Deploy the `build` directory to a webserver 

## Back-end
### Features
- Listen for race results appearing in a folder and update all standings based on them
- Listen for server dumps and update class qualifying based on them
- Serve a HTTP server for use with this app's front-end
- Adjustability: you can run whichever functions you want

### Deployment
#### Using the installer (Windows only)
1. Download the installer from the [lastest release](https://github.com/schmatteo/acc-race-hub/releases/latest)
1. Run the installer
1. **Remember to specify all the environment variables** (for server it's `MONGO_URI`, which is the MongoDB connection string, and `RESULTS_FOLDER`, which is a folder, in which the app will listen for new qualifying/race results). They can be later adjusted in the .env file without having to recompile anything.
1. [Insert the entrylist into the database using `insertEntrylist.js`](https://github.com/schmatteo/acc-race-hub/blob/master/docs/entrylist.md)
1. [Insert a season into the database using `insertSeasons.js`](https://github.com/schmatteo/acc-race-hub/blob/master/docs/seasons.md)
1. OPTIONAL: [Insert teams into the database](https://github.com/schmatteo/acc-race-hub/blob/master/docs/teams.md)
1. You can disable some features that you don't need by commenting them out in `index.js` (put `//` in front of feature you don't want to use and restart the app)
1. Run the app with `node --experimental-json-modules .` having terminal open in server's directory 
#### Manual
1. Run `git clone https://github.com/schmatteo/acc_race_hub.git & cd acc-race-hub/server` or [download the ZIP](https://github.com/schmatteo/acc-race-hub/archive/refs/heads/master.zip) and open the terminal in `server` directory
1. Run `npm install`
2. Fill the required environment variables in the `.env` file out (if you need help with deploying MongoDB you can read [this doc](https://github.com/schmatteo/acc-race-hub/blob/master/docs/mongodb.md))
1. Run `node ./createDB.js`
1. [Insert the entrylist into the database using `insertEntrylist.js`](https://github.com/schmatteo/acc-race-hub/blob/master/docs/entrylist.md)
1. [Insert a season into the database using `insertSeasons.js`](https://github.com/schmatteo/acc-race-hub/blob/master/docs/seasons.md)
1. OPTIONAL: [Insert teams into the database](https://github.com/schmatteo/acc-race-hub/blob/master/docs/teams.md)
1. Run `npx tsc`
1. Comment/uncomment features that you want to use in the `index.js` file (add `//` at the beginning of the line to comment)
1. Run the app with `node --experimental-json-modules .` having terminal open in server's directory 

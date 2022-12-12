# About
ACC Race Hub is a web app used for displaying race results and standings based on Assetto Corsa Competizione's Dedicated Server's dumps.   
[Demo](https://schmatteo.github.io/bskithub/)   
It's using [React](https://reactjs.org/) as a front-end framework, [MUI](https://mui.com/) for UI (no CSS file is used in this project), [Express.js](https://expressjs.com/) for back-end and [MongoDB](https://www.mongodb.com/) as a database, all written in [TypeScript](https://www.typescriptlang.org/).

# Front-end
## Features
- Display each race's results
- Display championship standings for drivers, teams and constructors
- All the results groupped into classes (Pro, Silver, AM)
- Toggle drop round
- Display class qualifying results

## Deployment
1. Run `git clone https://github.com/schmatteo/acc_race_hub.git & cd acc-race-hub/client` or [download the ZIP](https://github.com/schmatteo/acc-race-hub/archive/refs/heads/master.zip) and open the terminal in `client` directory
2. Run `npm install`
3. OPTIONAL: Insert your own `favicon.ico` and logos into `public` folder
4. Add required environment variables to the `.env` file
5. Run `npm run build`
6. Deploy the `build` directory to a webserver 

# Back-end
## Features
- Listen for race results appearing in a folder and update all standings based on them
- Listen for server dumps and update class qualifying based on them
- Serve a HTTP server for use with this app's front-end
- Adjustability: you can run all of the functions described, only one, or however many you want

## Deployment
1. Run `git clone https://github.com/schmatteo/acc_race_hub.git & cd acc-race-hub/server` or [download the ZIP](https://github.com/schmatteo/acc-race-hub/archive/refs/heads/master.zip) and open the terminal in `server` directory
2. `npm install`
3. `npx tsc`
4. Add required environment variables to the `.env` file
5. Comment/uncomment features that you want to use in the `server.js` file
6. To run the app: `node --experimental-json-modules .`

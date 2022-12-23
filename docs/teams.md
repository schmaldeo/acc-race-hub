# Inserting teams into the database
## **NOTE**: there are major limitations to how teams championship works at the moment.
Due to the original purpose of the app:
- only teams of 1 or 2 are supported
- there are 3 classes, calculated based on drivers' classes (Pro, Silver, AM, [points formula available here](https://i.imgur.com/DNXkBb2.png))
   
This will be addressed at some point in the future.   

If you want this app to calculate team points, you need to enable the option in the `.env` file and (`CALCULATE_TEAMS_POINTS=true`), most importantly, insert teams into the database. That can be done using the `insertTeams.js` script.   
To run the `insertTeams` script, you first need to have a teams file.

### Creating a `teams.json` file

To create this file, you need to have a text editor, basic knowledge of [JSON](https://www.json.org/json-en.html) and access to an entrylist.   
This file needs to have the following format:   
```json
{
  <team_name>: [<steam_id_1>, <steam_id_2 (if applicable)>]
}
```   
Steam IDs can be found in the entrylist file, under the `playerID` key in the first object of `drivers` array, in each object.   
Example `teams.json`:   
```
{
  "Team A": ["S11111111111111111", "S22222222222222222"],
  "Team B": ["S33333333333333333"],
  "team c": ["S12345678901234567"],
  "TEAM D": ["S12345123451234567", "S09876543210987654"]
}
```

> NOTE: it is planned to make this process much easier by integrating an admin panel into the front-end   
   
### Using the `insertTeams.js` script
   
> NOTE: an entrylist must be present in the database before running this script   

Using this script is fairly straightforward, you need to place the `teams.json` file in the same directory as the script and then run `node --experimental-json-modules ./insertEntryList.js`.

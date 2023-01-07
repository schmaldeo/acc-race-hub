# Inserting a season into the database

A very important part that can't be skipped if you want this app to work properly is inserting a season into the database. Unfortunately it's another step which might cause some confusion and might look complicated. It's also planned to make this much easier in the future by integrating this into the GUI.

1. Take a note of your calendar. All the tracks are listed below. **You need to store the list in the following format**: `[track1, track2, track3, track4]`, where each element is track's name.
**IMPORTANT: all the track names must be the same as the ones listed below, e.g. `["barcelona", "watkins_glen", "monza"]`, but not ~~`["Circuit de Barcelona - Catalunya", "Watkins Glen International", "Autodromo Nazionale di Monza"]`~~**

```json
{
   "barcelona":{
      "fullName":"Circuit de Barcelona - Catalunya",
      "year":2018
   },
   "brands_hatch":{
      "fullName":"Brands Hatch Circuit",
      "year":2018
   },
   "hungaroring":{
      "fullName":"Hungaroring Circuit",
      "year":2018
   },
   "misano":{
      "fullName":"Misano",
      "year":2018
   },
   "monza":{
      "fullName":"Autodromo Nazionale di Monza",
      "year":2018
   },
   "nurburgring":{
      "fullName":"Nurburgring",
      "year":2018
   },
   "paul_ricard":{
      "fullName":"Circuit - Paul Ricard",
      "year":2018
   },
   "silverstone":{
      "fullName":"Silverstone",
      "year":2018
   },
   "spa":{
      "fullName":"Circuit de Spa-Francorchamps",
      "year":2018
   },
   "zolder":{
      "fullName":"Circuit Zolder",
      "year":2018
   },
   "zandvoort":{
      "fullName":"Circuit Park Zandvoort",
      "year":2018
   },
   "donington":{
      "fullName":"Donington Park",
      "year":2019,
      "dlc":"British GT Pack"
   },
   "kyalami":{
      "fullName":"Kyalami Grand Prix Circuit",
      "year":2019,
      "dlc":"Intercontinental GT Pack"
   },
   "laguna":{
      "fullName":"WeatherTech Raceway Laguna Seca",
      "year":2019,
      "dlc":"Intercontinental GT Pack"
   },
   "mount_panorama":{
      "fullName":"Bathurst Mount Panorama Circuit",
      "year":2019,
      "dlc":"Intercontinental GT Pack"
   },
   "oulton_park":{
      "fullName":"Oulton Park",
      "year":2019,
      "dlc":"British GT Pack"
   },
   "snetterton":{
      "fullName":"Snetterton Circuit",
      "year":2019,
      "dlc":"British GT Pack"
   },
   "suzuka":{
      "fullName":"Suzuka Circuit",
      "year":2019,
      "dlc":"Intercontinental GT Pack"
   },
   "imola":{
      "fullName":"Autodromo Enzo e Dino Ferrari - Imola",
      "year":2020,
      "dlc":"2020 GT World Challenge Pack"
   },
   "watkins_glen":{
      "fullName":"Watkins Glen International",
      "year":2022,
      "dlc":"US Track Pack"
   },
   "indianapolis":{
      "fullName":"Indianapolis Motor Speedway",
      "year":2022,
      "dlc":"US Track Pack"
   },
   "cota":{
      "fullName":"Circuit of the Americas",
      "year":2022,
      "dlc":"US Track Pack"
   }
}
```

1. Take a note of which season it is, it doesn't matter, what number you put in for now, but in the future when multiple seasons will be handled, this will be important.

1. Go to a file called `insertSeasons.js` in the `server` directory:

- In line 11, change the `[]` to the array of tracks you specified in step 1.
- Optionally, in line 12, change the number from 1 to whatever you want.

1. Run the script using `node ./insertSeasons.js` from the command line while being in the `server` directory.

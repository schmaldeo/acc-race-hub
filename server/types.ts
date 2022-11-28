interface DriversArr {
  firstName: string,
  lastName: string,
  shortName: string,
  playerId: string,
}

export interface LeaderboardLines {
  car: {
    carId: number,
    raceNumber: number,
    carModel: number,
    cupCategory: number,
    carGroup: string,
    teamName: string,
    nationality: number,
    carGuid: number,
    teamGuid: number,
    drivers: DriversArr[]
  },
  currentDriver: {
    firstName: string,
    lastName: string,
    shortName: string,
    playerId: string
  },
  currentDriverIndex: 0,
  timing: {
    lastLap: number,
    lastSplits: number[],
    bestLap: number,
    bestSplits: number[],
    totalTime: number,
    lapCount: number,
    lastSplitId: number,
  },
  missingMandatoryPiststop: number,
  driverTotalTimes: number[]
}

export interface Leaderboard {
  carId?: number,
  name: string,
  playerId: string,
  bestLap: number,
  laps: number[],
  amountOfValidLaps?: number,
}

export interface Lap {
  carId: number,
  driverIndex: number,
  laptime: number,
  isValidForBest: boolean,
  splits: number[]
}

export interface ChampStandingsEntry {
  _id: string,
  playerId: string,
  points: number,
  pointsWDrop: number,
  finishes: {
    [trackName: string]: (number|boolean)[]
  },
  roundDropped: number
}

export interface ManufacturersElement {
  car: number,
  place: number
}

export interface Team {
  _id: string,
  team: string,
  drivers: string[],
  class: string
}

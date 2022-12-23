interface DriversArr {
  firstName: string;
  lastName: string;
  shortName: string;
  playerId: string;
}

interface DriverInEntrylist extends DriversArr {
  nationality: number;
  playerID: string;
  driverCategory: number;
}

export interface ParsedLeaderboardEntry {
  playerId: string;
  bestLap: number;
  lapCount: number;
  totalTime: number;
  fastestLap?: boolean;
}

export interface ClassesGroupped {
  playerId: string;
  place: number;
  result: null | ParsedLeaderboardEntry;
}

export interface EntrylistEntry {
  id: string;
  drivers: DriverInEntrylist[];
  raceNumber: number;
  forcedCarModel: number;
  overrideDriverInfo: number;
  defaultGridPosition: number;
  isServerAdmin: number;
}

export interface ChampionshipEntry {
  _id?: string;
  playerId: string;
  points: number;
  pointsWDrop: number;
  finishes: {
    [track: string]: [number | string, boolean, number]
  };
  roundDropped?: number;
}

export interface LeaderboardLines {
  car: {
    carId: number;
    raceNumber: number;
    carModel: number;
    cupCategory: number;
    carGroup: string;
    teamName: string;
    nationality: number;
    carGuid: number;
    teamGuid: number;
    drivers: DriversArr[]
  },
  currentDriver: {
    firstName: string;
    lastName: string;
    shortName: string;
    playerId: string
  },
  currentDriverIndex: 0,
  timing: {
    lastLap: number;
    lastSplits: number[],
    bestLap: number;
    bestSplits: number[],
    totalTime: number;
    lapCount: number;
    lastSplitId: number;
  },
  missingMandatoryPiststop: number;
  driverTotalTimes: number[]
}

export interface Leaderboard {
  carId?: number;
  name: string;
  playerId: string;
  bestLap: number;
  laps: number[];
  amountOfValidLaps?: number;
}

export interface QualifyingResults extends Omit<Leaderboard, "name"> {
  lapCount: number;
}

export interface Lap {
  carId: number;
  driverIndex: number;
  laptime: number;
  isValidForBest: boolean;
  splits: number[]
}

export interface ManufacturersElement {
  car: number;
  place: number
}

export interface DriverInServerChampionshipRes extends Omit<ChampionshipEntry, "_id" | "playerId"> {
  driver: DriverInEntrylist;
  number: number;
  car: string;
}

export interface ServerChampionshipRes {
  classStandings: {
    pro: DriverInServerChampionshipRes[];
    silver: DriverInServerChampionshipRes[];
    am: DriverInServerChampionshipRes[];
  },
  races: string[];
  season?: string[];
}

export interface Races {
  _id?: string;
  race: string;
  track: string;
  qualifyingResults: QualifyingResults[];
  results: ParsedLeaderboardEntry[];
}

export interface Team {
  _id: string;
  team: string;
  drivers: string[];
  class: string;
  points: {
    points: number;
    pointsWDrop: number
  }[];
  pointsCalculated?: {
    points: number;
    pointsWDrop: number;
  }
}

export interface Manufacturer {
  _id: string;
  car: string;
  points: number;
}

export interface DriverInRaceResults {
  driver: DriverInEntrylist;
  number: number;
  car: string;
  bestLap: number;
  lapCount: number;
  totalTime: number;
}

export interface ParsedRaceResults {
  race: string;
  track: string;
  results: {
    [c: string]: DriverInRaceResults[]
  };
}

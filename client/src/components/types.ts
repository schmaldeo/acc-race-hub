import { Dispatch, SetStateAction } from "react";

interface Driver {
  firstName: string,
  lastName: string,
  shortName: string,
  nationality: number,
  driverCategory: number,
  playerID: string
}

// CLASS QUALI

export interface ClassQualiDriver {
  name: string,
  playerId: string,
  bestLap: number,
  laps: number[],
  amountOfValidLaps: number
}

export interface ClassQualiEntry {
  _id: string,
  name: string,
  playerId: string,
  bestLap: number,
  laps: number[],
  amountOfValidLaps: number,
}

// CHAMPIONSHIP

export interface ClassEntry {
  driver: Driver
  number: number,
  car: string,
  points: number,
  finishes: {
    [raceName: string]: (string|number)[]
  },
}

export interface ChampionshipData {
  classStandings: {
    pro: ClassEntry[],
    silver: ClassEntry[],
    am: ClassEntry[]
  },
  races: string[],
  season: string[]
}

// RACE RESULTS
export interface RaceResultsEntry {
  driver: Driver,
  number: number,
  car: string,
  bestLap: number,
  lapCount: number,
  totalTime: number
}

export interface Race {
  race: string,
  track: string,
  results: {
    pro: RaceResultsEntry[],
    silver: RaceResultsEntry[],
    am: RaceResultsEntry[],
  }
}

export interface RaceSubcomponentsProps {
  race: Race;
  setOpened: Dispatch<SetStateAction<boolean>>,
  opened: boolean
}

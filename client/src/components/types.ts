/* eslint-disable no-unused-vars */
import {
  Dispatch,
  SetStateAction,
} from "react";

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
}

// CHAMPIONSHIP

export interface ClassEntry {
  driver: Driver
  number: number,
  car: string,
  points: number,
  pointsWDrop: number,
  roundDropped?: number,
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

// TEAMS CHAMPIONSHIP
export interface Team {
  _id: string;
  team: string;
  drivers: string[];
  class: string;
  points: {
    points: number;
    pointsWDrop: number
  }[];
  pointsCalculated: {
    points: number;
    pointsWDrop: number;
  }
}

export interface TeamsChampionshipData {
  pro: Team[],
  silver: Team[],
  am: Team[]
}

// CONSTRUCTORS CHAMPIONSHIP
export interface ConstructorsChampionshipEntry {
  _id: string,
  car: string,
  points: number
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

export interface QualifyingInRaceResults {
  driver: Driver;
  number: number;
  car: string;
  bestLap: number;
  lapCount: number;
  laps: number[];
}

export interface Race {
  race: string,
  track: string,
  qualifyingResults: {
    pro: QualifyingInRaceResults[],
    silver: QualifyingInRaceResults[],
    am: QualifyingInRaceResults[],
  }
  results: {
    pro: RaceResultsEntry[],
    silver: RaceResultsEntry[],
    am: RaceResultsEntry[],
  }
}

export interface RaceSubcomponentsProps {
  race: Race,
  setOpened: Dispatch<SetStateAction<boolean>>,
  opened: boolean
}

export interface DropRoundToggleProps {
  showDropRound: boolean;
  setShowDropRound: Dispatch<SetStateAction<boolean>>;
}

export interface ClassSelectorProps {
  classToDisplay: number;
  setClassToDisplay: Dispatch<SetStateAction<number>>
}

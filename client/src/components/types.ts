export interface ClassEntry {
  driver: {
    firstName: string,
    lastName: string,
    shortName: string,
    nationality: number,
    driverCategory: number,
    playerID: string
  },
  number: number,
  car: string,
  points: number,
  finishes: {
    [raceName: string]: (string|number)[]
  },
}

export interface Driver {
  name: string,
  playerId: string,
  bestLap: number,
  laps: number[],
  amountOfValidLaps: number
}

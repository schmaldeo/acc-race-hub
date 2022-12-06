// Pretty self-explainatory - conversion of milliseconds
// (laptimes are given in millisecondsin the server output file) to a mm:ss.SSS string.
export function msToLaptime(milliseconds: number) {
  const pad = (n: number, z = 2) => (`00${n}`).slice(-z);
  const mm = pad((milliseconds % 3.6e6) / 6e4 | 0);
  const ss = pad((milliseconds % 6e4) / 1000 | 0);
  const mmm = pad(milliseconds % 1000, 3);

  return `${mm}:${ss}.${mmm}`;
}

export function parseTrackName(string: string) {
  if (string.indexOf("_") !== -1) {
    const tempString = string.replace(/_/g, " ");
    const spl = tempString.split(" ");
    const mapped = spl.map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join(" ");
    return mapped;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function parseTotalRaceTime(
  ms: number,
  leaderTime: number,
  totalLaps: number,
  driverLaps: number,
  winner: boolean,
) {
  if (totalLaps !== driverLaps) {
    const lapsDown = totalLaps - driverLaps;
    return (`+${lapsDown} ${lapsDown > 1 ? "laps" : "lap"}`);
  }

  if (winner) {
    const msRest = ms % 1000;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 3600) % 24);
    const parsed = `${hours}:${minutes}:${seconds}.${msRest}`;
    return parsed;
  }

  const gapToLeader = ms - leaderTime;
  const msRest = gapToLeader % 1000;
  const seconds = Math.floor((gapToLeader / 1000) % 60);
  const minutes = Math.floor((gapToLeader / 1000 / 60) % 60);
  const hours = Math.floor((gapToLeader / 1000 / 3600) % 24);

  const localisedArr = [hours, minutes, seconds].map((num) => {
    return num.toLocaleString("en-UK", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  });

  const parsed = `+${localisedArr[0]}:${localisedArr[1]}:${localisedArr[2]}.${msRest}`;

  return parsed;
}

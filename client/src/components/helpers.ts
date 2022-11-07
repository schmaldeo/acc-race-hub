/* eslint-disable import/prefer-default-export */
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
    const mapped = spl.map((str) => str.charAt(0).toUpperCase() + str.substr(1)).join(" ");
    return mapped;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// eslint-disable-next-line import/named
import { ManufacturersElement } from "./types";
import pointsMap from "./pointsMap.json" assert { type: "json" };

export default function manufacturersChamp(results: ManufacturersElement[]) {
  const standings:{[key: string]: number[]} = {};
  results.forEach((driver) => {
    if (standings[driver.car]) {
      standings[driver.car].push(driver.place);
    } else {
      standings[driver.car] = [driver.place];
    }
  });

  const points: {[key: string]: number} = {};
  Object.keys(standings).forEach((car) => {
    standings[car].length = 3;
    points[car] = (standings[car]
      .reduce((prev, curr) => prev + pointsMap[(curr + 1).toString() as keyof typeof pointsMap], 0)
    );
  });
  return points;
}

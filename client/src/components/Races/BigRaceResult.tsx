import React, { useState } from "react";
import { RaceResultsEntry, RaceSubcomponentsProps } from "../types";
import { msToLaptime, parseTotalRaceTime, parseTrackName } from "../helpers";

function BigRaceResult({ race, opened, setOpened }: RaceSubcomponentsProps) {
  const [classToDisplay, setClassToDisplay] = useState("pro");

  const handleClassClick = (c: string) => {
    switch (c) {
      case "pro":
        setClassToDisplay("pro");
        break;
      case "silver":
        setClassToDisplay("silver");
        break;
      case "am":
        setClassToDisplay("am");
        break;
      default:
        setClassToDisplay("pro");
    }
  };

  const handleClick = () => {
    opened ? setOpened(false) : setOpened(true);
  };

  const classes: {
    [key: string]: RaceResultsEntry[]
  } = {
    pro: race.results.pro,
    silver: race.results.silver,
    am: race.results.am,
  };

  const fastestLap = classes[classToDisplay]
    .indexOf(classes[classToDisplay]
      .filter((e) => e.lapCount > classes[classToDisplay][0].lapCount - 5)
      .reduce((prev, curr) => (prev.bestLap < curr.bestLap ? prev : curr)));
  const fastestLapTd = (bestLap: number, index: number) => {
    return <td className={fastestLap === index ? "purple" : ""}>{msToLaptime(bestLap)}</td>;
  };
  const raceResult = classes[classToDisplay]?.map((driver, index) => {
    return (
      <tr key={driver.driver.playerID}>
        <td>{index + 1}</td>
        <td>{driver.number}</td>
        <td>{`${driver.driver.firstName} ${driver.driver.lastName}`}</td>
        <td>{driver.car}</td>
        {fastestLapTd(driver.bestLap, index)}
        <td>
          {parseTotalRaceTime(
            driver.totalTime,
            classes[classToDisplay][0].totalTime,
            classes[classToDisplay][0].lapCount,
            driver.lapCount,
            index === 0,
          )}
        </td>
      </tr>
    );
  });

  return (
    <div key={race.track} className="race">
      <button type="button" onClick={handleClick}>CLOSE DETAILED RESULTS</button>
      <div>{race.race}</div>
      <div>
        Track:&nbsp;
        {parseTrackName(race.track)}
      </div>
      <div className="champ-btns ">
        <button type="button" className="class-btn widget-champ-btn pro" onClick={() => handleClassClick("pro")}>Pro</button>
        <button type="button" className="class-btn widget-champ-btn silver" onClick={() => handleClassClick("silver")}>Silver</button>
        <button type="button" className="class-btn widget-champ-btn am" onClick={() => handleClassClick("am")}>AM</button>
      </div>
      <div className="results">
        <table>
          <thead>
            <tr>
              <th className="place">Place</th>
              <th className="car-number">Car #</th>
              <th className="driver-name">Name</th>
              <th className="car">Car</th>
              <th className="best-lap"> Best lap</th>
              <th className="gap">Gap</th>
            </tr>
          </thead>
          <tbody>
            {raceResult}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BigRaceResult;

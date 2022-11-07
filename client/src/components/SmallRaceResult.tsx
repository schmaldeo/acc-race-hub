import React from "react";
import { RaceSubcomponentsProps } from "./types";
import { parseTrackName } from "./helpers";

function SmallRaceResult({ race, opened, setOpened }: RaceSubcomponentsProps) {
  const handleClick = () => {
    opened ? setOpened(false) : setOpened(true);
  };

  const placeMap: {[index:number]: string} = {
    0: "\u{1F3C6}",
    1: "\u{1F3C5}",
    2: "\u{1F949}",
  };

  return (
    <div key={race.track} className="race">
      <button type="button" onClick={handleClick}>SHOW DETAILED RESULTS</button>
      <div>{race.race}</div>
      <div>
        Track:&nbsp;
        {parseTrackName(race.track)}
      </div>
      <div className="results">
        <div className="class-results">
          <h4>Pro:</h4>
          {race.results.pro.slice(0, 3).map((driver, index) => {
            return (
              <div key={driver.driver.playerID}>
                {placeMap[index]}
                &nbsp;
                {driver.driver.firstName}
                &nbsp;
                {driver.driver.lastName}
                <br />
              </div>
            );
          })}
        </div>
        <div className="class-results">
          <h4>Silver:</h4>
          {race.results.silver.slice(0, 3).map((driver, index) => {
            return (
              <div key={driver.driver.playerID}>
                {placeMap[index]}
                &nbsp;
                {driver.driver.firstName}
                &nbsp;
                {driver.driver.lastName}
                <br />
              </div>
            );
          })}
        </div>
        <div className="class-results">
          <h4>AM:</h4>
          {race.results.am.slice(0, 3).map((driver, index) => {
            return (
              <div key={driver.driver.playerID}>
                {placeMap[index]}
                &nbsp;
                {driver.driver.firstName}
                &nbsp;
                {driver.driver.lastName}
                <br />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SmallRaceResult;

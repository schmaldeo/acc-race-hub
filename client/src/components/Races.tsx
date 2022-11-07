import React from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import { parseTrackName } from "./helpers";

function Races() {
  const { isLoading, error, data } = useQuery("races", () => fetch("http://127.0.0.1:4001/champ").then((res) => res.json()));

  interface Result {
    playerId: string,
    bestLap: number,
    lapCount: number,
    totalTime: number
  }

  interface Race {
    race: string,
    track: string,
    results: Result[]
  }

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) {
    return (
      <div>error</div>
    );
  }

  return (
    <div className="races">
      {data.map((race: Race) => {
        return (
          <div key={race.track} className="race">
            <div>{race.race}</div>
            <div>
              Track:&nbsp;
              {parseTrackName(race.track)}
            </div>
            <div className="results">
              {/* <div className="class-results">
                <h4>Pro:</h4>
                &#127942;
                {race.results[0][0].driver.firstName}
                &nbsp;
                {race.results[0][0].driver.lastName}
                <br />
                &#127941;
                {race.results[0][1].driver.firstName}
                &nbsp;
                {race.results[0][1].driver.lastName}
                <br />
                &#x1F949;
                {race.results[0][2].driver.firstName}
                &nbsp;
                {race.results[0][2].driver.lastName}
                <br />
                &#x1F7EA;
                {race.fastestLaps[0].driver.firstName}
                &nbsp;
                {race.fastestLaps[0].driver.lastName}
              </div>
              <div className="class-results">
                <h4>Silver:</h4>
                &#127942;
                {race.results[2][0].driver.firstName}
                &nbsp;
                {race.results[2][0].driver.lastName}
                <br />
                &#127941;
                {race.results[2][1].driver.firstName}
                &nbsp;
                {race.results[2][1].driver.lastName}
                <br />
                &#x1F949;
                {race.results[2][2].driver.firstName}
                &nbsp;
                {race.results[2][2].driver.lastName}
                <br />
                &#x1F7EA;
                {race.fastestLaps[2].driver.firstName}
                &nbsp;
                {race.fastestLaps[2].driver.lastName}
              </div>
              <div className="class-results">
                <h4>AM:</h4>
                &#127942;
                {race.results[1][0].driver.firstName}
                &nbsp;
                {race.results[1][0].driver.lastName}
                <br />
                &#127941;
                {race.results[1][1].driver.firstName}
                &nbsp;
                {race.results[1][1].driver.lastName}
                <br />
                &#x1F949;
                {race.results[1][2].driver.firstName}
                &nbsp;
                {race.results[1][2].driver.lastName}
                <br />
                &#x1F7EA;
                {race.fastestLaps[1].driver.firstName}
                &nbsp;
                {race.fastestLaps[1].driver.lastName}
              </div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Races;

import React, { useState } from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import ReactTooltip from "react-tooltip";
import _flagsMap from "./flagsMap.json";
import { ClassEntry, ChampionshipData } from "./types";
import { parseTrackName } from "./helpers";

const flagsMap: { [country: string]: string } = _flagsMap;

function Championship() {
  const [classToDisplay, setClassToDisplay] = useState("Pro");
  const [showDropRound, setShowDropRound] = useState(true);

  const handleClick = (c: string) => {
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

  const handleDropRoundClick = () => {
    showDropRound ? setShowDropRound(false) : setShowDropRound(true);
  };

  const race = (track: (string|number)[], index: number, roundDropped: number) => {
    return index === roundDropped
      ? (
        <td>
          {showDropRound ? <s>{track[0]}</s> : track[0]}
          {track[1] ? <sup>F</sup> : ""}
        </td>
      )
      : (
        <td>
          {track[0]}
          {track[1] ? <sup>F</sup> : ""}
        </td>
      );
  };

  const { isLoading, error, data } = useQuery<ChampionshipData, Error>("champData", () => fetch("http://127.0.0.1:4001/champ").then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <div>{error.message}</div>;

  const classes: {
    [key: string]: ClassEntry[] | undefined,
  } = {
    pro: data?.classStandings.pro,
    silver: data?.classStandings.silver,
    am: data?.classStandings.am,
  };

  Object.values(classes).forEach((arr) => arr?.sort(
    (a: ClassEntry, b: ClassEntry) => {
      return (showDropRound ? b.pointsWDrop - a.pointsWDrop : b.points - a.points);
    },
  ));

  const leaderboard = (classes[classToDisplay] || classes.pro)
    ?.map((driver: ClassEntry, index: number) => {
      return (
        <tr key={driver.driver.playerID}>
          <td>{index + 1}</td>
          <td>{driver.number}</td>
          <td>{`${driver.driver.firstName} ${driver.driver.lastName}`}</td>
          <td>{driver.car}</td>
          <td>{showDropRound ? driver.pointsWDrop : driver.points}</td>
          {data?.races.map((key: string, i: number) => (
            driver.finishes[key] ? race(driver.finishes[key], i, driver.roundDropped || 0)
              : <td>DNS</td>
          ))}
        </tr>
      );
    });

  return (
    <div className="championship">
      <div className="champ-btns">
        <button type="button" className="class-btn pro" onClick={() => handleClick("pro")}>Pro</button>
        <button type="button" className="class-btn silver" onClick={() => handleClick("silver")}>Silver</button>
        <button type="button" className="class-btn am" onClick={() => handleClick("am")}>AM</button>
      </div>

      <button type="button" onClick={handleDropRoundClick}>Show drop round</button>
      <table>
        <thead>
          <tr>
            <th className="place">Place</th>
            <th className="car-number">Car #</th>
            <th className="driver-name">Name</th>
            <th className="car">Car</th>
            <th className="points">Points</th>
            {data?.season.map((r: string) => {
              return (
                <th data-tip data-for={`${r}tip`} className={`race-column ${flagsMap[r]}`}>
                  <ReactTooltip className="tooltip" id={`${r}tip`} place="top" effect="solid">
                    {parseTrackName(r)}
                  </ReactTooltip>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {leaderboard}
        </tbody>
      </table>
    </div>
  );
}

export default Championship;

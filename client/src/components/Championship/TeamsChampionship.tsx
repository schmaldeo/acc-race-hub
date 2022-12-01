import React, { useState } from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import DropRoundToggle from "./DropRoundToggle";
import { TeamsChampionshipData, TeamsChampionshipEntry } from "../types";

function TeamsChampionship() {
  const [classToDisplay, setClassToDisplay] = useState("Pro");
  const [showDropRound, setShowDropRound] = useState(true);

  const handleDropRoundClick = () => {
    showDropRound ? setShowDropRound(false) : setShowDropRound(true);
  };

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

  const { isLoading, error, data } = useQuery<TeamsChampionshipData, Error>("teamsData", () => fetch("http://127.0.0.1:4001/teams").then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>error.message</span>;

  const classes: {
    [key: string]: TeamsChampionshipEntry[] | undefined,
  } = {
    pro: data?.pro,
    silver: data?.silver,
    am: data?.am,
  };

  Object.values(classes).forEach((arr) => arr?.sort(
    (a: TeamsChampionshipEntry, b: TeamsChampionshipEntry) => {
      return (showDropRound ? b.points.pointsWDrop - a.points.pointsWDrop
        : b.points.points - a.points.points);
    },
  ));

  const leaderboard = (classes[classToDisplay] || classes.pro)
    ?.map((team: TeamsChampionshipEntry, index: number) => {
      return (
        <tr key={team._id}>
          <td>{index + 1}</td>
          <td>{team.team}</td>
          <td>{showDropRound ? team.points.pointsWDrop : team.points.points}</td>
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
      <DropRoundToggle handleDropRoundClick={handleDropRoundClick} showDropRound={showDropRound} />
      <table>
        <thead>
          <tr>
            <th className="constructors-place">Place</th>
            <th>Name</th>
            <th className="constructors-points">Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard}
        </tbody>
      </table>
    </div>
  );
}

export default TeamsChampionship;

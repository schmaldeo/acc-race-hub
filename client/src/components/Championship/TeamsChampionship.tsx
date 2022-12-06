import React, { useState } from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import DropRoundToggle from "./DropRoundToggle";
import { TeamsChampionshipData, Team } from "../types";

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

  const { isLoading, error, data } = useQuery<TeamsChampionshipData, Error>("teamsData", () => fetch("https://bskit-hub-backend.onrender.com/teams").then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

  const classes: {
    [key: string]: Team[] | undefined,
  } = {
    pro: data?.pro,
    silver: data?.silver,
    am: data?.am,
  };

  Object.values(classes).forEach((arr) => arr?.sort(
    (a: Team, b: Team) => {
      return (showDropRound ? b.pointsCalculated.pointsWDrop - a.pointsCalculated.pointsWDrop
        : b.pointsCalculated.points - a.pointsCalculated.points);
    },
  ));

  const leaderboard = (classes[classToDisplay] || classes.pro)
    ?.map((team: Team, index: number) => {
      return (
        <tr key={team._id}>
          <td>{index + 1}</td>
          <td>{team.team}</td>
          <td>
            {showDropRound
              ? team.pointsCalculated.pointsWDrop
              : team.pointsCalculated.points}
          </td>
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

import React, { useState } from "react";
import ConstructorsStandings from "./ConstructorsStandings";
import DriversChampionship from "./DriversChampionship";
import TeamsChampionship from "./TeamsChampionship";

function Championship() {
  const [championshipToShow, setChampionshipToShow] = useState("drivers");

  const handleClick = (c: string) => {
    switch (c) {
      case "drivers":
        setChampionshipToShow("drivers");
        break;
      case "teams":
        setChampionshipToShow("teams");
        break;
      case "constructors":
        setChampionshipToShow("constructors");
        break;
      default:
        setChampionshipToShow("drivers");
    }
  };

  return (
    <>
      <div className="champ-select-btns">
        <button type="button" className="class-btn" onClick={() => handleClick("drivers")}>Drivers</button>
        <button type="button" className="class-btn" onClick={() => handleClick("teams")}>Teams</button>
        <button type="button" className="class-btn" onClick={() => handleClick("constructors")}>Constructors</button>
      </div>

      {championshipToShow === "drivers" && <DriversChampionship />}
      {championshipToShow === "teams" && <TeamsChampionship />}
      {championshipToShow === "constructors" && <ConstructorsStandings />}
    </>
  );
}

export default Championship;

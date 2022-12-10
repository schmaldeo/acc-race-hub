import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ConstructorsStandings from "./ConstructorsStandings";
import DriversChampionship from "./DriversChampionship";
import TeamsChampionship from "./TeamsChampionship";

function Championship() {
  const [championshipToShow, setChampionshipToShow] = useState("drivers");
  const [tabSelected, setTabSelected] = useState(0);

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabSelected(newValue);
  };

  return (
    <>
      <Tabs value={tabSelected} onChange={handleChange} centered>
        <Tab label="Drivers" onClick={() => handleClick("drivers")} />
        <Tab label="Teams" onClick={() => handleClick("teams")} />
        <Tab label="Constructors" onClick={() => handleClick("constructors")} />
      </Tabs>

      {championshipToShow === "drivers" && <DriversChampionship />}
      {championshipToShow === "teams" && <TeamsChampionship />}
      {championshipToShow === "constructors" && <ConstructorsStandings />}
    </>
  );
}

export default Championship;

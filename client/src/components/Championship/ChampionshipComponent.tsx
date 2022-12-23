import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ConstructorsStandings from "./ConstructorsStandings";
import DriversChampionship from "./DriversChampionship";
import TeamsChampionship from "./TeamsChampionship";

function Championship() {
  const champsToShow: number = parseInt(process.env.REACT_APP_CHAMPS_TO_SHOW || "7", 10);
  const defaultChamp = (toShow: number): string => {
    if (toShow % 2 === 1) {
      return "drivers";
    } if (toShow === 4) {
      return "constructors";
    }
    return "teams";
  };

  const [championshipToShow, setChampionshipToShow] = useState(defaultChamp(champsToShow));
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
        {champsToShow % 2 === 1 && <Tab label="Drivers" onClick={() => handleClick("drivers")} />}
        {(champsToShow % 3 === 0 || champsToShow === 7 || champsToShow === 2) && <Tab label="Teams" onClick={() => handleClick("teams")} />}
        {champsToShow >= 4 && <Tab label="Constructors" onClick={() => handleClick("constructors")} />}
      </Tabs>

      {championshipToShow === "drivers" && <DriversChampionship />}
      {championshipToShow === "teams" && <TeamsChampionship />}
      {championshipToShow === "constructors" && <ConstructorsStandings />}
    </>
  );
}

export default Championship;

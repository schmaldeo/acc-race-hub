import React, { useState } from "react";
import {
  Paper, Tab, Tabs, ToggleButton, Typography, Box,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StyledTableCell from "../StyledComponents/StyledTableCell";
import StyledTableRow from "../StyledComponents/StyledTableRow";
import { RaceResultsEntry, RaceSubcomponentsProps } from "../types";
import { msToLaptime, parseTotalRaceTime, parseTrackName } from "../helpers";

function BigRaceResult({ race, opened, setOpened }: RaceSubcomponentsProps) {
  const [classToDisplay, setClassToDisplay] = useState("pro");
  const [tabSelected, setTabSelected] = useState(0);

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabSelected(newValue);
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
    return <StyledTableCell className={fastestLap === index ? "purple" : ""}>{msToLaptime(bestLap)}</StyledTableCell>;
  };
  const raceResult = classes[classToDisplay]?.map((driver, index) => {
    return (
      <StyledTableRow key={driver.driver.playerID}>
        <StyledTableCell>{index + 1}</StyledTableCell>
        <StyledTableCell>{driver.number}</StyledTableCell>
        <StyledTableCell>{`${driver.driver.firstName} ${driver.driver.lastName}`}</StyledTableCell>
        <StyledTableCell>{driver.car}</StyledTableCell>
        {fastestLapTd(driver.bestLap, index)}
        <StyledTableCell>
          {parseTotalRaceTime(
            driver.totalTime,
            classes[classToDisplay][0].totalTime,
            classes[classToDisplay][0].lapCount,
            driver.lapCount,
            index === 0,
          )}
        </StyledTableCell>
      </StyledTableRow>
    );
  });

  return (
    <Paper variant="outlined" sx={{ width: 1, mb: 5 }}>
      <ToggleButton value="detailed-results" onClick={handleClick} selected={opened}>Detailed results</ToggleButton>
      <Typography>{race.race}</Typography>
      <Typography>
        Track:&nbsp;
        {parseTrackName(race.track)}
      </Typography>
      <Tabs value={tabSelected} onChange={handleChange} centered>
        <Tab label="Pro" onClick={() => handleClassClick("pro")} />
        <Tab label="Silver" onClick={() => handleClassClick("silver")} />
        <Tab label="AM" onClick={() => handleClassClick("am")} />
      </Tabs>
      <TableContainer component={Box} sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Place</StyledTableCell>
              <StyledTableCell>Car #</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Car</StyledTableCell>
              <StyledTableCell>Best lap</StyledTableCell>
              <StyledTableCell>Gap</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {raceResult}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default BigRaceResult;

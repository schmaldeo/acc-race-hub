import React, { useState } from "react";
import {
  Paper, ToggleButton, Typography, Box,
  Tabs, Tab,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StyledTableCell from "../StyledComponents/StyledTableCell";
import StyledTableRow from "../StyledComponents/StyledTableRow";
import ClassSelector from "../ClassSelector";

import { QualifyingInRaceResults, RaceResultsEntry, RaceSubcomponentsProps } from "../types";
import { msToLaptime, parseTotalRaceTime, parseTrackName } from "../helpers";

function BigRaceResult({ race, opened, setOpened }: RaceSubcomponentsProps) {
  const [classToDisplay, setClassToDisplay] = useState(0);
  const [sessionToDisplay, setSessionToDisplay] = useState(1);
  const handleSessionChange = (event: React.SyntheticEvent, newValue: number) => {
    setSessionToDisplay(newValue);
  };

  const handleClick = () => {
    opened ? setOpened(false) : setOpened(true);
  };

  const classes: Array<RaceResultsEntry[]> = [
    race.results.pro,
    race.results.silver,
    race.results.am,
  ];

  const qClasses: Array<QualifyingInRaceResults[]> = [
    race.qualifyingResults.pro,
    race.qualifyingResults.silver,
    race.qualifyingResults.am,
  ];

  const fastestLap = classes[classToDisplay]
    .indexOf(classes[classToDisplay]
      .filter((e) => e.lapCount > classes[classToDisplay][0].lapCount - 5)
      .reduce((prev, curr) => (prev.bestLap < curr.bestLap ? prev : curr)));

  const fastestLapTd = (bestLap: number, index: number) => {
    return <StyledTableCell sx={{ backgroundColor: `${fastestLap === index && "purple"}` }}>{msToLaptime(bestLap)}</StyledTableCell>;
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

  const qualifyingResult = qClasses[classToDisplay]?.map((driver, index) => {
    return (
      <StyledTableRow key={driver.driver.playerID}>
        <StyledTableCell>{index + 1}</StyledTableCell>
        <StyledTableCell>{driver.number}</StyledTableCell>
        <StyledTableCell>{`${driver.driver.firstName} ${driver.driver.lastName}`}</StyledTableCell>
        <StyledTableCell>{driver.car}</StyledTableCell>
        <StyledTableCell>{msToLaptime(driver.bestLap)}</StyledTableCell>
        <StyledTableCell>{driver.lapCount}</StyledTableCell>
        <StyledTableCell>{(driver.laps).length}</StyledTableCell>
      </StyledTableRow>
    );
  });

  const results = [qualifyingResult, raceResult];

  return (
    <Paper variant="outlined" sx={{ width: 1, mb: 5, paddingY: 1 }}>
      {/* TODO make a component to display race info in these */}
      <ToggleButton value="detailed-results" onClick={handleClick} selected={opened}>Detailed results</ToggleButton>
      <Typography sx={{ marginY: 1 }}>{race.race}</Typography>
      <Typography>
        Track:&nbsp;
        {parseTrackName(race.track)}
      </Typography>
      <Tabs value={sessionToDisplay} onChange={handleSessionChange} centered>
        <Tab label="Qualifying" />
        <Tab label="Race" />
      </Tabs>
      <ClassSelector classToDisplay={classToDisplay} setClassToDisplay={setClassToDisplay} />
      <TableContainer component={Box} sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 1 / 15 }}>Place</StyledTableCell>
              <StyledTableCell sx={{ width: 1 / 15 }}>Car #</StyledTableCell>
              <StyledTableCell sx={{ width: 1 / 4 }}>Name</StyledTableCell>
              <StyledTableCell sx={{ width: 1 / 5 }}>Car</StyledTableCell>
              <StyledTableCell sx={{ width: 1 / 8 }}>Best lap</StyledTableCell>
              <StyledTableCell sx={{ width: 1 / 8 }}>{sessionToDisplay === 1 ? "Gap" : "Laps"}</StyledTableCell>
              {sessionToDisplay === 0 && (
              <StyledTableCell sx={{ width: 1 / 8 }}>
                Valid laps
              </StyledTableCell>
              ) }
            </TableRow>
          </TableHead>
          <TableBody>
            {results[sessionToDisplay]}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default BigRaceResult;

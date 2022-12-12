import React from "react";
import {
  Paper, ToggleButton, Typography, Card, Box, useMediaQuery,
} from "@mui/material";
import { RaceSubcomponentsProps } from "../types";
import { parseTrackName } from "../helpers";

function SmallRaceResult({ race, opened, setOpened }: RaceSubcomponentsProps) {
  const handleClick = () => {
    opened ? setOpened(false) : setOpened(true);
  };

  const placeMap: {[index:number]: string} = {
    0: "\u{1F3C6}",
    1: "\u{1F3C5}",
    2: "\u{1F949}",
  };

  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex", flexDirection: "column", alignItems: "center", width: 1, mb: 5,
      }}
    >
      <ToggleButton value="detailed-results" onClick={handleClick} selected={opened}>Detailed results</ToggleButton>
      <Typography sx={{ marginY: 1 }}>{race.race}</Typography>
      <Typography>
        Track:&nbsp;
        {parseTrackName(race.track)}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: `${mobile && "column"}`, width: `${mobile ? 1 / 2 : 1}` }}>
        <Card
          variant="outlined"
          sx={{
            margin: `${mobile ? ".25rem 0" : "0 1rem"}`, width: `${mobile ? 1 : 1 / 3}`, pb: 2, paddingX: 2,
          }}
        >
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
        </Card>
        <Card
          variant="outlined"
          sx={{
            margin: `${mobile ? ".25rem 0" : "0 1rem"}`, width: `${mobile ? 1 : 1 / 3}`, pb: 2, paddingX: 2,
          }}
        >
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
        </Card>
        <Card
          variant="outlined"
          sx={{
            margin: `${mobile ? ".25rem 0" : "0 1rem"}`, width: `${mobile ? 1 : 1 / 3}`, pb: 2, paddingX: 2,
          }}
        >
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
        </Card>
      </Box>
    </Paper>
  );
}

export default SmallRaceResult;

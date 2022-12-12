import React from "react";
import {
  Paper, ToggleButton, Typography, Box, useMediaQuery,
} from "@mui/material";
import { RaceResultsEntry, RaceSubcomponentsProps } from "../types";
import { parseTrackName } from "../helpers";
import ClassRaceResult from "./ClassRaceResult";

function SmallRaceResult({ race, opened, setOpened }: RaceSubcomponentsProps) {
  const handleClick = () => {
    opened ? setOpened(false) : setOpened(true);
  };

  const classes: {
    [index: string]: RaceResultsEntry[]
  } = {
    Pro: race.results.pro,
    Silver: race.results.silver,
    Am: race.results.am,
  };

  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex", flexDirection: "column", alignItems: "center", width: 1, mb: 5, paddingY: 1,
      }}
    >
      <ToggleButton value="detailed-results" onClick={handleClick} selected={opened}>Detailed results</ToggleButton>
      <Typography sx={{ marginY: 1 }}>{race.race}</Typography>
      <Typography>
        Track:&nbsp;
        {parseTrackName(race.track)}
      </Typography>
      <Box sx={{
        display: "flex", flexDirection: `${mobile && "column"}`, width: `${mobile ? 1 / 2 : 1}`,
      }}
      >
        {Object.keys(classes).map((c) => {
          return <ClassRaceResult result={classes[c]} c={c} />;
        })}
      </Box>
    </Paper>
  );
}

export default SmallRaceResult;

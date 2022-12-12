import React from "react";
import { Card, useMediaQuery } from "@mui/material";
import { RaceResultsEntry } from "../types";

function ClassRaceResult({ result, c }: {result: RaceResultsEntry[], c: string}) {
  const placeMap: {[index:number]: string} = {
    0: "\u{1F3C6}",
    1: "\u{1F3C5}",
    2: "\u{1F949}",
  };

  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <Card
      variant="outlined"
      sx={{
        margin: `${mobile ? ".25rem 0" : "1rem 1rem 0 1rem"}`, width: `${mobile ? 1 : 1 / 3}`, pb: 2, paddingX: 2,
      }}
    >
      <h4>
        {c}
        :
      </h4>
      {result.slice(0, 3).map((driver, index) => {
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
  );
}

export default ClassRaceResult;

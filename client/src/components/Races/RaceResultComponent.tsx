import React, { useState } from "react";
import BigRaceResult from "./BigRaceResult";
import SmallRaceResult from "./SmallRaceResult";
import { Race } from "../types";

function RaceResultComponent({ race }: {race: Race}) {
  const [opened, setOpened] = useState(false);

  return (
    race
    && opened ? (
      <BigRaceResult
        race={race}
        opened={opened}
        setOpened={setOpened}
      />
      ) : (
        <SmallRaceResult
          race={race}
          opened={opened}
          setOpened={setOpened}
        />
      )
  );
}

export default RaceResultComponent;

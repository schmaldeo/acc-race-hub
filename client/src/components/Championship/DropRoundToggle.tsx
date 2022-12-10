import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { DropRoundToggleProps } from "../types";

function DropRoundToggle({ handleDropRoundClick, showDropRound }: DropRoundToggleProps) {
  return (
    <div className="switch-el">
      <ToggleButton value="drop" onChange={handleDropRoundClick} selected={showDropRound}>Toggle drop round</ToggleButton>
    </div>
  );
}

export default DropRoundToggle;

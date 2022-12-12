import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import { DropRoundToggleProps } from "../types";

function DropRoundToggle({ showDropRound, setShowDropRound }: DropRoundToggleProps) {
  const handleDropRoundClick = () => {
    showDropRound ? setShowDropRound(false) : setShowDropRound(true);
  };
  return (
    <ToggleButton sx={{ mt: 2, mb: 2 }} value="drop" onChange={handleDropRoundClick} selected={showDropRound}>Toggle drop round</ToggleButton>
  );
}

export default DropRoundToggle;

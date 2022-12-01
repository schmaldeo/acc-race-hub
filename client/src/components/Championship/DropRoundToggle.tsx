import React from "react";
import { DropRoundToggleProps } from "../types";

function DropRoundToggle({ handleDropRoundClick, showDropRound }: DropRoundToggleProps) {
  return (
    <div className="switch-el">
      SHOW DROP ROUND?
      <label className="switch">
        <input type="checkbox" onChange={handleDropRoundClick} checked={showDropRound} />
        <span className="slider round" />
      </label>
    </div>
  );
}

export default DropRoundToggle;

import React from "react";
import { Tabs, Tab } from "@mui/material";
import { ClassSelectorProps } from "../types";

function ClassSelector({ classToDisplay, handleClassChange }: ClassSelectorProps) {
  return (
    <Tabs value={classToDisplay} onChange={handleClassChange} centered>
      <Tab label="Pro" />
      <Tab label="Silver" />
      <Tab label="AM" />
    </Tabs>
  );
}

export default ClassSelector;

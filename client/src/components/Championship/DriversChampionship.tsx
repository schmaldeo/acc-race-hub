import React, { useState } from "react";
import { useQuery } from "react-query";
import ReactTooltip from "react-tooltip";
import { FidgetSpinner } from "react-loader-spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StyledTableCell from "../StyledComponents/StyledTableCell";
import StyledTableRow from "../StyledComponents/StyledTableRow";
import { ClassEntry, ChampionshipData } from "../types";
import { parseTrackName } from "../helpers";
import _flagsMap from "../flagsMap.json";
import DropRoundToggle from "./DropRoundToggle";
import ClassSelector from "../ClassSelector";

const flagsMap: { [country: string]: string } = _flagsMap;

function DriversChampionship() {
  const [showDropRound, setShowDropRound] = useState(true);
  const [classToDisplay, setClassToDisplay] = useState(0);

  const { isLoading, error, data } = useQuery<ChampionshipData, Error>("champData", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/champ`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

  const classes: Array<ClassEntry[] | undefined> = [
    data?.classStandings.pro,
    data?.classStandings.silver,
    data?.classStandings.am,
  ];

  Object.values(classes).forEach((arr) => arr?.sort(
    (a: ClassEntry, b: ClassEntry) => {
      return (showDropRound ? b.pointsWDrop - a.pointsWDrop : b.points - a.points);
    },
  ));

  const race = (track: (string|number)[], index: number, roundDropped: number) => {
    return index === roundDropped
      ? (
        <StyledTableCell key={index}>
          {showDropRound ? <s>{track[0]}</s> : track[0]}
          {track[1] ? <sup>F</sup> : ""}
        </StyledTableCell>
      )
      : (
        <StyledTableCell key={index}>
          {track[0]}
          {track[1] ? <sup>F</sup> : ""}
        </StyledTableCell>
      );
  };

  const leaderboard = (classes[classToDisplay] || classes[0])
    ?.map((driver: ClassEntry, index: number) => {
      return (
        <StyledTableRow key={driver.driver.playerID}>
          <StyledTableCell>{index + 1}</StyledTableCell>
          <StyledTableCell>{driver.number}</StyledTableCell>
          <StyledTableCell>{`${driver.driver.firstName} ${driver.driver.lastName}`}</StyledTableCell>
          <StyledTableCell>{driver.car}</StyledTableCell>
          <StyledTableCell>{showDropRound ? driver.pointsWDrop : driver.points}</StyledTableCell>
          {data?.races.map((key: string, i: number) => (
            driver.finishes[key] ? race(driver.finishes[key], i, driver.roundDropped || 0)
              : <StyledTableCell>DNS</StyledTableCell>
          ))}
        </StyledTableRow>
      );
    });

  return (
    <>
      <ClassSelector classToDisplay={classToDisplay} setClassToDisplay={setClassToDisplay} />
      <DropRoundToggle showDropRound={showDropRound} setShowDropRound={setShowDropRound} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Place</StyledTableCell>
              <StyledTableCell>Car #</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Car</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
              {data?.season.map((r: string) => {
                return (
                  <StyledTableCell data-tip data-for={`${r}tip`} key={r} sx={{ backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundImage: `url(/flags/4x3/${flagsMap[r]}.svg)` }}>
                    <ReactTooltip className="tooltip" id={`${r}tip`} place="top" effect="solid">
                      {parseTrackName(r)}
                    </ReactTooltip>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DriversChampionship;

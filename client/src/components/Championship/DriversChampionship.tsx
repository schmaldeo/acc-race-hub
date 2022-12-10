import React, { useState } from "react";
import { useQuery } from "react-query";
import ReactTooltip from "react-tooltip";
import { FidgetSpinner } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ClassEntry, ChampionshipData } from "../types";
import { parseTrackName } from "../helpers";
import _flagsMap from "../flagsMap.json";
import DropRoundToggle from "./DropRoundToggle";

const flagsMap: { [country: string]: string } = _flagsMap;

function DriversChampionship() {
  const [classToDisplay, setClassToDisplay] = useState("Pro");
  const [showDropRound, setShowDropRound] = useState(true);

  const handleDropRoundClick = () => {
    showDropRound ? setShowDropRound(false) : setShowDropRound(true);
  };

  const { isLoading, error, data } = useQuery<ChampionshipData, Error>("champData", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/champ`).then((res) => res.json()));

  const handleClick = (c: string) => {
    switch (c) {
      case "pro":
        setClassToDisplay("pro");
        break;
      case "silver":
        setClassToDisplay("silver");
        break;
      case "am":
        setClassToDisplay("am");
        break;
      default:
        setClassToDisplay("pro");
    }
  };

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

  const classes: {
    [key: string]: ClassEntry[] | undefined,
  } = {
    pro: data?.classStandings.pro,
    silver: data?.classStandings.silver,
    am: data?.classStandings.am,
  };

  Object.values(classes).forEach((arr) => arr?.sort(
    (a: ClassEntry, b: ClassEntry) => {
      return (showDropRound ? b.pointsWDrop - a.pointsWDrop : b.points - a.points);
    },
  ));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: "center",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

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

  const leaderboard = (classes[classToDisplay] || classes.pro)
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
    <div className="championship">
      <div className="champ-btns">
        <button type="button" className="class-btn pro" onClick={() => handleClick("pro")}>Pro</button>
        <button type="button" className="class-btn silver" onClick={() => handleClick("silver")}>Silver</button>
        <button type="button" className="class-btn am" onClick={() => handleClick("am")}>AM</button>
      </div>
      <DropRoundToggle handleDropRoundClick={handleDropRoundClick} showDropRound={showDropRound} />
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
                  <StyledTableCell data-tip data-for={`${r}tip`} key={r} className={`race-column ${flagsMap[r]}`}>
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
    </div>
  );
}

export default DriversChampionship;

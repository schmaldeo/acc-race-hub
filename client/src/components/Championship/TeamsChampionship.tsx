import React, { useState } from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Tab, Tabs } from "@mui/material";
import DropRoundToggle from "./DropRoundToggle";
import { TeamsChampionshipData, Team } from "../types";
import StyledTableCell from "../StyledComponents/StyledTableCell";
import StyledTableRow from "../StyledComponents/StyledTableRow";

function TeamsChampionship() {
  const [showDropRound, setShowDropRound] = useState(true);
  const [classToDisplay, setClassToDisplay] = useState(0);

  const handleDropRoundClick = () => {
    showDropRound ? setShowDropRound(false) : setShowDropRound(true);
  };

  const handleClassChange = (event: React.SyntheticEvent, newValue: number) => {
    setClassToDisplay(newValue);
  };

  const { isLoading, error, data } = useQuery<TeamsChampionshipData, Error>("teamsData", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/teams`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

  const classes: Array<Team[] | undefined> = [data?.pro, data?.silver, data?.am];

  Object.values(classes).forEach((arr) => arr?.sort(
    (a: Team, b: Team) => {
      return (showDropRound ? b.pointsCalculated.pointsWDrop - a.pointsCalculated.pointsWDrop
        : b.pointsCalculated.points - a.pointsCalculated.points);
    },
  ));

  const leaderboard = (classes[classToDisplay] || classes[0])
    ?.map((team: Team, index: number) => {
      return (
        <StyledTableRow key={team._id}>
          <StyledTableCell>{index + 1}</StyledTableCell>
          <StyledTableCell>{team.team}</StyledTableCell>
          <StyledTableCell>
            {showDropRound
              ? team.pointsCalculated.pointsWDrop
              : team.pointsCalculated.points}
          </StyledTableCell>
        </StyledTableRow>
      );
    });

  return (
    <>
      <Tabs value={classToDisplay} onChange={handleClassChange} centered>
        <Tab label="Pro" />
        <Tab label="Silver" />
        <Tab label="AM" />
      </Tabs>
      <DropRoundToggle handleDropRoundClick={handleDropRoundClick} showDropRound={showDropRound} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Place</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
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

export default TeamsChampionship;

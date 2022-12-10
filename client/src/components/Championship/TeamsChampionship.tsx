import React, { useState } from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DropRoundToggle from "./DropRoundToggle";
import { TeamsChampionshipData, Team } from "../types";

function TeamsChampionship() {
  const [classToDisplay, setClassToDisplay] = useState("Pro");
  const [showDropRound, setShowDropRound] = useState(true);

  const handleDropRoundClick = () => {
    showDropRound ? setShowDropRound(false) : setShowDropRound(true);
  };

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

  const { isLoading, error, data } = useQuery<TeamsChampionshipData, Error>("teamsData", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/teams`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

  const classes: {
    [key: string]: Team[] | undefined,
  } = {
    pro: data?.pro,
    silver: data?.silver,
    am: data?.am,
  };

  Object.values(classes).forEach((arr) => arr?.sort(
    (a: Team, b: Team) => {
      return (showDropRound ? b.pointsCalculated.pointsWDrop - a.pointsCalculated.pointsWDrop
        : b.pointsCalculated.points - a.pointsCalculated.points);
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

  const leaderboard = (classes[classToDisplay] || classes.pro)
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
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
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

export default TeamsChampionship;

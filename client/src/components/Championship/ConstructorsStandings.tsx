import React from "react";
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
import { ConstructorsChampionshipEntry } from "../types";

function ConstructorsStandings() {
  const { isLoading, error, data } = useQuery<ConstructorsChampionshipEntry[], Error>("constructorsData", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/constructors`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

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

  return (
    <div className="championship constructors">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Place</StyledTableCell>
              <StyledTableCell>Car</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((car: ConstructorsChampionshipEntry, index: number) => {
              return (
                <StyledTableRow key={car._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{car.car}</StyledTableCell>
                  <StyledTableCell>{car.points}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ConstructorsStandings;

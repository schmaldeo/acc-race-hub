import React from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ConstructorsChampionshipEntry } from "../types";
import StyledTableRow from "../StyledComponents/StyledTableRow";
import StyledTableCell from "../StyledComponents/StyledTableCell";

function ConstructorsStandings() {
  const { isLoading, error, data } = useQuery<ConstructorsChampionshipEntry[], Error>("constructorsData", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/constructors`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

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

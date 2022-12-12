import React from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ClassQualiEntry } from "../types";
import { msToLaptime } from "../helpers";
import StyledTableRow from "../StyledComponents/StyledTableRow";
import StyledTableCell from "../StyledComponents/StyledTableCell";

function ClassQuali() {
  const { isLoading, error, data } = useQuery<ClassQualiEntry[], Error>("classQ", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/classquali`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <div>{error.message}</div>;

  // TODO add sorting by best lap
  data?.sort((a, b) => b.laps.length - a.laps.length);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Valid laps</StyledTableCell>
            <StyledTableCell>Best lap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((driver: ClassQualiEntry) => {
            return (
              <StyledTableRow key={driver.playerId}>
                <StyledTableCell>{driver.name}</StyledTableCell>
                <StyledTableCell>{driver.laps.length}</StyledTableCell>
                <StyledTableCell>{msToLaptime(driver.bestLap)}</StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ClassQuali;

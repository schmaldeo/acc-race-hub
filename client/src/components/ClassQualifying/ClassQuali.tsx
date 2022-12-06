import React from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import { msToLaptime } from "../helpers";
import { ClassQualiEntry } from "../types";

function ClassQuali() {
  const { isLoading, error, data } = useQuery<ClassQualiEntry[], Error>("classQ", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/classquali`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <div>{error.message}</div>;

  return (
    <div className="classquali">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Valid laps</th>
            <th>Best lap</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((driver: ClassQualiEntry) => {
            return (
              <tr key={driver.playerId}>
                <td>{driver.name}</td>
                <td>{driver.amountOfValidLaps}</td>
                <td>{msToLaptime(driver.bestLap)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClassQuali;

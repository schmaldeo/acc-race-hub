import React from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import { msToLaptime } from "./helpers";
import { Driver } from "./types";

function ClassQuali() {
  const { isLoading, error, data } = useQuery("champData", () => fetch("http://127.0.0.1:4001/classquali").then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) {
    return (
      <div>error</div>
    );
  }

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
          {data.map((driver: Driver) => {
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

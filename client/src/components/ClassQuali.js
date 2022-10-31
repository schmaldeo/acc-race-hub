import React, { useState, useEffect } from "react";
import { msToLaptime } from "./helpers";

function ClassQuali() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:4001/classquali")
      .then((res) => res.json())
      .then((res) => {
        res.sort((a, b) => b.amountOfValidLaps - a.amountOfValidLaps);
        setData(res);
      });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Valid laps</th>
            <th>Best lap</th>
          </tr>
        </thead>
        <tbody>
          {data.map((driver) => {
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

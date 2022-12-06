import React from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import { ConstructorsChampionshipEntry } from "../types";

function ConstructorsStandings() {
  const { isLoading, error, data } = useQuery<ConstructorsChampionshipEntry[], Error>("constructorsData", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/constructors`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

  return (
    <div className="championship constructors">
      <table>
        <thead>
          <tr>
            <th className="constructors-place">Place</th>
            <th>Car</th>
            <th className="constructors-points">Points</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((car: ConstructorsChampionshipEntry, index: number) => {
            return (
              <tr key={car._id}>
                <td>{index + 1}</td>
                <td>{car.car}</td>
                <td>{car.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ConstructorsStandings;

import React from "react";
import { useQuery } from "react-query";
import { FidgetSpinner } from "react-loader-spinner";
import { Race } from "../types";
import RaceResultComponent from "./RaceResultComponent";

function Races() {
  const { isLoading, error, data } = useQuery<Race[], Error>("races", () => fetch(`${process.env.REACT_APP_BACKEND_URL}/raceresults`).then((res) => res.json()));

  if (isLoading) return <FidgetSpinner backgroundColor="#7b089e" ballColors={["#b505af", "#116599", "#969406"]} width={180} height={180} />;

  if (error) return <span>{error.message}</span>;

  return (
    <div className="races">
      {data?.map((race) => {
        return (
          <RaceResultComponent key={race.track} race={race} />
        );
      })}
    </div>
  );
}

export default Races;

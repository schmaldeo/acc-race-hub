import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import Championship from "./components/Championship/ChampionshipComponent";
import NavBar from "./components/NavBar";
import ClassQuali from "./components/ClassQualifying/ClassQuali";
import Races from "./components/Races/Races";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<NavBar />}>
        <Route index element={<Championship />} />
        <Route path="races" element={<Races />} />
        <Route path="classqualifying" element={<ClassQuali />} />
      </Route>
    </Routes>
  );
}

export default App;

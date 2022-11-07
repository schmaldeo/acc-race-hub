/* eslint-disable no-unused-vars */
import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import Championship from "./components/Championship";
import NavBar from "./components/NavBar";
import ClassQuali from "./components/ClassQuali";
import Races from "./components/Races";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="races" element={<Races />} />
          <Route path="championship" element={<Championship />} />
          <Route path="classqualifying" element={<ClassQuali />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

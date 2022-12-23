import React, { ReactNode } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import Championship from "./components/Championship/ChampionshipComponent";
import NavBar from "./components/NavBar";
import ClassQuali from "./components/ClassQualifying/ClassQuali";
import Races from "./components/Races/Races";

function App() {
  const componentsToShow: number = parseInt(process.env.REACT_APP_COMPONENTS_TO_SHOW_IN_MENU || "7");
  const specifyIndexElement = (toShow: number): ReactNode => {
    if (toShow % 2 === 1) {
      return <Championship />
    } else if (toShow === 4) {
      return <ClassQuali />
    } else {
      return <Races />
    };
  };

  return (
    <Routes>
      <Route path="/*" element={<NavBar componentsToShow={componentsToShow} />}>
        <Route index element={specifyIndexElement(componentsToShow)} />
        <Route path="championship" element={<Championship />} />
        <Route path="races" element={<Races />} />
        <Route path="classqualifying" element={<ClassQuali />} />
      </Route>
    </Routes>
  );
}

export default App;

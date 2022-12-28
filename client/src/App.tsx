import React, { ReactNode, useState } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useDarkMode } from "usehooks-ts";
import Championship from "./components/Championship/ChampionshipComponent";
import NavBar from "./components/NavBar";
import ClassQuali from "./components/ClassQualifying/ClassQuali";
import Races from "./components/Races/Races";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminPanel from "./components/Admin/AdminPanel";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const { isDarkMode, toggle } = useDarkMode();
  const componentsToShow: number = parseInt(process.env.REACT_APP_COMPONENTS_TO_SHOW_IN_MENU || "7", 10);
  const specifyIndexElement = (toShow: number): ReactNode => {
    if (toShow % 2 === 1) {
      return <Championship />;
    } if (toShow === 4) {
      return <ClassQuali />;
    }
    return <Races />;
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/*" element={<NavBar componentsToShow={componentsToShow} toggleDarkMode={toggle} isDarkMode={isDarkMode} />}>
          <Route index element={specifyIndexElement(componentsToShow)} />
          {componentsToShow % 2 === 1 && <Route path="championship" element={<Championship />} />}
          {(componentsToShow % 3 === 0 || componentsToShow === 7 || componentsToShow === 2) && <Route path="races" element={<Races />} />}
          {componentsToShow >= 4 && <Route path="classqualifying" element={<ClassQuali />} />}
        </Route>
        <Route path="admin" element={authenticated ? <AdminPanel /> : <AdminLogin setAuthenticated={setAuthenticated} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

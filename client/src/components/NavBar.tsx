import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import LightMode from "@mui/icons-material/LightMode";

function NavBar() {
  const [blackTheme, setBlackTheme] = useState(false);
  const handleClick = () => {
    if (blackTheme) {
      setBlackTheme(false);
    } else {
      setBlackTheme(true);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="App">
      <nav>
        <button type="button" onClick={() => navigate("/races")}>
          <div>
            Races
          </div>
        </button>
        <button type="button" onClick={() => navigate("/championship")}>
          <div>
            Championship
          </div>
        </button>
        <button type="button" onClick={() => navigate("/classqualifying")}>
          <div>
            Class qualifying
          </div>
        </button>
        <IconButton sx={{ width: "auto", height: "auto" }} onClick={handleClick}>
          {blackTheme ? <Brightness3Icon /> : <LightMode />}
        </IconButton>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;

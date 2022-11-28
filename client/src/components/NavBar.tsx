import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function NavBar() {
  const [blackTheme, setBlackTheme] = useState(false);
  const handleClick = () => {
    if (blackTheme) {
      setBlackTheme(false);
      document.body.classList.add("body-gradient");
      document.body.classList.remove("body-black");
    } else {
      setBlackTheme(true);
      document.body.classList.add("body-black");
      document.body.classList.remove("body-gradient");
    }
  };
  const navigate = useNavigate();
  return (
    <div className="nav">
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
        <button className="black-mode" type="button" onClick={handleClick}>Change theme</button>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;

import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function NavBar() {
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
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;

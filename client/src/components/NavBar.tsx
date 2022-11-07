import React from "react";
import { Link, Outlet } from "react-router-dom";

function NavBar() {
  return (
    <div className="nav">
      <nav>
        <a href="/#/races">
          <div>
            <Link to="/races">Races</Link>
          </div>
        </a>
        <a href="/#/championship">
          <div>
            <Link to="/championship">Championship</Link>
          </div>
        </a>
        <a href="/#/classqualifying">
          <div>
            <Link to="/classqualifying">Class qualifying</Link>
          </div>
        </a>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;

import React, { useState, useEffect } from "react";

function Championship() {
  const [classToDisplay, setClassToDisplay] = useState("Pro");
  const [proClass, setProClass] = useState([]);
  const [silverClass, setSilverClass] = useState([]);
  const [amClass, setAmClass] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:4001/champ")
      .then((res) => res.json())
      .then((res) => {
        const proClassArr = [];
        const silverClassArr = [];
        const amClassArr = [];
        res.forEach((driver) => {
          if (driver.class === "Pro") {
            proClassArr.push(driver);
          } else if (driver.class === "Silver") {
            silverClassArr.push(driver);
          } else {
            amClassArr.push(driver);
          }
        });
        setProClass(proClassArr.sort((a, b) => b.points - a.points));
        setSilverClass(silverClassArr.sort((a, b) => b.points - a.points));
        setAmClass(amClassArr.sort((a, b) => b.points - a.points));
      });
  }, []);

  useEffect(() => {}, [classToDisplay]);

  const handleClick = (c) => {
    switch (c) {
      case "pro":
        setClassToDisplay("pro");
        break;
      case "silver":
        setClassToDisplay("silver");
        break;
      case "am":
        setClassToDisplay("am");
        break;
      default:
        setClassToDisplay("pro");
    }
  };

  let leaderboard;
  switch (classToDisplay) {
    case "pro":
      leaderboard = proClass.map((driver, index) => {
        return (
          <tr key={driver.playerId}>
            <td>{index + 1}</td>
            <td>{driver.number}</td>
            <td>{driver.name}</td>
            <td>{driver.car}</td>
            <td>{driver.points}</td>
            {driver.spa ? <td>{driver.spa}</td> : <td>DNS</td>}
            {driver.hungaroring ? <td>{driver.hungaroring}</td> : <td>DNS</td>}
            {driver.mount_panorama ? <td>{driver.mount_panorama}</td> : <td>DNS</td>}
            {driver.silverstone ? <td>{driver.silverstone}</td> : <td>DNS</td>}
          </tr>
        );
      });
      break;
    case "silver":
      leaderboard = silverClass.map((driver, index) => {
        return (
          <tr key={driver.playerId}>
            <td>{index + 1}</td>
            <td>{driver.number}</td>
            <td>{driver.name}</td>
            <td>{driver.car}</td>
            <td>{driver.points}</td>
            {driver.spa ? <td>{driver.spa}</td> : <td>DNS</td>}
            {driver.hungaroring ? <td>{driver.hungaroring}</td> : <td>DNS</td>}
            {driver.mount_panorama ? <td>{driver.mount_panorama}</td> : <td>DNS</td>}
            {driver.silverstone ? <td>{driver.silverstone}</td> : <td>DNS</td>}
          </tr>
        );
      });
      break;
    case "am":
      leaderboard = amClass.map((driver, index) => {
        return (
          <tr key={driver.playerId}>
            <td>{index + 1}</td>
            <td>{driver.number}</td>
            <td>{driver.name}</td>
            <td>{driver.car}</td>
            <td>{driver.points}</td>
            {driver.spa ? <td>{driver.spa}</td> : <td>DNS</td>}
            {driver.hungaroring ? <td>{driver.hungaroring}</td> : <td>DNS</td>}
            {driver.mount_panorama ? <td>{driver.mount_panorama}</td> : <td>DNS</td>}
            {driver.silverstone ? <td>{driver.silverstone}</td> : <td>DNS</td>}
          </tr>
        );
      });
      break;
    default:
      leaderboard = proClass.map((driver, index) => {
        return (
          <tr key={driver.playerId}>
            <td>{index + 1}</td>
            <td>{driver.number}</td>
            <td>{driver.name}</td>
            <td>{driver.car}</td>
            <td>{driver.points}</td>
            {driver.spa ? <td>{driver.spa}</td> : <td>DNS</td>}
            {driver.hungaroring ? <td>{driver.hungaroring}</td> : <td>DNS</td>}
            {driver.mount_panorama ? <td>{driver.mount_panorama}</td> : <td>DNS</td>}
            {driver.silverstone ? <td>{driver.silverstone}</td> : <td>DNS</td>}
          </tr>
        );
      });
  }

  return (
    <div className="championship">
      <div className="champ-btns">
        <button type="button" className="class-btn pro" onClick={() => handleClick("pro")}>Pro</button>
        <button type="button" className="class-btn silver" onClick={() => handleClick("silver")}>Silver</button>
        <button type="button" className="class-btn am" onClick={() => handleClick("am")}>AM</button>
      </div>

      <table>
        <thead>
          <tr>
            <th className="place">Place</th>
            <th className="car-number">Car #</th>
            <th className="driver-name">Name</th>
            <th className="car">Car</th>
            <th className="points">Points</th>
            <th className="race"><img src="./belgium.png" alt="spa" className="raceFlag" /></th>
            <th className="race"><img src="./hungary.png" alt="hungaroring" className="raceFlag" /></th>
            <th className="race"><img src="./australia.png" alt="bathurst" className="raceFlag" /></th>
            <th className="race"><img src="./britain.png" alt="britain" className="raceFlag" /></th>
          </tr>
        </thead>
        <tbody>
          {leaderboard}
        </tbody>
      </table>
    </div>
  );
}

export default Championship;

import React, { useState, useEffect } from "react";
import "./styles.css";

export const Watch = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  // Function to calculate degrees for each hand
  const calculateDegrees = (currentTime, total) => {
    return (currentTime / total) * 360;
  };

  // Calculate degrees for each hand
  const secondsDegrees = calculateDegrees(time.getSeconds(), 60);
  const minutesDegrees = calculateDegrees(
    time.getMinutes() * 60 + time.getSeconds(),
    3600
  );
  const hoursDegrees = calculateDegrees(
    (time.getHours() % 12) * 3600 + time.getMinutes() * 60 + time.getSeconds(),
    43200
  );

  return (
    <div className="watch-container">
      <div className="watch">
        <div className="watch-face">
          <div className="watch-face-outline">
            {/* Points omitted for brevity */}
          </div>

          <div className="watch-face-date date">{time.getDate()}</div>

          <div className="watch-face-centre">
            <div className="watch-face-centre-inner"></div>
          </div>

          <div className="watch-face-hands">
            <div
              className="watch-face-hand hour"
              style={{ transform: `rotate(${hoursDegrees}deg)` }}
            ></div>
            <div
              className="watch-face-hand minute"
              style={{ transform: `rotate(${minutesDegrees}deg)` }}
            ></div>
            <div
              className="watch-face-hand second"
              style={{ transform: `rotate(${secondsDegrees}deg)` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

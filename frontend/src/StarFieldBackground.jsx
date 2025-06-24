// StarfieldBackground.js
import React, { useEffect, useState } from "react";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function StarfieldBackground({ starCount = 90 }) {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    // Generate new stars on mount or resize
    function createStars() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const newStars = Array.from({ length: starCount }).map(() => ({
        x: randomInt(0, width),
        y: randomInt(0, height),
        r: Math.random() * 1.2 + 0.6,
        color: Math.random() < 0.85 ? "#ffe97a" : "#fffbe7", // mostly yellow, some white
        glow: Math.random() * 4 + 6,
        twinkle: 0.5 + Math.random() * 0.6,
      }));
      setStars(newStars);
    }
    createStars();
    window.addEventListener("resize", createStars);
    return () => window.removeEventListener("resize", createStars);
  }, [starCount]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#07080b", // nearly black
        width: "100vw",
        height: "100vh",
      }}
    >
      <svg width="100vw" height="100vh" style={{ width: "100vw", height: "100vh" }}>
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.color}
            opacity={s.twinkle}
            style={{
              filter: `drop-shadow(0 0 ${s.glow}px ${s.color})`,
              transition: "opacity 1.8s",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

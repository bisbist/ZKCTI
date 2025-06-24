import React, { useRef, useEffect } from "react";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const RAIN_COLORS = [
  "rgba(40,90,200,",     // Dark blue
  "rgba(55,138,255,",    // Blue
  "rgba(91,197,255,",    // Sky blue
  "rgba(145,220,255,",   // Lighter blue
  "rgba(200,240,255,",   // Very light blue
];

const SPLASH_COLOR = "rgba(55,138,255, 0.85)";

export default function RainBackground() {
  const canvasRef = useRef(null);
  const raindrops = useRef([]);
  const splashes = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // More visible/darker, denser
    const dropCount = Math.floor(width / 2.2);
    raindrops.current = Array.from({ length: dropCount }).map(() => ({
      x: random(0, width),
      y: random(-height, height),
      len: random(18, 38),
      speed: random(2.8, 4.2),
      color: RAIN_COLORS[Math.floor(random(0, RAIN_COLORS.length))],
      alpha: random(0.25, 0.49), // more visible
      thickness: random(1.5, 2.1)
    }));

    splashes.current = [];

    let animId;
    function draw() {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      // Draw raindrops
      for (const drop of raindrops.current) {
        ctx.beginPath();
        ctx.strokeStyle = `${drop.color}${drop.alpha})`;
        ctx.lineWidth = drop.thickness;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.len);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > height - 3) {
          // Add splash when rain hits the bottom
          splashes.current.push({
            x: drop.x,
            y: height - 2,
            radius: random(5, 14),
            opacity: 0.85,
            maxOpacity: 0.85,
            frame: 0
          });
          // Reset drop
          drop.x = random(0, width);
          drop.y = random(-30, -10);
          drop.len = random(18, 38);
          drop.speed = random(2.8, 4.2);
          drop.color = RAIN_COLORS[Math.floor(random(0, RAIN_COLORS.length))];
          drop.alpha = random(0.25, 0.49);
          drop.thickness = random(1.5, 2.1);
        }
      }

      // Draw & animate splashes
      for (let i = splashes.current.length - 1; i >= 0; i--) {
        const splash = splashes.current[i];
        ctx.save();
        ctx.globalAlpha = splash.opacity;
        ctx.beginPath();
        // Draw small arc to mimic splash
        ctx.arc(splash.x, splash.y, splash.radius, Math.PI * 1.1, Math.PI * 1.9, false);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = SPLASH_COLOR;
        ctx.shadowColor = SPLASH_COLOR;
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.restore();

        // Animate splash (fade and grow, then disappear)
        splash.radius += 0.6;
        splash.opacity -= splash.maxOpacity / 12;
        splash.frame++;
        if (splash.opacity <= 0 || splash.frame > 13) {
          splashes.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(draw);
    }
    draw();

    // Handle resize
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Recreate raindrops with new width
      const dropCount = Math.floor(width / 2.2);
      raindrops.current = Array.from({ length: dropCount }).map(() => ({
        x: random(0, width),
        y: random(-height, height),
        len: random(18, 38),
        speed: random(2.8, 4.2),
        color: RAIN_COLORS[Math.floor(random(0, RAIN_COLORS.length))],
        alpha: random(0.25, 0.49),
        thickness: random(1.5, 2.1)
      }));
      splashes.current = [];
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.78, // Now more visible but still lets UI show
        transition: "opacity 0.3s"
      }}
    />
  );
}

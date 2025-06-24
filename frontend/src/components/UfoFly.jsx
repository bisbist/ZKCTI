import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";

// UFO color palette
const UFO_COLORS = [
  "#f6b73c", "#24b655", "#7554ee", "#00f9f4", "#f84aaf", "#ff7fad"
];

function getRandomY() {
  // Between 10% and 80% of viewport
  const vh = window.innerHeight || 900;
  return Math.round(vh * (0.12 + 0.7 * Math.random()));
}
function getRandomColor() {
  return UFO_COLORS[Math.floor(Math.random() * UFO_COLORS.length)];
}
function getRandomCount() {
  return 3 + Math.floor(Math.random() * 3); // 3-5 ufos
}

function randomLights(color) {
  return [
    { x: 27, y: 26.5, color: color },
    { x: 39, y: 26.5, color: "#00f9f4" },
    { x: 55, y: 26.5, color: "#fff6b3" },
    { x: 71, y: 26.5, color: "#f84aaf" },
    { x: 83, y: 26.5, color: "#24b655" }
  ];
}

// Standard cubic Bezier
function getUfoPathWithCPs(x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y, t) {
  const x =
    (1 - t) ** 3 * x0 +
    3 * (1 - t) ** 2 * t * cp1x +
    3 * (1 - t) * t ** 2 * cp2x +
    t ** 3 * x1;
  const y =
    (1 - t) ** 3 * y0 +
    3 * (1 - t) ** 2 * t * cp1y +
    3 * (1 - t) * t ** 2 * cp2y +
    t ** 3 * y1;
  return { x, y };
}

// UFO smoke trail
function UfoTrail({ ufo, tval, color }) {
  let trail = [];
  for (let i = 0; i < 10; ++i) {
    const trailT = Math.max(0, tval - i * 0.04);
    const pos = getUfoPathWithCPs(
      ufo.x0, ufo.y0, ufo.x1, ufo.y1,
      ufo.cp1x, ufo.cp1y, ufo.cp2x, ufo.cp2y,
      trailT
    );
    trail.push({
      x: pos.x + 95,
      y: pos.y + 36,
      opacity: Math.max(0, 0.11 + 0.09 * (1 - i / 11)),
      blur: 4 + i * 0.7,
    });
  }
  return (
    <g>
      {trail.map(({ x, y, opacity, blur }, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={9 - i * 0.5}
          ry={5.5 - i * 0.2}
          fill={color}
          opacity={opacity}
          style={{
            filter: `blur(${blur}px)`,
            transition: "opacity 0.35s, filter 0.32s"
          }}
        />
      ))}
    </g>
  );
}

function UfoSVG({ color, lights }) {
  return (
    <svg width="110" height="42" viewBox="0 0 110 42" fill="none">
      <ellipse cx="55" cy="35" rx="42" ry="7" fill={color + "33"} style={{ filter: "blur(8px)" }} />
      <ellipse cx="55" cy="21" rx="36" ry="10" fill={color} />
      <ellipse cx="55" cy="17.5" rx="26" ry="7" fill="#b7fffb" />
      <ellipse cx="55" cy="19.7" rx="14" ry="3.5" fill="#fff" opacity="0.65" />
      <ellipse cx="55" cy="12" rx="13" ry="7" fill="#f2f2fa" stroke="#24b655" strokeWidth="1.2" />
      {lights.map((light, i) => (
        <motion.circle
          key={i}
          cx={light.x}
          cy={light.y}
          r={2.8}
          fill={light.color}
          animate={{
            opacity: [0.75, 1, 0.75, 0.4, 0.85],
            filter: [
              "drop-shadow(0 0 3px #fff)",
              "drop-shadow(0 0 8px #fff)",
              "drop-shadow(0 0 6px #fff0)",
              "drop-shadow(0 0 12px #fffa)",
            ],
            scale: [1, 1.22, 1, 0.85, 1],
          }}
          transition={{
            duration: 1.6 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.13,
          }}
        />
      ))}
    </svg>
  );
}

// ---- FLYING UFO WITH "BEAM" SUPPORT ----
function FlyingUfo({ ufo, darkMode }) {
  const [show, setShow] = useState(true);
  const [mainPos, setMainPos] = useState(getUfoPathWithCPs(
    ufo.x0, ufo.y0, ufo.x1, ufo.y1, ufo.cp1x, ufo.cp1y, ufo.cp2x, ufo.cp2y, 0));
  const [tval, setTval] = useState(0);
  const tRef = useRef(0);

  useAnimationFrame((t, delta) => {
    if (!show) return;
    const dt = ufo.duration === 0 ? 0 : (delta || 16.7) / (ufo.duration * 1000);
    tRef.current += dt;
    const tvalNext = Math.min(1, tRef.current);
    setTval(tvalNext);
    const pos = getUfoPathWithCPs(
      ufo.x0, ufo.y0, ufo.x1, ufo.y1, ufo.cp1x, ufo.cp1y, ufo.cp2x, ufo.cp2y, tvalNext
    );
    setMainPos(pos);
    if (tvalNext >= 1) setShow(false);
  });

  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(1.6px)" }}
      animate={{
        opacity: 1,
        scale: [0.95, 1.08, 1],
        filter: ["blur(1.6px)", "blur(0.6px)", "blur(0.35px)"],
      }}
      exit={{ opacity: 0, scale: 0.7, filter: "blur(2.5px)" }}
      transition={{
        duration: 0.9,
        ease: "easeInOut"
      }}
      style={{
        position: "fixed",
        left: mainPos.x,
        top: mainPos.y,
        zIndex: 19,
        width: 110,
        pointerEvents: "none",
        willChange: "transform, filter, opacity"
      }}
    >
      {/* ---- UFO HEADLIGHT BEAM (dark mode only) ---- */}
      {darkMode && (
        <motion.svg width="110" height="90" style={{
          position: "absolute",
          left: 0,
          top: 12,
          zIndex: 1,
          pointerEvents: "none",
        }}>
          <defs>
            <radialGradient id={`beam-glow-${ufo.id}`} cx="60%" cy="40%" r="95%">
              <stop offset="0%" stopColor={ufo.color} stopOpacity="0.22" />
              <stop offset="80%" stopColor={ufo.color} stopOpacity="0.10" />
              <stop offset="100%" stopColor={ufo.color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <motion.ellipse
            cx="85" cy="33"
            rx="55" ry="22"
            fill={`url(#beam-glow-${ufo.id})`}
            animate={{ opacity: [0.56, 0.68, 0.31, 0.72] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      )}

      {/* Smoke Trail */}
      <svg width="330" height="500" style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}>
        <UfoTrail ufo={ufo} tval={tval} color={ufo.color} />
      </svg>
      {/* UFO Itself */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <UfoSVG color={ufo.color} lights={ufo.lights} />
      </div>
    </motion.div>
  );
}

export default function MultiUfoFly({ darkMode }) {
  const [ufos, setUfos] = useState([]);
  const ufoId = useRef(0);

  useEffect(() => {
    let running = true;
    function spawnUfos() {
      if (!running) return;
      const count = getRandomCount();
      setUfos(
        Array.from({ length: count }).map(() => {
          ufoId.current += 1;
          const startY = getRandomY();
          const endY = getRandomY();
          const x0 = -120, x1 = window.innerWidth + 120;
          const y0 = startY, y1 = endY;
          const cp1x = x0 + 240;
          const cp2x = x1 - 240;
          const cp1y = y0 + (Math.random() - 0.5) * 80;
          const cp2y = y1 + (Math.random() - 0.5) * 80;
          return {
            id: ufoId.current,
            color: getRandomColor(),
            duration: 3.8 + Math.random() * 2.8,
            x0, y0, x1, y1, cp1x, cp1y, cp2x, cp2y,
            lights: randomLights(getRandomColor()),
          };
        })
      );
    }
    spawnUfos();
    const interval = setInterval(() => {
      spawnUfos();
    }, 6000 + Math.random() * 7000);
    return () => {
      running = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {ufos.map(ufo => (
        <FlyingUfo key={ufo.id} ufo={ufo} darkMode={darkMode} />
      ))}
    </AnimatePresence>
  );
}

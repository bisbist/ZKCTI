import React, { useState, useEffect } from "react";

// Matrix binary rain generator
function MatrixRain({ width = 180, height = 90, rows = 6, cols = 18 }) {
  const getDigit = () => (Math.random() > 0.5 ? "1" : "0");
  let digits = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      digits.push(
        <text
          key={`${x}-${y}`}
          x={10 + x * 9}
          y={14 + y * 13}
          fontSize="13"
          fontFamily="monospace"
          fill={x % 2 === 0 ? "#43f89b" : "#6ff8e3"}
          opacity={Math.random() * 0.8 + 0.15}
        >
          {getDigit()}
        </text>
      );
    }
  }
  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 1,
        filter: "blur(0.7px)",
        opacity: 0.5
      }}
    >
      {digits}
    </svg>
  );
}

// Spider web SVG
function SpiderWebBg({ size = 280, color = "#5ce8f7", lines = 7, rings = 6 }) {
  const webLines = [];
  const center = size / 2;
  const radStep = (2 * Math.PI) / lines;
  for (let i = 0; i < lines; i++) {
    const angle = i * radStep;
    webLines.push(
      <line
        key={`radial${i}`}
        x1={center}
        y1={center}
        x2={center + center * Math.cos(angle)}
        y2={center + center * Math.sin(angle)}
        stroke={color}
        strokeWidth={i % 2 ? 0.7 : 1.5}
        opacity={i % 2 ? 0.19 : 0.30}
      />
    );
  }
  for (let r = 1; r <= rings; r++) {
    webLines.push(
      <circle
        key={`ring${r}`}
        cx={center}
        cy={center}
        r={center * (r / rings)}
        stroke={color}
        strokeWidth={r % 2 ? 1.1 : 0.5}
        fill="none"
        opacity={0.14 + 0.08 * (rings - r)}
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        top: -18,
        left: "50%",
        zIndex: 0,
        transform: "translateX(-50%)",
        pointerEvents: "none",
        filter: "blur(0.3px)"
      }}
    >
      {webLines}
    </svg>
  );
}

// Scanlines overlay
function ScanlinesOverlay({ width = 260, height = 170, speed = 2.1 }) {
  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        left: "50%",
        top: "6px",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 9,
        opacity: 0.13,
        mixBlendMode: "screen",
        animation: `scanlinesMove ${speed}s linear infinite`
      }}
    >
      <defs>
        <pattern id="scanlines" width="1" height="7" patternUnits="userSpaceOnUse">
          <rect y="0" width={width} height="2" fill="#aee7fc" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#scanlines)" />
      <style>
        {`
          @keyframes scanlinesMove {
            0% { transform: translateX(-50%) translateY(0); }
            100% { transform: translateX(-50%) translateY(7px);}
          }
        `}
      </style>
    </svg>
  );
}

function Ripple({ show = false, duration = 900 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(t);
    }
  }, [show, duration]);

  if (!visible) return null;

  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: 83,
      width: 32,
      height: 32,
      transform: "translateX(-50%)",
      zIndex: 100,
      pointerEvents: "none"
    }}>
      <svg width={32} height={32}>
        <circle
          cx={16} cy={16} r={12}
          fill="none"
          stroke="#43f89b"
          strokeWidth="4"
          opacity="0.93"
        >
          <animate
            attributeName="r"
            from="8"
            to="33"
            dur={`${duration / 1000}s`}
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            from="0.95"
            to="0"
            dur={`${duration / 1000}s`}
            fill="freeze"
          />
        </circle>
      </svg>
    </div>
  );
}

export default function HackerSpinnerPro({ showRipple = false, message }) {
  return (
    <div style={{
      minHeight: '50vh',
      width: '80vw',
      position: "relative",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      <SpiderWebBg size={255} />
      <MatrixRain width="100%" height="auto" />
      <div style={{
        position: "absolute",
        zIndex: 0,
        left: "50%", 
        top: "62%",
        width: "80%",
        height: "30%",
        transform: "translateX(-50%)",
        background: "radial-gradient(circle,#1a2347 60%,#3adfa066 95%,#fff0 100%)",
        filter: "blur(16px)",
        opacity: 0.97,
        animation: "panelGlow 2.2s infinite alternate"
      }} />
      <style>
        {`
        @keyframes panelGlow {
          0% { opacity: 0.73; }
          70% { opacity: 1.00; }
          100% { opacity: 0.84; }
        }
        `}
      </style>
      <svg width="40vw" height="auto" viewBox="0 0 170 158" style={{ position: "relative", zIndex: 2 }}>
        {/* Hoodie */}
        <ellipse cx="85" cy="70" rx="56" ry="48" fill="#6047f7" opacity="0.97" />
        <ellipse cx="85" cy="115" rx="41" ry="24" fill="#222b41" />
        <ellipse cx="85" cy="86" rx="23" ry="21" fill="#282d49" />
        <ellipse cx="78" cy="88" rx="4.7" ry="5.6" fill="#7cf9e2" />
        <ellipse cx="93" cy="88" rx="4.7" ry="5.6" fill="#7cf9e2" />
        <ellipse cx="61" cy="140" rx="10" ry="5.1" fill="#222b41" />
        <ellipse cx="109" cy="140" rx="10" ry="5.1" fill="#222b41" />
        <rect x="62" y="128" width="46" height="16" rx="7" fill="#fafcff" stroke="#6047f7" strokeWidth="2.2" />
        <rect x="72" y="136" width="26" height="5.7" rx="2" fill="#c5ecf7" />
      </svg>
      <ScanlinesOverlay width="100%" height="auto" />
      <Ripple show={showRipple} duration={1200} />
      <div style={{
        fontFamily: "monospace",
        color: "#ffffff",
        letterSpacing: ".01em",
        fontSize: "1.18rem",
        fontWeight: 700,
        marginTop: 9
      }}>
        {message}
      </div>
    </div>
  );
}

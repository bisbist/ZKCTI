import React, { useRef, useEffect } from "react";

const ASSISTIVE_COLORS = [
  "rgba(255,255,255,0.9)",
  "rgba(255,255,255,0.65)",
  "rgba(96,71,247,0.13)",
  "rgba(36,182,85,0.09)"
];

function pickAssistiveColor() {
  // White most of the time, subtle color sometimes
  return Math.random() > 0.27
    ? "rgba(255,255,255,0.95)"
    : ASSISTIVE_COLORS[Math.floor(Math.random() * ASSISTIVE_COLORS.length)];
}

export default function RippleEffect() {
  const containerRef = useRef();

  useEffect(() => {
    const handleClick = e => {
      if (!containerRef.current) return;
      // Main small ripple
      const size = 24 + Math.random() * 18; // 54–72px
      const ripple = document.createElement("span");
      ripple.className = "assistive-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.marginLeft = ripple.style.marginTop = `${-size / 2}px`;
      ripple.style.setProperty("--assistive-ripple-color", pickAssistiveColor());

      containerRef.current.appendChild(ripple);
      setTimeout(() => ripple.remove(), 320);
    };
    window.addEventListener("pointerdown", handleClick);
    return () => window.removeEventListener("pointerdown", handleClick);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        overflow: "hidden"
      }}
    >
      <style>{`
        .assistive-ripple {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 55% 45%, #fff 30%, var(--assistive-ripple-color, #fff8) 80%, transparent 100%);
          box-shadow: 0 0 0 0 #fff7, 0 0 14px 2px #fff4;
          animation: assistive-ripple-anim 0.52s cubic-bezier(.28,1.21,.51,1);
          pointer-events: none;
          filter: blur(0.2px) saturate(1.13);
          will-change: transform, opacity;
        }
        @keyframes assistive-ripple-anim {
          0% { opacity: 0.7; transform: scale(0.45);}
          60% { opacity: 0.88; }
          85% { opacity: 0.53; transform: scale(1.05);}
          100% { opacity: 0; transform: scale(1.18);}
        }
      `}</style>
    </div>
  );
}

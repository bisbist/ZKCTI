import React from "react";

export default function ProofGeneratingAnimation({ show }) {
  if (!show) return null;
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 10,
      background: "rgba(255,255,255,0.62)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      pointerEvents: "none" // Prevent blocking the UI, can remove if you want to block clicks
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: "50%",
        background: "linear-gradient(135deg,#fff 55%,#24b655cc 85%,#7554ee88 100%)",
        boxShadow: "0 0 44px #24b65533, 0 0 80px #6047f744",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        animation: "pulseGlow 1.6s infinite alternate cubic-bezier(.56,1.36,.56,1)"
      }}>
        <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
          <circle cx={26} cy={26} r={24} stroke="#24b65599" strokeWidth={3} opacity={0.5} />
          <circle
            cx={26} cy={26} r={17}
            stroke="#7554ee"
            strokeWidth={4.2}
            strokeDasharray={100}
            strokeDashoffset={30}
            style={{ filter: "drop-shadow(0 0 10px #7554ee66)" }}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 26 26"
              to="360 26 26"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <span style={{
          fontWeight: 700, color: "#6047f7", position: "absolute",
          left: 0, right: 0, bottom: -32, fontSize: 15, textAlign: "center"
        }}>
          Generating Proof...
        </span>
      </div>
      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 44px #24b65533, 0 0 80px #6047f744; }
          100% { box-shadow: 0 0 54px #24b65544, 0 0 110px #6047f799; }
        }
      `}</style>
    </div>
  );
}

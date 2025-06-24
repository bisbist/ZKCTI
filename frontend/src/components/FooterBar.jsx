import React from "react";

export default function FooterBar() {
  return (
    <footer
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100vw",
        zIndex: 240,
        background: "none",
        backdropFilter: "none",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        className="glass-panel"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          margin: "0 auto",
          maxWidth: 700,
          minWidth: 280,
          padding: "18px 60px",
          textAlign: "center",
          color: "#222",
          borderRadius: 18,
          fontWeight: 600,
          fontSize: "1.01rem",
          pointerEvents: "auto"
        }}
      >
        © 2025 ZK-CTI Demo. Powered by Zero-Knowledge Proofs.
      </div>
    </footer>
  );
}

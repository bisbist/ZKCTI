import React from "react";

export default function HeaderBar({ darkMode, onToggleDarkMode }) {
  return (
    <header className="app-header glass-panel" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 32px", borderBottom: "1px solid #eee",
      minHeight: 110, height: 110, boxShadow: "0 4px 22px 0 rgba(80,76,176,0.05)",
      position: "sticky", top: 0, zIndex: 300
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/zkcti-logo.svg" alt="ZKCTI Logo"
          style={{ width: 100, height: 100, marginRight: 16 }} />
        <span style={{
          fontSize: "1.7rem", fontWeight: 700,
          color: darkMode ? "#fff" : "#2d2d44", letterSpacing: "0.02em"
        }}>
          ZKCTI: Threat Intelligence Sharing Platform
        </span>
      </div>
      <button
        onClick={onToggleDarkMode}
        style={{
          marginLeft: 20, background: darkMode ? "#2d2d44" : "#fff",
          color: darkMode ? "#fff" : "#2d2d44",
          border: "1px solid #b4b4d8", borderRadius: 8, padding: "6px 15px",
          fontWeight: 600, cursor: "pointer"
        }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
    </header>
  );
}

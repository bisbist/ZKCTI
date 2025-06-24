// HackerSpinner.jsx
import React from "react";

export default function HackerSpinner() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: 170
    }}>
      <svg width="120" height="110" viewBox="0 0 120 110" style={{ marginBottom: 10 }}>
        {/* Body */}
        <ellipse cx="60" cy="80" rx="30" ry="18" fill="#222a39" />
        {/* Head */}
        <ellipse cx="60" cy="60" rx="16" ry="17" fill="#232b45" />
        {/* Hoodie */}
        <ellipse cx="60" cy="57" rx="18" ry="18" fill="#6047f7" opacity="0.95" />
        <ellipse cx="60" cy="51" rx="22" ry="11" fill="#92b2fc" opacity="0.17" />
        {/* Eyes */}
        <ellipse cx="55" cy="61" rx="2.8" ry="3.5" fill="#aafcda">
          <animate attributeName="cy" values="61;62;61" dur="1.4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="65" cy="61" rx="2.8" ry="3.5" fill="#aafcda">
          <animate attributeName="cy" values="61;62;61" dur="1.4s" repeatCount="indefinite" />
        </ellipse>
        {/* Hands */}
        <ellipse cx="40" cy="92" rx="6" ry="2.8" fill="#222a39">
          <animate attributeName="rx" values="6;8;6" dur="1s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="80" cy="92" rx="6" ry="2.8" fill="#222a39">
          <animate attributeName="rx" values="6;8;6" dur="1s" repeatCount="indefinite" />
        </ellipse>
        {/* Laptop */}
        <rect x="45" y="85" width="30" height="13" rx="4" fill="#fafbff" stroke="#6047f7" strokeWidth="2" />
        <rect x="51" y="90" width="18" height="2.5" rx="1.1" fill="#dbe7fa">
          <animate attributeName="width" values="18;10;18" dur="0.85s" repeatCount="indefinite" />
        </rect>
      </svg>
      <div style={{
        fontFamily: "monospace",
        color: "#7554ee",
        letterSpacing: ".01em",
        fontSize: "1.12rem",
        fontWeight: 500,
        marginTop: 0
      }}>
        Generating random threat sample...
      </div>
    </div>
  );
}

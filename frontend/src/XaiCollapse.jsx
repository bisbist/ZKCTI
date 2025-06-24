import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Expects xai: [{feature: 'feature_123', shap: 0.1}, ...]
export default function XaiCollapse({ xai }) {
  const [open, setOpen] = useState(false);

  if (!xai || !xai.length) return null;

  // Sort & take top 10 most important features (by abs(shap))
  const sorted = [...xai].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap)).slice(0, 10);

  return (
    <div style={{
      margin: "20px 0 10px 0",
      borderRadius: 14,
      background: "rgba(252,250,255,0.96)",
      boxShadow: "0 2px 16px #7e5cfc11",
      border: "1.5px solid #e7e4ff",
      overflow: "hidden"
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 0",
          border: "none",
          background: "linear-gradient(90deg,#7554ee11,#24b65512)",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "1.08rem",
          color: "#6047f7"
        }}
      >
        <span style={{marginRight: 8}}>{open ? "▼" : "▶"}</span>
        Explain Prediction (XAI)
      </button>
      <div
        style={{
          maxHeight: open ? 320 : 0,
          transition: "max-height 0.45s cubic-bezier(.56,1.36,.56,1)",
          overflow: "hidden",
          background: "rgba(255,255,255,0.98)",
          padding: open ? "18px" : "0 18px",
          borderTop: open ? "1px solid #ece5ff" : "none"
        }}
      >
        {open && (
          <>
            <div style={{ marginBottom: 10, fontWeight: 600, color: "#222" }}>
              Top Features for this Sample
            </div>
            <div style={{ width: "100%", height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sorted} layout="vertical">
                  <XAxis type="number" fontSize={12} />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12, fill: "#6047f7" }}
                  />
                  <Tooltip formatter={v => v.toFixed(4)} />
                  <Bar
                    dataKey="shap"
                    fill="#7554ee"
                    radius={[7, 7, 7, 7]}
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{
              marginTop: 12,
              fontSize: "0.96rem",
              color: "#6047f7",
              background: "#f8f7ff",
              borderRadius: 6,
              padding: "7px 14px",
              display: "inline-block"
            }}>
              <b>Positive SHAP</b> → Malicious, <b>Negative</b> → Benign
            </div>
          </>
        )}
      </div>
    </div>
  );
}

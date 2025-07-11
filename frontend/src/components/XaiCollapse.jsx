import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function XaiCollapse({ xai }) {
  const [open, setOpen] = useState(false);
  const [featureCount, setFeatureCount] = useState(15);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!xai || !xai.length) return null;

  const sorted = [...xai].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap));
  const displayed = sorted.slice(0, featureCount);

  const ModalContent = (
    <motion.div
      key="xai-modal-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{
        position: "fixed",
        zIndex: 1000,
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(40,40,60,0.29)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)", // For Safari
      }}
    >
      <motion.div
        key="xai-modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300,
          damping: 25,
          mass: 0.5
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "min(96vw, 2000px)",
          height: "min(92vh, 650px)",
          background: "rgba(250,250,255,0.95)",
          borderRadius: 24,
          boxShadow: "0 10px 48px rgba(163, 157, 219, 0.3)",
          position: "relative",
          padding: 0,
          overflow: "hidden",
          willChange: "transform, opacity" // Optimize for animation
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            top: 18,
            right: 24,
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: "50%",
            width: 38,
            height: 38,
            fontSize: 24,
            color: "#6047f7",
            boxShadow: "0 2px 10px rgba(126, 92, 252, 0.1)",
            cursor: "pointer",
            zIndex: 2,
            transition: "all 0.2s ease",
            ":hover": {
              background: "rgba(255,255,255,1)",
              transform: "scale(1.1)"
            }
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Rest of your modal content remains the same */}
        <div style={{
          width: "82%",
          maxWidth: 800,
          display: "flex",
          alignItems: "center",
          gap: 18,
          margin: "32px 0 8px 0",
          fontWeight: 500,
          color: "#6248ca"
        }}>
          <input
            type="range"
            min={1}
            max={Math.min(xai.length, 32)}
            value={featureCount}
            onChange={e => setFeatureCount(Number(e.target.value))}
            style={{ width: 240, accentColor: "#7554ee" }}
          />
          <span style={{
            background: "#f1ecfd",
            color: "#7554ee",
            borderRadius: 9,
            padding: "2px 11px",
            fontSize: "1.05rem",
            boxShadow: "0 1px 4px rgba(184, 179, 244, 0.2)"
          }}>
            {featureCount} Features
          </span>
        </div>

        <div
          style={{
            flex: 1,
            width: "90%",
            maxWidth: 1000,
            minWidth: 340,
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 28,
            overflow: "hidden",
            height: "calc(100% - 90px)",
            minHeight: 350,
          }}
        >
          {/* Chart */}
          <div style={{
            flex: 1.6,
            minWidth: 260,
            height: "100%",
            background: "rgba(245,244,251,0.93)",
            borderRadius: 18,
            boxShadow: "0 1px 8px rgba(184, 179, 244, 0.23)",
            border: "1px solid #ede9ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 8px",
          }}>
            <ResponsiveContainer width="100%" height="97%">
              <BarChart data={displayed} layout="vertical">
                <XAxis type="number" fontSize={13} />
                <YAxis
                  dataKey="feature"
                  type="category"
                  width={120}
                  tick={{ fontSize: 13, fill: "#6047f7" }}
                />
                <Tooltip formatter={v => v.toFixed(4)} />
                <Bar
                  dataKey="shap"
                  fill="#7554ee"
                  radius={[7, 7, 7, 7]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Table */}
          <div style={{
            flex: 1,
            minWidth: 180,
            maxWidth: 320,
            maxHeight: "100%",
            overflowY: "auto",
            background: "rgba(250,250,255,0.97)",
            borderRadius: 16,
            boxShadow: "0 1px 8px rgba(184, 179, 244, 0.23)",
            border: "1px solid #ede9ff",
            padding: "14px 12px",
            display: "flex",
            alignItems: "center"
          }}>
            <table style={{ width: "100%", fontSize: "1.01rem", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: "#6047f7", paddingBottom: 2, fontWeight: 600 }}>Feature</th>
                  <th style={{ textAlign: "right", color: "#6047f7", paddingBottom: 2, fontWeight: 600 }}>SHAP</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((item) => (
                  <tr key={item.feature}>
                    <td style={{ padding: "2px 7px" }}>{item.feature}</td>
                    <td style={{
                      padding: "2px 7px",
                      textAlign: "right",
                      color: item.shap > 0 ? "#24b655" : "#d12e6a",
                      fontWeight: 500
                    }}>
                      {item.shap.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          padding: "12px 0",
          border: "none",
          background: "linear-gradient(90deg, rgba(117, 84, 238, 0.07), rgba(36, 182, 85, 0.07))",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "1.08rem",
          color: "#6047f7",
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(126, 92, 252, 0.1)",
          transition: "transform 0.2s ease",
          ":hover": {
            transform: "translateY(-2px)"
          }
        }}
      >
        ▶ Explain Prediction (SHAP)
      </button>
      
      {createPortal(
        <AnimatePresence>
          {open && ModalContent}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
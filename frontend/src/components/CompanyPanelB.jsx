import React, { useState } from "react";
import { verifyProof } from "../api"; // Adjust as needed
import VerificationCard from "./VerificationCard";

export default function CompanyBPanel({ proofData, onBack }) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(null);

  async function handleVerify() {
    setVerifying(true);
    try {
      const res = await verifyProof();
      setVerified(res.verified);
    } catch (err) {
      setVerified(false);
    }
    setVerifying(false);
  }

  // Fullscreen verification animation overlay
  const verificationOverlay = verified !== null && (
    <div style={{
      position: "fixed",
      inset: 0,
      background: verified ? "rgba(36,182,85,0.09)" : "rgba(240,39,39,0.11)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 5000,
      animation: "fadein 0.5s"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.99)",
        borderRadius: 18,
        boxShadow: "0 6px 40px #a8e4a166",
        padding: 46,
        minWidth: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <VerificationCard verified={verified} />
        <button
          style={{
            marginTop: 30,
            background: "#f6f7fb",
            border: "1.2px solid #7554ee77",
            borderRadius: 9,
            color: "#7554ee",
            fontWeight: 600,
            padding: "13px 30px",
            fontSize: "1.09rem",
            cursor: "pointer",
            boxShadow: "0 2px 16px #7554ee23",
            letterSpacing: "0.02em"
          }}
          onClick={onBack}
        >
          Back to Home
        </button>
      </div>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{
      background: "rgba(255,255,255,0.97)",
      borderRadius: 22,
      boxShadow: "0 8px 40px #b5a2ff22",
      padding: "44px 36px",
      minWidth: 440,
      maxWidth: 520,
      minHeight: 280,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      color: "#222",
      zIndex: 10,
      position: "relative"
    }}>
      <div style={{
        fontWeight: 700, color: "#024", fontSize: "2.18rem", marginBottom: 16
      }}>
        Company B (Verifier)
      </div>
      <div style={{ fontSize: "1.5rem", color: "#6047f7", marginBottom: 20 }}>
        Proof Received From Company A!
      </div>
      <div style={{fontSize: "1.5rem"}}>
        <b>Prediction:</b>{" "}
        <span style={{ color: proofData?.prediction === 1 ? "#e54769" : "#24b655" }}>
          {proofData?.prediction === 1 ? "Malicious" : "Benign"}
        </span>
      </div>

      {/* Show Verify button until verification is done */}
      {verified === null && (
        <button
          style={{
            marginTop: 40,
            marginBottom: 15,
            background: "#7554ee",
            backgroundImage: "linear-gradient(90deg,#7554ee 70%,#24b655 100%)",
            border: "none",
            borderRadius: 9,
            color: "#fff",
            fontWeight: 700,
            padding: "11px 32px",
            fontSize: "2.08rem",
            cursor: verifying ? "not-allowed" : "pointer",
            opacity: verifying ? 0.7 : 1,
            boxShadow: "0 2px 16px #7554ee33"
          }}
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify Proof"}
        </button>
      )}

      {/* Show the fullscreen overlay when verified */}
      {verificationOverlay}
    </div>
  );
}

import React, { useState } from "react";
import XaiCollapse from "./XaiCollapse";
import { useNavigate } from "react-router-dom";

export default function CompanyAPanel({
  predictionResult,
  proofStatus,
  xai,
  showExplain,
  onStart,
  onSendProof,
}) {
  const [proofSent, setProofSent] = useState(false);
  const navigate = useNavigate();

  // Handle Send Proof button click
  const handleSendProof = () => {
    setProofSent(true);
    console.log("Proof sent to Company B");
    
    onSendProof(); // Call the function passed as prop
  };

  // Handle verifying the proof (after sending to Company B)
  const handleVerify = () => {
    navigate("/verify-result"); // Navigate to the verification result page
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,243,255,0.98) 100%)",
        borderRadius: "24px",
        boxShadow: `
          0 4px 6px -1px rgba(96, 71, 247, 0.1),
          0 2px 4px -1px rgba(96, 71, 247, 0.06),
          0 25px 50px -12px rgba(96, 71, 247, 0.25)
        `,
        padding: "48px 40px",
        minWidth: "45vw",
        maxWidth: "40vw",
        minHeight: "30vw",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        color: "#1a1a1a",
        zIndex: 10,
        border: "1px solid rgba(224, 216, 255, 0.5)",
        backdropFilter: "blur(8px)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease-out",
      }}
    >
      {/* Decorative Elements */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(117,84,238,0.15) 0%, rgba(117,84,238,0) 70%)",
          zIndex: -1,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "-30px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(36,182,85,0.1) 0%, rgba(36,182,85,0) 70%)",
          zIndex: -1,
        }}
      ></div>

      {/* Header */}
      <div
        style={{
          fontWeight: 700,
          color: "#6047f7",
          fontSize: "1.4rem",
          marginBottom: "20px",
          textAlign: "center",
          position: "relative",
          paddingBottom: "12px",
        }}
      >
        Company A (Prover)
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #7554ee 0%, #24b655 100%)",
            borderRadius: "3px",
          }}
        ></div>
      </div>

      {predictionResult != null ? (
        <>
          {/* Prediction Result */}
          <div
            style={{
              fontSize: "1.2rem",
              color: "#1a1a1a",
              marginBottom: "12px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <span style={{ fontWeight: 600 }}>Prediction:</span>{" "}
            <span
              style={{
                color: predictionResult === 1 ? "#e54769" : "#24b655",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "20px",
                background:
                  predictionResult === 1
                    ? "rgba(229, 71, 105, 0.1)"
                    : "rgba(36, 182, 85, 0.1)",
                display: "inline-block",
                marginTop: "8px",
              }}
            >
              {predictionResult === 1 ? "Malicious" : "Benign"}
            </span>
          </div>

          {/* Proof Status */}
          <div
            style={{
              color: "#6047f7",
              fontWeight: 600,
              fontSize: "1.1rem",
              background: "rgba(117, 84, 238, 0.1)",
              padding: "8px 16px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#6047f7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {proofStatus}
          </div>

          {/* XAI Section */}
          {showExplain && xai && (
            <div
              style={{
                width: "100%",
                marginTop: "16px",
                borderTop: "1px solid rgba(224, 216, 255, 0.5)",
                paddingTop: "16px",
              }}
            >
              <XaiCollapse xai={xai} />
            </div>
          )}

          {/* Send Proof Button */}
          {!proofSent && (
            <button
              onClick={handleSendProof}
              style={{
                background: "linear-gradient(90deg, #7554ee 0%, #24b655 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "1.15rem",
                padding: "16px 36px",
                cursor: "pointer",
                margin: "0 auto",
                marginTop: "20px",
                boxShadow: "0 4px 14px rgba(117, 84, 238, 0.35)",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(117, 84, 238, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 14px rgba(117, 84, 238, 0.35)";
              }}
            >
              Send Proof
              <span
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                  transform: "rotate(30deg)",
                  transition: "all 0.6s ease",
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.left = "100%";
                  e.target.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.target.style.left = "-50%";
                  e.target.style.opacity = 0;
                }}
              ></span>
            </button>
          )}
        </>
      ) : (
        <>
          {/* Initial State */}
          <div
            style={{
              fontSize: "1.15rem",
              color: "#555",
              textAlign: "center",
              fontWeight: 500,
              lineHeight: 1.5,
              marginBottom: "8px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Begin a new zero-knowledge proof session
          </div>

          <button
            onClick={onStart}
            style={{
              background: "linear-gradient(90deg, #7554ee 0%, #24b655 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: "1.15rem",
              padding: "16px 36px",
              cursor: "pointer",
              margin: "0 auto",
              boxShadow: "0 4px 14px rgba(117, 84, 238, 0.35)",
              transition: "all 0.2s ease",
            }}
          >
            Start Process
          </button>
        </>
      )}
    </div>
  );
}

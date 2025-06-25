import React from "react";
import ZkctiAvatarB from "./ZkctiAvatarB";  // Assuming this is an avatar component
import { VerificationCard } from "./VerificationCard";  // Assuming this displays the verification results

export default function CompanyBPanel({
  step,
  verified,
  handleVerify,
  loading,
  companyBPanelRef
}) {
  return (
    <div
      className="company company-b glass-panel"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,243,255,0.98) 100%)",
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
        transition: "all 0.3s ease-out"
      }}
      ref={companyBPanelRef}
    >
      {/* Avatar and Header */}
      <ZkctiAvatarB size={56} style={{ marginBottom: 10 }} animate />
      <h2 style={{ marginBottom: 6, textAlign: "center" }}>
        Company B<br />(Verifier)
      </h2>

      {/* Status Section */}
      <ul style={{
        marginBottom: 18,
        color: "#111",
        fontWeight: 600,
        textAlign: "center"
      }}>
        <span style={{ color: "#111" }}>Status:</span>
        <span
          className="status-ok"
          style={{
            color: "#fff",
            textShadow:
              step === 5
                ? verified
                  ? "0 1px 5px #24b655, 0 0 1px #111"
                  : "0 1px 5px #ff4444, 0 0 1px #111"
                : "0 1px 5px #24b655, 0 0 1px #111",
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          {step === 5
            ? verified ? "Verified" : "Verification Failed"
            : "Available"}
        </span>
      </ul>

      {/* Proof Status - Awaiting Proof from Company A */}
      {step < 4 && (
        <div
          style={{
            background: "rgba(200, 200, 255, 0.1)",
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
            marginBottom: 20,
            border: "1px dashed rgba(100, 100, 255, 0.3)"
          }}
        >
          <div style={{ opacity: 0.7 }}>
            Awaiting proof from Company A...
          </div>
        </div>
      )}

      {/* Verification Button - Step 4 */}
      {step === 4 && (
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition mb-2"
          onClick={handleVerify}
          disabled={loading}
          style={{
            background: "linear-gradient(90deg, #7554ee 0%, #24b655 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "1.2rem",
            padding: "16px 36px",
            cursor: "pointer",
            marginTop: "20px",
            boxShadow: "0 4px 14px rgba(117, 84, 238, 0.35)",
            transition: "all 0.2s ease",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {loading ? "Verifying..." : "Verify Proof"}
          <span
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
              transform: "rotate(30deg)",
              transition: "all 0.6s ease",
              opacity: 0
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

      {/* Verification Card - Step 5 */}
      {step === 5 && (
        <VerificationCard verified={verified} />
      )}
    </div>
  );
}

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProof } from "../context/ProofContext";
import ZkctiAvatarA from "./ZkctiAvatarA";
import ZkctiAvatarB from "./ZkctiAvatarB";
import ProofGeneratingAnimation from "./ProofGeneratingAnimation";
import HackerSpinnerPro from "./HackerSpinnerPro";
import AnimatedStepper from "./AnimatedStepper";
import RippleEffect from "./RippleEffect";
import MultiUfoFly from "./UfoFly";
import DataTunnel from "./DataPath";
import XaiCollapse from "./XaiCollapse";
import VerificationCard from "./VerificationCard";
import AnimatedBackground from "./AnimatedBackground";

import {getRandomSample} from "../api"
const tooltips = [
  "Step 1: Click to generate a random test sample.",
  "Step 2: Click 'Predict & Generate Proof' to run the model.",
  "Step 3: Send proof to Company B.",
  "Step 4: Company B verifies the proof.",
  "Step 5: Trust is established if the proof is valid."
];

export default function HomePage() {
  const navigate = useNavigate();
  const {
    proof,
    prediction,
    verified,
    resetAll,
    sample,
    isSampling,
    isProofGenerating,
    xai
  } = useProof();

  const [step, setStep] = React.useState(1);
  const [showTour, setShowTour] = React.useState(false);
  const [showDataTunnel, setShowDataTunnel] = React.useState(false);

  // Create refs for DataTunnel endpoints
  const companyARef = useRef(null);
  const companyBRef = useRef(null);

  // Reset step logic on proof/verification state
  React.useEffect(() => {
    if (isSampling) setStep(1);
    else if (sample && !proof) setStep(2);
    else if (proof && !verified) setStep(3);
    else if (proof && verified !== null) setStep(4);
    else setStep(1);
  }, [isSampling, sample, proof, verified]);

  // Reset app state after trust established
  React.useEffect(() => {
    if (verified !== null) {
      const t = setTimeout(resetAll, 8000);
      return () => clearTimeout(t);
    }
  }, [verified, resetAll]);

  const handleSample = async () => {
    await getRandomSample();
  };

  const handleSendProof = () => {
    setShowDataTunnel(true);
    setTimeout(() => {
      setShowDataTunnel(false);
    }, 2000); // Match animation duration
  };

  return (
    <div className="zkcti-app" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <AnimatedBackground />
      <RippleEffect />
      <MultiUfoFly />

      {/* HEADER */}
      <header className="app-header glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: 0.5, color: "#222", margin: 0 }}>
          ZKCTI Threat Intelligence Platform
        </h1>
        <button
          onClick={() => setShowTour(true)}
          style={{
            background: "#6047f7", color: "#fff", border: "none",
            borderRadius: 14, padding: "11px 23px", fontWeight: 600,
            fontSize: "1.07rem", boxShadow: "0 2px 16px #6047f733", zIndex: 100,
          }}
        >How this works?</button>
      </header>

      {/* TOOLTIP */}
      <div
        className="step-tooltip glass-panel"
        style={{
          background: "rgba(255,250,230,0.85)",
          borderLeft: "4px solid #f6b73c",
          borderRadius: 12,
          padding: "10px 18px",
          margin: "18px auto 12px auto",
          maxWidth: 480,
          fontSize: "1.07rem",
          fontWeight: 500,
          color: "#514500",
          boxShadow: "0 2px 14px #ebd97e33",
          transition: "all 0.3s",
          position: "relative"
        }}
      >
        💡 {tooltips[step - 1]}
      </div>

      {/* MAIN TWO-PANEL LAYOUT */}
      <main>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 24 }}>
          {/* Company A (Prover) */}
          <div ref={companyARef} className="company company-a glass-panel" style={{ minWidth: 320, padding: 26, position: "relative" }}>
            <ZkctiAvatarA size={56} style={{ marginBottom: 10 }} animate />
            <h2>Company A (Prover)</h2>
            <button
              className="w-full bg-teal-600 text-white font-semibold py-2 rounded hover:bg-teal-700 transition mb-2"
              onClick={handleSample}
              disabled={isSampling || sample || !!proof}
            >
              {isSampling ? "Sampling..." : "Generate Data"}
            </button>
            {isSampling && (
              <div style={{ margin: "22px 0" }}>
                <HackerSpinnerPro showRipple />
              </div>
            )}
            {sample && !proof && (
              <button
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition mb-2"
                onClick={() => navigate("/prove")}
                disabled={!!proof}
              >
                Predict & Generate Proof
              </button>
            )}
            {proof && (
              <div style={{ margin: "16px 0", color: "#24b655", fontWeight: 700 }}>
                Proof generated! Ready to send.
              </div>
            )}
            {proof && (
              <button
                className="w-full bg-gray-700 text-white font-semibold py-2 rounded hover:bg-gray-800 transition mb-2"
                onClick={handleSendProof}
                disabled={verified !== null}
              >
                Send Proof to Company B
              </button>
            )}
            {sample?.xai && (
              <XaiCollapse xai={sample.xai} />
            )}
            {typeof prediction === "number" && (
              <div style={{
                margin: "10px 0 0 0",
                fontWeight: 700,
                fontSize: 18,
                color: prediction === 1 ? "#db1d5b" : "#24b655"
              }}>
                Prediction: {prediction === 1 ? "Malicious" : "Benign"}
              </div>
            )}
          </div>

          {/* Company B (Verifier) */}
          <div ref={companyBRef} className="company company-b glass-panel" style={{ minWidth: 320, padding: 26 }}>
            <ZkctiAvatarB size={56} style={{ marginBottom: 10 }} animate />
            <h2>Company B (Verifier)</h2>
            {proof ? (
              <button
                className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition mb-2"
                onClick={() => navigate("/verify")}
                disabled={verified !== null}
              >
                Verify Proof
              </button>
            ) : (
              <div style={{ color: "#aaa" }}>Waiting for proof...</div>
            )}
            {verified !== null && (
              <>
                <VerificationCard verified={verified} />
                <div style={{
                  color: verified ? "#24b655" : "#ff4444",
                  margin: "16px 0",
                  fontWeight: 700
                }}>
                  {verified ? "Proof Verified – Trust Established!" : "Proof Verification Failed"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* DataTunnel animation - only show when sending proof */}
        {showDataTunnel && (
          <DataTunnel 
            trigger={showDataTunnel}
            refA={companyARef}
            refB={companyBRef}
          />
        )}
      </main>

      {/* Stepper */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 82,
          transform: "translateX(-50%)",
          zIndex: 220,
          pointerEvents: "auto"
        }}
      >
        <AnimatedStepper step={step} verified={verified} />
      </div>

      {/* Footer */}
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
            padding: "18px 0",
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

      {/* Tour Modal */}
      {showTour && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(60,50,100,0.22)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowTour(false)}
        >
          <div
            className="glass-panel"
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid #e9e2ff",
              boxShadow: "0 10px 40px #aaa9f944, 0 2px 6px #dbd8f544",
              padding: "2.4rem 2.7rem",
              borderRadius: "22px",
              minWidth: 390,
              maxWidth: 520,
              textAlign: "center",
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute", top: 18, right: 24, fontSize: 25, color: "#aaa", border: "none", background: "none", cursor: "pointer"
              }}
              onClick={() => setShowTour(false)}
              aria-label="Close"
            >×</button>
            <h2 style={{ color: "#19181c", marginBottom: "1.5rem" }}>
              How ZKCTI Works
            </h2>
            <ol
              style={{
                textAlign: "left",
                margin: "0 auto",
                maxWidth: 400,
                fontSize: "1.11rem",
                lineHeight: 1.7
              }}
            >
              <li>
                <b>Generate Sample:</b> Click to create a random test sample.
              </li>
              <li>
                <b>Predict & Generate Proof:</b> The model predicts threat status and creates a zero-knowledge proof of the result.
              </li>
              <li>
                <b>Send Proof:</b> Company A sends the proof to Company B (verifier).
              </li>
              <li>
                <b>Verify Proof:</b> Company B checks the proof and the process is complete.
              </li>
            </ol>
            <div style={{
              marginTop: 20,
              color: "#19181c",
              fontWeight: 700,
              maxWidth: 400,
              fontSize: "1.07rem",
              letterSpacing: "0.01em",
              background: "rgba(240,240,240,0.95)",
              borderRadius: 7,
              padding: "7px 15px",
              display: "inline-block"
            }}>
              🔒 NOTE: No sensitive data is shared—only cryptographic proofs.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
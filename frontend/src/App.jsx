import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import MultiUfoFly from "./components/UfoFly";
import DataTunnel from "./components/DataPath";
import RippleEffect from "./components/RippleEffect";
import AnimatedBackground from "./components/AnimatedBackground";

import HeaderBar from "./components/HeaderBar";
import TooltipStep from "./components/TooltipStep";
import FooterBar from "./components/FooterBar";
import CompanyPanelA from "./components/CompanyPanelA";
import CompanyPanelB from "./components/CompanyPanelB";
import StepperBar from "./components/StepperBar";
import QuickTourModal from "./components/QuickTourModal";
import BenignConfirmModal from "./components/BenignConformModal";

import { tooltips, glassCSS, HEADER_HEIGHT, STEPPER_HEIGHT, FOOTER_HEIGHT } from "./components/Constants"; // Make sure these are defined/exported
import { getRandomSample, predict, generateProof, verifyProof } from "./api";

function App() {
  // ---- State management ----
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [zkData, setZkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sample, setSample] = useState(null);
  const [proof, setProof] = useState(null);
  const sendProofBtnRef = useRef();
  const companyBPanelRef = useRef();
  const [showProofAnim, setShowProofAnim] = useState(false);
  const [showBenignConfirm, setShowBenignConfirm] = useState(false);
  const [showUfo, setShowUfo] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // ---- Glassmorphism CSS effect ----
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = glassCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ---- Stepper reset logic ----
  useEffect(() => {
    if (step === 5) {
      const timeout = setTimeout(() => {
        setStep(1);
        setVerified(null);
        setPrediction(null);
        setSample(null);
        setProof(null);
        setZkData(null);
        setShowProofAnim(false);
      }, 20000); // Adjust delay if needed
      return () => clearTimeout(timeout);
    }
  }, [step]);

  // ---- Handler functions ----
  const handleRandomSample = async () => {
    setShowUfo(false);
    setLoading(true);
    setStep(1);
    setSample(null);
    setProof(null);
    try {
      const data = await getRandomSample();
      setSample(data);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode((v) => {
      localStorage.setItem("darkMode", String(!v));
      return !v;
    });
  };

  const handlePredictAndProof = async () => {
    setShowProofAnim(true);
    try {
      const predRes = await predict(sample.features);
      setPrediction(predRes.prediction);
      if (predRes.prediction === 0) {
        setShowBenignConfirm(true);
        setShowProofAnim(false);
        return;
      }
      const zkRes = await generateProof();
      setZkData({ ...zkRes, prediction: predRes.prediction });
      setStep(3);
    } catch (error) {
      console.error("Error during prediction or proof generation:", error);
    } finally {
      setShowProofAnim(false);
    }
  };

  const handleBenignConfirm = async () => {
    setShowBenignConfirm(false);
    setShowProofAnim(true);
    try {
      const zkRes = await generateProof();
      setZkData({ ...zkRes, prediction: 0 });
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setShowProofAnim(false);
    }
  };

  const handleBenignCancel = () => {
    setShowBenignConfirm(false);
    // Optionally reset step or do nothing
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyProof();
      setVerified(res.verified);
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  const handleSendProof = async () => {
    setStep(4);
  };

  // Stepper logic: 1=Sample, 2=Proof Gen, 3=Proof Sent, 4=Verified
  let stepper = step;
  if (stepper > 4) stepper = 4;

  const mainMinHeight = `calc(100vh - ${HEADER_HEIGHT + STEPPER_HEIGHT + FOOTER_HEIGHT + 18}px)`;

  // ---- UI ----
  return (
    <div className={`zkcti-app${darkMode ? " dark-mode" : ""}`} style={{
      position: "relative",
      minHeight: "100vh",
      zIndex: 1,
      overflow: "hidden"
    }}>
      <AnimatedBackground />
      <RippleEffect />
      {showUfo && <MultiUfoFly darkMode={darkMode} />}
      <HeaderBar darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
      <TooltipStep step={step} tooltips={tooltips} />
      <main
        style={{
          minHeight: mainMinHeight,
          maxHeight: mainMinHeight,
          overflowY: "auto",
          paddingBottom: 12,
          paddingTop: 12,
          boxSizing: "border-box",
        }}
      >
        <div className="company-panel" style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 14 }}>
          <CompanyPanelA
            loading={loading}
            step={step}
            handleRandomSample={handleRandomSample}
            handlePredictAndProof={handlePredictAndProof}
            prediction={prediction}
            sample={sample}
            showProofAnim={showProofAnim}
            handleSendProof={handleSendProof}
            sendProofBtnRef={sendProofBtnRef}
          />
          <CompanyPanelB
            step={step}
            verified={verified}
            handleVerify={handleVerify}
            loading={loading}
            companyBPanelRef={companyBPanelRef}
          />
        </div>
        <DataTunnel trigger={step === 4} refA={sendProofBtnRef} refB={companyBPanelRef} />
      </main>
      <StepperBar stepper={stepper} verified={verified} />
      <FooterBar />

      {/* Floating Quick Tour Button */}
      <button
        onClick={() => setShowTour(true)}
        style={{
          position: "fixed",
          right: 30,
          bottom: FOOTER_HEIGHT + STEPPER_HEIGHT - 14,
          background: "#6047f7",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "11px 23px",
          fontWeight: 600,
          fontSize: "1.07rem",
          boxShadow: "0 2px 16px #6047f733",
          zIndex: 300,
        }}
      >
        How this works?
      </button>

      <QuickTourModal show={showTour} onClose={() => setShowTour(false)} darkMode={darkMode} />
      <BenignConfirmModal
        show={showBenignConfirm}
        onConfirm={handleBenignConfirm}
        onCancel={handleBenignCancel}
      />
    </div>
  );
}

export default App;


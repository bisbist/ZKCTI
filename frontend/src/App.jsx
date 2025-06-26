import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground";
import HeaderBar from "./components/HeaderBar";
import TooltipStep from "./components/TooltipStep";
import FooterBar from "./components/FooterBar";
import StepperBar from "./components/StepperBar";
import QuickTourModal from "./components/QuickTourModal";
import HomePage from "./components/HomePage";
import ProvePage from "./components/ProvePage";
import VerifyPage from "./components/VerifyPage"; // <-- NEW: Import your VerifyPage wrapper
import { tooltips, glassCSS, HEADER_HEIGHT, STEPPER_HEIGHT, FOOTER_HEIGHT } from "./components/Constants";

// Helper to check if proveResult is a valid result object
function isValidProveResult(result) {
  return result && typeof result.prediction === "number" && !!result.proofStatus;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = glassCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((v) => {
      localStorage.setItem("darkMode", String(!v));
      return !v;
    });
  };

  return (
    <Router>
      <AppFrame
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        showTour={showTour}
        setShowTour={setShowTour}
      />
    </Router>
  );
}

function AppFrame({ darkMode, onToggleDarkMode, showTour, setShowTour }) {
  const location = useLocation();

  // Determine if session is "complete" using helper
  const proveResult = location.state?.proveResult || null;
  const isComplete = isValidProveResult(proveResult);

  // Stepper logic: 1 - only "Sample Generated", 3 - after proof complete
  let stepper = 1;
  if (location.pathname === "/" && isComplete) stepper = 3;
  if (location.pathname === "/prove") stepper = 1;
  if (location.pathname === "/verify") stepper = 3; // After proof is sent

  const mainMinHeight = `calc(100vh - ${HEADER_HEIGHT + STEPPER_HEIGHT + FOOTER_HEIGHT + 18}px)`;

  return (
    <div className={`zkcti-app${darkMode ? " dark-mode" : ""}`} style={{
      position: "relative",
      minHeight: "100vh",
      zIndex: 1,
      overflow: "hidden"
    }}>
      <AnimatedBackground />
      <HeaderBar darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
      <TooltipStep step={stepper} tooltips={tooltips} />
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prove" element={<ProvePage />} />
          <Route path="/verify" element={<VerifyPage />} /> {/* <-- NEW Route */}
        </Routes>
      </main>
      <StepperBar stepper={stepper} />
      <FooterBar />
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
    </div>
  );
}

export default App;

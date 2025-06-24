import "./App.css";
import MultiUfoFly from "./UfoFly";
import DataTunnel from "./DataPath";
import XaiCollapse from "./XaiCollapse";
import RippleEffect from "./RippleEffect";
import HackerSpinnerPro from "./HackerSpinnerPro";
import React, { useState, useRef, useEffect } from "react";
import ProofGeneratingAnimation from "./ProofGeneratingAnimation";
import { getRandomSample, predict, generateProof, verifyProof } from "./api";

// --- Constants for Layout ---
const HEADER_HEIGHT = 110;
const STEPPER_HEIGHT = 50;
const FOOTER_HEIGHT = 70;

// Add these new components at the top of your file
const VerificationSuccessAnimation = () => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0'
  }}>
    {/* Animated checkmark */}
    <svg width="80" height="80" viewBox="0 0 80 80" style={{
      animation: 'checkmarkPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }}>
      <circle cx="40" cy="40" r="38" fill="#4BB543" />
      <path
        d="M25 40 L35 50 L55 30"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    {/* Floating particles */}
    {[...Array(12)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#4BB543',
        opacity: 0.7,
        animation: `floatParticles 2s ease-in-out ${i * 0.1}s infinite`,
        top: '50%',
        left: '50%',
        transform: `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px)`
      }} />
    ))}

    <h3 style={{
      marginTop: 20,
      color: '#ffffff',
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center'
    }}>
      Proof Verified Successfully!
    </h3>

    <style jsx>{`
      @keyframes checkmarkPop {
        0% { transform: scale(0); opacity: 0; }
        80% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes floatParticles {
        0% { transform: translate(0, 0); opacity: 0; }
        50% { opacity: 0.7; }
        100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
      }
    `}</style>
  </div>
);

const VerificationFailedAnimation = () => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0'
  }}>
    {/* Animated X mark */}
    <svg width="80" height="80" viewBox="0 0 80 80" style={{
      animation: 'xMarkShake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)'
    }}>
      <circle cx="40" cy="40" r="38" fill="#ff4444" />
      <path
        d="M30 30 L50 50 M50 30 L30 50"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>

    {/* Shatter effect */}
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: 6,
        height: 6,
        background: '#ff4444',
        opacity: 0,
        animation: `shatter 1s ease-out ${i * 0.1}s forwards`,
        top: '50%',
        left: '50%',
        transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg)`
      }} />
    ))}

    <h3 style={{
      marginTop: 20,
      color: '#ff4444',
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center'
    }}>
      Proof Verification Failed!
    </h3>

    <style jsx>{`
      @keyframes xMarkShake {
        0%, 100% { transform: rotate(0deg); }
        10%, 30%, 50%, 70%, 90% { transform: rotate(-3deg); }
        20%, 40%, 60%, 80% { transform: rotate(3deg); }
      }
      
      @keyframes shatter {
        0% { opacity: 0; transform: translate(0, 0) scale(0); }
        50% { opacity: 1; transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1); }
        100% { opacity: 0; transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); }
      }
    `}</style>
  </div>
);

const VerificationCard = ({ verified }) => (
  <div className="glass-panel" style={{
    padding: '25px',
    borderRadius: '20px',
    margin: '20px 0',
    background: verified
      ? 'linear-gradient(135deg, rgba(75, 181, 67, 0.15) 0%, rgba(75, 181, 67, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(255, 68, 68, 0.1) 0%, rgba(255, 68, 68, 0.03) 100%)',
    border: `2px solid ${verified ? '#4BB543' : '#ff4444'}`,
    boxShadow: verified
      ? '0 0 20px rgba(75, 181, 67, 0.3)'
      : '0 0 20px rgba(255, 68, 68, 0.3)',
    transition: 'all 0.5s ease',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Animated background elements */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: verified
        ? 'radial-gradient(circle, rgba(75, 181, 67, 0.15) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(255, 68, 68, 0.15) 0%, transparent 70%)',
      animation: 'pulse 4s infinite alternate'
    }} />

    {verified ? <VerificationSuccessAnimation /> : <VerificationFailedAnimation />}

    <div style={{
      textAlign: 'center',
      marginTop: '15px',
      color: verified
        ? '#ffffff'  // White text for success
        : '#ff2a2a', // Bright red text for failure
      fontSize: '1.1rem',
      fontWeight: 500,
      textShadow: verified
        ? '0 1px 3px rgba(0,0,0,0.3)'
        : '0 1px 2px rgba(255,255,255,0.3)',
      padding: '10px 15px',
      background: verified
        ? 'rgba(0,0,0,0.15)'
        : 'rgba(255,255,255,0.7)',
      borderRadius: '8px',
      display: 'inline-block'
    }}>
      {verified
        ? 'The proof was successfully verified. Trust established!'
        : 'The proof could not be verified.'}
    </div>

    {/* Additional visual feedback */}
    {!verified && (
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: 'rgba(255, 220, 220, 0.3)',
        borderRadius: '8px',
        border: '1px dashed rgba(255, 100, 100, 0.5)'
      }}>
        <div style={{
          color: '#cc0000',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          Tip: Check your proof parameters and model constraints
        </div>
      </div>
    )}

    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 0.3; transform: scale(0.98); }
        100% { opacity: 0.7; transform: scale(1.02); }
      }
    `}</style>
  </div>
);

// Animated avatar logo for Company A
function ZkctiAvatarA({ size = 56, style = {}, animate = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style} fill="none">
      {/* Glow */}
      <ellipse cx="32" cy="56" rx="22" ry="6" fill="#b3aaff" opacity="0.18" />
      {/* Animated halo */}
      <ellipse
        cx="32" cy="22" rx="18" ry="8"
        fill="#6047f7"
        opacity="0.19"
        style={{
          transformOrigin: "32px 22px",
          animation: animate ? "haloA 2.1s linear infinite" : undefined,
        }}
      />
      {/* Hair */}
      <path
        d="M19 25 Q26 10 44 18 Q48 19 45 27 Q40 12 28 18 Q24 20 19 25 Z"
        fill="#2b2d48"
      />
      {/* Face - lighter skin */}
      <ellipse
        cx="32" cy="29.5" rx="13.2" ry="13"
        fill="#f7e7da"   // pale skin tone
        stroke="#6047f7" strokeWidth="2.1"
      />
      {/* Blush (cheeks) */}
      <ellipse cx="25.5" cy="33" rx="2.1" ry="1.1" fill="#ffb6ad" opacity="0.35" />
      <ellipse cx="38.5" cy="33" rx="2.1" ry="1.1" fill="#ffb6ad" opacity="0.35" />
      {/* Glasses / Visor */}
      <rect x="22" y="25" width="20" height="6" rx="3.2"
        fill="#6bd4ff"
        stroke="#443b7b"
        strokeWidth="1.2"
        opacity="0.92"
      />
      <rect x="22" y="25" width="20" height="6" rx="3.2"
        fill="url(#visorGradA)"
        opacity="0.35"
      />
      <defs>
        <linearGradient id="visorGradA" x1="22" y1="25" x2="42" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6bd4ff" />
          <stop offset="1" stopColor="#3e7fc1" />
        </linearGradient>
      </defs>
      {/* Eyes under glasses */}
      <ellipse cx="27.5" cy="30.5" rx="1.3" ry="1.7" fill="#222" />
      <ellipse cx="36.5" cy="30.5" rx="1.3" ry="1.7" fill="#222" />
      {/* Smile */}
      <path d="M27 36 Q32 39 37 36" stroke="#8c7fef" strokeWidth="2" fill="none" />
      {/* Cyber Jacket - brighten color */}
      <path
        d="M20 47 Q32 63 44 47 Q51 52 51 58 Q32 62 13 58 Q13 52 20 47 Z"
        fill="#5060e2"
        stroke="#6047f7"
        strokeWidth="1"
      />
      {/* Jacket Lapels */}
      <path d="M32 47 Q34 55 40 55 Q38 52 44 47" fill="#a9baff" opacity="0.23" />
      <path d="M32 47 Q30 55 24 55 Q26 52 20 47" fill="#a9baff" opacity="0.23" />
      {/* Cyber earring */}
      <circle cx="18.8" cy="36.5" r="1.2" fill="#36ecff" stroke="#111" strokeWidth="0.32" />
      <style>
        {`
          @keyframes haloA {
            0% { transform: rotate(0deg) scaleX(1);}
            60% { transform: rotate(10deg) scaleX(1.09);}
            100% { transform: rotate(0deg) scaleX(1);}
          }
        `}
      </style>
    </svg>
  );
}

// Animated avatar logo for Company B
function ZkctiAvatarB({ size = 56, style = {}, animate = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style} fill="none">
      {/* Glow */}
      <ellipse cx="32" cy="56" rx="22" ry="6" fill="#c3fad7" opacity="0.18" />
      {/* Animated ring */}
      <circle
        cx="32" cy="22" r="12"
        fill="#24b655"
        opacity="0.14"
        style={{
          transformOrigin: "32px 22px",
          animation: animate ? "haloB 2.4s linear infinite" : undefined,
        }}
      />
      {/* Spiky Hair */}
      <path
        d="M19 22 Q23 9 32 14 Q40 7 45 22 Q41 18 39 22 Q36 16 32 22 Q28 18 25 22 Q21 19 19 22 Z"
        fill="#f6d287"
        stroke="#388946"
        strokeWidth="0.7"
      />
      {/* Face */}
      <ellipse cx="32" cy="29.5" rx="13.1" ry="13" fill="#f9ecd9" stroke="#24b655" strokeWidth="2.1" />
      {/* Eyes */}
      <ellipse cx="27.5" cy="31" rx="1.5" ry="1.8" fill="#373e36" />
      <ellipse cx="36.5" cy="31" rx="1.5" ry="1.8" fill="#373e36" />
      {/* Smile */}
      <path d="M27.5 36 Q32 40 36.5 36" stroke="#2bc274" strokeWidth="2" fill="none" />
      {/* Cyber earpiece */}
      <rect x="44.7" y="31" width="2.7" height="6.3" rx="1.3"
        fill="#43e65a"
        stroke="#222"
        strokeWidth="0.19"
        opacity="0.66"
      />
      <circle cx="46" cy="37.5" r="1.3" fill="#4fffa0" opacity="0.67" />
      {/* Suit */}
      <path
        d="M20 47 Q32 62 44 47 Q52 51 51 59 Q32 62 13 59 Q13 51 20 47 Z"
        fill="#24b655"
        stroke="#21713e"
        strokeWidth="1.2"
        opacity="0.98"
      />
      {/* Lapels */}
      <path d="M32 47 Q34 56 41 56 Q38 52 44 47" fill="#89e6bb" opacity="0.15" />
      <path d="M32 47 Q30 56 23 56 Q26 52 20 47" fill="#89e6bb" opacity="0.15" />
      {/* Lock badge */}
      <g>
        <rect x="28.3" y="52.7" width="7.2" height="8.3" rx="3.2"
          fill="#fff" stroke="#2bc274" strokeWidth="0.7" opacity="0.95"
        />
        <rect x="30.6" y="54.8" width="2.6" height="4" rx="1" fill="#24b655" opacity="0.67" />
        <circle cx="31.9" cy="56.5" r="0.65" fill="#21713e" />
      </g>
      {/* Glasses */}
      <rect x="24" y="27" width="16" height="4" rx="2"
        fill="#7cf0bb" opacity="0.13"
      />
      <style>
        {`
          @keyframes haloB {
            0% { transform: scaleY(1);}
            50% { transform: scaleY(1.12);}
            100% { transform: scaleY(1);}
          }
        `}
      </style>
    </svg>
  );
}

// --- Animated Gradient Background ---
function AnimatedBackground() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      background: "linear-gradient(120deg, #6047f7 0%, #24b655 70%, #ffd65b 100%)",
      animation: "moveBg 18s ease-in-out infinite alternate",
      backgroundSize: "220% 220%",
    }}>
      <style>{`
        @keyframes moveBg {
          0% { background-position: 0% 80%; }
          50% { background-position: 100% 20%; }
          100% { background-position: 0% 80%; }
        }
      `}</style>
    </div>
  );
}

// --- Glassmorphism CSS class ---
const glassCSS = `
  .glass-panel {
    background: rgba(255,255,255,0.19);
    border: 1.6px solid rgba(100,100,255,0.13);
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: 20px;
    transition: background 0.3s, box-shadow 0.2s;
  }
`;

const tooltips = [
  "Step 1: Click to generate a random test sample.",
  "Step 2: Click 'Predict & Generate Proof' to run the model.",
  "Step 3: Send proof to Company B.",
  "Step 4: Company B verifies the proof.",
  "Step 5: Trust is established if the proof is valid.",
  "All done! Trust established."
];

function AnimatedStepper({ step, verified = null, debug = false }) {
  const steps = [
    "Sample Generated",
    "Proof Generated",
    "Proof Sent",
    "Proof Verified"
  ];

  if (debug) {
    console.log("AnimatedStepper rendering. Step prop value:", step);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "34px 0 14px",
        border: debug ? "2px dashed red" : undefined,
        position: "relative",
        zIndex: 20,
        background: "none",
        boxShadow: "none",
        width: "auto"
      }}
    >
      {steps.map((label, idx) => {
        // Determine status of this step
        const current = idx + 1 === step;
        const completed = idx + 1 < step || (idx + 1 === step && idx + 1 === steps.length && verified === true);
        const failed = idx + 1 === steps.length && step === steps.length && verified === false;

        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    failed
                      ? "#ff4444"
                      : current
                        ? "linear-gradient(135deg,#7554ee 60%,#24b655 100%)"
                        : completed
                          ? "#24b655"
                          : "#eee",
                  boxShadow:
                    current && !failed ? "0 0 12px #b5a2ff88" : failed ? "0 0 18px #ff4444bb" : undefined,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 22,
                  border:
                    current
                      ? "4px solid #cabdff"
                      : failed
                        ? "3px solid #ff4444"
                        : "2px solid #ddd",
                  transition: "all 0.22s cubic-bezier(.56,1.36,.56,1)"
                }}
              >
                {/* Change content for last step */}
                {idx + 1 === steps.length && step === steps.length
                  ? (verified === false
                    ? <span style={{ fontSize: 32, color: "#fff" }}>✗</span> // Red cross
                    : (verified === true
                      ? <span style={{ fontSize: 32, color: "#fff" }}>✓</span> // Green tick
                      : idx + 1 // show step number if not yet done
                    )
                  )
                  : (completed
                    ? <span style={{ fontSize: 26, color: "#fff" }}>✓</span>
                    : idx + 1
                  )
                }
              </div>
              <span
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  color: current ? "#6047F7" : failed ? "#ff4444" : "#555",
                  fontWeight: current ? 700 : 500,
                  minWidth: 90,
                  textAlign: "center"
                }}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  width: 58,
                  height: 7,
                  background:
                    idx + 1 < step
                      ? "linear-gradient(90deg,#24b655 40%,#7554ee 90%)"
                      : "#eee",
                  borderRadius: 9,
                  margin: "0 3px",
                  transition: "background 0.19s"
                }}
                className={idx + 2 === step ? "stepper-bar-animate" : ""}
              />
            )}
          </React.Fragment>
        );
      })}
      <style>{`
        .stepper-bar-animate {
          animation: progwiggle 1.25s infinite alternate;
        }
        @keyframes progwiggle {
          0% { box-shadow: 0 0 0 0 #7554ee44; }
          70% { box-shadow: 0 0 10px 5px #7554ee55; }
          100% { box-shadow: 0 0 0 0 #7554ee44; }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [pendingSample, setPendingSample] = useState(null);
  const [zkData, setZkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletNetwork, setWalletNetwork] = useState("");
  const [sample, setSample] = useState(null);
  const [proof, setProof] = useState(null);
  const sendProofBtnRef = useRef();
  const companyBPanelRef = useRef();
  const [showProofAnim, setShowProofAnim] = useState(false);
  const [showBenignConfirm, setShowBenignConfirm] = useState(false);
  const [showUfo, setShowUfo] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });


  // Inject glassmorphism CSS globally
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = glassCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
      }, 100000); // Change delay as needed
      return () => clearTimeout(timeout);
    }
  }, [step]);


  const handleRandomSample = async () => {
    setShowUfo(false);
    setLoading(true);
    setStep(1);
    setSample(null);
    setProof(null);
    try {
      const data = await getRandomSample();
      console.log("Random sample data:", data);

      setSample(data);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(v => {
      localStorage.setItem('darkMode', String(!v));
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
    // Optionally: Reset step or do nothing.
  };

  const handleVerify = async () => {
    const res = await verifyProof();
    setVerified(res.verified);
    setStep(5);
  };

  const handleSendProof = async () => {
    setStep(4);
  };

  const handleWalletConnect = (address, network) => {
    setWalletConnected(true);
    setWalletAddress(address);
    setWalletNetwork(network);
  };
  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setWalletNetwork("");
  };

  // Stepper logic: 1=Sample, 2=Proof Gen, 3=Proof Sent, 4=Verified
  let stepper = step;
  if (stepper > 4) stepper = 4;

  // HEIGHT: Subtract HEADER+STEPPER+FOOTER from 100vh, allow for safe margin
  const mainMinHeight = `calc(100vh - ${HEADER_HEIGHT + STEPPER_HEIGHT + FOOTER_HEIGHT + 18}px)`;

  return (
    <div
      className={`zkcti-app${darkMode ? " dark-mode" : ""}`}
      style={{
        position: "relative",
        minHeight: "100vh",
        zIndex: 1,
        overflow: "hidden"
      }}
    >
      <AnimatedBackground />
      <RippleEffect />
      {showUfo && <MultiUfoFly darkMode={darkMode} />}

      {/* HEADER */}
      <header
        className="app-header glass-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          borderBottom: "1px solid #eee",
          minHeight: HEADER_HEIGHT,
          height: HEADER_HEIGHT,
          boxShadow: "0 4px 22px 0 rgba(80,76,176,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 300
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/zkcti-logo.svg"
            alt="ZKCTI Logo"
            style={{
              width: 100,
              height: 100,
              marginRight: 16,
              display: "inline-block",
              verticalAlign: "middle"
            }}
          />
          <span
            style={{
              fontSize: "1.7rem",
              fontWeight: 700,
              color: darkMode ? "#fff" : "#2d2d44",
              letterSpacing: "0.02em"
            }}
          >
            ZKCTI: Threat Intelligence Sharing Platform
          </span>
        </div>

        <button
          onClick={handleToggleDarkMode}
          style={{
            marginLeft: 20,
            background: darkMode ? "#2d2d44" : "#fff",
            color: darkMode ? "#fff" : "#2d2d44",
            border: "1px solid #b4b4d8",
            borderRadius: 8,
            padding: "6px 15px",
            fontWeight: 600,
            cursor: "pointer"
          }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

      </header>
      {/* TOOLTIP */}
      {step <= tooltips.length && (
        <div
          className="step-tooltip glass-panel"
          style={{
            background: "rgba(255,250,230,0.78)",
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
      )}

      {/* MAIN */}
      <main
        style={{
          minHeight: mainMinHeight,
          maxHeight: mainMinHeight,
          overflowY: "auto",
          paddingBottom: 12,
          paddingTop: 12,
          boxSizing: "border-box"
        }}
      >
        <div
          className="company-panel"
          style={{
            display: "flex",
            gap: 32,
            justifyContent: "center",
            marginTop: 14
          }}
        >
          {/* COMPANY A */}
          <div className="company company-a glass-panel" style={{
            minWidth: 320,
            padding: 26,
            position: "relative",
          }}>
            {/* Animation overlay */}
            {showProofAnim && (
              <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 22,
                background: "rgba(255,255,255,0.70)",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ProofGeneratingAnimation show={showProofAnim} />
              </div>
            )}

            <ZkctiAvatarA size={56} style={{ marginBottom: 10 }} animate />
            <h2 style={{ marginBottom: 6 }}>Company A<br />(Prover)</h2>
            <ul style={{ marginBottom: 18, color: "#111", fontWeight: 600 }}>
              <span style={{ color: "#111" }}>Status:</span>{" "}
              <span
                className="status-ok"
                style={{
                  color: "#fff",
                  textShadow: "0 1px 5px #24b655, 0 0 1px #111",
                  fontWeight: 700,
                  letterSpacing: 0.2,
                }}
              >
                Available
              </span>
            </ul>
            <div style={{ minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <button
                className="w-full bg-teal-600 text-white font-semibold py-2 rounded hover:bg-teal-700 transition mb-2"
                onClick={handleRandomSample}
                disabled={loading || step > 1}
              >
                {loading && step === 1 ? "Sampling..." : "Generate Random Test Sample From EMBER Test Dataset"}
              </button>

              {loading && step === 1 && (
                <div style={{ margin: "22px 0" }}>
                  <HackerSpinnerPro showRipple={true} />
                </div>
              )}

              {step === 2 && (
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    marginTop: 10,
                    fontSize: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    textShadow: "0 2px 10px #24b655, 0 0 2px #222"
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <circle cx="13" cy="13" r="13" fill="#24b655" />
                    <path d="M8 13.5l4 4 6-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Data sample generated
                </div>
              )}

              <button
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition mb-2"
                onClick={handlePredictAndProof}
                disabled={loading || step !== 2}
              >
                {loading && step === 2 ? "Generating Proof..." : "Predict & Generate Proof"}
              </button>

              {step === 3 && (
                <>
                  <div className="proof-details" style={{ marginTop: 16 }}>
                    <div
                      className={prediction === 1 ? "glow-box" : ""}
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        margin: "6px 0",
                        color: "#24b655",
                        transition: "box-shadow 0.4s"
                      }}
                    >
                      <b>Prediction:</b> {prediction === 1 ? "Malicious" : "Benign"}
                    </div>
                  </div>
                  {/* XAI Explanation Section */}
                  <XaiCollapse xai={sample?.xai} />
                </>
              )}

              <button
                ref={sendProofBtnRef}
                className="w-full bg-gray-700 text-white font-semibold py-2 rounded hover:bg-gray-800 transition mb-2"
                onClick={handleSendProof}
                disabled={step !== 3}
              >
                Send Proof to Company B
              </button>
            </div>
          </div>

          {/* COMPANY B */}
          {/* COMPANY B */}
          <div className="company company-b glass-panel" style={{
            minWidth: 320,
            padding: 26
          }} ref={companyBPanelRef}>
            <ZkctiAvatarB size={56} style={{ marginBottom: 10 }} animate />
            <h2 style={{ marginBottom: 6 }}>Company B<br />(Verifier)</h2>

            <ul style={{ marginBottom: 18, color: "#111", fontWeight: 600 }}>
              <span style={{ color: "#111" }}>Status:</span>{" "}
              <span className="status-ok" style={{
                color: "#fff",
                textShadow: step === 5
                  ? verified
                    ? "0 1px 5px #24b655, 0 0 1px #111"
                    : "0 1px 5px #ff4444, 0 0 1px #111"
                  : "0 1px 5px #24b655, 0 0 1px #111",
                fontWeight: 700,
                letterSpacing: 0.2,
              }}>
                {step === 5
                  ? verified ? "Verified" : "Verification Failed"
                  : "Available"}
              </span>
            </ul>

            {step < 4 && (
              <div style={{
                background: 'rgba(200, 200, 255, 0.1)',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center',
                marginBottom: 20,
                border: '1px dashed rgba(100, 100, 255, 0.3)'
              }}>
                <div style={{ opacity: 0.7 }}>
                  Awaiting proof from Company A...
                </div>
              </div>
            )}

            {step === 4 && (
              <button
                className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition mb-2"
                onClick={handleVerify}
                disabled={loading}
                style={{
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {loading && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  }} />
                )}
                {loading ? "Verifying..." : "Verify Proof"}
              </button>
            )}

            {step === 5 && (
              <VerificationCard verified={verified} />
            )}
          </div>
        </div>

        <DataTunnel
          trigger={step === 4}
          refA={sendProofBtnRef}
          refB={companyBPanelRef}
        />
      </main>

      {/* Animated stepper always visible just above footer */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 82, // adjust to avoid overlapping with your footer/floating button
          transform: "translateX(-50%)",
          zIndex: 220,
          pointerEvents: "auto"
        }}
      >
        <AnimatedStepper step={stepper} verified={verified} />
      </div>

      {/* Footer always fixed at bottom */}
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
            padding: "18px 60px",
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

      {/* Quick Tour Modal */}
      {showTour && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: darkMode
              ? "rgba(60,50,100,0.6)"     // darker overlay for dark mode
              : "rgba(60,50,100,0.22)", // lighter overlay for light mode
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
                position: "absolute",
                top: 18,
                right: 24,
                fontSize: 25,
                color: "#aaa",
                border: "none",
                background: "none",
                cursor: "pointer"
              }}
              onClick={() => setShowTour(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{
              color: darkMode ? "#fff" : "#19181c",
              marginBottom: "1.5rem"
            }}>
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
      {showBenignConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(60,50,100,0.22)",
          zIndex: 1002,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 10px 40px #aaa9f966",
            padding: "2rem 2.4rem",
            minWidth: 340,
            maxWidth: 400,
            textAlign: "center",
            border: "2px solid #e0d9ff",
            position: "relative"
          }}>
            <button
              style={{
                position: "absolute", top: 12, right: 18,
                fontSize: 22, color: "#aaa", background: "none",
                border: "none", cursor: "pointer"
              }}
              onClick={handleBenignCancel}
              aria-label="Close"
            >×</button>
            <svg width={50} height={50} viewBox="0 0 60 60" style={{ margin: "0 0 14px" }}>
              <circle cx="30" cy="30" r="28" fill="#e5fbf0" />
              <path d="M19 32c5 8 17 8 22-1" stroke="#24b655" strokeWidth={3} fill="none" />
              <circle cx="24" cy="25" r="2" fill="#24b655" />
              <circle cx="36" cy="25" r="2" fill="#24b655" />
            </svg>
            <h3 style={{ color: "#1e553a", margin: "0 0 10px" }}>
              Prediction is <span style={{ color: "#24b655" }}>Benign</span>
            </h3>
            <p style={{
              color: "#555", fontSize: "1.08rem", marginBottom: 22
            }}>
              This file/sample is predicted as <b>benign</b>.<br />
              <span style={{ color: "#a381ff" }}>It's not necessary</span> to generate a ZK proof for non-malicious predictions.<br /><br />
              Would you still like to proceed with zero-knowledge proof generation?
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button
                onClick={handleBenignConfirm}
                style={{
                  background: "linear-gradient(90deg,#7554ee 70%,#24b655 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontWeight: 700,
                  fontSize: "1rem",
                  padding: "9px 25px",
                  cursor: "pointer",
                  boxShadow: "0 2px 16px #6047f733"
                }}
              >Proceed Anyway</button>
              <button
                onClick={handleBenignCancel}
                style={{
                  background: "#f6f6fa",
                  color: "#7554ee",
                  border: "1.5px solid #e7e4ff",
                  borderRadius: 9,
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "9px 18px",
                  cursor: "pointer"
                }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


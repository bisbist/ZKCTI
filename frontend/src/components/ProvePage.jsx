import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HackerSpinnerPro from "../components/HackerSpinnerPro";
import XaiCollapse from "../components/XaiCollapse";
import BenignConfirmModal from "./BenignConfirmModal";
import { getRandomSample, predict, generateProof } from "../api";
import ZkctiAvatarA from "../components/ZkctiAvatarA";
import TooltipStep from "../components/TooltipStep";
import { tooltips } from "../components/Constants";
import "../App.css";

// --- Fancy Send Proof Animation Modal ---
function SendProofAnimationModal({ show, showCheck }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed",
      zIndex: 1500,
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(90,70,170,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(7px)",
      transition: "all 0.3s"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 12px 46px #b5a7ff44",
        padding: "3.4rem 3.7rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 320,
        minHeight: 220
      }}>
        <div style={{ position: "relative", width: 130, height: 112 }}>
          {/* Plane animation: show only if !showCheck */}
          {!showCheck && (
            <>
              {/* Dotted Path */}
              <svg
                width={130}
                height={80}
                viewBox="0 0 130 80"
                style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
              >
                <path
                  id="planePath"
                  d="M20,60 Q65,10 110,60"
                  stroke="#8c7bee"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="6 8"
                  style={{
                    animation: "moveDash 1.3s linear infinite"
                  }}
                />
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#cabdff" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#cabdff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Path Glow */}
                <path
                  d="M20,60 Q65,10 110,60"
                  stroke="url(#glow)"
                  strokeWidth="15"
                  fill="none"
                  opacity="0.8"
                  filter="blur(2px)"
                />
              </svg>
              {/* Animated Plane */}
              <svg
                width={38}
                height={38}
                viewBox="0 0 40 40"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: 2,
                  offsetPath: "path('M20,60 Q65,10 110,60')",
                  offsetDistance: "0%",
                  animation: "flyPlane 1.3s linear infinite"
                }}
                className="plane-anim"
              >
                <g>
                  <polygon points="4,20 36,20 20,7" fill="#7554ee" stroke="#6248ca" strokeWidth="2" />
                  <polygon points="20,7 24,17 16,17" fill="#cabdff" />
                  <rect x="18" y="17" width="4" height="13" rx="2" fill="#24b655" />
                  <polygon points="18,30 22,30 20,35" fill="#7554ee" />
                </g>
                <filter id="planeShadow" x="0" y="0">
                  <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#cabdff" />
                </filter>
              </svg>
            </>
          )}
          {/* Checkmark appears after animation */}
          {showCheck && (
            <svg
              width={82}
              height={82}
              viewBox="0 0 82 82"
              style={{
                position: "absolute",
                left: 24,
                top: 12,
                zIndex: 3,
                animation: "popCheck 0.7s cubic-bezier(.49,1.48,.44,1.01)"
              }}
            >
              <circle cx="41" cy="41" r="38" fill="#e5fbf0" />
              <path d="M25 43 L39 56 L59 31" stroke="#24b655" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="41" cy="41" r="38" fill="none" stroke="#24b655" strokeWidth="2" opacity="0.21" />
            </svg>
          )}
        </div>
        <div style={{
          marginTop: 30,
          fontSize: "1.38rem",
          fontWeight: 700,
          color: showCheck ? "#24b655" : "#6047f7",
          letterSpacing: "0.01em",
          textShadow: "0 1px 14px #cabdff88"
        }}>
          {showCheck ? "Proof Sent!" : "Sending Proof to Company B..."}
        </div>
        {/* Inline CSS for animation */}
        <style>{`
          @keyframes moveDash {
            to {
              stroke-dashoffset: -60;
            }
          }
          @keyframes flyPlane {
            0% { offset-distance: 0%; }
            100% { offset-distance: 100%; }
          }
          @keyframes popCheck {
            0% { opacity: 0; transform: scale(0.3);}
            55% { opacity: 1; transform: scale(1.15);}
            100% { opacity: 1; transform: scale(1);}
          }
        `}</style>
      </div>
    </div>
  );
}

// --- ProvePage Core ---
const stageToStep = {
  predict: 1,
  proof: 2,
  done: 3,
};
const shouldShowStepper = (stage) =>
  stage === "predict" || stage === "proof" || stage === "done";

const mainButtonStyle = {
  background: "linear-gradient(90deg,#7b48ff 0%,#17b26a 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  fontSize: "2rem",
  padding: "13px 32px",
  cursor: "pointer",
  boxShadow: "0 2px 16px #7b48ff33",
  marginTop: 1,
  transition: "all 0.3s",
  outline: "none",
  borderBottom: "2.5px solid #6047f7",
  display: "inline-block",
  visibility: "visible !important",
  opacity: "1 !important",
  position: "relative",
  zIndex: 1,
};

export default function ProvePage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("idle");
  const [sample, setSample] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [xai, setXai] = useState(null);
  const [showXai, setShowXai] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);

  // Benign modal state
  const [showBenignModal, setShowBenignModal] = useState(false);
  const [pendingProof, setPendingProof] = useState(false);

  // Animation modal state
  const [showSendProofAnim, setShowSendProofAnim] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const getAvatarSize = () => {
    return (stage === "loading" || stage === "proving") ? 200 : 400;
  };

  const transitionButtons = [
    {
      label: "Generate Data",
      onClick: async () => {
        setStage("loading");
        const res = await getRandomSample();
        setSample(res);
        setStage("predict");
      },
      stage: "idle",
    },
    {
      label: "Predict",
      onClick: async () => {
        setStage("predicting");
        const predRes = await predict(sample.features);
        setPrediction(predRes.prediction);
        setXai(sample.xai);
        setStage("proof");
      },
      stage: "predict",
    },
    {
      label: "Generate Proof",
      onClick: async () => {
        if (prediction === 0) {
          setShowBenignModal(true);
          setPendingProof(true);
          return;
        }
        setStage("proving");
        await generateProof();
        setStage("done");
        setProofGenerated(true);
      },
      stage: "proof",
    },
  ];

  // Handler for confirming in modal
  const handleBenignConfirm = async () => {
    setShowBenignModal(false);
    setStage("proving");
    await generateProof();
    setStage("done");
    setProofGenerated(true);
    setPendingProof(false);
  };

  // Handler for cancel in modal
  const handleBenignCancel = () => {
    setShowBenignModal(false);
    setPendingProof(false);
  };

  // After proof is generated
  if (stage === "done" && proofGenerated) {
    return (
      <>
        <SendProofAnimationModal show={showSendProofAnim} showCheck={showCheck} />
        <CenterPanel avatarSize={300}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: "20px",
            marginTop: "40px"
          }}>
            <div style={{
              ...mainButtonStyle,
              background: prediction === 1
                ? "linear-gradient(90deg, #ff4848 0%, #d12e6a 100%)"
                : "linear-gradient(90deg, #17b26a 0%, #48b0ff 100%)",
              borderBottom: prediction === 1
                ? "2.5px solid #d12e6a"
                : "2.5px solid #17b26a",
              boxShadow: prediction === 1
                ? "0 2px 16px #ff484833"
                : "0 2px 16px #17b26a33",
              textAlign: "center",
              cursor: "default",
            }}>
              {prediction === 1 ? "Malicious Threat Detected" : "Predicted Result: Benign"}
            </div>

            <button
              style={{
                ...mainButtonStyle,
                marginTop: 30
              }}
              onClick={() => setShowXai(!showXai)}
            >
              {showXai ? "Hide Explanation" : "Explain Prediction (SHAP)"}
            </button>

            {showXai && xai && (
              <div style={{ margin: "0", width: "100%" }}>
                <XaiCollapse
                  xai={xai}
                  open={showXai}
                  onClose={() => setShowXai(false)}
                />
              </div>
            )}

            <button
              style={mainButtonStyle}
              onClick={() => {
                setShowSendProofAnim(true);
                setShowCheck(false);
                // 2s for plane, then 1s for check, then navigate
                setTimeout(() => {
                  setShowCheck(true);
                  setTimeout(() => {
                    setShowSendProofAnim(false);
                    setShowCheck(false);
                    navigate("/verify", {
                      state: {
                        proofData: {
                          prediction,
                          xai,
                        },
                      },
                    });
                  }, 1000);
                }, 2000);
              }}
            >
              Send Proof to Company B
            </button>
          </div>
        </CenterPanel>
        {/* <StepperBar stepper={stageToStep["done"]} /> */}
      </>
    );
  }

  // Regular process for all other steps
  return (
    <>
      <SendProofAnimationModal show={showSendProofAnim} showCheck={showCheck} />
      <CenterPanel avatarSize={getAvatarSize()}>
        {stage === "loading" || stage === "predicting" || stage === "proving" ? (
          <HackerSpinnerPro
            showRipple
            message={
              stage === "loading"
                ? "Searching for a threat sample..."
                : stage === "predicting"
                  ? "Predicting..."
                  : "Generating a zero knowledge proof..."
            }
          />
        ) : (
          transitionButtons
            .filter(button => button.stage === stage)
            .map(({ label, onClick }) => (
              <button
                key={label}
                style={mainButtonStyle}
                onClick={onClick}
                className="magic-btn"
              >
                {label}
              </button>
            ))
        )}
        {stage === "loading" && (
          <div style={{ marginTop: 28, color: "#222" }}>Generating data sample...</div>
        )}
        {stage === "predicting" && (
          <div style={{ marginTop: 28, color: "#222" }}>Predicting...</div>
        )}
        {stage === "proving" && (
          <div style={{ marginTop: 28, color: "#222" }}>Generating proof...</div>
        )}
        <BenignConfirmModal
          show={showBenignModal}
          onConfirm={handleBenignConfirm}
          onCancel={handleBenignCancel}
        />
      </CenterPanel>
      {/* {shouldShowStepper(stage) && <StepperBar stepper={stageToStep[stage]} />} */}
    </>
  );
}

function CenterPanel({ children, avatarSize = 300 }) {
  // Calculate dynamic positioning based on avatar size
  const avatarStyles = {
    small: {
      marginBottom: "-30px",
      transform: "translateY(-20px)",
      marginTop: "0px"
    },
    large: {
      marginBottom: "-80px",
      transform: "translateY(-40px)",
      marginTop: "20px"
    }
  };

  const currentAvatarStyle = avatarSize === 100 ? avatarStyles.small : avatarStyles.large;

  return (
    <div style={{
      minHeight: "calc(100vh - 250px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      background: "#fff",
      border: "1px solid #ede9ff",
      paddingTop: "20px",
    }}>
      <div style={{
        ...currentAvatarStyle,
        zIndex: 10,
        transition: "all 0.3s ease-out"
      }}>
        <ZkctiAvatarA size={avatarSize} />
      </div>
      <div style={{
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 8px 40px #b5a2ff33",
        padding: "50px 42px",
        minWidth: 330,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#222",
        maxWidth: "90%",
        width: "100%",
        marginTop: avatarSize === 100 ? "20px" : "60px",
        transition: "margin-top 0.3s ease-out"
      }}>
        {children}
      </div>
    </div>
  );
}

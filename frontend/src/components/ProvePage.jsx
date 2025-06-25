import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HackerSpinnerPro from "../components/HackerSpinnerPro";
import { getRandomSample, predict, generateProof } from "../api";
import "../App.css";

const mainButtonStyle = {
  background: "#7554ee",
  backgroundImage: "linear-gradient(90deg,#7554ee 70%,#24b655 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: "1.14rem",
  padding: "13px 32px",
  cursor: "pointer",
  boxShadow: "0 2px 16px #0008",
  marginTop: 12,
  zIndex: 10,
  transition: "all 0.3s ease",
};

export default function ProvePage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("idle");
  const [sample, setSample] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [xai, setXai] = useState(null);

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
        setStage("proving");
        await generateProof();
        setStage("done");
        setTimeout(() => {
          navigate("/", {
            replace: true,
            state: {
              proveResult: {
                prediction,
                proofStatus: "Proof Created",
                xai,
              },
            },
          });
        }, 1000);
      },
      stage: "proof",
    },
  ];

  return (
    <CenterPanel>
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
    </CenterPanel>
  );
}

function CenterPanel({ children }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 250px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: 22,
          boxShadow: "0 8px 40px #b5a2ff33",
          padding: "50px 42px",
          minWidth: 330,
          minHeight: 230,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

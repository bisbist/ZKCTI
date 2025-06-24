import React from "react";
import { useNavigate } from "react-router-dom";
import { useProof } from "../context/ProofContext";
import ProofGeneratingAnimation from "./ProofGeneratingAnimation";

export default function ProvePage() {
  const { generateProofWithPrediction } = useProof();
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await generateProofWithPrediction();
        setTimeout(() => mounted && navigate("/"), 1000);
      } catch (err) {
        setError("Error generating proof");
        setTimeout(() => mounted && navigate("/"), 1500);
      }
    })();
    return () => { mounted = false; };
  }, [generateProofWithPrediction, navigate]);

  return (
    <div className="zkcti-app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ProofGeneratingAnimation show />
      <h2 style={{ marginTop: 40, color: "#6047f7", fontWeight: 700 }}>
        {error ? error : "Generating prediction & zero-knowledge proof..."}
      </h2>
    </div>
  );
}

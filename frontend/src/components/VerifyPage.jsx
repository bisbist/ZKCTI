import React from "react";
import { useNavigate } from "react-router-dom";
import { useProof } from "../context/ProofContext";
import ProofGeneratingAnimation from "./ProofGeneratingAnimation";

export default function VerifyPage() {
  const { verifyProof } = useProof();
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await verifyProof(); // Should update 'verified' in context
        setTimeout(() => mounted && navigate("/"), 1200); // Give time for UX
      } catch (err) {
        setError("Error verifying proof");
        setTimeout(() => mounted && navigate("/"), 1600);
      }
    })();
    return () => { mounted = false; };
  }, [verifyProof, navigate]);

  return (
    <div className="zkcti-app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ProofGeneratingAnimation show />
      <h2 style={{ marginTop: 40, color: "#24b655", fontWeight: 700 }}>
        {error ? error : "Verifying zero-knowledge proof..."}
      </h2>
    </div>
  );
}

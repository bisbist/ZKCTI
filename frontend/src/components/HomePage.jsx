import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompanyAPanel from "../components/CompanyAPanel";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Only use state if returned from /prove
  const result = location.state?.proveResult || null;  

  return (
    <div style={{
      minHeight: "calc(100vh - 250px)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <CompanyAPanel
        predictionResult={result?.prediction}
        proofStatus={result?.proofStatus}
        xai={result?.xai}
        showExplain={!!result}
        onStart={() => navigate("/prove")}
      />
    </div>
  );
}

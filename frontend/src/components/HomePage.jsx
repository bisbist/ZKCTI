import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompanyAPanel from "../components/CompanyAPanel";
import ZkctiAvatarA from "../components/ZkctiAvatarA";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Only use state if returned from /prove
  const result = location.state?.proveResult || null;

  return (
    <div style={{
      minHeight: "calc(100vh - 450px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "0px",
    }}>
      <div style={{ marginBottom: "-30px",
        transform: "translateY(-60px)",
       }}>
        <ZkctiAvatarA size={300} />
      </div>

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

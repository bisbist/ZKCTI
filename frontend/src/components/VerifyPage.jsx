import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompanyPanelB from "./CompanyPanelB"; // Your B Panel
import ZkctiAvatarB from "./ZkctiAvatarB"; // Your B Avatar

export default function VerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Proof info (optional)
  const proofData = location.state?.proofData || null;

  return (
    <div style={{
      minHeight: "calc(100vh - 450px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "0px",
    }}>
      <div style={{
        marginBottom: "-30px",
        transform: "translateY(-60px)",
      }}>
        <ZkctiAvatarB size={300} />
      </div>

      <CompanyPanelB
        proofData={proofData}
        onBack={() => navigate("/")}
      />
    </div>
  );
}

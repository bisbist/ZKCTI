import ZkctiAvatarA from "./ZkctiAvatarA";
import XaiCollapse from "./XaiCollapse";
import HackerSpinnerPro from "./HackerSpinnerPro";
import ProofGeneratingAnimation from "./ProofGeneratingAnimation";

export default function CompanyPanelA({
  loading, step, handleRandomSample, handlePredictAndProof,
  prediction, sample, showProofAnim, showBenignConfirm, handleSendProof,
  sendProofBtnRef
}) {
  // Determine minHeight based on state
  let minHeight = 260; // Just the button
  if (loading && step === 1) minHeight = 370; // Add space for spinner
  if (prediction !== null) minHeight = 450;   // Results section, XAI, etc.

  return (
    <div
      className="company company-a glass-panel"
      style={{
        minWidth: 320,
        minHeight,
        padding: 26,
        position: "relative",
        transition: "min-height 0.35s cubic-bezier(.5,1.7,.5,1)", // Smooth grow/shrink
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
      }}
    >
      {showProofAnim && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 22,
          background: "rgba(255,255,255,0.70)", borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ProofGeneratingAnimation show={showProofAnim} />
        </div>
      )}
      <ZkctiAvatarA size={56} style={{ marginBottom: 10 }} animate />
      <h2 style={{ marginBottom: 6 }}>Company A<br />(Prover)</h2>
      <ul style={{ marginBottom: 18, color: "#111", fontWeight: 600 }}>
        <span style={{ color: "#111" }}>Status:</span>
        <span className="status-ok"
          style={{
            color: "#fff", textShadow: "0 1px 5px #24b655, 0 0 1px #111",
            fontWeight: 700, letterSpacing: 0.2
          }}>
          {prediction !== null ? "Analysis Complete" : 
           step === 2 ? "Sample Ready" : "Available"}
        </span>
      </ul>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        {/* Only show these buttons if we don't have a prediction yet */}
        {prediction === null ? (
          <>
            <button className="w-full bg-teal-600 text-white font-semibold py-2 rounded hover:bg-teal-700 transition mb-2"
              onClick={handleRandomSample}
              disabled={loading || step > 1}>
              {loading && step === 1 ? "Sampling..." : "Generate Random Test Sample From EMBER Test Dataset"}
            </button>
            {loading && step === 1 && (
              <div style={{ margin: "22px 0" }}>
                <HackerSpinnerPro showRipple={true} />
              </div>
            )}
            {step === 2 && (
              <div style={{
                color: "#fff", fontWeight: 700, marginTop: 10, fontSize: "1.25rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                textShadow: "0 2px 10px #24b655, 0 0 2px #222"
              }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="13" fill="#24b655" />
                  <path d="M8 13.5l4 4 6-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Data sample generated
              </div>
            )}
            {step === 2 && (
              <button className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition mb-2"
                onClick={handlePredictAndProof}
                disabled={loading}>
                {loading ? "Generating Proof..." : "Predict & Generate Proof"}
              </button>
            )}
          </>
        ) : (
          <>
            {/* Show results section when we have a prediction */}
            <div className="proof-details" style={{ marginTop: 16 }}>
              <div className={prediction === 1 ? "glow-box" : ""}
                style={{
                  fontSize: "1.2rem", fontWeight: 600, margin: "6px 0",
                  color: "#24b655", transition: "box-shadow 0.4s"
                }}>
                <b>Prediction:</b> {prediction === 1 ? "Malicious" : "Benign"}
              </div>
            </div>
            <XaiCollapse xai={sample?.xai} />
            <button
              ref={sendProofBtnRef}
              className="w-full bg-gray-700 text-white font-semibold py-2 rounded hover:bg-gray-800 transition mb-2"
              onClick={handleSendProof}
              disabled={step !== 3}>
              Send Proof to Company B
            </button>
          </>
        )}
      </div>
    </div>
  );
}

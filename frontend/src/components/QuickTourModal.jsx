export default function QuickTourModal({ show, onClose, darkMode }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: darkMode ? "rgba(60,50,100,0.6)" : "rgba(60,50,100,0.22)",
      backdropFilter: "blur(4px)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}
      onClick={onClose}
    >
      <div className="glass-panel"
        style={{
          background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)",
          border: "1.5px solid #e9e2ff", boxShadow: "0 10px 40px #aaa9f944, 0 2px 6px #dbd8f544",
          padding: "2.4rem 2.7rem", borderRadius: "22px", minWidth: 390, maxWidth: 520, textAlign: "center", position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute", top: 18, right: 24, fontSize: 25,
            color: "#aaa", border: "none", background: "none", cursor: "pointer"
          }}
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <h2 style={{
          color: darkMode ? "#fff" : "#19181c", marginBottom: "1.5rem"
        }}>How ZKCTI Works</h2>
        <ol style={{
          textAlign: "left", margin: "0 auto", maxWidth: 400, fontSize: "1.11rem", lineHeight: 1.7
        }}>
          <li><b>Generate Sample:</b> Click to create a random test sample.</li>
          <li><b>Predict & Generate Proof:</b> The model predicts threat status and creates a zero-knowledge proof of the result.</li>
          <li><b>Send Proof:</b> Company A sends the proof to Company B (verifier).</li>
          <li><b>Verify Proof:</b> Company B checks the proof and the process is complete.</li>
        </ol>
        <div style={{
          marginTop: 20, color: "#19181c", fontWeight: 700, maxWidth: 400,
          fontSize: "1.07rem", letterSpacing: "0.01em",
          background: "rgba(240,240,240,0.95)", borderRadius: 7, padding: "7px 15px", display: "inline-block"
        }}>
          🔒 NOTE: No sensitive data is shared—only cryptographic proofs.
        </div>
      </div>
    </div>
  );
}
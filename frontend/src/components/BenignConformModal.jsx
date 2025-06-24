export default function BenignConfirmModal({ show, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(60,50,100,0.22)", zIndex: 1002,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, boxShadow: "0 10px 40px #aaa9f966",
        padding: "2rem 2.4rem", minWidth: 340, maxWidth: 400, textAlign: "center",
        border: "2px solid #e0d9ff", position: "relative"
      }}>
        <button
          style={{
            position: "absolute", top: 12, right: 18,
            fontSize: 22, color: "#aaa", background: "none", border: "none", cursor: "pointer"
          }}
          onClick={onCancel}
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
            onClick={onConfirm}
            style={{
              background: "linear-gradient(90deg,#7554ee 70%,#24b655 100%)",
              color: "#fff", border: "none", borderRadius: 9, fontWeight: 700,
              fontSize: "1rem", padding: "9px 25px", cursor: "pointer", boxShadow: "0 2px 16px #6047f733"
            }}
          >Proceed Anyway</button>
          <button
            onClick={onCancel}
            style={{
              background: "#f6f6fa", color: "#7554ee", border: "1.5px solid #e7e4ff",
              borderRadius: 9, fontWeight: 600, fontSize: "1rem", padding: "9px 18px", cursor: "pointer"
            }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

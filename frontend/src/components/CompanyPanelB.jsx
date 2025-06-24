import ZkctiAvatarB from "./ZkctiAvatarB";
import { VerificationCard } from "./VerificationCard";

export default function CompanyPanelB({
  step, verified, handleVerify, loading, companyBPanelRef
}) {
  return (
    <div className="company company-b glass-panel" style={{
      minWidth: 320, padding: 26
    }} ref={companyBPanelRef}>
      <ZkctiAvatarB size={56} style={{ marginBottom: 10 }} animate />
      <h2 style={{ marginBottom: 6 }}>Company B<br />(Verifier)</h2>
      <ul style={{ marginBottom: 18, color: "#111", fontWeight: 600 }}>
        <span style={{ color: "#111" }}>Status:</span>
        <span className="status-ok" style={{
          color: "#fff",
          textShadow: step === 5
            ? verified
              ? "0 1px 5px #24b655, 0 0 1px #111"
              : "0 1px 5px #ff4444, 0 0 1px #111"
            : "0 1px 5px #24b655, 0 0 1px #111",
          fontWeight: 700, letterSpacing: 0.2,
        }}>
          {step === 5
            ? verified ? "Verified" : "Verification Failed"
            : "Available"}
        </span>
      </ul>
      {step < 4 && (
        <div style={{
          background: 'rgba(200, 200, 255, 0.1)', borderRadius: 12,
          padding: 20, textAlign: 'center', marginBottom: 20,
          border: '1px dashed rgba(100, 100, 255, 0.3)'
        }}>
          <div style={{ opacity: 0.7 }}>
            Awaiting proof from Company A...
          </div>
        </div>
      )}
      {step === 4 && (
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition mb-2"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Proof"}
        </button>
      )}
      {step === 5 && (
        <VerificationCard verified={verified} />
      )}
    </div>
  );
}

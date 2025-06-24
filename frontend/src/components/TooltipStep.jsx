export default function TooltipStep({ step, tooltips }) {
  if (step > tooltips.length) return null;
  return (
    <div className="step-tooltip glass-panel"
      style={{
        background: "rgba(255,250,230,0.78)",
        borderLeft: "4px solid #f6b73c", borderRadius: 12,
        padding: "10px 18px", margin: "18px auto 12px auto", maxWidth: 480,
        fontSize: "1.07rem", fontWeight: 500, color: "#514500",
        boxShadow: "0 2px 14px #ebd97e33", transition: "all 0.3s"
      }}>
      💡 {tooltips[step - 1]}
    </div>
  );
}

import React from "react";

function AnimatedStepper({ step, verified = null }) {
  const steps = [
    "Sample Generated",
    "Proof Generated",
    "Proof Sent",
    "Proof Verified"
  ];

  // Don't show ticks for steps that aren't reached
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "34px 0 14px" }}>
      {steps.map((label, idx) => {
        // step=0 means idle, so no current, no completed
        const current = step === idx + 1;
        const completed = step > idx + 1;
        const failed = idx + 1 === steps.length && step === steps.length && verified === false;
        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    failed
                      ? "#ff4444"
                      : current
                        ? "linear-gradient(135deg,#7554ee 60%,#24b655 100%)"
                        : completed
                          ? "#24b655"
                          : "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 22,
                  border:
                    current
                      ? "4px solid #cabdff"
                      : failed
                        ? "3px solid #ff4444"
                        : "2px solid #ddd",
                  transition: "all 0.22s cubic-bezier(.56,1.36,.56,1)"
                }}
              >
                {idx + 1 === steps.length && step === steps.length
                  ? (verified === false
                    ? <span style={{ fontSize: 32, color: "#fff" }}>✗</span>
                    : (verified === true
                      ? <span style={{ fontSize: 32, color: "#fff" }}>✓</span>
                      : idx + 1
                    )
                  )
                  : (completed
                    ? <span style={{ fontSize: 26, color: "#fff" }}>✓</span>
                    : idx + 1
                  )
                }
              </div>
              <span
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  color: current ? "#6047F7" : failed ? "#ff4444" : "#555",
                  fontWeight: current ? 700 : 500,
                  minWidth: 90,
                  textAlign: "center"
                }}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  width: 58,
                  height: 7,
                  background:
                    completed
                      ? "linear-gradient(90deg,#24b655 40%,#7554ee 90%)"
                      : "#eee",
                  borderRadius: 9,
                  margin: "0 3px",
                  transition: "background 0.19s"
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}


export default AnimatedStepper;
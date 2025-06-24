import React from "react";

function AnimatedStepper({ step, verified = null, debug = false }) {
  const steps = [
    "Sample Generated",
    "Proof Generated",
    "Proof Sent",
    "Proof Verified"
  ];

  if (debug) {
    console.log("AnimatedStepper rendering. Step prop value:", step);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "34px 0 14px",
        border: debug ? "2px dashed red" : undefined,
        position: "relative",
        zIndex: 20,
        background: "none",
        boxShadow: "none",
        width: "auto"
      }}
    >
      {steps.map((label, idx) => {
        // Determine status of this step
        const current = idx + 1 === step;
        const completed = idx + 1 < step || (idx + 1 === step && idx + 1 === steps.length && verified === true);
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
                  boxShadow:
                    current && !failed ? "0 0 12px #b5a2ff88" : failed ? "0 0 18px #ff4444bb" : undefined,
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
                {/* Change content for last step */}
                {idx + 1 === steps.length && step === steps.length
                  ? (verified === false
                    ? <span style={{ fontSize: 32, color: "#fff" }}>✗</span> // Red cross
                    : (verified === true
                      ? <span style={{ fontSize: 32, color: "#fff" }}>✓</span> // Green tick
                      : idx + 1 // show step number if not yet done
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
                    idx + 1 < step
                      ? "linear-gradient(90deg,#24b655 40%,#7554ee 90%)"
                      : "#eee",
                  borderRadius: 9,
                  margin: "0 3px",
                  transition: "background 0.19s"
                }}
                className={idx + 2 === step ? "stepper-bar-animate" : ""}
              />
            )}
          </React.Fragment>
        );
      })}
      <style>{`
        .stepper-bar-animate {
          animation: progwiggle 1.25s infinite alternate;
        }
        @keyframes progwiggle {
          0% { box-shadow: 0 0 0 0 #7554ee44; }
          70% { box-shadow: 0 0 10px 5px #7554ee55; }
          100% { box-shadow: 0 0 0 0 #7554ee44; }
        }
      `}</style>
    </div>
  );
}

export default AnimatedStepper;
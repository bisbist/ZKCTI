// --- Constants for Layout ---
export const HEADER_HEIGHT = 110;
export const STEPPER_HEIGHT = 50;
export const FOOTER_HEIGHT = 70;

// --- Glassmorphism CSS class ---
export const glassCSS = `
  .glass-panel {
    background: rgba(255,255,255,0.19);
    border: 1.6px solid rgba(100,100,255,0.13);
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: 20px;
    transition: background 0.3s, box-shadow 0.2s;
  }
`;

export const tooltips = [
  "Step 1: Click to generate a random test sample.",
  "Step 2: Click 'Predict & Generate Proof' to run the model.",
  "Step 3: Send proof to Company B.",
  "Step 4: Company B verifies the proof.",
  "Step 5: Trust is established if the proof is valid.",
  "All done! Trust established."
];

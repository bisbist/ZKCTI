import AnimatedStepper from "./AnimatedStepper";
export default function StepperBar({ stepper, verified }) {
  return (
    <div style={{
      position: "fixed", left: "50%", bottom: 82,
      transform: "translateX(-50%)", zIndex: 220,
      pointerEvents: "auto"
    }}>
      <AnimatedStepper step={stepper} verified={verified} />
    </div>
  );
}

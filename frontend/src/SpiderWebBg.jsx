// frontend/src/SpiderWebBg.jsx
import Particles from "react-tsparticles";

export default function SpiderWebBg() {
  return (
    <Particles
      id="spiderweb-bg"
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: "#f8fafd" },
        particles: {
          number: { value: 70 },
          color: { value: "#8b7ffd" },
          links: {
            enable: true,
            color: "#6047F7",
            opacity: 0.24,
            width: 1.1,
            distance: 135,
          },
          move: { enable: true, speed: 0.9 },
          size: { value: 1.7 },
          opacity: { value: 0.43 }
        },
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" }
          },
          modes: {
            push: { quantity: 6 },
            repulse: { distance: 85, duration: 0.55 }
          }
        }
      }}
    />
  );
}

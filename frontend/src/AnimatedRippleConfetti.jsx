// frontend/src/AnimatedRippleConfetti.jsx
import React, { useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

export default function AnimatedRippleConfetti() {
  const ref = useRef();
  const handleBgClick = (e) => {
    if (ref.current) {
      // Get click position as normalized coordinates
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      ref.current({
        particleCount: 55,
        spread: 90,
        startVelocity: 38,
        origin: { x, y }
      });
    }
    // Add CSS ripple (see below)
    createCssRipple(e.clientX, e.clientY);
  };

  // Add a CSS ripple where user clicks (bonus effect)
  function createCssRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.className = "css-ripple";
    ripple.style.left = `${x - 120}px`;
    ripple.style.top = `${y - 120}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 900);
  }

  return (
    <>
      <div
        onClick={handleBgClick}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw", height: "100vh",
          zIndex: 1,
          pointerEvents: "auto",
          background: "transparent"
        }}
      />
      <ReactCanvasConfetti
        refConfetti={ref}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100vw", height: "100vh", top: 0, left: 0,
          zIndex: 2,
        }}
      />
    </>
  );
}

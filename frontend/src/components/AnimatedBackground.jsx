function AnimatedBackground() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      background: "linear-gradient(120deg, #6047f7 0%, #24b655 70%, #ffd65b 100%)",
      animation: "moveBg 18s ease-in-out infinite alternate",
      backgroundSize: "220% 220%",
    }}>
      <style>{`
        @keyframes moveBg {
          0% { background-position: 0% 80%; }
          50% { background-position: 100% 20%; }
          100% { background-position: 0% 80%; }
        }
      `}</style>
    </div>
  );
}

export default AnimatedBackground;
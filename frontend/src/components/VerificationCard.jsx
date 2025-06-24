const VerificationSuccessAnimation = () => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0'
  }}>
    {/* Animated checkmark */}
    <svg width="80" height="80" viewBox="0 0 80 80" style={{
      animation: 'checkmarkPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }}>
      <circle cx="40" cy="40" r="38" fill="#4BB543" />
      <path
        d="M25 40 L35 50 L55 30"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    {/* Floating particles */}
    {[...Array(12)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#4BB543',
        opacity: 0.7,
        animation: `floatParticles 2s ease-in-out ${i * 0.1}s infinite`,
        top: '50%',
        left: '50%',
        transform: `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px)`
      }} />
    ))}

    <h3 style={{
      marginTop: 20,
      color: '#ffffff',
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center'
    }}>
      Proof Verified Successfully!
    </h3>

    <style jsx>{`
      @keyframes checkmarkPop {
        0% { transform: scale(0); opacity: 0; }
        80% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes floatParticles {
        0% { transform: translate(0, 0); opacity: 0; }
        50% { opacity: 0.7; }
        100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
      }
    `}</style>
  </div>
);

const VerificationFailedAnimation = () => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0'
  }}>
    {/* Animated X mark */}
    <svg width="80" height="80" viewBox="0 0 80 80" style={{
      animation: 'xMarkShake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)'
    }}>
      <circle cx="40" cy="40" r="38" fill="#ff4444" />
      <path
        d="M30 30 L50 50 M50 30 L30 50"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>

    {/* Shatter effect */}
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: 6,
        height: 6,
        background: '#ff4444',
        opacity: 0,
        animation: `shatter 1s ease-out ${i * 0.1}s forwards`,
        top: '50%',
        left: '50%',
        transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg)`
      }} />
    ))}

    <h3 style={{
      marginTop: 20,
      color: '#ff4444',
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center'
    }}>
      Proof Verification Failed!
    </h3>

    <style jsx>{`
      @keyframes xMarkShake {
        0%, 100% { transform: rotate(0deg); }
        10%, 30%, 50%, 70%, 90% { transform: rotate(-3deg); }
        20%, 40%, 60%, 80% { transform: rotate(3deg); }
      }
      
      @keyframes shatter {
        0% { opacity: 0; transform: translate(0, 0) scale(0); }
        50% { opacity: 1; transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1); }
        100% { opacity: 0; transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); }
      }
    `}</style>
  </div>
);

export const VerificationCard = ({ verified }) => (
  <div className="glass-panel" style={{
    padding: '25px',
    borderRadius: '20px',
    margin: '20px 0',
    background: verified
      ? 'linear-gradient(135deg, rgba(75, 181, 67, 0.15) 0%, rgba(75, 181, 67, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(255, 68, 68, 0.1) 0%, rgba(255, 68, 68, 0.03) 100%)',
    border: `2px solid ${verified ? '#4BB543' : '#ff4444'}`,
    boxShadow: verified
      ? '0 0 20px rgba(75, 181, 67, 0.3)'
      : '0 0 20px rgba(255, 68, 68, 0.3)',
    transition: 'all 0.5s ease',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Animated background elements */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: verified
        ? 'radial-gradient(circle, rgba(75, 181, 67, 0.15) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(255, 68, 68, 0.15) 0%, transparent 70%)',
      animation: 'pulse 4s infinite alternate'
    }} />

    {verified ? <VerificationSuccessAnimation /> : <VerificationFailedAnimation />}

    <div style={{
      textAlign: 'center',
      marginTop: '15px',
      color: verified
        ? '#ffffff'  // White text for success
        : '#ff2a2a', // Bright red text for failure
      fontSize: '1.1rem',
      fontWeight: 500,
      textShadow: verified
        ? '0 1px 3px rgba(0,0,0,0.3)'
        : '0 1px 2px rgba(255,255,255,0.3)',
      padding: '10px 15px',
      background: verified
        ? 'rgba(0,0,0,0.15)'
        : 'rgba(255,255,255,0.7)',
      borderRadius: '8px',
      display: 'inline-block'
    }}>
      {verified
        ? 'The proof was successfully verified. Trust established!'
        : 'The proof could not be verified.'}
    </div>

    {/* Additional visual feedback */}
    {!verified && (
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: 'rgba(255, 220, 220, 0.3)',
        borderRadius: '8px',
        border: '1px dashed rgba(255, 100, 100, 0.5)'
      }}>
        <div style={{
          color: '#cc0000',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          Tip: Check your proof parameters and model constraints
        </div>
      </div>
    )}

    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 0.3; transform: scale(0.98); }
        100% { opacity: 0.7; transform: scale(1.02); }
      }
    `}</style>
  </div>
);

function ZkctiAvatarA({ size = 56, style = {}, animate = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style} fill="none">
      {/* Glow */}
      <ellipse cx="32" cy="56" rx="22" ry="6" fill="#b3aaff" opacity="0.18" />
      {/* Animated halo */}
      <ellipse
        cx="32" cy="22" rx="18" ry="8"
        fill="#6047f7"
        opacity="0.19"
        style={{
          transformOrigin: "32px 22px",
          animation: animate ? "haloA 2.1s linear infinite" : undefined,
        }}
      />
      {/* Hair */}
      <path
        d="M19 25 Q26 10 44 18 Q48 19 45 27 Q40 12 28 18 Q24 20 19 25 Z"
        fill="#2b2d48"
      />
      {/* Face - lighter skin */}
      <ellipse
        cx="32" cy="29.5" rx="13.2" ry="13"
        fill="#f7e7da"   // pale skin tone
        stroke="#6047f7" strokeWidth="2.1"
      />
      {/* Blush (cheeks) */}
      <ellipse cx="25.5" cy="33" rx="2.1" ry="1.1" fill="#ffb6ad" opacity="0.35" />
      <ellipse cx="38.5" cy="33" rx="2.1" ry="1.1" fill="#ffb6ad" opacity="0.35" />
      {/* Glasses / Visor */}
      <rect x="22" y="25" width="20" height="6" rx="3.2"
        fill="#6bd4ff"
        stroke="#443b7b"
        strokeWidth="1.2"
        opacity="0.92"
      />
      <rect x="22" y="25" width="20" height="6" rx="3.2"
        fill="url(#visorGradA)"
        opacity="0.35"
      />
      <defs>
        <linearGradient id="visorGradA" x1="22" y1="25" x2="42" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6bd4ff" />
          <stop offset="1" stopColor="#3e7fc1" />
        </linearGradient>
      </defs>
      {/* Eyes under glasses */}
      <ellipse cx="27.5" cy="30.5" rx="1.3" ry="1.7" fill="#222" />
      <ellipse cx="36.5" cy="30.5" rx="1.3" ry="1.7" fill="#222" />
      {/* Smile */}
      <path d="M27 36 Q32 39 37 36" stroke="#8c7fef" strokeWidth="2" fill="none" />
      {/* Cyber Jacket - brighten color */}
      <path
        d="M20 47 Q32 63 44 47 Q51 52 51 58 Q32 62 13 58 Q13 52 20 47 Z"
        fill="#5060e2"
        stroke="#6047f7"
        strokeWidth="1"
      />
      {/* Jacket Lapels */}
      <path d="M32 47 Q34 55 40 55 Q38 52 44 47" fill="#a9baff" opacity="0.23" />
      <path d="M32 47 Q30 55 24 55 Q26 52 20 47" fill="#a9baff" opacity="0.23" />
      {/* Cyber earring */}
      <circle cx="18.8" cy="36.5" r="1.2" fill="#36ecff" stroke="#111" strokeWidth="0.32" />
      <style>
        {`
          @keyframes haloA {
            0% { transform: rotate(0deg) scaleX(1);}
            60% { transform: rotate(10deg) scaleX(1.09);}
            100% { transform: rotate(0deg) scaleX(1);}
          }
        `}
      </style>
    </svg>
  );
}

export default ZkctiAvatarA;
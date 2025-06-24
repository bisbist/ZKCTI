function ZkctiAvatarB({ size = 56, style = {}, animate = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style} fill="none">
      {/* Glow */}
      <ellipse cx="32" cy="56" rx="22" ry="6" fill="#c3fad7" opacity="0.18" />
      {/* Animated ring */}
      <circle
        cx="32" cy="22" r="12"
        fill="#24b655"
        opacity="0.14"
        style={{
          transformOrigin: "32px 22px",
          animation: animate ? "haloB 2.4s linear infinite" : undefined,
        }}
      />
      {/* Spiky Hair */}
      <path
        d="M19 22 Q23 9 32 14 Q40 7 45 22 Q41 18 39 22 Q36 16 32 22 Q28 18 25 22 Q21 19 19 22 Z"
        fill="#f6d287"
        stroke="#388946"
        strokeWidth="0.7"
      />
      {/* Face */}
      <ellipse cx="32" cy="29.5" rx="13.1" ry="13" fill="#f9ecd9" stroke="#24b655" strokeWidth="2.1" />
      {/* Eyes */}
      <ellipse cx="27.5" cy="31" rx="1.5" ry="1.8" fill="#373e36" />
      <ellipse cx="36.5" cy="31" rx="1.5" ry="1.8" fill="#373e36" />
      {/* Smile */}
      <path d="M27.5 36 Q32 40 36.5 36" stroke="#2bc274" strokeWidth="2" fill="none" />
      {/* Cyber earpiece */}
      <rect x="44.7" y="31" width="2.7" height="6.3" rx="1.3"
        fill="#43e65a"
        stroke="#222"
        strokeWidth="0.19"
        opacity="0.66"
      />
      <circle cx="46" cy="37.5" r="1.3" fill="#4fffa0" opacity="0.67" />
      {/* Suit */}
      <path
        d="M20 47 Q32 62 44 47 Q52 51 51 59 Q32 62 13 59 Q13 51 20 47 Z"
        fill="#24b655"
        stroke="#21713e"
        strokeWidth="1.2"
        opacity="0.98"
      />
      {/* Lapels */}
      <path d="M32 47 Q34 56 41 56 Q38 52 44 47" fill="#89e6bb" opacity="0.15" />
      <path d="M32 47 Q30 56 23 56 Q26 52 20 47" fill="#89e6bb" opacity="0.15" />
      {/* Lock badge */}
      <g>
        <rect x="28.3" y="52.7" width="7.2" height="8.3" rx="3.2"
          fill="#fff" stroke="#2bc274" strokeWidth="0.7" opacity="0.95"
        />
        <rect x="30.6" y="54.8" width="2.6" height="4" rx="1" fill="#24b655" opacity="0.67" />
        <circle cx="31.9" cy="56.5" r="0.65" fill="#21713e" />
      </g>
      {/* Glasses */}
      <rect x="24" y="27" width="16" height="4" rx="2"
        fill="#7cf0bb" opacity="0.13"
      />
      <style>
        {`
          @keyframes haloB {
            0% { transform: scaleY(1);}
            50% { transform: scaleY(1.12);}
            100% { transform: scaleY(1);}
          }
        `}
      </style>
    </svg>
  );
}

export default ZkctiAvatarB;
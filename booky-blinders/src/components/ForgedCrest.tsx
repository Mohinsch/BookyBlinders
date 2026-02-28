export default function ForgedCrest() {
  return (
    <svg
      viewBox="0 0 400 520"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      <defs>
        <linearGradient id="ironGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="30%" stopColor="#2d2d2d" />
          <stop offset="70%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#1f1f1f" />
        </linearGradient>
        <linearGradient id="steelEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b6b6b" />
          <stop offset="50%" stopColor="#3d3d3d" />
          <stop offset="100%" stopColor="#5a5a5a" />
        </linearGradient>
        <linearGradient id="crestCopper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4955a" />
          <stop offset="40%" stopColor="#b87333" />
          <stop offset="100%" stopColor="#8b5e2f" />
        </linearGradient>
        <filter id="forgeGlow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feFlood floodColor="#b87333" floodOpacity="0.15" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="roughIron">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            result="noise"
          />
          <feComposite in="SourceGraphic" in2="noise" operator="in" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      {/* Crossed elements behind the shield */}
      <g transform="translate(200, 235)" opacity="0.4">
        {/* Quill (left) */}
        <g transform="rotate(-35)">
          <line
            x1="0"
            y1="-140"
            x2="0"
            y2="140"
            stroke="#7a6840"
            strokeWidth="2.5"
          />
          {/* Feather barbs */}
          <path
            d="M0,-140 C-15,-120 -20,-100 -8,-90 L0,-85 L8,-90 C20,-100 15,-120 0,-140Z"
            fill="#7a6840"
            opacity="0.6"
          />
          <path
            d="M0,-130 C-12,-115 -16,-100 -6,-92"
            stroke="#9a8860"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M0,-130 C12,-115 16,-100 6,-92"
            stroke="#9a8860"
            strokeWidth="0.5"
            fill="none"
          />
          {/* Nib */}
          <path d="M-2,135 L0,150 L2,135Z" fill="#7a6840" />
        </g>

        {/* Flat cap / razor (right) */}
        <g transform="rotate(35)">
          <line
            x1="0"
            y1="-140"
            x2="0"
            y2="140"
            stroke="#7a6840"
            strokeWidth="2.5"
          />
          {/* Razor blade shape at top */}
          <rect
            x="-14"
            y="-135"
            width="28"
            height="50"
            rx="2"
            fill="none"
            stroke="#7a6840"
            strokeWidth="1.5"
          />
          <line
            x1="-14"
            y1="-110"
            x2="14"
            y2="-110"
            stroke="#7a6840"
            strokeWidth="1"
          />
          <circle cx="0" cy="-120" r="3" fill="none" stroke="#7a6840" strokeWidth="1" />
          {/* Flat cap silhouette at bottom */}
          <ellipse
            cx="0"
            cy="125"
            rx="18"
            ry="8"
            fill="#7a6840"
            opacity="0.5"
          />
          <path
            d="M-18,125 C-18,115 -10,108 0,108 C10,108 18,115 18,125"
            fill="#7a6840"
            opacity="0.4"
          />
          <path
            d="M-22,125 L-18,125 M18,125 L22,125"
            stroke="#7a6840"
            strokeWidth="1.5"
          />
        </g>
      </g>

      {/* Shield shape */}
      <g filter="url(#forgeGlow)">
        <path
          d="M200,60 L320,100 L320,280 C320,340 260,400 200,420 C140,400 80,340 80,280 L80,100 Z"
          fill="url(#ironGrad)"
          stroke="url(#steelEdge)"
          strokeWidth="4"
          filter="url(#roughIron)"
        />
        {/* Shield inner border */}
        <path
          d="M200,78 L305,112 L305,275 C305,330 250,385 200,402 C150,385 95,330 95,275 L95,112 Z"
          fill="none"
          stroke="url(#steelEdge)"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Rivets on shield */}
        {[
          [110, 115],
          [290, 115],
          [95, 260],
          [305, 260],
          [140, 385],
          [260, 385],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill="#3d3d3d" stroke="#5a5a5a" strokeWidth="1" />
            <circle cx={cx! - 1} cy={cy! - 1} r="1.5" fill="#6b6b6b" opacity="0.6" />
          </g>
        ))}

        {/* BB Letters on shield */}
        <g transform="translate(200, 230)">
          {/* First B */}
          <g fill="url(#crestCopper)">
            <rect x="-75" y="-65" width="14" height="130" rx="1" />
            <path d="M-61,-65 L-20,-65 C0,-65 12,-55 12,-44 C12,-34 0,-27 -20,-27 L-61,-27 Z" />
            <path
              d="M-50,-55 L-24,-55 C-10,-55 -2,-50 -2,-44 C-2,-38 -10,-34 -24,-34 L-50,-34 Z"
              fill="#1f1f1f"
            />
            <path d="M-61,-27 L-16,-27 C8,-27 18,-16 18,-4 C18,10 8,22 -16,22 L-61,22 Z" />
            <path
              d="M-50,-18 L-20,-18 C-4,-18 6,-10 6,-4 C6,4 -4,14 -20,14 L-50,14 Z"
              fill="#1f1f1f"
            />
          </g>

          {/* Second B */}
          <g fill="url(#crestCopper)" opacity="0.9">
            <rect x="5" y="-65" width="14" height="130" rx="1" />
            <path d="M19,-65 L60,-65 C80,-65 92,-55 92,-44 C92,-34 80,-27 60,-27 L19,-27 Z" />
            <path
              d="M30,-55 L56,-55 C70,-55 78,-50 78,-44 C78,-38 70,-34 56,-34 L30,-34 Z"
              fill="#1f1f1f"
            />
            <path d="M19,-27 L64,-27 C88,-27 98,-16 98,-4 C98,10 88,22 64,22 L19,22 Z" />
            <path
              d="M30,-18 L60,-18 C76,-18 86,-10 86,-4 C86,4 76,14 60,14 L30,14 Z"
              fill="#1f1f1f"
            />
          </g>
        </g>
      </g>

      {/* Banner at bottom */}
      <g transform="translate(200, 440)">
        {/* Banner ribbon */}
        <path
          d="M-120,0 L-100,-15 L-100,15 L-120,0 Z"
          fill="#7f1d1d"
          opacity="0.8"
        />
        <path
          d="M120,0 L100,-15 L100,15 L120,0 Z"
          fill="#7f1d1d"
          opacity="0.8"
        />
        <rect x="-100" y="-15" width="200" height="30" rx="2" fill="#7f1d1d" />
        <rect
          x="-100"
          y="-15"
          width="200"
          height="30"
          rx="2"
          fill="none"
          stroke="#991b1b"
          strokeWidth="1"
        />
        {/* Banner text */}
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill="#d4a843"
          fontSize="13"
          letterSpacing="4"
          fontFamily="Georgia, serif"
          fontWeight="bold"
        >
          BOOKY BLINDERS
        </text>
      </g>
    </svg>
  );
}

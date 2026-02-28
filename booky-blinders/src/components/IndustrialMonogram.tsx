export default function IndustrialMonogram() {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      <defs>
        <linearGradient
          id="copperGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#d4955a" />
          <stop offset="30%" stopColor="#b87333" />
          <stop offset="60%" stopColor="#a0622a" />
          <stop offset="80%" stopColor="#c5944d" />
          <stop offset="100%" stopColor="#8b5e2f" />
        </linearGradient>
        <linearGradient
          id="copperHighlight"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#e0a56a" />
          <stop offset="50%" stopColor="#b87333" />
          <stop offset="100%" stopColor="#7a4f24" />
        </linearGradient>
        <filter id="hammerTexture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="4"
            result="noise"
          />
          <feComposite in="SourceGraphic" in2="noise" operator="in" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
        <filter id="innerGlow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feFlood floodColor="#e0a56a" floodOpacity="0.3" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Decorative Art Deco lines at top */}
      <g opacity="0.4">
        <line
          x1="60"
          y1="40"
          x2="340"
          y2="40"
          stroke="#c5a059"
          strokeWidth="1"
        />
        <line
          x1="80"
          y1="46"
          x2="320"
          y2="46"
          stroke="#c5a059"
          strokeWidth="0.5"
        />
        <polygon points="190,32 200,22 210,32" fill="#c5a059" />
        <polygon points="190,54 200,64 210,54" fill="#c5a059" />
      </g>

      {/* Interlaced BB Monogram – Art Deco style */}
      <g transform="translate(200, 210)" filter="url(#innerGlow)">
        {/* First B */}
        <g fill="url(#copperGrad)" filter="url(#hammerTexture)">
          {/* Vertical stem of first B */}
          <rect x="-95" y="-100" width="22" height="200" rx="2" />
          {/* Top bowl of first B */}
          <path d="M-73,-100 L-20,-100 C10,-100 25,-85 25,-72 C25,-58 10,-48 -20,-48 L-73,-48 Z" />
          {/* Bottom bowl of first B */}
          <path d="M-73,-48 L-15,-48 C20,-48 38,-35 38,-18 C38,0 20,14 -15,14 L-73,14 Z" />
          {/* Inner cutout top */}
          <path
            d="M-55,-84 L-25,-84 C-5,-84 5,-78 5,-72 C5,-65 -5,-60 -25,-60 L-55,-60 Z"
            fill="#1a1f2e"
          />
          {/* Inner cutout bottom */}
          <path
            d="M-55,-36 L-20,-36 C5,-36 18,-28 18,-18 C18,-7 5,0 -20,0 L-55,0 Z"
            fill="#1a1f2e"
          />
        </g>

        {/* Second B – offset and interlaced */}
        <g
          fill="url(#copperHighlight)"
          filter="url(#hammerTexture)"
          opacity="0.88"
        >
          {/* Vertical stem of second B */}
          <rect x="-15" y="-86" width="22" height="200" rx="2" />
          {/* Top bowl of second B */}
          <path d="M7,-86 L60,-86 C90,-86 105,-71 105,-58 C105,-44 90,-34 60,-34 L7,-34 Z" />
          {/* Bottom bowl of second B */}
          <path d="M7,-34 L65,-34 C100,-34 118,-21 118,-4 C118,14 100,28 65,28 L7,28 Z" />
          {/* Inner cutout top */}
          <path
            d="M25,-70 L55,-70 C75,-70 85,-64 85,-58 C85,-51 75,-46 55,-46 L25,-46 Z"
            fill="#1a1f2e"
          />
          {/* Inner cutout bottom */}
          <path
            d="M25,-22 L60,-22 C85,-22 98,-14 98,-4 C98,7 85,14 60,14 L25,14 Z"
            fill="#1a1f2e"
          />
        </g>
      </g>

      {/* "BY ORDER OF THE" small tracking text */}
      <text
        x="200"
        y="370"
        textAnchor="middle"
        fill="#9ca3af"
        fontSize="11"
        letterSpacing="6"
        fontFamily="Georgia, serif"
      >
        BY ORDER OF THE
      </text>

      {/* "BOOKY BLINDERS" large vintage text */}
      <text
        x="200"
        y="410"
        textAnchor="middle"
        fill="url(#copperGrad)"
        fontSize="36"
        fontWeight="bold"
        letterSpacing="5"
        fontFamily="Georgia, serif"
      >
        BOOKY BLINDERS
      </text>

      {/* Decorative Art Deco lines at bottom */}
      <g opacity="0.4">
        <line
          x1="60"
          y1="440"
          x2="340"
          y2="440"
          stroke="#c5a059"
          strokeWidth="1"
        />
        <line
          x1="80"
          y1="446"
          x2="320"
          y2="446"
          stroke="#c5a059"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}

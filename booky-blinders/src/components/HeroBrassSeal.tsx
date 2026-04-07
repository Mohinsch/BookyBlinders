"use client";

export default function HeroBrassSeal() {
  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      className="hero-seal"
    >
      <defs>
        {/* ===== METALLIC GRADIENTS ===== */}
        {/* Aged brass — main body */}
        <radialGradient id="hs-brassMetal" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f0d78c" />
          <stop offset="18%" stopColor="#d4b867" />
          <stop offset="40%" stopColor="#c5a049" />
          <stop offset="62%" stopColor="#a8883a" />
          <stop offset="85%" stopColor="#7d6425" />
          <stop offset="100%" stopColor="#5c4a1a" />
        </radialGradient>

        {/* Tarnished dark brass for depth */}
        <radialGradient id="hs-darkBrass" cx="55%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#8a7030" />
          <stop offset="50%" stopColor="#5c4a1a" />
          <stop offset="100%" stopColor="#3a2f10" />
        </radialGradient>

        {/* Highlight sweep for the rim bevel */}
        <linearGradient id="hs-rimHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e6a3" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#d4b564" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#a08030" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5c4a1a" stopOpacity="0.8" />
        </linearGradient>

        {/* Embossed letter gradient — top lit */}
        <linearGradient id="hs-letterGrad" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f7e8a0" />
          <stop offset="25%" stopColor="#d4b564" />
          <stop offset="55%" stopColor="#b89940" />
          <stop offset="80%" stopColor="#8a6e2f" />
          <stop offset="100%" stopColor="#5c4a1a" />
        </linearGradient>

        {/* Letter face — polished brass */}
        <linearGradient id="hs-letterFace" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#eed88a" />
          <stop offset="40%" stopColor="#c9a64e" />
          <stop offset="70%" stopColor="#a08030" />
          <stop offset="100%" stopColor="#7a6020" />
        </linearGradient>

        {/* Shimmer sweep gradient */}
        <linearGradient id="hs-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8dc" stopOpacity="0" />
          <stop offset="40%" stopColor="#fff8dc" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff8dc" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#fff8dc" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff8dc" stopOpacity="0" />
        </linearGradient>

        {/* Rim edge highlight */}
        <linearGradient id="hs-edgeLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5e6a3" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#c5a049" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5c4a1a" stopOpacity="0.6" />
        </linearGradient>

        {/* Inner field dark gradient */}
        <radialGradient id="hs-innerField" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#2a2418" />
          <stop offset="60%" stopColor="#1a1710" />
          <stop offset="100%" stopColor="#0f0d08" />
        </radialGradient>

        {/* ===== FILTERS ===== */}
        {/* Heavy emboss for the outer ring */}
        <filter id="hs-ringEmboss" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur1" />
          <feSpecularLighting in="blur1" surfaceScale="6" specularConstant="1.2" specularExponent="25" result="spec1">
            <feDistantLight azimuth="225" elevation="45" />
          </feSpecularLighting>
          <feComposite in="spec1" in2="SourceAlpha" operator="in" result="specClip" />
          <feComposite in="SourceGraphic" in2="specClip" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" />
        </filter>

        {/* Deep emboss for BB letters */}
        <filter id="hs-letterEmboss" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="lBlur" />
          <feSpecularLighting in="lBlur" surfaceScale="8" specularConstant="1.5" specularExponent="35" result="lSpec">
            <feDistantLight azimuth="215" elevation="50" />
          </feSpecularLighting>
          <feComposite in="lSpec" in2="SourceAlpha" operator="in" result="lSpecClip" />
          <feComposite in="SourceGraphic" in2="lSpecClip" operator="arithmetic" k1="0" k2="1" k3="0.7" k4="0" />
        </filter>

        {/* Inner shadow (inset look) */}
        <filter id="hs-innerShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="iBlur" />
          <feOffset dx="3" dy="4" result="iOff" />
          <feComposite in="iOff" in2="SourceAlpha" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="iShadow" />
          <feFlood floodColor="#000000" floodOpacity="0.55" result="iColor" />
          <feComposite in="iColor" in2="iShadow" operator="in" result="iFinal" />
          <feComposite in="SourceGraphic" in2="iFinal" operator="over" />
        </filter>

        {/* Drop shadow for overall depth */}
        <filter id="hs-dropShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="dBlur" />
          <feOffset dx="0" dy="8" result="dOff" />
          <feFlood floodColor="#000000" floodOpacity="0.6" result="dColor" />
          <feComposite in="dColor" in2="dOff" operator="in" result="dSh" />
          <feMerge>
            <feMergeNode in="dSh" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Noise texture */}
        <filter id="hs-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="noisyResult" />
          <feComponentTransfer in="noisyResult">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>

        {/* Subtle grain overlay */}
        <filter id="hs-grain">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="grain" />
          <feColorMatrix type="saturate" values="0" in="grain" result="gGray" />
          <feBlend in="SourceGraphic" in2="gGray" mode="overlay" />
        </filter>

        {/* Circular clip for shimmer */}
        <clipPath id="hs-sealClip">
          <circle cx="300" cy="300" r="248" />
        </clipPath>

        {/* Circular text paths */}
        <path
          id="hs-topTextPath"
          d="M 105,300 A 195,195 0 0,1 495,300"
          fill="none"
        />
        <path
          id="hs-bottomTextPath"
          d="M 495,300 A 195,195 0 0,1 105,300"
          fill="none"
        />
      </defs>

      {/* ===== DROP SHADOW LAYER ===== */}
      <g filter="url(#hs-dropShadow)">
        {/* ===== OUTER BEZEL RING ===== */}
        {/* Thick outer ring — beveled brass */}
        <circle cx="300" cy="300" r="248" fill="url(#hs-brassMetal)" />
        <circle cx="300" cy="300" r="248" fill="url(#hs-rimHighlight)" opacity="0.4" />
        {/* Grain texture on outer ring */}
        <circle cx="300" cy="300" r="248" fill="url(#hs-brassMetal)" filter="url(#hs-grain)" opacity="0.3" />

        {/* Outer ring edge highlights */}
        <circle cx="300" cy="300" r="246" fill="none" stroke="#f5e6a3" strokeWidth="0.5" opacity="0.5" />
        <circle cx="300" cy="300" r="248" fill="none" stroke="#3a2f10" strokeWidth="1.5" />
        <circle cx="300" cy="300" r="250" fill="none" stroke="#5c4a1a" strokeWidth="0.5" opacity="0.6" />

        {/* Inner bezel cut */}
        <circle cx="300" cy="300" r="225" fill="none" stroke="#3a2f10" strokeWidth="2" />
        <circle cx="300" cy="300" r="223" fill="none" stroke="#f5e6a3" strokeWidth="0.5" opacity="0.35" />

        {/* Knurled edge — decorative nubs */}
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i * 5 * Math.PI) / 180;
          const cx = 300 + 236 * Math.cos(angle);
          const cy = 300 + 236 * Math.sin(angle);
          return (
            <circle
              key={`knurl-${i}`}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 2.2 : 1.4}
              fill={i % 3 === 0 ? "#d4b564" : "#a08030"}
              opacity={i % 2 === 0 ? 0.7 : 0.4}
            />
          );
        })}

        {/* ===== INNER FIELD (dark recessed area) ===== */}
        <circle cx="300" cy="300" r="218" fill="url(#hs-innerField)" />
        <circle cx="300" cy="300" r="218" fill="url(#hs-innerField)" filter="url(#hs-innerShadow)" />

        {/* Subtle ring texture inside */}
        <circle cx="300" cy="300" r="210" fill="none" stroke="#c5a049" strokeWidth="0.3" opacity="0.15" />
        <circle cx="300" cy="300" r="200" fill="none" stroke="#c5a049" strokeWidth="0.3" opacity="0.1" />
        <circle cx="300" cy="300" r="190" fill="none" stroke="#c5a049" strokeWidth="0.2" opacity="0.08" />

        {/* ===== CIRCULAR TEXT ===== */}
        <text
          fill="#c5a049"
          fontSize="18"
          letterSpacing="10"
          fontWeight="bold"
          opacity="0.85"
        >
          <textPath href="#hs-topTextPath" startOffset="50%" textAnchor="middle">
            BOOKY BLINDERS
          </textPath>
        </text>
        <text
          fill="#8a7030"
          fontSize="13"
          letterSpacing="8"
          opacity="0.7"
        >
          <textPath href="#hs-bottomTextPath" startOffset="50%" textAnchor="middle">
            EST. 1920
          </textPath>
        </text>

        {/* Thin decorative separators flanking text */}
        {/* Left dot cluster */}
        <circle cx="130" cy="270" r="2" fill="#c5a049" opacity="0.5" />
        <circle cx="124" cy="278" r="1.3" fill="#a08030" opacity="0.4" />
        <circle cx="120" cy="286" r="2" fill="#c5a049" opacity="0.5" />
        {/* Right dot cluster */}
        <circle cx="470" cy="270" r="2" fill="#c5a049" opacity="0.5" />
        <circle cx="476" cy="278" r="1.3" fill="#a08030" opacity="0.4" />
        <circle cx="480" cy="286" r="2" fill="#c5a049" opacity="0.5" />
        {/* Bottom left */}
        <circle cx="130" cy="330" r="2" fill="#c5a049" opacity="0.5" />
        <circle cx="124" cy="322" r="1.3" fill="#a08030" opacity="0.4" />
        <circle cx="120" cy="314" r="2" fill="#c5a049" opacity="0.5" />
        {/* Bottom right */}
        <circle cx="470" cy="330" r="2" fill="#c5a049" opacity="0.5" />
        <circle cx="476" cy="322" r="1.3" fill="#a08030" opacity="0.4" />
        <circle cx="480" cy="314" r="2" fill="#c5a049" opacity="0.5" />

        {/* ===== @font-face for ETCO Brookshire ===== */}
        <style>{`
          @font-face {
            font-family: 'ETCO Brookshire';
            src: url('/fonts/ETCOBrookshire.woff2') format('woff2'),
                 url('/fonts/ETCOBrookshire.woff') format('woff'),
                 url('/fonts/ETCOBrookshire.otf') format('opentype'),
                 url('/fonts/ETCOBrookshire.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}</style>

        {/* ===== CENTER BB MONOGRAM ===== */}
        <g filter="url(#hs-letterEmboss)">
          {/* Shadow / depth layer behind letters */}
          <text
            x="300"
            y="320"
            textAnchor="middle"
            fontFamily="'ETCO Brookshire', serif"
            fontSize="160"
            letterSpacing="12"
            fill="#000"
            opacity="0.3"
            transform="translate(3, 4)"
          >
            BB
          </text>

          {/* Main BB text with brass gradient */}
          <text
            x="300"
            y="320"
            textAnchor="middle"
            fontFamily="'ETCO Brookshire', serif"
            fontSize="160"
            letterSpacing="12"
            fill="url(#hs-letterGrad)"
            stroke="#3a2f10"
            strokeWidth="1"
          >
            BB
          </text>

          {/* Polished highlight layer */}
          <text
            x="300"
            y="320"
            textAnchor="middle"
            fontFamily="'ETCO Brookshire', serif"
            fontSize="160"
            letterSpacing="12"
            fill="url(#hs-letterFace)"
            opacity="0.4"
          >
            BB
          </text>

          {/* Top edge highlight */}
          <text
            x="300"
            y="320"
            textAnchor="middle"
            fontFamily="'ETCO Brookshire', serif"
            fontSize="160"
            letterSpacing="12"
            fill="none"
            stroke="#f5e6a3"
            strokeWidth="0.8"
            opacity="0.25"
          >
            BB
          </text>
        </g>

        {/* ===== CROSSED ELEMENTS behind BB ===== */}
        {/* Razor blade — angled behind letters */}
        <g opacity="0.18">
          <line x1="210" y1="370" x2="390" y2="220" stroke="#c5a049" strokeWidth="1.5" />
          <line x1="210" y1="220" x2="390" y2="370" stroke="#c5a049" strokeWidth="1.5" />
          {/* Small diamond at crossing */}
          <polygon points="300,290 306,295 300,300 294,295" fill="#c5a049" opacity="0.5" />
        </g>

        {/* ===== INNER DECORATIVE RING ===== */}
        <circle cx="300" cy="300" r="160" fill="none" stroke="url(#hs-edgeLight)" strokeWidth="1.5" opacity="0.4" />
        <circle cx="300" cy="300" r="156" fill="none" stroke="#3a2f10" strokeWidth="0.5" opacity="0.3" />

        {/* Small decorative dots on inner ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 300 + 158 * Math.cos(rad);
          const cy = 300 + 158 * Math.sin(rad);
          return (
            <circle
              key={`idot-${deg}`}
              cx={cx}
              cy={cy}
              r="2.5"
              fill="#c5a049"
              opacity="0.5"
            />
          );
        })}

        {/* ===== SHIMMER OVERLAY ===== */}
        <g clipPath="url(#hs-sealClip)">
          <rect
            x="-300"
            y="-300"
            width="1200"
            height="1200"
            fill="url(#hs-shimmer)"
            opacity="0.5"
            className="shimmer-rect"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="-600 -600"
              to="600 600"
              dur="4s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      </g>
    </svg>
  );
}

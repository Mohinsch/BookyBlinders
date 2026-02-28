export default function ClassicBrassSeal() {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      <defs>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbb86a" />
          <stop offset="25%" stopColor="#c5a059" />
          <stop offset="50%" stopColor="#b8923e" />
          <stop offset="75%" stopColor="#d4a843" />
          <stop offset="100%" stopColor="#a07830" />
        </linearGradient>
        <linearGradient id="brassInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c5a059" />
          <stop offset="100%" stopColor="#8a6e2f" />
        </linearGradient>
        <filter id="emboss">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="4"
            specularConstant="0.8"
            specularExponent="20"
            result="specOut"
          >
            <fePointLight x="-5000" y="-5000" z="8000" />
          </feSpecularLighting>
          <feComposite
            in="specOut"
            in2="SourceAlpha"
            operator="in"
            result="specOut2"
          />
          <feComposite
            in="SourceGraphic"
            in2="specOut2"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx="200"
        cy="230"
        r="170"
        fill="none"
        stroke="url(#brassGrad)"
        strokeWidth="6"
      />
      {/* Inner ring */}
      <circle
        cx="200"
        cy="230"
        r="155"
        fill="none"
        stroke="url(#brassGrad)"
        strokeWidth="2"
      />
      {/* Decorative dots around the border */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const cx = 200 + 162 * Math.cos(angle);
        const cy = 230 + 162 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="1.5"
            fill="#c5a059"
            opacity="0.5"
          />
        );
      })}

      {/* Circular text - top: "BOOKY BLINDERS" */}
      <defs>
        <path
          id="topArc"
          d="M 60,230 A 140,140 0 0,1 340,230"
        />
        <path
          id="bottomArc"
          d="M 340,230 A 140,140 0 0,1 60,230"
        />
      </defs>
      <text
        fill="#c5a059"
        fontSize="16"
        letterSpacing="8"
        fontFamily="Georgia, serif"
        fontWeight="bold"
      >
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          BOOKY BLINDERS
        </textPath>
      </text>
      <text
        fill="#9ca3af"
        fontSize="13"
        letterSpacing="6"
        fontFamily="Georgia, serif"
      >
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          EST. 1920
        </textPath>
      </text>

      {/* Center BB forming an open book */}
      <g transform="translate(200, 225)" filter="url(#emboss)">
        {/* Book spine / center line */}
        <line
          x1="0"
          y1="-55"
          x2="0"
          y2="55"
          stroke="#8a6e2f"
          strokeWidth="3"
        />

        {/* Left page (first B) */}
        <g fill="url(#brassGrad)">
          {/* Left page shape */}
          <path
            d="M-5,-50 L-5,50 C-5,50 -60,45 -75,30 L-75,-35 C-60,-48 -5,-50 -5,-50 Z"
            fill="#1a1f2e"
            stroke="url(#brassGrad)"
            strokeWidth="1.5"
          />
          {/* B on left page */}
          <g transform="translate(-42, -5)">
            {/* Stem */}
            <rect x="-18" y="-32" width="8" height="64" rx="1" />
            {/* Top bump */}
            <path d="M-10,-32 L6,-32 C18,-32 24,-24 24,-18 C24,-12 18,-6 6,-6 L-10,-6 Z" />
            <path
              d="M-4,-26 L4,-26 C12,-26 16,-22 16,-18 C16,-14 12,-12 4,-12 L-4,-12 Z"
              fill="#1a1f2e"
            />
            {/* Bottom bump */}
            <path d="M-10,-6 L8,-6 C22,-6 28,4 28,12 C28,20 22,32 8,32 L-10,32 Z" />
            <path
              d="M-4,0 L6,0 C16,0 20,6 20,12 C20,18 16,24 6,24 L-4,24 Z"
              fill="#1a1f2e"
            />
          </g>
        </g>

        {/* Right page (second B) */}
        <g fill="url(#brassInner)">
          {/* Right page shape */}
          <path
            d="M5,-50 L5,50 C5,50 60,45 75,30 L75,-35 C60,-48 5,-50 5,-50 Z"
            fill="#1a1f2e"
            stroke="url(#brassGrad)"
            strokeWidth="1.5"
          />
          {/* B on right page */}
          <g transform="translate(22, -5)">
            {/* Stem */}
            <rect x="-2" y="-32" width="8" height="64" rx="1" />
            {/* Top bump */}
            <path d="M6,-32 L22,-32 C34,-32 40,-24 40,-18 C40,-12 34,-6 22,-6 L6,-6 Z" />
            <path
              d="M12,-26 L20,-26 C28,-26 32,-22 32,-18 C32,-14 28,-12 20,-12 L12,-12 Z"
              fill="#1a1f2e"
            />
            {/* Bottom bump */}
            <path d="M6,-6 L24,-6 C38,-6 44,4 44,12 C44,20 38,32 24,32 L6,32 Z" />
            <path
              d="M12,0 L22,0 C32,0 36,6 36,12 C36,18 32,24 22,24 L12,24 Z"
              fill="#1a1f2e"
            />
          </g>
        </g>

        {/* Small book pages fan lines */}
        <g stroke="#c5a059" strokeWidth="0.5" opacity="0.3">
          <line x1="-5" y1="-50" x2="-70" y2="-38" />
          <line x1="5" y1="-50" x2="70" y2="-38" />
          <line x1="-5" y1="50" x2="-70" y2="35" />
          <line x1="5" y1="50" x2="70" y2="35" />
        </g>
      </g>
    </svg>
  );
}

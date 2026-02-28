export default function BookStackBB() {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      <defs>
        <linearGradient id="bookBurgundy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="50%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#5c1515" />
        </linearGradient>
        <linearGradient id="bookGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="50%" stopColor="#c5a059" />
          <stop offset="100%" stopColor="#8a6e2f" />
        </linearGradient>
        <linearGradient id="bookDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a2020" />
          <stop offset="100%" stopColor="#2d1212" />
        </linearGradient>
        <linearGradient id="spine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>

      {/* === FIRST B (left side) === */}
      <g transform="translate(52, 55)">
        {/* Vertical stem of B - stack of books */}
        {/* Book 1 */}
        <rect x="0" y="0" width="26" height="28" rx="2" fill="url(#bookBurgundy)" />
        <rect x="0" y="0" width="5" height="28" rx="1" fill="url(#spine)" />
        <line x1="6" y1="8" x2="24" y2="8" stroke="#d4a843" strokeWidth="0.5" opacity="0.4" />
        <line x1="6" y1="20" x2="24" y2="20" stroke="#d4a843" strokeWidth="0.5" opacity="0.4" />

        {/* Book 2 */}
        <rect x="0" y="31" width="26" height="24" rx="2" fill="url(#bookGold)" />
        <rect x="0" y="31" width="5" height="24" rx="1" fill="url(#spine)" />

        {/* Book 3 */}
        <rect x="0" y="58" width="26" height="30" rx="2" fill="url(#bookDark)" />
        <rect x="0" y="58" width="5" height="30" rx="1" fill="url(#spine)" />
        <line x1="6" y1="73" x2="24" y2="73" stroke="#c5a059" strokeWidth="0.5" opacity="0.5" />

        {/* Book 4 */}
        <rect x="0" y="91" width="26" height="26" rx="2" fill="url(#bookBurgundy)" />
        <rect x="0" y="91" width="5" height="26" rx="1" fill="url(#spine)" />

        {/* Book 5 */}
        <rect x="0" y="120" width="26" height="28" rx="2" fill="url(#bookGold)" />
        <rect x="0" y="120" width="5" height="28" rx="1" fill="url(#spine)" />

        {/* Book 6 */}
        <rect x="0" y="151" width="26" height="24" rx="2" fill="url(#bookDark)" />
        <rect x="0" y="151" width="5" height="24" rx="1" fill="url(#spine)" />

        {/* Book 7 */}
        <rect x="0" y="178" width="26" height="28" rx="2" fill="url(#bookBurgundy)" />
        <rect x="0" y="178" width="5" height="28" rx="1" fill="url(#spine)" />

        {/* Book 8 - bottom */}
        <rect x="0" y="209" width="26" height="26" rx="2" fill="url(#bookGold)" />
        <rect x="0" y="209" width="5" height="26" rx="1" fill="url(#spine)" />

        {/* Top bowl of B - horizontal books */}
        <rect x="29" y="0" width="90" height="22" rx="2" fill="url(#bookGold)" />
        <rect x="29" y="0" width="90" height="4" rx="1" fill="url(#spine)" />
        <line x1="35" y1="6" x2="115" y2="6" stroke="#7f1d1d" strokeWidth="0.5" opacity="0.3" />

        <rect x="29" y="25" width="80" height="20" rx="2" fill="url(#bookBurgundy)" />
        <rect x="29" y="25" width="80" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="48" width="88" height="24" rx="2" fill="url(#bookDark)" />
        <rect x="29" y="48" width="88" height="4" rx="1" fill="url(#spine)" />

        {/* Curved end of top bowl */}
        <path
          d="M119,0 C148,0 158,18 158,36 C158,54 148,72 119,72"
          fill="none"
          stroke="url(#bookBurgundy)"
          strokeWidth="22"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M119,8 C140,8 148,20 148,36 C148,52 140,64 119,64"
          fill="none"
          stroke="#1a1f2e"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Middle horizontal connector */}
        <rect x="29" y="95" width="94" height="22" rx="2" fill="url(#bookBurgundy)" />
        <rect x="29" y="95" width="94" height="4" rx="1" fill="url(#spine)" />

        {/* Bottom bowl - larger */}
        <rect x="29" y="120" width="96" height="24" rx="2" fill="url(#bookGold)" />
        <rect x="29" y="120" width="96" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="147" width="88" height="22" rx="2" fill="url(#bookDark)" />
        <rect x="29" y="147" width="88" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="172" width="96" height="24" rx="2" fill="url(#bookBurgundy)" />
        <rect x="29" y="172" width="96" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="199" width="92" height="22" rx="2" fill="url(#bookGold)" />
        <rect x="29" y="199" width="92" height="4" rx="1" fill="url(#spine)" />

        {/* Curved end of bottom bowl */}
        <path
          d="M125,95 C162,95 175,120 175,155 C175,190 162,220 125,220"
          fill="none"
          stroke="url(#bookGold)"
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M125,108 C152,108 162,126 162,155 C162,184 152,202 125,207"
          fill="none"
          stroke="#1a1f2e"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      {/* === SECOND B (right side) === */}
      <g transform="translate(210, 55)">
        {/* Vertical stem */}
        <rect x="0" y="0" width="26" height="28" rx="2" fill="url(#bookGold)" />
        <rect x="0" y="0" width="5" height="28" rx="1" fill="url(#spine)" />

        <rect x="0" y="31" width="26" height="24" rx="2" fill="url(#bookBurgundy)" />
        <rect x="0" y="31" width="5" height="24" rx="1" fill="url(#spine)" />

        <rect x="0" y="58" width="26" height="30" rx="2" fill="url(#bookGold)" />
        <rect x="0" y="58" width="5" height="30" rx="1" fill="url(#spine)" />

        <rect x="0" y="91" width="26" height="26" rx="2" fill="url(#bookDark)" />
        <rect x="0" y="91" width="5" height="26" rx="1" fill="url(#spine)" />

        <rect x="0" y="120" width="26" height="28" rx="2" fill="url(#bookBurgundy)" />
        <rect x="0" y="120" width="5" height="28" rx="1" fill="url(#spine)" />

        <rect x="0" y="151" width="26" height="24" rx="2" fill="url(#bookGold)" />
        <rect x="0" y="151" width="5" height="24" rx="1" fill="url(#spine)" />

        <rect x="0" y="178" width="26" height="28" rx="2" fill="url(#bookDark)" />
        <rect x="0" y="178" width="5" height="28" rx="1" fill="url(#spine)" />

        <rect x="0" y="209" width="26" height="26" rx="2" fill="url(#bookBurgundy)" />
        <rect x="0" y="209" width="5" height="26" rx="1" fill="url(#spine)" />

        {/* Top bowl horizontal books */}
        <rect x="29" y="0" width="90" height="22" rx="2" fill="url(#bookBurgundy)" />
        <rect x="29" y="0" width="90" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="25" width="80" height="20" rx="2" fill="url(#bookGold)" />
        <rect x="29" y="25" width="80" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="48" width="88" height="24" rx="2" fill="url(#bookBurgundy)" />
        <rect x="29" y="48" width="88" height="4" rx="1" fill="url(#spine)" />

        <path
          d="M119,0 C148,0 158,18 158,36 C158,54 148,72 119,72"
          fill="none"
          stroke="url(#bookGold)"
          strokeWidth="22"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M119,8 C140,8 148,20 148,36 C148,52 140,64 119,64"
          fill="none"
          stroke="#1a1f2e"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Middle connector */}
        <rect x="29" y="95" width="94" height="22" rx="2" fill="url(#bookGold)" />
        <rect x="29" y="95" width="94" height="4" rx="1" fill="url(#spine)" />

        {/* Bottom bowl */}
        <rect x="29" y="120" width="96" height="24" rx="2" fill="url(#bookDark)" />
        <rect x="29" y="120" width="96" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="147" width="88" height="22" rx="2" fill="url(#bookBurgundy)" />
        <rect x="29" y="147" width="88" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="172" width="96" height="24" rx="2" fill="url(#bookGold)" />
        <rect x="29" y="172" width="96" height="4" rx="1" fill="url(#spine)" />

        <rect x="29" y="199" width="92" height="22" rx="2" fill="url(#bookDark)" />
        <rect x="29" y="199" width="92" height="4" rx="1" fill="url(#spine)" />

        <path
          d="M125,95 C162,95 175,120 175,155 C175,190 162,220 125,220"
          fill="none"
          stroke="url(#bookBurgundy)"
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M125,108 C152,108 162,126 162,155 C162,184 152,202 125,207"
          fill="none"
          stroke="#1a1f2e"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      {/* "BOOKY BLINDERS" underneath */}
      <text
        x="200"
        y="360"
        textAnchor="middle"
        fill="url(#bookGold)"
        fontSize="32"
        fontWeight="bold"
        letterSpacing="5"
        fontFamily="Georgia, serif"
      >
        BOOKY BLINDERS
      </text>

      {/* Decorative book line elements */}
      <g opacity="0.3">
        <line
          x1="60"
          y1="385"
          x2="340"
          y2="385"
          stroke="#c5a059"
          strokeWidth="1"
        />
        <rect x="180" y="380" width="40" height="10" rx="2" fill="#7f1d1d" />
        <line
          x1="182"
          y1="380"
          x2="182"
          y2="390"
          stroke="#c5a059"
          strokeWidth="0.5"
        />
        <line
          x1="195"
          y1="380"
          x2="195"
          y2="390"
          stroke="#c5a059"
          strokeWidth="0.5"
        />
        <line
          x1="208"
          y1="380"
          x2="208"
          y2="390"
          stroke="#c5a059"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}

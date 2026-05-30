import type { NextConfig } from "next";

// OWASP-aligned security headers for production hardening
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload", // Forces HTTPS (MitM protection)
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff", // Prevents MIME-type sniffing attacks
  },
  {
    key: "X-Frame-Options",
    value: "DENY", // Clickjacking mitigation (blocks frame embedding)
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin", // Limits referrer data leaks
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()", // Disables unused browser APIs
  },
  {
    key: "Content-Security-Policy",
    // Strict resource loading context to prevent XSS. Unsafe flags required by Next.js/next-themes.
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://books.google.com http://books.google.com",
      "font-src 'self' data:",
      "connect-src 'self' https://www.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true, // Opt-in for React 19 automatic compiler memoization

  // Fixes Next 16 Turbopack build failure by preventing static analysis of unused better-auth submodules
  serverExternalPackages: ["better-auth"],

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "books.google.com" },
      { protocol: "https", hostname: "books.google.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

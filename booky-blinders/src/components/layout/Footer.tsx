// src/components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <p>&copy; {currentYear} Booky Blinders. By order of the management.</p>
        </div>
        
        <div className="footer-links">
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-link">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
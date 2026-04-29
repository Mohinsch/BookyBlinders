"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BBMonogram } from "@/components/ui/BBMonogram";
import styles from "./Header.module.scss";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  // Explicitly check for the user object to confirm authentication
  const isAuthenticated = !!session?.user;

  const navLinks = ["Home", "Discover", "About Us"];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsMobileMenuOpen(false);
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* Brand */}
        <Link href="/" className={styles.brand} onClick={() => setIsMobileMenuOpen(false)}>
          <BBMonogram className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.title}>Booky Blinders</span>
            <span className={styles.subtitle}>Personal Library</span>
          </div>
        </Link>

        {/* Desktop Actions */}
        <div className={styles.desktopActions}>
          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map((link) => {
              const href = link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s+/g, '-')}`;
              // Keep active state even on nested routes (e.g., /discover/123)
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

              return (
                <Link 
                  key={link} 
                  href={href} 
                  className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                  {link}
                </Link>
              );
            })}
          </nav>
          
          {isPending ? (
            <span className={styles.enterBtn} style={{ opacity: 0.5 }}>Loading...</span>
          ) : isAuthenticated ? (
            <button onClick={handleLogout} className={styles.enterBtn}>
              Step Away
            </button>
          ) : (
            <Link href="/login" className={styles.enterBtn}>
              Enter Library
            </Link>
          )}
        </div>

        {/* Mobile Menu Burger */}
        <button 
          className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.menuOpen : ""}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileNav}>
          {navLinks.map((link) => {
            const href = link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s+/g, '-')}`;
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

            return (
              <Link 
                key={link} 
                href={href} 
                className={`${styles.mobileNavLink} ${isActive ? styles.active : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </Link>
            );
          })}
          
          {isAuthenticated ? (
            <button onClick={handleLogout} className={styles.enterBtnMobile}>
              Sign Out
            </button>
          ) : (
            <Link href="/login" className={styles.enterBtnMobile} onClick={() => setIsMobileMenuOpen(false)}>
              Enter Library
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
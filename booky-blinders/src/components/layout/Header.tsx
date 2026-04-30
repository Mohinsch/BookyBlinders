"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence , Variants} from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { BBMonogram } from "@/components/ui/BBMonogram";
import styles from "./Header.module.scss";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
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

  // Animation variants for the mobile slide-down menu
  const menuVariants : Variants= {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
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
              Close the Ledger
            </button>
          ) : (
            <Link href="/login" className={styles.enterBtn}>
              Open the Ledger
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
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

      {/* Animated Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={styles.mobileNav}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
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
                Close the Ledger
              </button>
            ) : (
              <Link href="/login" className={styles.enterBtnMobile} onClick={() => setIsMobileMenuOpen(false)}>
                Open the Ledger
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
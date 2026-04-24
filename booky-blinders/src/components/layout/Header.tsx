"use client"

import Link from "next/link";
import { BBMonogram } from "@/components/ui/BBMonogram";
import styles from "./Header.module.scss";

export function Header() {
  const navLinks = ["Home", "Discover", "About Us"];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* --- Bloc Marque (Logo + Texte) --- */}
        <Link href="/" className={styles.brand}>
          <BBMonogram className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.title}>Booky Blinders</span>
            <span className={styles.subtitle}>Personal Library</span>
          </div>
        </Link>

        {/* --- Navigation Bureau + Bouton --- */}
        <div className={styles.desktopActions}>
          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link 
                key={link} 
                href={link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s+/g, '-')}`} 
                className={styles.navLink}
              >
                {link}
              </Link>
            ))}
          </nav>
          
          <Link href="/login" className={styles.enterBtn}>
            Enter Library
          </Link>
        </div>

        {/* --- Menu Hamburger Mobile --- */}
        <button className={styles.mobileMenuBtn} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  );
}
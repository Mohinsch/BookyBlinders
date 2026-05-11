"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { UserDropdown } from "@/components/header/UserDropdown";
import { BBMonogram } from "@/components/ui/BBMonogram";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./Header.module.scss";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const navLinks = [
    { label: "Home", key: "header.home" },
    { label: "Discover", key: "header.discover" },
    { label: "About Us", key: "header.aboutUs" },
  ];

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

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string,
  ) => {
    if (link === "Discover") {
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById("discover");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", "#discover");
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          href="/"
          className={styles.brand}
          onClick={(e) => handleLinkClick(e, "Home")}
        >
          <BBMonogram className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.title}>Booky Blinders</span>
            <span className={styles.subtitle}>Personal Library</span>
          </div>
        </Link>

        <div className={styles.desktopActions}>
          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map(({ label, key }) => {
              let href = "/";
              if (label === "Discover") href = "/#discover";
              else if (label !== "Home")
                href = `/${label.toLowerCase().replace(/\s+/g, "-")}`;

              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));

              return (
                <Link
                  key={label}
                  href={href}
                  className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                  onClick={(e) => handleLinkClick(e, label)}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          {isPending ? (
            <span className={styles.enterBtn} style={{ opacity: 0.5 }}>
              {t("common.loading")}
            </span>
          ) : isAuthenticated ? (
            <div className={styles.authActions}>
              <Link href="/library" className={styles.enterBtn}>
                {t("header.myLibrary")}
              </Link>
              <UserDropdown />
            </div>
          ) : (
            <Link href="/login" className={styles.enterBtn}>
              {t("header.openTheLedger")}
            </Link>
          )}
        </div>

        <button
          type="button"
          className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.menuOpen : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileNav}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {navLinks.map(({ label, key }) => {
              let href = "/";
              if (label === "Discover") href = "/#discover";
              else if (label !== "Home")
                href = `/${label.toLowerCase().replace(/\s+/g, "-")}`;

              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));

              return (
                <Link
                  key={label}
                  href={href}
                  className={`${styles.mobileNavLink} ${isActive ? styles.active : ""}`}
                  onClick={(e) => handleLinkClick(e, label)}
                >
                  {t(key)}
                </Link>
              );
            })}
            {isAuthenticated && (
              <>
                <Link href="/account" className={styles.mobileNavLink}>
                  Account Settings
                </Link>
                <button
                  type="button"
                  className={styles.mobileLogoutBtn}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

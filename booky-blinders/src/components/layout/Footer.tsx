"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBMonogram } from "@/components/ui/BBMonogram";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./Footer.module.scss";

export function Footer() {
  const pathname = usePathname();
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "Home", key: "header.home", href: "/" },
    { label: "Discover", key: "header.discover", href: "/#discover" },
    { label: "Privacy", key: "footer.privacy", href: "/privacy" },
    { label: "Terms", key: "footer.terms", href: "/terms" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* --- Logo + Nav --- */}
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <BBMonogram className={styles.logo} />
            <div className={styles.brandText}>
              <span className={styles.title}>{t("footer.brand")}</span>
              <span className={styles.subtitle}>{t("footer.tagline")}</span>
            </div>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            {navLinks.map(({ label, key, href }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));

              return (
                <Link
                  key={label}
                  href={href}
                  className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher />
        </div>

        {/* --- Copyright + Quote --- */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {currentYear} {t("footer.brand")}. {t("footer.allRightsReserved")}
          </p>
          <p className={styles.quote}>"By order of the Booky Blinders"</p>
        </div>
      </div>
    </footer>
  );
}

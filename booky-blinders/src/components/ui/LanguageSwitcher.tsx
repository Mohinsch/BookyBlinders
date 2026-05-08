"use client";

import { useLocaleContext } from "@/lib/locale-context";
import styles from "./LanguageSwitcher.module.scss";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();

  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.button} ${locale === "en" ? styles.active : ""}`}
        onClick={() => setLocale("en")}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        className={`${styles.button} ${locale === "fr" ? styles.active : ""}`}
        onClick={() => setLocale("fr")}
        aria-label="Switch to French"
      >
        FR
      </button>
    </div>
  );
}

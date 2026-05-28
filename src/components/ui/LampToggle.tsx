"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./LampToggle.module.scss";

export function LampToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`${styles.lamp} ${isDark ? styles.on : styles.off}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Toggle ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className={styles.lampBase} />
      <div className={styles.lampPole} />
      <div className={`${styles.lampShade} ${isDark ? styles.glowing : ""}`} />
      <div className={`${styles.lampLight} ${isDark ? styles.visible : ""}`} />
    </button>
  );
}

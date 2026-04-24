import { BBMonogram } from "@/components/ui/BBMonogram";
import styles from "./Footer.module.scss";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const navLinks = ["Home", "Discover", "Privacy", "Terms"];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* --- Logo + Nav --- */}
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <BBMonogram className={styles.logo} />
            <div className={styles.brandText}>
              <span className={styles.title}>Booky Blinders</span>
              <span className={styles.subtitle}>Personal Library</span>
            </div>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            {navLinks.map((item) => (
              <a
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={styles.navLink}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* --- Copyright + Quote --- */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {currentYear} Booky Blinders. All rights reserved.
          </p>
          <p className={styles.quote}>
            “By order of the Booky Blinders”
          </p>
        </div>

      </div>
    </footer>
  );
}
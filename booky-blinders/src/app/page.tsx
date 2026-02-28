import HeroBrassSeal from "../components/HeroBrassSeal";
import styles from "./hero.module.scss";

export default function Home() {
  return (
    <main className={styles.showcase}>
      {/* Ambient floating particles */}
      <div className={styles.particles}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={styles.particle} />
        ))}
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Booky Blinders</h1>
        <div className={styles.divider} />
      </header>

      <section className={styles.sealContainer}>
        <div className={styles.sealFloat}>
          <div className={styles.sealWrapper}>
            <div className={styles.sealSvg}>
              <HeroBrassSeal />
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          By order of the Booky Blinders
        </p>
        <p className={styles.footerSub}>
          Personal Library Management &mdash; Est. 1920
        </p>
      </footer>
    </main>
  );
}

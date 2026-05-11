"use client";

import Link from "next/link";
import { BBMonogram } from "@/components/ui/BBMonogram";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./about.module.scss";

export default function AboutUsPage() {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  return (
    <main className={styles.aboutContainer}>
      <section className={styles.hero}>
        <BBMonogram className={styles.logo} />
        <h1>{t("about.title")}</h1>
        <p className={styles.subtitle}>By order of the Booky Blinders</p>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.card}>
          <h2>{t("about.mission")}</h2>
          <p>
            In an age of digital chaos, we provide order. Booky Blinders is not
            merely a tool; it is a sanctuary for the discerning reader. We
            believe that a personal library should be managed with the same
            precision and elegance as a family empire.
          </p>
          <p>
            No more lost titles. No more forgotten stories. Your books, your
            rules, under our protection.
          </p>
        </div>

        <div className={styles.teamGrid}>
          <div className={styles.card}>
            <h2>The Architect</h2>
            <div className={styles.memberInfo}>
              <h3>Mohini</h3>
              <span>Lead Fullstack Developer</span>
            </div>
            <p>
              The visionary behind the code. Responsible for the architecture,
              the security of the ledger, and the seamless experience of our
              members.
            </p>
          </div>

          <div className={styles.card}>
            <h2>The Advisors</h2>
            <div className={styles.memberInfo}>
              <h3>The Mentors</h3>
              <span>Strategic Support</span>
            </div>
            <p>
              Providing the technical wisdom and tactical guidance required to
              keep our infrastructure ahead of the rivals.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to join the family?</h2>
        <Link href="/login?mode=register">
          <Button variant="primary">Enlist Now</Button>
        </Link>
      </section>
    </main>
  );
}

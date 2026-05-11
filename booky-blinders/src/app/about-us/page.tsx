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
        <p className={styles.subtitle}>{t("about.subtitle")}</p>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.card}>
          <h2>{t("about.mission")}</h2>
          <p>{t("about.missionLong")}</p>
          <p>{t("about.missionContinued")}</p>
        </div>

        <div className={styles.teamGrid}>
          <div className={styles.card}>
            <h2>{t("about.team.architect")}</h2>
            <div className={styles.memberInfo}>
              <h3>{t("about.team.mohini")}</h3>
              <span>{t("about.team.leadDeveloper")}</span>
            </div>
            <p>{t("about.team.architectDesc")}</p>
          </div>

          <div className={styles.card}>
            <h2>{t("about.team.advisors")}</h2>
            <div className={styles.memberInfo}>
              <h3>{t("about.team.mentors")}</h3>
              <span>{t("about.team.strategicSupport")}</span>
            </div>
            <p>{t("about.team.advisorsDesc")}</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>{t("about.cta")}</h2>
        <Link href="/login?mode=register">
          <Button variant="primary">{t("about.enlist")}</Button>
        </Link>
      </section>
    </main>
  );
}

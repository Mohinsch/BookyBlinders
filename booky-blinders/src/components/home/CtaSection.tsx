"use client";

import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import { AuthCTA } from "@/components/ui/AuthCTA";
import styles from "./CtaSection.module.scss";

export function CtaSection() {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  return (
    <section className={styles.cta}>
      <h2>{t("cta.title")}</h2>
      <p>
        {t("cta.description")}
      </p>
      <AuthCTA variant="primary">{t("cta.ctaButton")}</AuthCTA>
    </section>
  );
}

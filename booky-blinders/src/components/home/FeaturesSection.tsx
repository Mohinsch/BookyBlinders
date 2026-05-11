"use client";

import { LayoutGrid, Library, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import SpotlightCard from "@/components/ui/SpotlightCard";
import styles from "./FeaturesSection.module.scss";

export function FeaturesSection() {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  return (
    <section className={styles.features}>
      <h2 className={styles.sectionTitle}>{t("features.sectionTitle")}</h2>

      <div className={styles.featureGrid}>
        <SpotlightCard className={styles.featureCard}>
          <Search className={styles.icon} size={28} />
          <h3>{t("features.items.0.title")}</h3>
          <p>
            {t("features.items.0.description")}
          </p>
        </SpotlightCard>

        <SpotlightCard className={styles.featureCard}>
          <Library className={styles.icon} size={28} />
          <h3>{t("features.items.1.title")}</h3>
          <p>
            {t("features.items.1.description")}
          </p>
        </SpotlightCard>

        <SpotlightCard className={styles.featureCard}>
          <LayoutGrid className={styles.icon} size={28} />
          <h3>{t("features.items.2.title")}</h3>
          <p>
            {t("features.items.2.description")}
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
}

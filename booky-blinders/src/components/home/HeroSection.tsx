// src/components/home/HeroSection.tsx

"use client";

import { motion, type Variants } from "framer-motion";
import { Search, Star } from "lucide-react";
import { AuthCTA } from "@/components/ui/AuthCTA";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import { useSearchStore } from "@/store/useSearchStore";
import BlurText from "../ui/BlurText";
import styles from "./HeroSection.module.scss";

export function HeroSection() {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
  const { openSearch } = useSearchStore();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.container}
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div className={styles.decorativeLine} variants={itemVariants}>
          <div className={styles.line} />
          <span>- Est.1920 -</span>
          <div className={styles.line} />
        </motion.div>

        <motion.div variants={itemVariants} className={styles.titleWrapper}>
          <BlurText
            text={t("hero.title")}
            delay={150}
            animateBy="letters"
            direction="top"
            className={`${styles.title} ${styles.whiteTitle}`}
          />
          <BlurText
            text={t("hero.yourRules")}
            delay={150}
            animateBy="letters"
            direction="top"
            className={`${styles.title} ${styles.rulesTitle}`}
          />
        </motion.div>

        <motion.p variants={itemVariants}>
          {t("hero.subtitle")}
        </motion.p>

        <motion.div className={styles.ctaContainer} variants={itemVariants}>
          <AuthCTA variant="primary">{t("hero.ctaButton")}</AuthCTA>
          <Button variant="outline" onClick={openSearch}>
            {t("hero.exploreBooks")} <Search size={16} />
          </Button>
        </motion.div>

        <motion.div className={styles.stats} variants={itemVariants}>
          <div className={styles.statItem}>
            <strong>10 M+</strong>
            <span>{t("hero.stats.books")}</span>
          </div>
          <div className={styles.statItem}>
            <strong>
              4.9 <Star size={20} className={styles.star} />
            </strong>
            <span>{t("hero.stats.rating")}</span>
          </div>
          <div className={styles.statItem}>
            <strong>Free</strong>
            <span>{t("hero.stats.forever")}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import TiltedCard from "@/components/ui/TiltedCard";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./ShowcaseSection.module.scss";

export function ShowcaseSection() {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  const books = [
    {
      title: t("showcase.books.0.title"),
      author: t("showcase.books.0.author"),
      quote: t("showcase.books.0.note"),
      rating: 5,
    },
    {
      title: t("showcase.books.1.title"),
      author: t("showcase.books.1.author"),
      quote: t("showcase.books.1.note"),
      rating: 5,
    },
  ];

  return (
    <section className={styles.showcase}>
      <div className={styles.imageColumn}>
        <TiltedCard
          imageSrc="/thomas-shelfy.jpg"
          altText="Thomas Shelfy"
          containerHeight="600px"
          containerWidth="100%"
          imageHeight="600px"
          imageWidth="500px"
          rotateAmplitude={12}
          scaleOnHover={1.03}
          showTooltip={false}
          displayOverlayContent={true}
        >
          <div className={styles.quoteOverlay}>
            <Quote size={20} className={styles.quoteIcon} />
            <blockquote>"{t("showcase.quote")}"</blockquote>
            <cite>{t("showcase.quoteCite")}</cite>
          </div>
        </TiltedCard>
      </div>

      <div className={styles.textColumn}>
        <span className={styles.label}>{t("showcase.collectionTitle")}</span>
        <h2>{t("showcase.title")}</h2>
        <p>{t("showcase.description")}</p>

        <div className={styles.showcaseList}>
          {books.map((book) => (
            <motion.div
              key={book.title}
              className={styles.showcaseItem}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: books.indexOf(book) * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.itemHeader}>
                <h4>{book.title}</h4>
                <div className={styles.stars}>
                  {[...Array(book.rating)].map((_, i) => (
                    <Star
                      key={`${book.title}-star-${i}`}
                      size={14}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
              <span className={styles.author}>{book.author}</span>
              <p>"{book.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import TiltedCard from "@/components/ui/TiltedCard";
import styles from "./ShowcaseSection.module.scss";

export function ShowcaseSection() {
  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      quote: "A masterpiece of the jazz age. The green light beckons us all.",
      rating: 5
    },
    {
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      quote: "The depths of human conscience, laid bare on every page.",
      rating: 5
    }
  ];

  return (
    <section className={styles.showcase}>
      <div className={styles.imageColumn}>
        <TiltedCard
          imageSrc="/thomas-shelfy.jpg"
          altText="Thomas Shelfy"
          containerHeight="600px" // Adjusted to match your original design
          containerWidth="100%"
          imageHeight="600px"     // Match containerHeight
          imageWidth="500px"      // Adjusted to match your original design
          rotateAmplitude={12}
          scaleOnHover={1.03}
          showTooltip={false}
          displayOverlayContent={true}
        >
          <div className={styles.quoteOverlay}>
            <Quote size={20} className={styles.quoteIcon} />
            <blockquote>"A man who reads lives a thousand lives before he dies."</blockquote>
            <cite>Thomas Shelfy</cite>
          </div>
        </TiltedCard>
      </div>

      <div className={styles.textColumn}>
        <span className={styles.label}>Thomas Shelfy's Collection</span>
        <h2>A gentleman's library</h2>
        <p>Every great mind curates their shelf with care. Here's a glimpse into one reader's world.</p>
        
        <div className={styles.showcaseList}>
          {books.map((book, index) => (
            <motion.div 
              key={index} 
              className={styles.showcaseItem}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.itemHeader}>
                <h4>{book.title}</h4>
                <div className={styles.stars}>
                  {[...Array(book.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
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
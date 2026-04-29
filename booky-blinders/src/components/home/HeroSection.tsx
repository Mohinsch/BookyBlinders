"use client";

import { motion, Variants } from "framer-motion";
import { Search, Star } from "lucide-react";
import styles from "./HeroSection.module.scss";
import BlurText from "../ui/BlurText";

export function HeroSection() {
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
        damping: 20 
      } 
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
          <span>EST. 1920</span>
          <div className={styles.line} />
        </motion.div>
        {/* --- BLUR TEXT INTEGRATION --- */}
        <motion.div variants={itemVariants} className={styles.titleWrapper}>
            <BlurText
            text="Your Books."
            delay={150}
            animateBy="letters"
            direction="top"
            className={`${styles.title} ${styles.gold}`}
            />

          <BlurText
            text="Your Rules."
            delay={150}
            animateBy="letters"
            direction="top"
            className={`${styles.title} ${styles.gold}`}
          />
        </motion.div>
        
        <motion.p variants={itemVariants}>
          A personal library for those who read with purpose. Search, collect, annotate, and curate your literary empire with the elegance it deserves.
        </motion.p>
        
        <motion.div className={styles.ctaContainer} variants={itemVariants}>
          <button className={styles.btnPrimary}>Start your collection</button>
          <button className={styles.btnOutline}>
            Explore Books <Search size={16} />
          </button>
        </motion.div>
        
        <motion.div className={styles.stats} variants={itemVariants}>
          <div className={styles.statItem}>
            <strong>10 M+</strong>
            <span>Books</span>
          </div>
          <div className={styles.statItem}>
            <strong>4.9 <Star size={20} className={styles.star} /></strong>
            <span>Rating</span>
          </div>
          <div className={styles.statItem}>
            <strong>Free</strong>
            <span>Forever</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
"use client";

import { Search, Library, LayoutGrid } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import styles from "./FeaturesSection.module.scss";

export function FeaturesSection() {
  return (
    <section className={styles.features}>
      <h2 className={styles.sectionTitle}>Everything a reader needs</h2>
      
      <div className={styles.featureGrid}>
        <SpotlightCard className={styles.featureCard}>
          <Search className={styles.icon} size={28} />
          <h3>Discover & Search</h3>
          <p>Explore millions of books. Our search engine uncovers every title, from forgotten classics to the latest releases.</p>
        </SpotlightCard>

        <SpotlightCard className={styles.featureCard}>
          <Library className={styles.icon} size={28} />
          <h3>Curate Your Shelf</h3>
          <p>Build your personal library with precision. Organize by genre, author, mood, or your own custom categories.</p>
        </SpotlightCard>

        <SpotlightCard className={styles.featureCard}>
          <LayoutGrid className={styles.icon} size={28} />
          <h3>Organise & Track</h3>
          <p>Track your reading progress, set goals, and maintain lists. From 'Currently Reading' to 'All-Time Favourites'.</p>
        </SpotlightCard>
      </div>
    </section>
  );
}
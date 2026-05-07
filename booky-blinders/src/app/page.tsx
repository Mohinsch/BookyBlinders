import { CtaSection } from "@/components/home/CtaSection";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { SEARCH_CONFIG } from "@/constants";
import { searchBooks } from "@/services/google-books";
import styles from "./page.module.scss";

export default async function HomePage() {
  const books = await searchBooks(
    SEARCH_CONFIG.INITIAL_QUERY,
    SEARCH_CONFIG.INITIAL_MAX_RESULTS,
  );

  return (
    <main className={styles.home}>
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <DiscoverSection initialBooks={books} />
      <CtaSection />
    </main>
  );
}

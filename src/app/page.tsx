import dynamic from "next/dynamic";

import { HeroSection } from "@/components/home/HeroSection";
import { SEARCH_CONFIG } from "@/constants";
import { getRandomBooks } from "@/services/google-books";
import type { GoogleBookItem } from "@/types/google-books";
import styles from "./page.module.scss";

// Lazy load below-the-fold sections for performance optimization
const FeaturesSection = dynamic(
  () =>
    import("@/components/home/FeaturesSection").then(
      (mod) => mod.FeaturesSection,
    ),
  { loading: () => null },
);
const ShowcaseSection = dynamic(
  () =>
    import("@/components/home/ShowcaseSection").then(
      (mod) => mod.ShowcaseSection,
    ),
  { loading: () => null },
);
const DiscoverSection = dynamic(
  () =>
    import("@/components/home/DiscoverSection").then(
      (mod) => mod.DiscoverSection,
    ),
  { loading: () => null },
);
const CtaSection = dynamic(
  () => import("@/components/home/CtaSection").then((mod) => mod.CtaSection),
  { loading: () => null },
);

export default async function HomePage() {
  let books: GoogleBookItem[] = [];
  try {
    books = await getRandomBooks(SEARCH_CONFIG.INITIAL_MAX_RESULTS);
  } catch (error) {
    console.error("Error loading initial books:", error);
  }

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

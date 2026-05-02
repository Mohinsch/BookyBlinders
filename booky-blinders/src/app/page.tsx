import { searchBooks } from "@/services/google-books";
import styles from "./page.module.scss";
import { HeroSection } from "@/components/home/HeroSection"; 
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { DiscoverSection } from "@/components/home/DiscoverSection";
import { CtaSection } from "@/components/home/CtaSection";

export default async function HomePage() {
  const books = await searchBooks("random", 12);

  return (
    <main className={styles.home}>
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <DiscoverSection initialBooks={books} />
      <CtaSection />

      <footer style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.5 }}>
        <p className="text-quote">By order of the Booky Blinders</p>
      </footer>
    </main>
  );
}
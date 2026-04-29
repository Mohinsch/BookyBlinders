import { searchBooks } from "@/services/google-books";
import Image from "next/image";
import { Search, Star, Library, LayoutGrid, Quote, BookOpen, ArrowRight } from "lucide-react";
import styles from "./page.module.scss";
import { HeroSection } from "@/components/home/HeroSection"; 
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";

export default async function HomePage() {
  // Fetch initial collection for the "Discover" section
  const books = await searchBooks("random", 12);

  return (
    <main className={styles.home}>
      
        <HeroSection />
        <FeaturesSection/>
        <ShowcaseSection/>

      {/* 🔹 Discover Section */}
      <section className={styles.discover}>
        <div className={styles.discoverHeader}>
          <h2 className={styles.sectionTitle}>Discover & Search</h2>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Explore Books" />
            <Search size={18} />
          </div>
        </div>
        
        {books.length === 0 ? (
          <p className={styles.author} style={{ textAlign: "center" }}>The archives are empty. Check your connection.</p>
        ) : (
          <div className={styles.bookGrid}>
            {books.map((book) => (
              <article key={book.id} className={styles.bookCard}>
                <div className={styles.coverWrapper}>
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img 
                      src={book.volumeInfo.imageLinks.thumbnail} 
                      alt={book.volumeInfo.title} 
                    />
                  ) : (
                    <div className={styles.placeholder}>No Cover</div>
                  )}
                </div>
                
                <h3>{book.volumeInfo.title}</h3>
                <p className={styles.author}>
                  {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 🔹 CTA Section */}
      <section className={styles.cta}>
        <h2>Begin your literary journey</h2>
        <p>Join the discerning readers who have chosen Booky Blinders as their personal library companion.</p>
        <button className={styles.btnPrimary}>
          Start your collection <ArrowRight size={18} />
        </button>
      </section>

      {/* 🔹 Footer mention as per requirements */}
      <footer style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.5 }}>
        <p className="text-quote">By order of the Booky Blinders</p>
      </footer>
    </main>
  );
}
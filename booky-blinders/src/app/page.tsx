import { searchBooks } from "@/services/google-books";
import Image from "next/image";
import { Search, Star, Library, LayoutGrid, Quote, BookOpen, ArrowRight } from "lucide-react";
import styles from "./page.module.scss";
import { HeroSection } from "@/components/home/HeroSection"; 
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default async function HomePage() {
  // Fetch initial collection for the "Discover" section
  const books = await searchBooks("random", 12);

  return (
    <main className={styles.home}>
      
        <HeroSection />
        <FeaturesSection/>

        
      {/* 🔹 Showcase Section (Thomas Shelfy) */}
      <section className={styles.showcase}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/thomas-shelfy.jpg" 
              alt="Thomas Shelfy" 
              width={500} 
              height={600} 
            />
            <div className={styles.quoteOverlay}>
              <Quote size={20} className={styles.quoteIcon} />
              <blockquote>"A man who reads lives a thousand lives before he dies."</blockquote>
              <cite>Thomas Shelfy</cite>
            </div>
          </div>
        </div>
        <div className={styles.textColumn}>
          <span className={styles.label}>Thomas Shelfy's Collection</span>
          <h2>A gentleman's library</h2>
          <p>Every great mind curates their shelf with care. Here's a glimpse into one reader's world.</p>
          
          <div className={styles.showcaseList}>
            <div className={styles.showcaseItem}>
              <div className={styles.itemHeader}>
                <h4>The Great Gatsby</h4>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
              <span className={styles.author}>F. Scott Fitzgerald</span>
              <p>"A masterpiece of the jazz age. The green light beckons us all."</p>
            </div>
            <div className={styles.showcaseItem}>
              <div className={styles.itemHeader}>
                <h4>Crime and Punishment</h4>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
              <span className={styles.author}>Fyodor Dostoevsky</span>
              <p>"The depths of human conscience, laid bare on every page."</p>
            </div>
          </div>
        </div>
      </section>

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
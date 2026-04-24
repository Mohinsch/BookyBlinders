import { searchBooks } from "@/services/google-books";
import styles from "./page.module.scss";

export default async function HomePage() {
  // Fetch initial collection for the "Discover" section
  const books = await searchBooks("classic literature", 12);

  return (
    <main className={styles.home}>
      {/* 🔹 Hero Section matching Moqups */}
      <section className={styles.hero}>
        <h1>
          Your Books. <br />
          <span>Your Rules.</span>
        </h1>
        <p>
          A personal library for those who read with purpose. Search, collect, 
          and curate your literary empire with the elegance it deserves.
        </p>
        <div className={styles.ctaContainer}>
          <button className="btn-primary">Start your collection</button>
        </div>
      </section>

      {/* 🔹 Discover Section */}
      <h2 className={styles.sectionTitle}>Discover & Search</h2>
      
      {books.length === 0 ? (
        <p className={styles.author}>The archives are empty. Check your connection.</p>
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

      {/* 🔹 Footer mention as per requirements */}
      <footer style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.5 }}>
        <p className="text-quote">By order of the Booky Blinders</p>
      </footer>
    </main>
  );
}
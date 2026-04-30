"use client";

import { Search } from "lucide-react";
import { BookCard } from "@/components/ui/BookCard";
import styles from "./DiscoverSection.module.scss";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface DiscoverSectionProps {
  initialBooks: Book[];
}

export function DiscoverSection({ initialBooks = [] }: DiscoverSectionProps) {
  return (
    <section className={styles.discover}>
      <div className={styles.discoverHeader}>
        <h2 className={styles.sectionTitle}>Discover & Search</h2>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Explore Books" />
          <Search size={18} />
        </div>
      </div>
      
      {!initialBooks || initialBooks.length === 0 ? (
        <p className={styles.emptyMessage}>The archives are empty.</p>
      ) : (
        <div className={styles.bookGrid}>
          {initialBooks.map((book) => (
            <BookCard 
              key={book.id}
              title={book.volumeInfo.title}
              authors={book.volumeInfo.authors}
              thumbnail={book.volumeInfo.imageLinks?.thumbnail}
            />
          ))}
        </div>
      )}
    </section>
  );
}
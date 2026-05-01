"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { searchBooksAction } from "@/actions/books";
import { BookCard } from "@/components/ui/BookCard";
import type { GoogleBookItem } from "@/types/google-books";
import styles from "./SearchModal.module.scss";

export function SearchModal() {
  const { isOpen, closeSearch } = useSearchStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const data = await searchBooksAction(query);
    setResults(data);
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={styles.modal}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button className={styles.closeBtn} onClick={closeSearch}>
              <X size={24} />
            </button>

            <form className={styles.searchBar} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className={styles.spinner} /> : <Search size={20} />}
              </button>
            </form>

            <div className={styles.resultsArea}>
              {results.length > 0 ? (
                <div className={styles.grid}>
                  {results.map((book) => (
                    <BookCard
                      key={book.id}
                      title={book.volumeInfo.title}
                      authors={book.volumeInfo.authors}
                      thumbnail={book.volumeInfo.imageLinks?.thumbnail}
                      onClick={() => {
                         // Future: Redirect to book details or add to library
                         console.log("Selected book:", book.id);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.placeholder}>
                  {query ? "No results found in the archives." : "Enter a title to begin the search."}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { searchBooksAction } from "@/actions/books";
import {
  addBookToLibrary,
  getOwnedGoogleBookIds,
  getUserLibraries,
} from "@/actions/library";
import { BookCard } from "@/components/ui/BookCard";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import { useSearchStore } from "@/store/useSearchStore";
import type { GoogleBookItem } from "@/types/google-books";
import type { UserLibrarySummary } from "@/types/library";
import styles from "./SearchModal.module.scss";

export function SearchModal() {
  const { isOpen, closeSearch } = useSearchStore();
  const { data: session } = authClient.useSession();
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableLibraries, setAvailableLibraries] = useState<
    UserLibrarySummary[]
  >([]);
  const [ownedGoogleIds, setOwnedGoogleIds] = useState<string[]>([]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeSearch]);

  useEffect(() => {
    const loadLibraries = async () => {
      if (!isOpen || !session?.user) return;
      const libraries = await getUserLibraries();
      const ownedIds = await getOwnedGoogleBookIds();
      setAvailableLibraries(libraries);
      setOwnedGoogleIds(ownedIds);
    };

    void loadLibraries();
  }, [isOpen, session?.user]);

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
            <button
              type="button"
              className={styles.closeBtn}
              onClick={closeSearch}
            >
              <X size={24} />
            </button>

            <form className={styles.searchBar} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading}
                aria-label={t("search.close")}
              >
                {isLoading ? (
                  <Loader2 className={styles.spinner} />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </form>

            <div className={styles.resultsArea}>
              {results.length > 0 ? (
                <div className={styles.grid}>
                  {results.map((book) => (
                    <BookCard
                      key={book.id}
                      bookId={book.id}
                      title={book.volumeInfo.title}
                      authors={book.volumeInfo.authors}
                      thumbnail={book.volumeInfo.imageLinks?.thumbnail}
                      isOwned={ownedGoogleIds.includes(book.id)}
                      availableLibraries={availableLibraries}
                      onAddToLibrary={async (libraryId) => {
                        const result = await addBookToLibrary(
                          book.id,
                          libraryId,
                        );
                        if (!result.success) return;
                        setOwnedGoogleIds((prev) =>
                          prev.includes(book.id) ? prev : [...prev, book.id],
                        );
                      }}
                      onClick={() => {
                        // Future: Redirect to book details or add to library
                        console.log("Selected book:", book.id);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.placeholder}>
                  {query ? t("search.noResults") : t("search.enterSearch")}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

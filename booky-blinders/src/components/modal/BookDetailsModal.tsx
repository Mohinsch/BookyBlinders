"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  addBookToLibrary,
  getOwnedGoogleBookIds,
  getUserLibraries,
} from "@/actions/library";
import type { BookDetailsViewModel } from "@/lib/book-details";
import { authClient } from "@/lib/auth-client";
import type { UserLibrarySummary } from "@/types/library";
import { BookCardActionButton } from "@/components/ui/BookCardActionButton";
import styles from "./BookDetailsModal.module.scss";

interface BookDetailsModalProps {
  bookDetails: BookDetailsViewModel;
}

export function BookDetailsModal({ bookDetails }: BookDetailsModalProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [availableLibraries, setAvailableLibraries] = useState<
    UserLibrarySummary[]
  >([]);
  const [ownedGoogleIds, setOwnedGoogleIds] = useState<string[]>([]);

  useEffect(() => {
    const loadLibraries = async () => {
      if (!session?.user) return;
      const libraries = await getUserLibraries();
      const ownedIds = await getOwnedGoogleBookIds();
      setAvailableLibraries(libraries);
      setOwnedGoogleIds(ownedIds);
    };

    void loadLibraries();
  }, [session?.user?.id]);

  const isOwned = bookDetails.googleId
    ? ownedGoogleIds.includes(bookDetails.googleId)
    : false;

  const handleAddToLibrary = useCallback(
    async (libraryId: number) => {
      if (!bookDetails.googleId) return;
      const googleId = bookDetails.googleId;
      const result = await addBookToLibrary(googleId, libraryId);
      if (!result.success) return;
      setOwnedGoogleIds((prev) =>
        prev.includes(googleId) ? prev : [...prev, googleId],
      );
    },
    [bookDetails.googleId],
  );

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => router.back()}
        role="presentation"
      >
        <motion.div
          className={styles.modalContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => router.back()}
            aria-label="Close book details"
          >
            <X size={24} />
          </button>

          <div className={styles.content}>
            <div className={styles.coverSection}>
              {bookDetails.cover ? (
                <Image
                  src={bookDetails.cover}
                  alt={`Cover of ${bookDetails.title}`}
                  className={styles.coverImage}
                  width={300}
                  height={400}
                  priority
                />
              ) : (
                <div className={styles.coverPlaceholder}>
                  <span>No Cover</span>
                </div>
              )}
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.header}>
                <div className={styles.titleRow}>
                  <h1 className={styles.title}>{bookDetails.title}</h1>
                  <div className={styles.titleActionButton}>
                    <BookCardActionButton
                      showActions
                      isOwned={isOwned}
                      availableLibraries={availableLibraries}
                      onAddToLibrary={handleAddToLibrary}
                      isModal={true}
                    />
                  </div>
                </div>
                <p className={styles.authors}>
                  {bookDetails.authors.length > 0
                    ? bookDetails.authors.join(", ")
                    : "Unknown Author"}
                </p>
              </div>

              {(bookDetails.publisher ||
                bookDetails.publishedDate ||
                bookDetails.pageCount ||
                bookDetails.isbn) && (
                <div className={styles.metadata}>
                  {bookDetails.publisher && (
                    <div className={styles.metadataRow}>
                      <label>Publisher:</label>
                      <span>{bookDetails.publisher}</span>
                    </div>
                  )}
                  {bookDetails.publishedDate && (
                    <div className={styles.metadataRow}>
                      <label>Published:</label>
                      <span>{bookDetails.publishedDate}</span>
                    </div>
                  )}
                  {bookDetails.pageCount && (
                    <div className={styles.metadataRow}>
                      <label>Pages:</label>
                      <span>{bookDetails.pageCount}</span>
                    </div>
                  )}
                  {bookDetails.isbn && (
                    <div className={styles.metadataRow}>
                      <label>ISBN:</label>
                      <span>{bookDetails.isbn}</span>
                    </div>
                  )}
                </div>
              )}

              {bookDetails.categories.length > 0 && (
                <div className={styles.categories}>
                  <div className={styles.categoriesLabel}>Categories</div>
                  <div className={styles.categoryTags}>
                    {bookDetails.categories.map((category) => (
                      <span key={category} className={styles.categoryTag}>
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.descriptionSection}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.description}>
                  {bookDetails.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

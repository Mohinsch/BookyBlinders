"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { addBookToLibrary } from "@/actions/library";
import { BookCardActionButton } from "@/components/ui/BookCardActionButton";
import { ANIMATIONS, SIZES, UI_TEXT } from "@/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLibraryOwnership } from "@/hooks/useLibraryOwnership";
import type { BookDetailsViewModel } from "@/types/book-details";
import styles from "./BookDetailsModal.module.scss";

interface BookDetailsModalProps {
  bookDetails: BookDetailsViewModel;
}

export function BookDetailsModal({ bookDetails }: BookDetailsModalProps) {
  const router = useRouter();
  const { availableLibraries, ownedGoogleIds, markOwned } =
    useLibraryOwnership(true);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(true, modalRef);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const isOwned = bookDetails.googleId
    ? ownedGoogleIds.includes(bookDetails.googleId)
    : false;

  const handleAddToLibrary = useCallback(
    async (libraryId: number) => {
      if (!bookDetails.googleId) return;
      const googleId = bookDetails.googleId;
      const result = await addBookToLibrary(googleId, libraryId);
      if (!result.success) return;
      markOwned(googleId);
    },
    [bookDetails.googleId, markOwned],
  );

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={ANIMATIONS.MODAL.OVERLAY_INITIAL}
        animate={ANIMATIONS.MODAL.OVERLAY_ANIMATE}
        exit={ANIMATIONS.MODAL.OVERLAY_EXIT}
        onClick={() => router.back()}
        role="presentation"
      >
        <motion.div
          className={styles.modalContainer}
          initial={ANIMATIONS.MODAL.CONTAINER_INITIAL}
          animate={ANIMATIONS.MODAL.CONTAINER_ANIMATE}
          exit={ANIMATIONS.MODAL.CONTAINER_EXIT}
          transition={ANIMATIONS.MODAL.CONTAINER_TRANSITION}
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-details-title"
          tabIndex={-1}
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => router.back()}
            aria-label={UI_TEXT.MODAL.CLOSE_TITLE}
          >
            <X size={SIZES.ICONS.LARGE} />
          </button>

          <div className={styles.content}>
            <div className={styles.coverSection}>
              {bookDetails.cover ? (
                <Image
                  src={bookDetails.cover}
                  alt={`Cover of ${bookDetails.title}`}
                  className={styles.coverImage}
                  width={SIZES.IMAGES.BOOK_MODAL.WIDTH}
                  height={SIZES.IMAGES.BOOK_MODAL.HEIGHT}
                  priority
                  quality={SIZES.IMAGES.BOOK_MODAL.QUALITY}
                />
              ) : (
                <div className={styles.coverPlaceholder}>
                  <span>{UI_TEXT.BOOK.NO_COVER}</span>
                </div>
              )}
            </div>

            <div className={styles.detailsSection}>
              <div className={styles.header}>
                <div className={styles.titleRow}>
                  <h1 id="book-details-title" className={styles.title}>
                    {bookDetails.title}
                  </h1>
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
                    : UI_TEXT.AUTHOR.UNKNOWN}
                </p>
              </div>

              {(bookDetails.publisher ||
                bookDetails.publishedDate ||
                bookDetails.pageCount ||
                bookDetails.isbn) && (
                <div className={styles.metadata}>
                  {bookDetails.publisher && (
                    <div className={styles.metadataRow}>
                      <span className={styles.label}>
                        {UI_TEXT.MODAL.PUBLISHER_LABEL}
                      </span>
                      <span>{bookDetails.publisher}</span>
                    </div>
                  )}
                  {bookDetails.publishedDate && (
                    <div className={styles.metadataRow}>
                      <span className={styles.label}>
                        {UI_TEXT.MODAL.PUBLISHED_LABEL}
                      </span>
                      <span>{bookDetails.publishedDate}</span>
                    </div>
                  )}
                  {bookDetails.pageCount && (
                    <div className={styles.metadataRow}>
                      <span className={styles.label}>
                        {UI_TEXT.MODAL.PAGES_LABEL}
                      </span>
                      <span>{bookDetails.pageCount}</span>
                    </div>
                  )}
                  {bookDetails.isbn && (
                    <div className={styles.metadataRow}>
                      <span className={styles.label}>
                        {UI_TEXT.MODAL.ISBN_LABEL}
                      </span>
                      <span>{bookDetails.isbn}</span>
                    </div>
                  )}
                </div>
              )}

              {bookDetails.categories.length > 0 && (
                <div className={styles.categories}>
                  <div className={styles.categoriesLabel}>
                    {UI_TEXT.MODAL.CATEGORIES_LABEL}
                  </div>
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
                <h2 className={styles.sectionTitle}>
                  {UI_TEXT.MODAL.ABOUT_SECTION}
                </h2>
                <p className={styles.description}>{bookDetails.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

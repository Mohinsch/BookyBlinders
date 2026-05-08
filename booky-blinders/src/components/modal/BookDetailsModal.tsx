"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  addBookToLibrary,
  getOwnedGoogleBookIds,
  getUserLibraries,
} from "@/actions/library";
import { BookCardActionButton } from "@/components/ui/BookCardActionButton";
import { ANIMATIONS, UI_TEXT } from "@/constants";
import { authClient } from "@/lib/auth-client";
import type { BookDetailsViewModel } from "@/lib/book-details";
import type { UserLibrarySummary } from "@/types/library";
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
  }, [session?.user?.id, session?.user]);

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
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => router.back()}
            aria-label={UI_TEXT.MODAL.CLOSE_TITLE}
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
                  <span>{UI_TEXT.BOOK.NO_COVER}</span>
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

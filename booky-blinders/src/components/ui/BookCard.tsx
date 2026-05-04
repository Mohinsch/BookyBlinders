"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReadingStatus } from "@/types/library";
import {
  BookCardActionButton,
  type LibraryOption,
} from "./BookCardActionButton";
import styles from "./BookCard.module.scss";

interface BookCardProps {
  title: string;
  authors?: string[];
  thumbnail?: string;
  bookId?: string;
  onClick?: () => void;
  showActions?: boolean;
  availableLibraries?: LibraryOption[];
  onAddToLibrary?: (libraryId: number) => void;
  readingStatus?: ReadingStatus;
  showReadingControls?: boolean;
  onReadingStatusChange?: (status: ReadingStatus) => void;
  onRemoveFromLibrary?: () => void;
  isOwned?: boolean;
}

export function BookCard({
  title,
  authors,
  thumbnail,
  bookId,
  onClick,
  showActions = true,
  availableLibraries = [],
  onAddToLibrary,
  readingStatus = "TO_READ",
  showReadingControls = false,
  onReadingStatusChange,
  onRemoveFromLibrary,
  isOwned = false,
}: BookCardProps) {
  const router = useRouter();
  const [isLibrarySelectOpen, setIsLibrarySelectOpen] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (bookId) {
      router.push(`/books/${bookId}`);
    }
  };

  const isClickable = !isLibrarySelectOpen;

  return (
    <article
      className={`${styles.bookCard} ${isOwned ? styles.ownedCard : ""}`}
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }
          : undefined
      }
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className={styles.coverWrapper}>
        {thumbnail ? (
          <img src={thumbnail} alt={`Cover of ${title}`} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <span>Missing Cover</span>
          </div>
        )}

        <BookCardActionButton
          showActions={showActions}
          isOwned={isOwned}
          availableLibraries={availableLibraries}
          onAddToLibrary={onAddToLibrary}
          onLibrarySelectOpenChange={setIsLibrarySelectOpen}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.title} title={title}>
          {title}
        </h3>
        <p className={styles.author} title={authors?.join(", ")}>
          {authors?.join(", ") || "Unknown Author"}
        </p>
        {showReadingControls && (
          <div className={styles.readingControls}>
            <select
              value={readingStatus}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                onReadingStatusChange?.(e.target.value as ReadingStatus)
              }
            >
              <option value="TO_READ">To Read</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="READ">Read</option>
            </select>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromLibrary?.();
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

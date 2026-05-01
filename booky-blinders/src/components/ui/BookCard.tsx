"use client";

import { Check, LogIn, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { ReadingStatus } from "@/types/library";
import styles from "./BookCard.module.scss";

export interface LibraryOption {
  id: number;
  name: string;
}

interface BookCardProps {
  title: string;
  authors?: string[];
  thumbnail?: string;
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
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const [showLibrarySelect, setShowLibrarySelect] = useState(false);
  const isClickable = !!onClick && !showLibrarySelect;

  useEffect(() => {
    if (isOwned) {
      setShowLibrarySelect(false);
    }
  }, [isOwned]);

  return (
    <article
      className={`${styles.bookCard} ${isOwned ? styles.ownedCard : ""}`}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
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

        {showActions && (
          <div className={styles.actionOverlay}>
            {isPending ? (
              <div
                className={styles.actionBtn}
                style={{ opacity: 0, cursor: "default" }}
              />
            ) : isAuthenticated ? (
              isOwned ? (
                <div
                  className={`${styles.actionBtn} ${styles.actionBtnOwned}`}
                  title="Already in your Ledger"
                >
                  <Check size={18} />
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLibrarySelect(!showLibrarySelect);
                  }}
                  title="Add to Library"
                >
                  {showLibrarySelect ? <X size={20} /> : <Plus size={20} />}
                </button>
              )
            ) : (
              <Link
                href="/login"
                className={styles.actionBtn}
                title="Login to add"
                onClick={(e) => e.stopPropagation()}
              >
                <LogIn size={20} />
              </Link>
            )}
          </div>
        )}

        {showLibrarySelect && isAuthenticated && !isPending && !isOwned && (
          <div className={styles.libraryDropdown}>
            <span className={styles.dropdownTitle}>Select Library</span>
            <ul className={styles.libraryList}>
              {availableLibraries.length > 0 ? (
                availableLibraries.map((lib) => (
                  <li key={lib.id}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToLibrary?.(lib.id);
                        setShowLibrarySelect(false);
                      }}
                    >
                      {lib.name}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToLibrary?.(0);
                      setShowLibrarySelect(false);
                    }}
                  >
                    My Collection (Default)
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
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

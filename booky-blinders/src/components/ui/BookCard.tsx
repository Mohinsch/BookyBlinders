"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LogIn, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
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
}

export function BookCard({ 
  title, 
  authors, 
  thumbnail, 
  onClick, 
  showActions = true,
  availableLibraries = [],
  onAddToLibrary 
}: BookCardProps) {
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const [showLibrarySelect, setShowLibrarySelect] = useState(false);

  return (
    <article className={styles.bookCard} onClick={showLibrarySelect ? undefined : onClick}>
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
              <div className={styles.actionBtn} style={{ opacity: 0, cursor: "default" }} />
            ) : isAuthenticated ? (
              <button 
                className={styles.actionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLibrarySelect(!showLibrarySelect);
                }}
                title="Add to Library"
              >
                {showLibrarySelect ? <X size={20} /> : <Plus size={20} />}
              </button>
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

        {showLibrarySelect && isAuthenticated && !isPending && (
          <div className={styles.libraryDropdown} onClick={(e) => e.stopPropagation()}>
            <span className={styles.dropdownTitle}>Select Library</span>
            <ul className={styles.libraryList}>
              {availableLibraries.length > 0 ? (
                availableLibraries.map((lib) => (
                  <li 
                    key={lib.id} 
                    onClick={() => {
                      onAddToLibrary?.(lib.id);
                      setShowLibrarySelect(false);
                    }}
                  >
                    {lib.name}
                  </li>
                ))
              ) : (
                <li 
                  onClick={() => {
                    onAddToLibrary?.(0); 
                    setShowLibrarySelect(false);
                  }}
                >
                  My Collection (Default)
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
      </div>
    </article>
  );
}
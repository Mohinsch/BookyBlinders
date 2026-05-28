"use client";

import { Check, LogIn, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ROUTES, UI_TEXT } from "@/constants";
import { authClient } from "@/lib/auth-client";
import styles from "./BookCard.module.scss";

export interface LibraryOption {
  id: number;
  name: string;
}

interface BookCardActionButtonProps {
  showActions?: boolean;
  isOwned?: boolean;
  availableLibraries?: LibraryOption[];
  onAddToLibrary?: (libraryId: number) => void;
  onLibrarySelectOpenChange?: (isOpen: boolean) => void;
  isModal?: boolean;
}

export function BookCardActionButton({
  showActions = true,
  isOwned = false,
  availableLibraries = [],
  onAddToLibrary,
  onLibrarySelectOpenChange,
  isModal = false,
}: BookCardActionButtonProps) {
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const [showLibrarySelect, setShowLibrarySelect] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOwned) {
      setShowLibrarySelect(false);
    }
  }, [isOwned]);

  useEffect(() => {
    onLibrarySelectOpenChange?.(showLibrarySelect);
  }, [onLibrarySelectOpenChange, showLibrarySelect]);

  if (!showActions) return null;

  return (
    <>
      <div className={styles.actionOverlay}>
        {!isMounted || isPending ? (
          <div
            className={styles.actionBtn}
            style={{ opacity: 0, cursor: "default" }}
          />
        ) : isAuthenticated ? (
          isOwned ? (
            <div
              className={`${styles.actionBtn} ${styles.actionBtnOwned}`}
              title={UI_TEXT.BUTTON.ALREADY_OWNED}
            >
              <Check size={18} />
            </div>
          ) : (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowLibrarySelect((prev) => !prev);
              }}
              title={UI_TEXT.BUTTON.ADD_TO_LIBRARY}
            >
              {showLibrarySelect ? <X size={20} /> : <Plus size={20} />}
            </button>
          )
        ) : (
          <a
            href={ROUTES.LOGIN}
            className={styles.actionBtn}
            title={UI_TEXT.BUTTON.LOGIN_TO_ADD}
            onClick={(e) => e.stopPropagation()}
          >
            <LogIn size={20} />
          </a>
        )}
      </div>

      {showLibrarySelect && isAuthenticated && !isPending && !isOwned && (
        <div
          className={`${styles.libraryDropdown} ${
            isModal ? styles.libraryDropdownModal : ""
          }`}
        >
          <span className={styles.dropdownTitle}>
            {UI_TEXT.BUTTON.SELECT_LIBRARY}
          </span>
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
                  {UI_TEXT.BUTTON.DEFAULT_LIBRARY}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}

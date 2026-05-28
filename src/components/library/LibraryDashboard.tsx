"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookPlus,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createLibrary,
  deleteLibrary,
  getUserLibraries,
  getUserLibrary,
  removeBookFromLibrary,
  renameLibrary,
  updateReadingStatus,
} from "@/actions/library";
import { BookCard } from "@/components/ui/BookCard";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useI18n } from "@/lib/i18n";
import { getReadingStatus } from "@/lib/library-status";
import { useLocaleContext } from "@/lib/locale-context";
import { useSearchStore } from "@/store/useSearchStore";
import type {
  ReadingStatus,
  UserLibraryBook,
  UserLibrarySummary,
} from "@/types/library";
import styles from "./LibraryDashboard.module.scss";
import { LibraryTable } from "./LibraryTable";

type SortCriterion = "addedAt" | "title" | "author";
type ViewMode = "grid" | "list";

interface LibraryDashboardProps {
  initialBooks: UserLibraryBook[];
  libraries: UserLibrarySummary[];
}

export function LibraryDashboard({
  initialBooks,
  libraries,
}: LibraryDashboardProps) {
  const router = useRouter();
  const { openSearch } = useSearchStore();

  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<SortCriterion>("addedAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLibraryId, setCurrentLibraryId] = useState<number>(
    libraries[0]?.id || 0,
  );
  const [userLibraries, setUserLibraries] =
    useState<UserLibrarySummary[]>(libraries);
  const [books, setBooks] = useState<UserLibraryBook[]>(initialBooks);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const libraryModalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(isLibraryModalOpen, libraryModalRef);
  const [libraryName, setLibraryName] = useState("");
  const [libraryAction, setLibraryAction] = useState<"create" | "rename">(
    "create",
  );

  useEffect(() => {
    if (userLibraries.length === 0) {
      setCurrentLibraryId(0);
      return;
    }

    if (!userLibraries.some((lib) => lib.id === currentLibraryId)) {
      setCurrentLibraryId(userLibraries[0].id);
    }
  }, [currentLibraryId, userLibraries]);

  useEffect(() => {
    const loadBooks = async () => {
      if (!currentLibraryId) {
        setBooks([]);
        return;
      }
      const freshBooks = await getUserLibrary(currentLibraryId);
      setBooks(freshBooks);
    };

    void loadBooks();
  }, [currentLibraryId]);

  const refreshLibraries = async () => {
    router.refresh();
    const nextLibraries = await getUserLibraries();
    setUserLibraries(nextLibraries);
  };

  const handleOpenCreateModal = () => {
    setLibraryAction("create");
    setLibraryName("");
    setIsLibraryModalOpen(true);
    setIsSettingsOpen(false);
  };

  const handleOpenRenameModal = () => {
    const currentLibrary = userLibraries.find(
      (lib) => lib.id === currentLibraryId,
    );
    if (!currentLibrary) return;

    setLibraryAction("rename");
    setLibraryName(currentLibrary.name);
    setIsLibraryModalOpen(true);
    setIsSettingsOpen(false);
  };

  const handleSubmitLibrary = async () => {
    const trimmedName = libraryName.trim();
    if (!trimmedName) return;

    const result =
      libraryAction === "create"
        ? await createLibrary(trimmedName)
        : await renameLibrary(currentLibraryId, trimmedName);

    if (!result.success) return;

    setIsLibraryModalOpen(false);
    setLibraryName("");
    await refreshLibraries();
  };

  const handleDeleteLibrary = async () => {
    if (!currentLibraryId) return;

    const result = await deleteLibrary(currentLibraryId);
    if (!result.success) return;

    setIsSettingsOpen(false);
    await refreshLibraries();
  };

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    if (statusFilter !== "ALL") {
      result = result.filter((b) => getReadingStatus(b) === statusFilter);
    }

    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (normalizedSearch) {
      result = result.filter((book) => {
        const title = book.title.toLowerCase();
        const author = (book.author || "").toLowerCase();
        return (
          title.includes(normalizedSearch) || author.includes(normalizedSearch)
        );
      });
    }

    return result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author")
        return (a.author || "").localeCompare(b.author || "");
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }, [books, statusFilter, sortBy, searchQuery]);

  const handleStatusChange = async (bookId: number, status: ReadingStatus) => {
    const result = await updateReadingStatus(bookId, status, currentLibraryId);
    if (!result.success) return;
    const freshBooks = await getUserLibrary(currentLibraryId);
    setBooks(freshBooks);
  };

  const handleRemove = async (bookId: number) => {
    const result = await removeBookFromLibrary(bookId, currentLibraryId);
    if (!result.success) return;
    const freshBooks = await getUserLibrary(currentLibraryId);
    setBooks(freshBooks);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.controls}>
        <div className={styles.libraryCluster}>
          <div className={styles.librarySelector}>
            <select
              value={currentLibraryId}
              onChange={(e) => setCurrentLibraryId(Number(e.target.value))}
            >
              {userLibraries.map((lib) => (
                <option key={lib.id} value={lib.id}>
                  {lib.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className={styles.icon} />
          </div>

          <button
            type="button"
            className={styles.iconActionBtn}
            onClick={handleOpenCreateModal}
            title={t("library.addBook")}
          >
            <Plus size={16} />
          </button>

          <div className={styles.settingsMenuWrap}>
            <button
              type="button"
              className={styles.iconActionBtn}
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              title={t("library.filter")}
            >
              <Settings size={15} />
            </button>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  className={styles.settingsMenu}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                >
                  <button type="button" onClick={handleOpenRenameModal}>
                    {t("common.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteLibrary()}
                  >
                    {t("common.delete")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchField}>
            <Search size={14} />
            <input
              type="text"
              placeholder={t("library.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={styles.addBookBtn}
            onClick={openSearch}
          >
            <BookPlus size={14} />
            {t("library.addBook")}
          </button>

          <div className={styles.selectWrapper}>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ReadingStatus | "ALL")
              }
            >
              <option value="ALL">{t("common.noResults")}</option>
              <option value="TO_READ">{t("library.toRead")}</option>
              <option value="IN_PROGRESS">{t("library.reading")}</option>
              <option value="READ">{t("library.completed")}</option>
            </select>
            <ChevronDown size={14} className={styles.icon} />
          </div>

          <div className={styles.selectWrapper}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortCriterion)}
            >
              <option value="addedAt">{t("library.sort")}</option>
              <option value="title">A-Z</option>
              <option value="author">Author</option>
            </select>
            <ChevronDown size={14} className={styles.icon} />
          </div>

          <div className={styles.viewToggle}>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? styles.active : ""}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? styles.active : ""}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {filteredAndSortedBooks.length === 0 ? (
          <p className={styles.emptyState}>{t("library.empty")}</p>
        ) : viewMode === "grid" ? (
          <div className={styles.grid}>
            {filteredAndSortedBooks.map((book) => (
              <BookCard
                key={book.id}
                bookId={book.googleId || String(book.id)}
                title={book.title}
                authors={book.author ? [book.author] : []}
                thumbnail={book.cover || undefined}
                showActions={false}
                showReadingControls
                readingStatus={getReadingStatus(book)}
                onReadingStatusChange={(status) =>
                  void handleStatusChange(book.id, status)
                }
                onRemoveFromLibrary={() => void handleRemove(book.id)}
              />
            ))}
          </div>
        ) : (
          <LibraryTable
            data={filteredAndSortedBooks}
            onStatusChange={handleStatusChange}
            onRemove={handleRemove}
          />
        )}
      </div>

      <AnimatePresence>
        {isLibraryModalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              ref={libraryModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="library-modal-title"
              tabIndex={-1}
            >
              <h3 id="library-modal-title">
                {libraryAction === "create"
                  ? t("library.addBook")
                  : t("common.edit")}
              </h3>
              <input
                type="text"
                value={libraryName}
                onChange={(e) => setLibraryName(e.target.value)}
                placeholder={t("library.title")}
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsLibraryModalOpen(false)}
                >
                  {t("accountSettings.cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleSubmitLibrary()}
                >
                  {t("accountSettings.save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

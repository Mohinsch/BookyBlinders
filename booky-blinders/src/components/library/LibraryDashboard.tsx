"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List as ListIcon, ChevronDown } from "lucide-react";
import type { UserLibraryBook, ReadingStatus } from "@/types/library";
import { BookCard, type LibraryOption } from "@/components/ui/BookCard";
import { LibraryTable } from "./LibraryTable";
import styles from "./LibraryDashboard.module.scss";

type SortCriterion = "addedAt" | "title" | "author";
type ViewMode = "grid" | "list";

interface LibraryDashboardProps {
  initialBooks: UserLibraryBook[];
  libraries: LibraryOption[];
}

const getStatus = (book: UserLibraryBook): ReadingStatus => {
  if (book.readEnd) return "READ";
  if (book.readStart) return "IN_PROGRESS";
  return "TO_READ";
};

export function LibraryDashboard({ initialBooks, libraries }: LibraryDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortCriterion>("addedAt");
  const [currentLibraryId, setCurrentLibraryId] = useState<number>(libraries[0]?.id || 0);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...initialBooks];

    if (statusFilter !== "ALL") {
      result = result.filter((b) => getStatus(b) === statusFilter);
    }

    return result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return (a.author || "").localeCompare(b.author || "");
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }, [initialBooks, statusFilter, sortBy]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.controls}>
        <div className={styles.librarySelector}>
          <select 
            value={currentLibraryId} 
            onChange={(e) => setCurrentLibraryId(Number(e.target.value))}
          >
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>{lib.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className={styles.icon} />
        </div>

        <div className={styles.filters}>
          <div className={styles.selectWrapper}>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as ReadingStatus | "ALL")}
            >
              <option value="ALL">All Status</option>
              <option value="TO_READ">To Read</option>
              <option value="IN_PROGRESS">Reading</option>
              <option value="READ">Finished</option>
            </select>
            <ChevronDown size={14} className={styles.icon} />
          </div>

          <div className={styles.selectWrapper}>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as SortCriterion)}
            >
              <option value="addedAt">Recent</option>
              <option value="title">A-Z</option>
              <option value="author">Author</option>
            </select>
            <ChevronDown size={14} className={styles.icon} />
          </div>

          <div className={styles.viewToggle}>
            <button 
              onClick={() => setViewMode("grid")} 
              className={viewMode === "grid" ? styles.active : ""}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
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
          <p className={styles.emptyState}>No books found for this selection.</p>
        ) : viewMode === "grid" ? (
          <div className={styles.grid}>
            {filteredAndSortedBooks.map((book) => (
              <BookCard 
                key={book.id} 
                title={book.title} 
                authors={book.author ? [book.author] : []} 
                thumbnail={book.cover || undefined} 
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <LibraryTable data={filteredAndSortedBooks} />
        )}
      </div>
    </div>
  );
}
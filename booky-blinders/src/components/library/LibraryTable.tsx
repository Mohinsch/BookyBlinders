"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import type { ReadingStatus, UserLibraryBook } from "@/types/library";
import styles from "./LibraryTable.module.scss";

const columnHelper = createColumnHelper<UserLibraryBook>();

const getStatus = (book: UserLibraryBook): ReadingStatus => {
  if (book.readEnd) return "READ";
  if (book.readStart) return "IN_PROGRESS";
  return "TO_READ";
};

interface LibraryTableProps {
  data: UserLibraryBook[];
  onStatusChange: (bookId: number, status: ReadingStatus) => void;
  onRemove: (bookId: number) => void;
}

export function LibraryTable({
  data,
  onStatusChange,
  onRemove,
}: LibraryTableProps) {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  const columns = useMemo(
    () => [
      columnHelper.accessor("cover", {
        header: "",
        cell: (info) => (
          <div className={styles.coverCell}>
            {info.getValue() ? (
              <Image
                src={info.getValue() || ""}
                alt="Book cover"
                width={60}
                height={90}
                className={styles.coverImage}
                sizes="60px"
                quality={75}
              />
            ) : (
              <div className={styles.placeholder} />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("title", {
        header: t("bookDetails.title"),
        cell: (info) => (
          <span className={styles.bookTitle}>{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("author", {
        header: t("bookDetails.author"),
        cell: (info) => (
          <span className={styles.author}>{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor((row) => getStatus(row), {
        id: "status",
        header: t("bookDetails.title"),
        cell: (info) => {
          const status = info.getValue();
          const currentBook = info.row.original;
          return (
            <select
              className={`${styles.badge} ${styles[status.toLowerCase()]}`}
              value={status}
              onChange={(e) =>
                onStatusChange(currentBook.id, e.target.value as ReadingStatus)
              }
            >
              <option value="TO_READ">{t("library.toRead")}</option>
              <option value="IN_PROGRESS">{t("library.reading")}</option>
              <option value="READ">{t("library.completed")}</option>
            </select>
          );
        },
      }),
      columnHelper.accessor("addedAt", {
        header: t("bookDetails.published"),
        cell: (info) => (
          <span className={styles.date}>
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(info.row.original.id)}
          >
            {t("common.delete")}
          </button>
        ),
      }),
    ],
    [t, onStatusChange, onRemove],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.libraryTable}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

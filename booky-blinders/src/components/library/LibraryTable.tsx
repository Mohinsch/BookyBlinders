"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
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
  const columns = useMemo(
    () => [
      columnHelper.accessor("cover", {
        header: "",
        cell: (info) => (
          <div className={styles.coverCell}>
            {info.getValue() ? (
              <img src={info.getValue() || ""} alt="Cover" />
            ) : (
              <div className={styles.placeholder} />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <span className={styles.bookTitle}>{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("author", {
        header: "Author",
        cell: (info) => (
          <span className={styles.author}>{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor((row) => getStatus(row), {
        id: "status",
        header: "Status",
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
              <option value="TO_READ">TO READ</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="READ">READ</option>
            </select>
          );
        },
      }),
      columnHelper.accessor("addedAt", {
        header: "Added Date",
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
            Remove
          </button>
        ),
      }),
    ],
    [onRemove, onStatusChange],
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

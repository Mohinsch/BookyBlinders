"use client";

import { useState } from "react";
import {
  addBookToLibrary,
  getUserLibrary,
  removeBookFromLibrary,
  updateReadingStatus,
} from "@/actions/library";
import type { UserLibraryBook } from "@/types/library";

export default function TestCrudPage() {
  const [books, setBooks] = useState<UserLibraryBook[]>([]);
  const [logs, setLogs] = useState<string>("");

  const handleAdd = async () => {
    const res = await addBookToLibrary("jCd3nQAACAAJ");
    setLogs(`Add: ${JSON.stringify(res)}`);
    handleFetch();
  };

  const handleFetch = async () => {
    const res = await getUserLibrary();
    setBooks(res);
    setLogs(`Fetched ${res.length} books`);
  };

  const handleUpdate = async (bookId: number) => {
    const res = await updateReadingStatus(bookId, "IN_PROGRESS");
    setLogs(`Update: ${JSON.stringify(res)}`);
    handleFetch();
  };

  const handleRemove = async (bookId: number) => {
    const res = await removeBookFromLibrary(bookId);
    setLogs(`Remove: ${JSON.stringify(res)}`);
    handleFetch();
  };

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl mb-6 font-bold">CRUD Sandbox</h1>

      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          1. Add Book (Peaky Blinders)
        </button>
        <button
          type="button"
          onClick={handleFetch}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          2. Fetch Library
        </button>
      </div>

      <pre className="bg-neutral-900 text-green-400 p-4 rounded mb-8">
        {logs || "No logs yet..."}
      </pre>

      <div className="grid gap-4">
        {books.map((b) => (
          <div
            key={b.id}
            className="border p-4 rounded flex items-center justify-between"
          >
            <div>
              <p className="font-bold">{b.title}</p>
              <p className="text-sm text-gray-500">
                Read Start: {b.readStart || "null"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleUpdate(b.id)}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded"
              >
                3. Set IN_PROGRESS
              </button>
              <button
                type="button"
                onClick={() => handleRemove(b.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded"
              >
                4. Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

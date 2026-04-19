// src/actions/books.ts
"use server"; // Indicates that this file contains Server Actions, which run on the server and can be called from client components.

import { searchBooks, getBookById } from "@/services/google-books";
import type { GoogleBookItem } from "@/types/google-books";

/**
 * Server Action: Search for books based on a user's query.
 * It acts as the bridge between the client-side components and the Google Books API service functions.
 */
export async function searchBooksAction(query: string): Promise<GoogleBookItem[]> {
  // Basic validation to prevent empty calls to the API
  if (!query || query.trim() === "") {
    return [];
  }

  try {
    // Call the service function that interacts with the Google Books API
    const results = await searchBooks(query);
    return results;
  } catch (error) {
    console.error("[Server Action] Failed to search books:", error);
    // In case of error, returning an empty array keeps the UI from crashing
    return [];
  }
}

/**
 * Server Action: Fetch details for a single book.
 */
export async function getBookDetailsAction(googleId: string): Promise<GoogleBookItem | null> {
  if (!googleId) {
    return null;
  }

  try {
    const book = await getBookById(googleId);
    return book;
  } catch (error) {
    console.error("[Server Action] Failed to get book details:", error);
    return null;
  }
}
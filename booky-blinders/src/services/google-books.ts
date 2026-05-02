// src/services/google-books.ts
// This file contains all the logic to interact with the Google Books API.
// It abstracts away the API details and provides clean functions for searching and fetching book details.

import type { GoogleBookItem, GoogleBooksResponse } from "@/types/google-books";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Core wrapper for fetching data from the Google Books API. It handles URL construction, API key inclusion, error handling, and response parsing.
 */
async function fetchFromGoogleBooks<T>(endpoint: string): Promise<T | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (apiKey) {
    url.searchParams.append("key", apiKey);
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`[Google Books API] Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("[Google Books API] Network or Parsing Error:", error);
    return null;
  }
}

/**
 * Utility 1: Search books by title, author, or keywords. It returns a list of books matching the query.
 */
export async function searchBooks(query: string, maxResults = 12) {
  if (!query.trim()) return [];

  const endpoint = `?q=${encodeURIComponent(query)}&maxResults=${maxResults}&langRestrict=en,fr`;
  const data = await fetchFromGoogleBooks<GoogleBooksResponse>(endpoint);
  return data?.items || [];
}

/**
 * Utility 2: Fetch a specific book's full details using its Google Books ID. This is useful for the book details page where we want to show comprehensive information about a single book.
 */
export async function getBookById(googleId: string): Promise<GoogleBookItem | null> {
  if (!googleId) return null;

  const endpoint = `/${googleId}`;
  return await fetchFromGoogleBooks<GoogleBookItem>(endpoint);
}

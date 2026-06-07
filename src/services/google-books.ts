// src/services/google-books.ts
// This file contains all the logic to interact with the Google Books API.
// It abstracts away the API details and provides clean functions for searching and fetching book details.

import {
  GOOGLE_BOOKS_API,
  LOG_MESSAGES,
  RANDOM_BOOKS_CONFIG,
  RANDOM_BOOKS_SEED_QUERIES,
} from "@/constants";
import type { GoogleBookItem, GoogleBooksResponse } from "@/types/google-books";

const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Core wrapper for fetching data from the Google Books API.
 * It handles URL construction, API key inclusion, error handling, and response parsing.
 * Accepts Next.js specific fetch options (like `next: { revalidate }`) for caching.
 */
async function fetchFromGoogleBooks<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(`${GOOGLE_BOOKS_API.BASE_URL}${endpoint}`);

  if (apiKey) {
    url.searchParams.append("key", apiKey);
  }

  try {
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      console.error(
        LOG_MESSAGES.GOOGLE_BOOKS.API_ERROR(
          response.status,
          response.statusText,
        ),
      );
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(LOG_MESSAGES.GOOGLE_BOOKS.NETWORK_ERROR, error);
    return null;
  }
}

/**
 * Utility 1: Search books by title, author, or keywords.
 * Leverages Next.js native Data Cache to prevent quota exhaustion.
 */
export async function searchBooks(
  query: string,
  maxResults = GOOGLE_BOOKS_API.DEFAULT_MAX_RESULTS,
) {
  if (!query.trim()) return [];

  const endpoint = `?q=${encodeURIComponent(query)}&maxResults=${maxResults}&langRestrict=${GOOGLE_BOOKS_API.LANGUAGE_RESTRICT}`;

  const data = await fetchFromGoogleBooks<GoogleBooksResponse>(endpoint, {
    next: {
      revalidate: 86400,
      tags: ["google-books", "search", query.toLowerCase()],
    },
  });

  return data?.items || [];
}

/**
 * Pick a random homepage selection that stays stable for one hour.
 * The seed query and start index are derived from a deterministic hour bucket,
 * so every visitor in the same hour hits the same Next.js cache entry; the
 * selection rotates automatically when the hour rolls over.
 */
export async function getRandomBooks(
  maxResults = GOOGLE_BOOKS_API.DEFAULT_MAX_RESULTS,
) {
  const hourBucket = Math.floor(Date.now() / ONE_HOUR_MS);
  const query =
    RANDOM_BOOKS_SEED_QUERIES[hourBucket % RANDOM_BOOKS_SEED_QUERIES.length];
  const startIndex = (hourBucket * 7) % RANDOM_BOOKS_CONFIG.MAX_START_INDEX;

  const endpoint = `?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=${GOOGLE_BOOKS_API.LANGUAGE_RESTRICT}&orderBy=relevance`;

  const data = await fetchFromGoogleBooks<GoogleBooksResponse>(endpoint, {
    next: {
      revalidate: RANDOM_BOOKS_CONFIG.REVALIDATE_SECONDS,
      tags: ["google-books", "random-books", `random-books-${hourBucket}`],
    },
  });

  return data?.items || [];
}

/**
 * Utility 2: Fetch a specific book's full details using its Google Books ID.
 * Leverages Next.js native Data Cache to prevent quota exhaustion.
 */
export async function getBookById(
  googleId: string,
): Promise<GoogleBookItem | null> {
  if (!googleId) return null;

  const endpoint = `/${googleId}`;

  const book = await fetchFromGoogleBooks<GoogleBookItem>(endpoint, {
    next: {
      revalidate: 86400,
      tags: ["google-books", `book-${googleId}`],
    },
  });

  return book;
}

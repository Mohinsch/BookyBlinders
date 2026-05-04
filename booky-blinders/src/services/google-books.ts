// src/services/google-books.ts
// This file contains all the logic to interact with the Google Books API.
// It abstracts away the API details and provides clean functions for searching and fetching book details.

import type { GoogleBookItem, GoogleBooksResponse } from "@/types/google-books";
import {
  getCacheKey,
  getFromCache,
  storeInCache,
  isCached,
} from "@/lib/cache";
import { GOOGLE_BOOKS_API, LOG_MESSAGES } from "@/constants";

/**
 * Core wrapper for fetching data from the Google Books API. It handles URL construction, API key inclusion, error handling, and response parsing.
 */
async function fetchFromGoogleBooks<T>(endpoint: string): Promise<T | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(`${GOOGLE_BOOKS_API.BASE_URL}${endpoint}`);

  if (apiKey) {
    url.searchParams.append("key", apiKey);
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(LOG_MESSAGES.GOOGLE_BOOKS.API_ERROR(response.status, response.statusText));
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
 * Utility 1: Search books by title, author, or keywords. It returns a list of books matching the query.
 * includes caching to prevent quota exhaustion and improve performance
 */
export async function searchBooks(query: string, maxResults = GOOGLE_BOOKS_API.DEFAULT_MAX_RESULTS) {
  if (!query.trim()) return [];

  // Check cache first
  const cacheKey = getCacheKey("search", query.toLowerCase());
  const cached = getFromCache<GoogleBookItem[]>(cacheKey);
  if (cached) {
    console.log(LOG_MESSAGES.GOOGLE_BOOKS.CACHE_HIT(query));
    return cached;
  }

  // Fetch from API if not cached
  const endpoint = `?q=${encodeURIComponent(query)}&maxResults=${maxResults}&langRestrict=${GOOGLE_BOOKS_API.LANGUAGE_RESTRICT}`;
  const data = await fetchFromGoogleBooks<GoogleBooksResponse>(endpoint);
  const items = data?.items || [];

  // Store in cache for future requests
  if (items.length > 0) {
    storeInCache(cacheKey, items);
    console.log(LOG_MESSAGES.GOOGLE_BOOKS.CACHE_STORED(items.length, query));
  }

  return items;
}

/**
 * Utility 2: Fetch a specific book's full details using its Google Books ID. This is useful for the book details page where we want to show comprehensive information about a single book.
 * includes caching to prevent quota exhaustion
 */
export async function getBookById(
  googleId: string
): Promise<GoogleBookItem | null> {
  if (!googleId) return null;

  // Check cache first
  const cacheKey = getCacheKey("book", googleId);
  const cached = getFromCache<GoogleBookItem>(cacheKey);
  if (cached) {
    console.log(LOG_MESSAGES.GOOGLE_BOOKS.CACHE_HIT_BOOK(googleId));
    return cached;
  }

  // Fetch from API if not cached
  const endpoint = `/${googleId}`;
  const book = await fetchFromGoogleBooks<GoogleBookItem>(endpoint);

  // Store in cache for future requests
  if (book) {
    storeInCache(cacheKey, book);
    console.log(LOG_MESSAGES.GOOGLE_BOOKS.CACHE_STORED_BOOK(googleId));
  }

  return book;
}

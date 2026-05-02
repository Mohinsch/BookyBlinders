// src/actions/books.ts
"use server"; // Indicates that this file contains Server Actions, which run on the server and can be called from client components.

import { searchBooks, getBookById } from "@/services/google-books";
import type { GoogleBookItem } from "@/types/google-books";
import { googleBooksSearchLimiter, checkRateLimit, trackViolation } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get the current user's ID for rate limiting
 */
async function getCurrentUserIdForRateLimit(): Promise<string> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id || "anonymous";
  } catch {
    return "anonymous";
  }
}

/**
 * Server Action: Search for books based on a user's query.
 * It acts as the bridge between the client-side components and the Google Books API service functions.
 * ✅ Now includes rate limiting to prevent API quota exhaustion
 */
export async function searchBooksAction(
  query: string
): Promise<GoogleBookItem[]> {
  // Basic validation to prevent empty calls to the API
  if (!query || query.trim() === "") {
    return [];
  }

  // ✅ Rate limiting: 30 searches per minute per user
  const userId = await getCurrentUserIdForRateLimit();
  const rateLimitKey = `search:${userId}`;
  const { allowed, error, result } = checkRateLimit(
    googleBooksSearchLimiter,
    rateLimitKey
  );

  if (!allowed) {
    console.warn(
      `[Server Action] Rate limit exceeded for user ${userId}: ${error}`
    );
    // Track violation for monitoring
    trackViolation(userId, "search", "server-action");
    return []; // Return empty instead of error to prevent UI crashes
  }

  try {
    // Call the service function that interacts with the Google Books API
    const results = await searchBooks(query);
    console.log(
      `[Server Action] Search completed - ${results.length} results (${result.remaining} requests remaining)`
    );
    return results;
  } catch (error) {
    console.error("[Server Action] Failed to search books:", error);
    // In case of error, returning an empty array keeps the UI from crashing
    return [];
  }
}

/**
 * Server Action: Fetch details for a single book.
 * ✅ Now includes rate limiting to prevent API quota exhaustion
 */
export async function getBookDetailsAction(
  googleId: string
): Promise<GoogleBookItem | null> {
  if (!googleId) {
    return null;
  }

  // ✅ Rate limiting: 30 requests per minute per user
  const userId = await getCurrentUserIdForRateLimit();
  const rateLimitKey = `book-details:${userId}`;
  const { allowed, error } = checkRateLimit(
    googleBooksSearchLimiter,
    rateLimitKey
  );

  if (!allowed) {
    console.warn(
      `[Server Action] Rate limit exceeded for user ${userId}: ${error}`
    );
    trackViolation(userId, "book-details", "server-action");
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
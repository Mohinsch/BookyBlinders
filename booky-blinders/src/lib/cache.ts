import { LRUCache } from "lru-cache";
import type { GoogleBookItem, GoogleBooksResponse } from "@/types/google-books";

type CacheValue = GoogleBookItem | GoogleBooksResponse | unknown;

/**
 * Cache for Google Books API responses
 * Prevents quota exhaustion and improves performance
 * - 1000 entries max (books, searches)
 * - 24 hour TTL per entry
 */
export const googleBooksCache = new LRUCache<string, CacheValue>({
  max: 1000,
  ttl: 24 * 60 * 60 * 1000, // 24 hours
});

/**
 * Cache management utilities
 */

export function getCacheKey(
  type: "search" | "book",
  identifier: string,
): string {
  return `${type}:${identifier}`;
}

/**
 * Get from cache with type safety
 */
export function getFromCache<T extends CacheValue = CacheValue>(
  key: string,
): T | undefined {
  const cached = googleBooksCache.get(key);
  return cached as T | undefined;
}

/**
 * Store in cache with TTL
 */
export function storeInCache<T extends CacheValue = CacheValue>(
  key: string,
  value: T,
): void {
  googleBooksCache.set(key, value);
}

/**
 * Check if key exists in cache
 */
export function isCached(key: string): boolean {
  return googleBooksCache.has(key);
}

/**
 * Clear cache (admin use only)
 */
export function clearCache(): void {
  googleBooksCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: googleBooksCache.size,
    maxSize: googleBooksCache.max,
    utilization: `${Math.round((googleBooksCache.size / (googleBooksCache.max || 1)) * 100)}%`,
  };
}

/**
 * Cache invalidation for a specific pattern
 * E.g., invalidate all searches starting with a prefix
 */
export function invalidateCachePattern(pattern: string): number {
  let invalidated = 0;
  for (const key of googleBooksCache.keys()) {
    if (key.startsWith(pattern)) {
      googleBooksCache.delete(key);
      invalidated++;
    }
  }
  return invalidated;
}

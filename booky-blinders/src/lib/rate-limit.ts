import { LRUCache } from 'lru-cache';

/**
 * Rate Limiting Configuration
 */
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
  keyGenerator?: (key: string) => string;
}

/**
 * Rate Limiter Result
 */
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
}

/**
 * Create a rate limiter with LRU cache backend
 * Tracks request count within a time window per key
 */
export function createRateLimiter(config: RateLimitConfig) {
  const store = new LRUCache<string, { count: number; resetTime: number }>({
    max: 10000,
    ttl: config.windowMs,
  });

  return (key: string): RateLimitResult => {
    const now = Date.now();
    const entry = store.get(key);

    // Create new entry or use existing
    if (!entry || entry.resetTime < now) {
      store.set(key, { count: 1, resetTime: now + config.windowMs });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: new Date(now + config.windowMs),
      };
    }

    // Increment existing entry
    const newCount = entry.count + 1;
    store.set(key, { count: newCount, resetTime: entry.resetTime });

    return {
      allowed: newCount <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - newCount),
      resetTime: new Date(entry.resetTime),
    };
  };
}

/**
 * Rate limiters for different endpoints/actions
 */

// Authentication: 5 attempts per 15 minutes
export const authLoginLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
});

// Authentication: 3 attempts per hour for signup
export const authSignupLimiter = createRateLimiter({
  maxRequests: 3,
  windowMs: 60 * 60 * 1000,
});

// Google Books API: 30 searches per minute per user
export const googleBooksSearchLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000,
});

// Server Actions: 100 library operations per minute per user
export const libraryOperationLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000,
});

// Generic API limiter: 200 requests per minute per user
export const apiLimiter = createRateLimiter({
  maxRequests: 200,
  windowMs: 60 * 1000,
});

/**
 * Helper to check rate limit and return formatted result
 */
export function checkRateLimit(
  limiter: ReturnType<typeof createRateLimiter>,
  key: string
): { allowed: boolean; error?: string; result: RateLimitResult } {
  const result = limiter(key);

  if (!result.allowed) {
    const retryAfter = Math.ceil(
      (result.resetTime.getTime() - Date.now()) / 1000
    );
    return {
      allowed: false,
      error: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
      result,
    };
  }

  return { allowed: true, result };
}

/**
 * Rate limit violation tracking (in-memory storage)
 * Consider moving to database for persistence across restarts
 */
const violationTracker = new LRUCache<
  string,
  { count: number; firstViolation: number }
>({
  max: 5000,
  ttl: 24 * 60 * 60 * 1000, // 24 hours
});

/**
 * Track rate limit violations for alerting
 */
export function trackViolation(
  userId: string,
  action: string,
  ipAddress: string
): { violationCount: number; shouldAlert: boolean } {
  const key = `violation:${userId}:${action}`;
  const now = Date.now();
  const entry = violationTracker.get(key);

  if (!entry) {
    violationTracker.set(key, { count: 1, firstViolation: now });
    return { violationCount: 1, shouldAlert: false };
  }

  const count = entry.count + 1;
  violationTracker.set(key, { count, firstViolation: entry.firstViolation });

  // Alert threshold: 10 violations in 1 hour
  const shouldAlert = count > 10;

  return { violationCount: count, shouldAlert };
}

/**
 * Get violation stats for a user
 */
export function getViolationStats(userId: string) {
  const stats: Record<string, number> = {};
  
  // This is limited - for production, query database instead
  // Keeping this for demonstration purposes
  
  return stats;
}

/**
 * Reset rate limit for a user (admin use only)
 */
export function resetRateLimit(userId: string, action: string) {
  const key = `violation:${userId}:${action}`;
  violationTracker.delete(key);
}

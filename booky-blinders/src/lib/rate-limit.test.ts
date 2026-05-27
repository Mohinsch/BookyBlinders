import { describe, expect, it } from "vitest";
import {
  checkRateLimit,
  createRateLimiter,
  resetRateLimit,
  trackViolation,
} from "./rate-limit";

describe("rate limiting helpers", () => {
  it("limits requests after the configured maximum", () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 1000 });

    const first = limiter("user-1");
    const second = limiter("user-1");
    const third = limiter("user-1");

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("returns a formatted error when the limit is exceeded", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 1000 });

    const first = checkRateLimit(limiter, "user-2");
    const second = checkRateLimit(limiter, "user-2");

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(false);
    expect(second.error).toContain("Rate limit exceeded.");
  });

  it("tracks violations and supports reset", () => {
    const userId = "user-3";
    const action = "login";

    let result = trackViolation(userId, action, "127.0.0.1");
    for (let i = 0; i < 10; i += 1) {
      result = trackViolation(userId, action, "127.0.0.1");
    }

    expect(result.violationCount).toBe(11);
    expect(result.shouldAlert).toBe(true);

    resetRateLimit(userId, action);

    const resetResult = trackViolation(userId, action, "127.0.0.1");
    expect(resetResult.violationCount).toBe(1);
    expect(resetResult.shouldAlert).toBe(false);
  });
});

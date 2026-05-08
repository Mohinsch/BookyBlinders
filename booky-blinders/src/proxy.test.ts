import { betterFetch } from "@better-fetch/fetch";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authMiddleware from "./proxy";

interface SessionResponse {
  data: { user: { id: string } } | null;
}

/**
 * Mock the external fetch module.
 * This prevents the middleware from making actual network calls to the auth API during tests.
 */
vi.mock("@better-fetch/fetch", () => ({
  betterFetch: vi.fn(),
}));

describe("Security Proxy (Middleware)", () => {
  /**
   * Ensure a clean state for the mock before each test run
   * to avoid cross-test contamination.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect unauthenticated users from /library to /login", async () => {
    // Simulate an API response where no active session is found
    vi.mocked(betterFetch).mockResolvedValue({
      data: null,
    } as SessionResponse as never);

    const request = new NextRequest(new URL("http://localhost:3000/library"));
    const response = await authMiddleware(request);

    // NextResponse.redirect() uses 307 (Temporary Redirect) by default in Next.js
    // to preserve the original HTTP method of the request.
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("should redirect authenticated users from /login to /library", async () => {
    // Simulate an API response containing a valid user session
    vi.mocked(betterFetch).mockResolvedValue({
      data: { user: { id: "123" } },
    } as SessionResponse as never);

    const request = new NextRequest(new URL("http://localhost:3000/login"));
    const response = await authMiddleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/library",
    );
  });

  it("should allow authenticated users to access /library", async () => {
    // Simulate an API response containing a valid user session
    vi.mocked(betterFetch).mockResolvedValue({
      data: { user: { id: "123" } },
    } as SessionResponse as never);

    const request = new NextRequest(new URL("http://localhost:3000/library"));
    const response = await authMiddleware(request);

    // NextResponse.next() allows the request to proceed without altering the status to a redirect
    expect(response.status).toBe(200);
  });
});

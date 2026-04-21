import { describe, it, expect, vi, beforeEach } from "vitest";
import authMiddleware from "./proxy";
import { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

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
    (betterFetch as any).mockResolvedValue({ data: null });

    const request = new NextRequest(new URL("http://localhost:3000/library"));
    const response = await authMiddleware(request);

    // NextResponse.redirect() uses 307 (Temporary Redirect) by default in Next.js
    // to preserve the original HTTP method of the request.
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("should redirect authenticated users from /login to /library", async () => {
    // Simulate an API response containing a valid user session
    (betterFetch as any).mockResolvedValue({ data: { user: { id: "123" } } });

    const request = new NextRequest(new URL("http://localhost:3000/login"));
    const response = await authMiddleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/library");
  });

  it("should allow authenticated users to access /library", async () => {
    // Simulate an API response containing a valid user session
    (betterFetch as any).mockResolvedValue({ data: { user: { id: "123" } } });

    const request = new NextRequest(new URL("http://localhost:3000/library"));
    const response = await authMiddleware(request);

    // NextResponse.next() allows the request to proceed without altering the status to a redirect
    expect(response.status).toBe(200); 
  });
});
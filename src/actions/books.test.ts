import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import { checkRateLimit, trackViolation } from "@/lib/rate-limit";
import { getBookById, searchBooks } from "@/services/google-books";
import type { GoogleBookItem } from "@/types/google-books";
import { getBookDetailsAction, searchBooksAction } from "./books";

/**
 * Mock the external Google Books API service.
 * We test the Server Action's internal validation and error handling,
 * completely isolating it from actual network requests.
 */
vi.mock("@/services/google-books", () => ({
  searchBooks: vi.fn(),
  getBookById: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: { getSession: vi.fn() },
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  googleBooksSearchLimiter: {},
  trackViolation: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Books Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-123" },
    } as never);
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      result: { remaining: 29, resetTime: new Date() },
    });
  });

  describe("searchBooksAction", () => {
    it("should return an empty array if the query is empty", async () => {
      const result = await searchBooksAction("");

      //Then
      expect(result).toEqual([]);
      expect(searchBooks).not.toHaveBeenCalled();
    });

    it("should return an empty array if the query is only whitespace", async () => {
      const result = await searchBooksAction("   ");

      expect(result).toEqual([]);
      expect(searchBooks).not.toHaveBeenCalled();
    });

    it("should return search results for a valid query", async () => {
      // Mock a successful API response Given
      const mockBooks: GoogleBookItem[] = [
        { id: "1", volumeInfo: { title: "Dune" } },
      ];
      vi.mocked(searchBooks).mockResolvedValue(mockBooks);

      //When
      const result = await searchBooksAction("Dune");

      //Then
      expect(result).toEqual(mockBooks);
      expect(searchBooks).toHaveBeenCalledWith("Dune");
    });

    it("should catch errors and return an empty array to prevent UI crashes", async () => {
      // Force the mocked API to throw an error
      vi.mocked(searchBooks).mockRejectedValue(new Error("External API Down"));

      const result = await searchBooksAction("Error Trigger");

      expect(result).toEqual([]);
    });

    it("should return empty results when rate limit is exceeded", async () => {
      vi.mocked(checkRateLimit).mockReturnValue({
        allowed: false,
        error: "Rate limit exceeded",
        result: { remaining: 0, resetTime: new Date() },
      });

      const result = await searchBooksAction("Dune");

      expect(result).toEqual([]);
      expect(trackViolation).toHaveBeenCalledWith(
        "user-123",
        "search",
        "server-action",
      );
      expect(searchBooks).not.toHaveBeenCalled();
    });

    it("should fall back to anonymous when session lookup fails", async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error("Boom"));
      await searchBooksAction("Dune");

      expect(checkRateLimit).toHaveBeenCalledWith(
        expect.anything(),
        "search:anonymous",
      );
    });
  });

  describe("getBookDetailsAction", () => {
    it("should return null if googleId is empty", async () => {
      const result = await getBookDetailsAction("");

      expect(result).toBeNull();
      expect(getBookById).not.toHaveBeenCalled();
    });

    it("should return book details for a valid id", async () => {
      const mockBook: GoogleBookItem = {
        id: "123",
        volumeInfo: { title: "1984" },
      };
      vi.mocked(getBookById).mockResolvedValue(mockBook);

      const result = await getBookDetailsAction("123");

      expect(result).toEqual(mockBook);
      expect(getBookById).toHaveBeenCalledWith("123");
    });

    it("should catch errors and return null", async () => {
      vi.mocked(getBookById).mockRejectedValue(new Error("External API Down"));

      const result = await getBookDetailsAction("123");

      expect(result).toBeNull();
    });

    it("should return null when rate limit is exceeded", async () => {
      vi.mocked(checkRateLimit).mockReturnValue({
        allowed: false,
        error: "Rate limit exceeded",
        result: { remaining: 0, resetTime: new Date() },
      });

      const result = await getBookDetailsAction("123");

      expect(result).toBeNull();
      expect(trackViolation).toHaveBeenCalledWith(
        "user-123",
        "book-details",
        "server-action",
      );
      expect(getBookById).not.toHaveBeenCalled();
    });
  });
});

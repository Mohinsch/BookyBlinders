import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GoogleBookItem, GoogleBooksResponse } from "@/types/google-books";
import { getBookById, searchBooks } from "./google-books";

interface FetchResponse {
  ok: boolean;
  status?: number;
  json: () => Promise<Record<string, unknown>>;
}

// Mock the global fetch API to prevent actual HTTP requests during testing
global.fetch = vi.fn();

describe("Google Books Service", () => {
  // Store the original environment variables to restore them later
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env vars and inject a fake API key before each test
    process.env = { ...originalEnv };
    process.env.GOOGLE_BOOKS_API_KEY = "test-api-key";
  });

  afterEach(() => {
    // Restore original env vars
    process.env = originalEnv;
  });

  describe("searchBooks", () => {
    it("should return an empty array if the query is empty", async () => {
      const result = await searchBooks("");

      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should return items when the API call is successful", async () => {
      const mockResponse: GoogleBooksResponse = {
        items: [{ id: "book-1", volumeInfo: { title: "Test Book" } }],
        totalItems: 1,
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as FetchResponse as never);

      const result = await searchBooks("harry potter", 5);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("book-1");
      // Verify URL construction, URL encoding, and API key inclusion
      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/books/v1/volumes?q=harry+potter&maxResults=5&langRestrict=en%2Cfr&key=test-api-key",
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 86400,
            tags: expect.arrayContaining(["google-books", "search", "harry potter"]),
          }),
        }),
      );
    });

    it("should return an empty array if the API returns no items", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as FetchResponse as never);

      const result = await searchBooks("unknown-query");

      expect(result).toEqual([]);
    });
  });

  describe("getBookById", () => {
    it("should return null if the googleId is empty", async () => {
      const result = await getBookById("");

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should return book data when the API call is successful", async () => {
      const mockBook: GoogleBookItem = {
        id: "google-123",
        volumeInfo: { title: "Specific Book" },
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockBook,
      } as FetchResponse as never);

      const result = await getBookById("google-123");

      expect(result).toEqual(mockBook);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/books/v1/volumes/google-123?key=test-api-key",
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 86400,
            tags: expect.arrayContaining(["google-books", "book-google-123"]),
          }),
        }),
      );
    });
  });

  describe("Internal fetch wrapper (fetchFromGoogleBooks)", () => {
    it("should make requests without an API key if it is not defined in the environment", async () => {
      delete process.env.GOOGLE_BOOKS_API_KEY;

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }) as GoogleBooksResponse,
      } as FetchResponse as never);

      await searchBooks("test");

      // Verify the URL does NOT contain the 'key=' parameter
      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/books/v1/volumes?q=test&maxResults=12&langRestrict=en,fr",
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 86400,
            tags: expect.arrayContaining(["google-books", "search", "test"]),
          }),
        }),
      );
    });

    it("should return null and log an error if the response is not OK (e.g., 404, 500)", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as FetchResponse as never);

      const result = await getBookById("invalid-id");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Google Books API] Error: 404 - Not Found",
      );
    });

    it("should return null and log an error if fetch throws an exception (e.g., network failure)", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(global.fetch).mockRejectedValue(new Error("Network Failure"));

      const result = await getBookById("network-error-id");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Google Books API] Network or Parsing Error:",
        expect.any(Error),
      );
    });
  });
});

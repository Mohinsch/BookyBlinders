import { describe, it, expect, vi, beforeEach } from "vitest";
import { addBookToLibrary, getUserLibrary } from "./library";
import { db } from "@/db";
import { getBookById } from "@/services/google-books";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Mocking external dependencies to ensure unit test isolation.
 * We prevent actual database writes and external API calls.
 */
vi.mock("@/db", () => ({
  db: {
    query: {
      book: { findFirst: vi.fn() },
      library: { findFirst: vi.fn() },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: 1 }]),
        onConflictDoNothing: vi.fn(),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => []),
          })),
        })),
      })),
    })),
  },
}));

vi.mock("@/services/google-books", () => ({
  getBookById: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mocking Next.js headers as they are unavailable in the Vitest node environment
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Library Server Actions", () => {
  /**
   * Reset all mocks before each test to prevent state leakage
   * between different test cases.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addBookToLibrary", () => {
    /**
     * Test Case: Authentication Guard
     * Ensures the action fails gracefully when no valid session is found.
     */
    it("should return success: false if the user is not authenticated", async () => {
      // Simulate an unauthenticated state (null session)
      (auth.api.getSession as any).mockResolvedValue(null);

      const result = await addBookToLibrary("test-id");

      // Verify that the internal try/catch correctly handles the requireAuth rejection
      expect(result).toEqual({
        success: false,
        message: "Failed to add book",
      });
    });

    /**
     * Test Case: Happy Path for adding a book
     * Validates the coordination between Google API, DB Upsert, and Cache Invalidation.
     */
    it("should add a book successfully when user is authenticated", async () => {
      // Inject dummy session data
      (auth.api.getSession as any).mockResolvedValue({ user: { id: "user-123" } });

      // Mock successful Google Books data retrieval
      (getBookById as any).mockResolvedValue({
        volumeInfo: {
          title: "Test Book",
          authors: ["Author A"],
          imageLinks: { thumbnail: "url" },
        },
      });

      // Simulate a scenario where the book is new and the user already has a library
      (db.query.book.findFirst as any).mockResolvedValue(null);
      (db.query.library.findFirst as any).mockResolvedValue({ id: 10, userId: "user-123" });

      const result = await addBookToLibrary("google-id-123");

      // Validate business logic expectations
      expect(result.success).toBe(true);
      expect(result.message).toBe("Book added");
      
      // Ensure Next.js is notified to re-render the library page
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });

  describe("getUserLibrary", () => {
    /**
     * Test Case: Empty State handling
     * Ensures the function returns a clean empty array instead of crashing if no library exists.
     */
    it("should return an empty array if no library is found for the current user", async () => {
      (auth.api.getSession as any).mockResolvedValue({ user: { id: "user-123" } });
      (db.query.library.findFirst as any).mockResolvedValue(null);

      const books = await getUserLibrary();

      expect(books).toEqual([]);
    });
  });
});
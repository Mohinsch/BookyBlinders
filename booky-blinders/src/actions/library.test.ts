import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  addBookToLibrary,
  createLibrary,
  deleteLibrary,
  getOwnedGoogleBookIds,
  getUserLibraries,
  getUserLibrary,
  renameLibrary,
  updateReadingStatus,
  removeBookFromLibrary,
} from "./library";
import { db } from "@/db";
import { getBookById } from "@/services/google-books";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Global Dependency Mocks
 * Isolate the test environment by overriding external modules.
 */

// Mock the Drizzle ORM database instance to prevent actual database connections.
// We provide vi.fn() implementations for the specific chained methods used in the actions.
vi.mock("@/db", () => ({
  db: {
    query: {
      book: { findFirst: vi.fn() },
      library: { findFirst: vi.fn(), findMany: vi.fn() },
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
            orderBy: vi.fn(() => [
              { id: 1, title: "Mocked Book", readStart: null, readEnd: null },
            ]),
          })),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
  },
}));

// Mock the external Google Books API service.
vi.mock("@/services/google-books", () => ({
  getBookById: vi.fn(),
}));

// Mock Better-Auth session retrieval.
vi.mock("@/lib/auth", () => ({
  auth: {
    api: { getSession: vi.fn() },
  },
}));

// Mock Next.js cache invalidation.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock Next.js headers since they are not available in the Node.js test environment.
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Library Server Actions", () => {
  // Clear mock history before each test to prevent state leakage.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addBookToLibrary", () => {
    it("should return success: false if the user is not authenticated", async () => {
      // Simulate missing session. The internal requireAuth() will throw.
      (auth.api.getSession as any).mockResolvedValue(null);

      const result = await addBookToLibrary("test-id");

      // Verify the catch block gracefully handles the thrown error.
      expect(result).toEqual({ success: false, message: "Failed to add book" });
    });

    it("should return success: false if book is not found in Google API", async () => {
      // Simulate valid session but invalid external API response.
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (getBookById as any).mockResolvedValue(null);

      const result = await addBookToLibrary("unknown-id");

      expect(result).toEqual({ success: false, message: "Failed to add book" });
    });

    it("should add a book successfully when user is authenticated", async () => {
      // Set up the happy path mocks.
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (getBookById as any).mockResolvedValue({
        volumeInfo: { title: "Test Book", authors: ["Author A"] },
      });
      // Simulate book not existing in DB to trigger the insert logic.
      (db.query.book.findFirst as any).mockResolvedValue(null);
      // Simulate user not having a library yet to trigger library creation.
      (db.query.library.findMany as any).mockResolvedValue([]);

      const result = await addBookToLibrary("google-id-123");

      expect(result.success).toBe(true);
      // Ensure UI is updated after successful mutation.
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });

  describe("getUserLibraries", () => {
    it("should return user libraries", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10, name: "Main" },
      ]);

      const libraries = await getUserLibraries();

      expect(libraries).toEqual([{ id: 10, name: "Main" }]);
    });
  });

  describe("getOwnedGoogleBookIds", () => {
    it("should return owned Google IDs without duplicates", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.select as any).mockReturnValueOnce({
        from: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            innerJoin: vi.fn(() => ({
              where: vi.fn(() => [
                { googleId: "id-1" },
                { googleId: "id-2" },
                { googleId: "id-1" },
                { googleId: null },
              ]),
            })),
          })),
        })),
      });

      const ids = await getOwnedGoogleBookIds();

      expect(ids).toEqual(["id-1", "id-2"]);
    });
  });

  describe("library CRUD", () => {
    it("should create a library successfully", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });

      const result = await createLibrary("Roadmap 2026");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });

    it("should rename a library successfully", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findFirst as any).mockResolvedValue({ id: 10 });

      const result = await renameLibrary(10, "Renamed Library");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });

    it("should fail deleting the last library", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([{ id: 10 }]);

      const result = await deleteLibrary(10);

      expect(result.success).toBe(false);
    });

    it("should delete a library successfully", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10 },
        { id: 20 },
      ]);

      const result = await deleteLibrary(10);

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });

  describe("getUserLibrary", () => {
    it("should return an empty array if no library is found", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([]);
      (db.select as any).mockReturnValueOnce({
        from: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            where: vi.fn(() => ({
              orderBy: vi.fn(() => []),
            })),
          })),
        })),
      });

      const books = await getUserLibrary();

      expect(books).toEqual([]);
    });

    it("should return a list of books if the library exists", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10, name: "Main" },
      ]);

      const books = await getUserLibrary();

      // Verify the mocked db.select().from().innerJoin().where().orderBy() chain returns our stub.
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe("Mocked Book");
    });
  });

  describe("updateReadingStatus", () => {
    it("should return success: false if library is not found", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      // Action requires a valid library to update junction table
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10, name: "Main" },
      ]);

      const result = await updateReadingStatus(1, "IN_PROGRESS", 999);

      expect(result.success).toBe(false);
    });

    it("should update status to IN_PROGRESS successfully", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10, name: "Main" },
      ]);

      const result = await updateReadingStatus(1, "IN_PROGRESS");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });

    it("should update status to READ successfully", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10, name: "Main" },
      ]);

      const result = await updateReadingStatus(1, "READ");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });

  describe("removeBookFromLibrary", () => {
    it("should return success: false if library is not found", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10, name: "Main" },
      ]);

      const result = await removeBookFromLibrary(1, 999);

      expect(result.success).toBe(false);
    });

    it("should remove book successfully", async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: "user-123" },
      });
      (db.query.library.findMany as any).mockResolvedValue([
        { id: 10, name: "Main" },
      ]);

      const result = await removeBookFromLibrary(1);

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });
  it("should return an empty array and log error if an unexpected error occurs", async () => {
    // Suppress console.error output during the test run
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "user-123" },
    });

    // Force the database query to throw an exception to trigger the catch block
    (db.query.library.findMany as any).mockRejectedValue(
      new Error("Simulated database failure"),
    );

    const books = await getUserLibrary();

    expect(books).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});

import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { getBookById } from "@/services/google-books";
import type { GoogleBookItem } from "@/types/google-books";
import {
  addBookToLibrary,
  createLibrary,
  deleteLibrary,
  getOwnedGoogleBookIds,
  getUserLibraries,
  getUserLibrary,
  removeBookFromLibrary,
  renameLibrary,
  updateReadingStatus,
} from "./library";

interface MockSession {
  user: { id: string };
}

interface MockLibrary {
  id: number;
  name: string;
}

interface MockBook {
  id: number;
  title: string;
  readStart: null;
  readEnd: null;
}

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
            orderBy: vi.fn(
              () =>
                [
                  {
                    id: 1,
                    title: "Mocked Book",
                    readStart: null,
                    readEnd: null,
                  },
                ] as MockBook[],
            ),
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
      vi.mocked(auth.api.getSession).mockResolvedValue(null as never);

      const result = await addBookToLibrary("test-id");

      // Verify the catch block gracefully handles the thrown error.
      expect(result).toEqual({ success: false, message: "Failed to add book" });
    });

    it("should return success: false if book is not found in Google API", async () => {
      // Simulate valid session but invalid external API response.
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(getBookById).mockResolvedValue(null as never);

      const result = await addBookToLibrary("unknown-id");

      expect(result).toEqual({ success: false, message: "Failed to add book" });
    });

    it("should add a book successfully when user is authenticated", async () => {
      // Set up the happy path mocks.
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(getBookById).mockResolvedValue({
        volumeInfo: { title: "Test Book", authors: ["Author A"] },
      } as GoogleBookItem as never);
      // Simulate book not existing in DB to trigger the insert logic.
      vi.mocked(db.query.book.findFirst).mockResolvedValue(null as never);
      // Simulate user not having a library yet to trigger library creation.
      vi.mocked(db.query.library.findMany).mockResolvedValue(
        [] as MockLibrary[] as never,
      );

      const result = await addBookToLibrary("google-id-123");

      expect(result.success).toBe(true);
      // Ensure UI is updated after successful mutation.
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });

  describe("getUserLibraries", () => {
    it("should return user libraries", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10, name: "Main" },
      ] as MockLibrary[] as never);

      const libraries = await getUserLibraries();

      expect(libraries).toEqual([{ id: 10, name: "Main" }]);
    });
  });

  describe("getOwnedGoogleBookIds", () => {
    it("should return owned Google IDs without duplicates", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.select).mockReturnValueOnce({
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
      } as never);

      const ids = await getOwnedGoogleBookIds();

      expect(ids).toEqual(["id-1", "id-2"]);
    });
  });

  describe("library CRUD", () => {
    it("should create a library successfully", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);

      const result = await createLibrary("Roadmap 2026");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });

    it("should rename a library successfully", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findFirst).mockResolvedValue({
        id: 10,
      } as never);

      const result = await renameLibrary(10, "Renamed Library");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });

    it("should fail deleting the last library", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10 },
      ] as MockLibrary[] as never);

      const result = await deleteLibrary(10);

      expect(result.success).toBe(false);
    });

    it("should delete a library successfully", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10 },
        { id: 20 },
      ] as MockLibrary[] as never);

      const result = await deleteLibrary(10);

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });

  describe("getUserLibrary", () => {
    it("should return an empty array if no library is found", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue(
        [] as MockLibrary[] as never,
      );
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            where: vi.fn(() => ({
              orderBy: vi.fn(() => []),
            })),
          })),
        })),
      } as never);

      const books = await getUserLibrary();

      expect(books).toEqual([]);
    });

    it("should return a list of books if the library exists", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10, name: "Main" },
      ] as MockLibrary[] as never);

      const books = await getUserLibrary();

      // Verify the mocked db.select().from().innerJoin().where().orderBy() chain returns our stub.
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe("Mocked Book");
    });
  });

  describe("updateReadingStatus", () => {
    it("should return success: false if library is not found", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      // Action requires a valid library to update junction table
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10, name: "Main" },
      ] as MockLibrary[] as never);

      const result = await updateReadingStatus(1, "IN_PROGRESS", 999);

      expect(result.success).toBe(false);
    });

    it("should update status to IN_PROGRESS successfully", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10, name: "Main" },
      ] as MockLibrary[] as never);

      const result = await updateReadingStatus(1, "IN_PROGRESS");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });

    it("should update status to READ successfully", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10, name: "Main" },
      ] as MockLibrary[] as never);

      const result = await updateReadingStatus(1, "READ");

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });

  describe("removeBookFromLibrary", () => {
    it("should return success: false if library is not found", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10, name: "Main" },
      ] as MockLibrary[] as never);

      const result = await removeBookFromLibrary(1, 999);

      expect(result.success).toBe(false);
    });

    it("should remove book successfully", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-123" },
      } as MockSession as never);
      vi.mocked(db.query.library.findMany).mockResolvedValue([
        { id: 10, name: "Main" },
      ] as MockLibrary[] as never);

      const result = await removeBookFromLibrary(1);

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/library");
    });
  });
});

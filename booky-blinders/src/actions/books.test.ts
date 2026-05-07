import { beforeEach, describe, expect, it, vi } from "vitest";
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

describe("Books Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });
});

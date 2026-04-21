import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchBooksAction, getBookDetailsAction } from "./books";
import { searchBooks, getBookById } from "@/services/google-books";

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
      
      expect(result).toEqual([]);
      expect(searchBooks).not.toHaveBeenCalled();
    });

    it("should return an empty array if the query is only whitespace", async () => {
      const result = await searchBooksAction("   ");
      
      expect(result).toEqual([]);
      expect(searchBooks).not.toHaveBeenCalled();
    });

    it("should return search results for a valid query", async () => {
      // Mock a successful API response
      const mockBooks = [{ id: "1", volumeInfo: { title: "Dune" } }];
      (searchBooks as any).mockResolvedValue(mockBooks);

      const result = await searchBooksAction("Dune");
      
      expect(result).toEqual(mockBooks);
      expect(searchBooks).toHaveBeenCalledWith("Dune");
    });

    it("should catch errors and return an empty array to prevent UI crashes", async () => {
      // Force the mocked API to throw an error
      (searchBooks as any).mockRejectedValue(new Error("External API Down"));

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
      const mockBook = { id: "123", volumeInfo: { title: "1984" } };
      (getBookById as any).mockResolvedValue(mockBook);

      const result = await getBookDetailsAction("123");
      
      expect(result).toEqual(mockBook);
      expect(getBookById).toHaveBeenCalledWith("123");
    });

    it("should catch errors and return null", async () => {
      (getBookById as any).mockRejectedValue(new Error("External API Down"));

      const result = await getBookDetailsAction("123");
      
      expect(result).toBeNull();
    });
  });
});
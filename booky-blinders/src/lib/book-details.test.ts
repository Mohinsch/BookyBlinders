import { beforeEach, describe, expect, it, vi } from "vitest";
import { BOOK_SOURCES, CONSTRAINTS, UI_TEXT } from "@/constants";
import { db } from "@/db";
import { getBookById } from "@/services/google-books";
import { getBookDetailsByRouteId } from "./book-details";

vi.mock("@/db", () => ({
  db: {
    query: {
      book: {
        findFirst: vi.fn(),
      },
    },
  },
}));

vi.mock("@/services/google-books", () => ({
  getBookById: vi.fn(),
}));

describe("getBookDetailsByRouteId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for an empty route id", async () => {
    const result = await getBookDetailsByRouteId("  ");
    expect(result).toBeNull();
  });

  it("maps a database book into the view model", async () => {
    vi.mocked(db.query.book.findFirst).mockResolvedValue({
      id: 42,
      googleId: "google-42",
      title: "Test Book",
      author: "Author One, Author Two",
      cover: "cover.jpg",
      publisher: null,
      publishedAt: "2024",
      description: "<p>My <strong>desc</strong></p>",
    } as never);

    const result = await getBookDetailsByRouteId("42");

    expect(result).toEqual({
      source: BOOK_SOURCES.INTERNAL,
      routeId: "42",
      internalId: 42,
      googleId: "google-42",
      title: "Test Book",
      authors: ["Author One", "Author Two"],
      cover: "cover.jpg",
      publisher: null,
      publishedDate: "2024",
      pageCount: null,
      isbn: null,
      categories: [],
      description: "My desc",
    });
  });

  it("falls back to Google Books when DB lookup fails", async () => {
    vi.mocked(db.query.book.findFirst).mockRejectedValue(
      new Error("DB failed"),
    );
    vi.mocked(getBookById).mockResolvedValue({
      id: "google-123",
      volumeInfo: {
        title: "External Book",
        authors: ["External Author"],
        imageLinks: { thumbnail: "thumb.jpg" },
        publisher: "Pub",
        publishedDate: "2022",
        pageCount: 320,
        industryIdentifiers: [{ type: "ISBN_13", identifier: "9781234567890" }],
        categories: ["A", "B", "C", "D"],
        description: "<p>External desc</p>",
      },
    } as never);

    const result = await getBookDetailsByRouteId("google-123");

    expect(result).toEqual({
      source: BOOK_SOURCES.EXTERNAL,
      routeId: "google-123",
      internalId: null,
      googleId: "google-123",
      title: "External Book",
      authors: ["External Author"],
      cover: "thumb.jpg",
      publisher: "Pub",
      publishedDate: "2022",
      pageCount: 320,
      isbn: "9781234567890",
      categories: ["A", "B", "C", "D"].slice(
        0,
        CONSTRAINTS.CATEGORIES.MAX_DISPLAYED,
      ),
      description: "External desc",
    });
  });

  it("uses ISBN-10 when ISBN-13 is missing", async () => {
    vi.mocked(db.query.book.findFirst).mockResolvedValue(null as never);
    vi.mocked(getBookById).mockResolvedValue({
      id: "google-10",
      volumeInfo: {
        title: "ISBN10 Book",
        authors: ["Author"],
        industryIdentifiers: [{ type: "ISBN_10", identifier: "1234567890" }],
        categories: [],
        description: "Desc",
      },
    } as never);

    const result = await getBookDetailsByRouteId("google-10");

    expect(result?.isbn).toBe("1234567890");
  });

  it("returns null ISBN when no identifiers are provided", async () => {
    vi.mocked(db.query.book.findFirst).mockResolvedValue(null as never);
    vi.mocked(getBookById).mockResolvedValue({
      id: "google-none",
      volumeInfo: {
        title: "No ISBN Book",
        authors: ["Author"],
        categories: [],
        description: "Desc",
      },
    } as never);

    const result = await getBookDetailsByRouteId("google-none");

    expect(result?.isbn).toBeNull();
  });

  it("returns null when Google Books has no match", async () => {
    vi.mocked(db.query.book.findFirst).mockResolvedValue(null as never);
    vi.mocked(getBookById).mockResolvedValue(null as never);

    const result = await getBookDetailsByRouteId("missing");

    expect(result).toBeNull();
  });

  it("falls back to a default description when missing", async () => {
    vi.mocked(db.query.book.findFirst).mockResolvedValue({
      id: 1,
      googleId: "g1",
      title: "No Desc",
      author: null,
      cover: null,
      publisher: null,
      publishedAt: null,
      description: null,
    } as never);

    const result = await getBookDetailsByRouteId("1");

    expect(result?.description).toBe(UI_TEXT.BOOK.NO_DESCRIPTION);
  });
});

import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { book } from "@/db/schema";
import { getBookById } from "@/services/google-books";
import { BOOK_SOURCES, ISBN_TYPES, UI_TEXT, LOG_MESSAGES, CONSTRAINTS } from "@/constants";

export interface BookDetailsViewModel {
  source: typeof BOOK_SOURCES[keyof typeof BOOK_SOURCES];
  routeId: string;
  internalId: number | null;
  googleId: string | null;
  title: string;
  authors: string[];
  cover: string | null;
  publisher: string | null;
  publishedDate: string | null;
  pageCount: number | null;
  isbn: string | null;
  categories: string[];
  description: string;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

function extractIsbn(
  industryIdentifiers?: Array<{ type: string; identifier: string }>,
): string | null {
  if (!industryIdentifiers || industryIdentifiers.length === 0) return null;
  
  const isbn13 = industryIdentifiers.find(
    (id) => id.type.toUpperCase() === ISBN_TYPES.ISBN_13,
  );
  if (isbn13) return isbn13.identifier;
  
  const isbn10 = industryIdentifiers.find(
    (id) => id.type.toUpperCase() === ISBN_TYPES.ISBN_10,
  );
  return isbn10?.identifier || null;
}

function getTopCategories(categories?: string[], limit = CONSTRAINTS.CATEGORIES.MAX_DISPLAYED): string[] {
  if (!categories) return [];
  return categories.slice(0, limit);
}

export async function getBookDetailsByRouteId(
  routeId: string,
): Promise<BookDetailsViewModel | null> {
  const normalizedId = routeId.trim();
  if (!normalizedId) return null;

  const numericId = Number.parseInt(normalizedId, 10);
  const isNumeric = Number.isInteger(numericId) && String(numericId) === normalizedId;

  try {
    const dbBook = await db.query.book.findFirst({
      where: isNumeric
        ? or(eq(book.googleId, normalizedId), eq(book.id, numericId))
        : eq(book.googleId, normalizedId),
      columns: {
        id: true,
        googleId: true,
        title: true,
        author: true,
        cover: true,
        publisher: true,
        publishedAt: true,
        description: true,
      },
    });

    if (dbBook) {
      return {
        source: BOOK_SOURCES.INTERNAL,
        routeId: normalizedId,
        internalId: dbBook.id,
        googleId: dbBook.googleId,
        title: dbBook.title,
        authors: dbBook.author
          ? dbBook.author.split(",").map((author) => author.trim())
          : [],
        cover: dbBook.cover,
        publisher: dbBook.publisher || null,
        publishedDate: dbBook.publishedAt || null,
        pageCount: null,
        isbn: null,
        categories: [],
        description: dbBook.description
          ? stripHtml(dbBook.description)
          : UI_TEXT.BOOK.NO_DESCRIPTION,
      };
    }
  } catch (error) {
    console.error(
      LOG_MESSAGES.BOOK_DETAILS.DB_FALLBACK,
      error,
    );
  }

  const googleBook = await getBookById(normalizedId);
  if (!googleBook) return null;

  return {
    source: BOOK_SOURCES.EXTERNAL,
    routeId: normalizedId,
    internalId: null,
    googleId: googleBook.id,
    title: googleBook.volumeInfo.title,
    authors: googleBook.volumeInfo.authors || [],
    cover: googleBook.volumeInfo.imageLinks?.thumbnail || null,
    publisher: googleBook.volumeInfo.publisher || null,
    publishedDate: googleBook.volumeInfo.publishedDate || null,
    pageCount: googleBook.volumeInfo.pageCount || null,
    isbn: extractIsbn(googleBook.volumeInfo.industryIdentifiers),
    categories: getTopCategories(googleBook.volumeInfo.categories),
    description: googleBook.volumeInfo.description
      ? stripHtml(googleBook.volumeInfo.description)
      : UI_TEXT.BOOK.NO_DESCRIPTION,
  };
}

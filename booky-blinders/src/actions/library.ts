"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { book, library, libraryBook } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getBookById } from "@/services/google-books";
import type {
  ActionResponse,
  ReadingStatus,
  UserLibraryBook,
  UserLibrarySummary,
} from "@/types/library";

/**
 * Validates the current session and retrieves the authenticated user.
 * * @throws {Error} If the session is invalid or user is not authenticated
 * @returns The authenticated user object
 */
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

async function ensureUserLibrary(
  userId: string,
  libraryId?: number,
): Promise<{ id: number; name: string }> {
  const userLibraries = await db.query.library.findMany({
    where: eq(library.userId, userId),
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: desc(library.createdAt),
  });

  if (userLibraries.length === 0) {
    const insertedLibs = await db
      .insert(library)
      .values({
        userId,
        name: "My Collection",
        isPublic: false,
      })
      .returning({
        id: library.id,
        name: library.name,
      });

    return insertedLibs[0];
  }

  if (libraryId) {
    const selectedLibrary = userLibraries.find((lib) => lib.id === libraryId);
    if (!selectedLibrary) {
      throw new Error("Library not found");
    }
    return { id: selectedLibrary.id, name: selectedLibrary.name };
  }

  const [defaultLibrary] = userLibraries;
  return { id: defaultLibrary.id, name: defaultLibrary.name };
}

export async function getUserLibraries(): Promise<UserLibrarySummary[]> {
  try {
    const user = await requireAuth();
    const defaultLibrary = await ensureUserLibrary(user.id);

    const userLibraries = await db.query.library.findMany({
      where: eq(library.userId, user.id),
      columns: {
        id: true,
        name: true,
      },
      orderBy: desc(library.createdAt),
    });

    if (userLibraries.length === 0) return [defaultLibrary];
    return userLibraries;
  } catch (error) {
    console.error("[Action Error] getUserLibraries:", error);
    return [];
  }
}

export async function getOwnedGoogleBookIds(): Promise<string[]> {
  try {
    const user = await requireAuth();

    const entries = await db
      .select({
        googleId: book.googleId,
      })
      .from(libraryBook)
      .innerJoin(library, eq(library.id, libraryBook.libraryId))
      .innerJoin(book, eq(book.id, libraryBook.bookId))
      .where(eq(library.userId, user.id));

    const ownedIds = entries
      .map((entry) => entry.googleId)
      .filter((googleId): googleId is string => Boolean(googleId));

    return [...new Set(ownedIds)];
  } catch (error) {
    console.error("[Action Error] getOwnedGoogleBookIds:", error);
    return [];
  }
}

export async function createLibrary(name: string): Promise<ActionResponse> {
  try {
    const user = await requireAuth();
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error("Library name is required");
    }

    await db.insert(library).values({
      userId: user.id,
      name: trimmedName,
      isPublic: false,
    });

    revalidatePath("/library");
    return { success: true, message: "Library created" };
  } catch (error) {
    console.error("[Action Error] createLibrary:", error);
    return { success: false, message: "Failed to create library" };
  }
}

export async function renameLibrary(
  libraryId: number,
  name: string,
): Promise<ActionResponse> {
  try {
    const user = await requireAuth();
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error("Library name is required");
    }

    const ownedLibrary = await db.query.library.findFirst({
      where: and(eq(library.id, libraryId), eq(library.userId, user.id)),
      columns: { id: true },
    });

    if (!ownedLibrary) {
      throw new Error("Library not found");
    }

    await db
      .update(library)
      .set({
        name: trimmedName,
        updatedAt: new Date(),
      })
      .where(and(eq(library.id, libraryId), eq(library.userId, user.id)));

    revalidatePath("/library");
    return { success: true, message: "Library renamed" };
  } catch (error) {
    console.error("[Action Error] renameLibrary:", error);
    return { success: false, message: "Failed to rename library" };
  }
}

export async function deleteLibrary(
  libraryId: number,
): Promise<ActionResponse> {
  try {
    const user = await requireAuth();

    const userLibraries = await db.query.library.findMany({
      where: eq(library.userId, user.id),
      columns: { id: true },
    });

    if (userLibraries.length <= 1) {
      throw new Error("Cannot delete last library");
    }

    const ownedLibrary = userLibraries.find((entry) => entry.id === libraryId);
    if (!ownedLibrary) {
      throw new Error("Library not found");
    }

    await db
      .delete(library)
      .where(and(eq(library.id, libraryId), eq(library.userId, user.id)));

    revalidatePath("/library");
    return { success: true, message: "Library deleted" };
  } catch (error) {
    console.error("[Action Error] deleteLibrary:", error);
    return { success: false, message: "Failed to delete library" };
  }
}

/**
 * Fetches book details from Google Books API, upserts the book record,
 * and associates it with the authenticated user's primary library.
 * * @param googleId - The unique identifier from Google Books API
 * @returns ActionResponse indicating success or failure
 */
export async function addBookToLibrary(
  googleId: string,
  libraryId?: number,
): Promise<ActionResponse> {
  try {
    const user = await requireAuth();

    // Fetch book metadata from external API
    const googleBookData = await getBookById(googleId);
    if (!googleBookData) throw new Error("Book not found");

    // Check for existing book record to prevent duplicates
    let existingBook = await db.query.book.findFirst({
      where: eq(book.googleId, googleId),
    });

    // Insert new book record if it does not exist
    if (!existingBook) {
      const insertedBooks = await db
        .insert(book)
        .values({
          googleId: googleId,
          title: googleBookData.volumeInfo.title,
          author: googleBookData.volumeInfo.authors?.join(", ") || null,
          description: googleBookData.volumeInfo.description || null,
          cover: googleBookData.volumeInfo.imageLinks?.thumbnail || null,
          publishedAt: googleBookData.volumeInfo.publishedDate || null,
        })
        .returning();

      existingBook = insertedBooks[0];
    }

    const userLibrary = await ensureUserLibrary(user.id, libraryId);

    // Create junction record. Ignores conflict if association already exists.
    await db
      .insert(libraryBook)
      .values({
        bookId: existingBook.id,
        libraryId: userLibrary.id,
        readStart: null,
        readEnd: null,
      })
      .onConflictDoNothing();

    // Purge Next.js cache for the library route
    revalidatePath("/library");

    return { success: true, message: "Book added" };
  } catch (error) {
    console.error("[Action Error] addBookToLibrary:", error);
    return { success: false, message: "Failed to add book" };
  }
}

/**
 * Retrieves all books associated with the authenticated user's library.
 * Performs an inner join between libraryBook and book tables.
 * * @returns Array of UserLibraryBook objects
 */
export async function getUserLibrary(
  libraryId?: number,
): Promise<UserLibraryBook[]> {
  try {
    const user = await requireAuth();
    const userLibrary = await ensureUserLibrary(user.id, libraryId);

    const myBooks = await db
      .select({
        id: book.id,
        libraryId: libraryBook.libraryId,
        googleId: book.googleId,
        title: book.title,
        author: book.author,
        cover: book.cover,
        readStart: libraryBook.readStart,
        readEnd: libraryBook.readEnd,
        addedAt: libraryBook.addedAt,
      })
      .from(libraryBook)
      .innerJoin(book, eq(book.id, libraryBook.bookId))
      .where(eq(libraryBook.libraryId, userLibrary.id))
      .orderBy(desc(libraryBook.addedAt));

    return myBooks;
  } catch (error) {
    console.error("[Action Error] getUserLibrary:", error);
    return [];
  }
}

/**
 * Updates the reading progression timestamps for a specific book in the user's library.
 * * @param bookId - The internal database ID of the book
 * @param status - The new reading status (TO_READ, IN_PROGRESS, READ)
 * @returns ActionResponse indicating success or failure
 */
export async function updateReadingStatus(
  bookId: number,
  status: ReadingStatus,
  libraryId?: number,
): Promise<ActionResponse> {
  try {
    const user = await requireAuth();
    const userLibrary = await ensureUserLibrary(user.id, libraryId);

    let readStart: string | null = null;
    let readEnd: string | null = null;

    const today = new Date().toISOString().split("T")[0];

    // Compute timestamps based on the provided status
    if (status === "IN_PROGRESS") {
      readStart = today;
    } else if (status === "READ") {
      readStart = today;
      readEnd = today;
    }

    await db
      .update(libraryBook)
      .set({
        readStart,
        readEnd,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(libraryBook.bookId, bookId),
          eq(libraryBook.libraryId, userLibrary.id),
        ),
      );

    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error("[Action Error] updateReadingStatus:", error);
    return { success: false };
  }
}

/**
 * Removes the association between a book and the user's library.
 * Does not delete the book record from the main book table.
 * * @param bookId - The internal database ID of the book
 * @returns ActionResponse indicating success or failure
 */
export async function removeBookFromLibrary(
  bookId: number,
  libraryId?: number,
): Promise<ActionResponse> {
  try {
    const user = await requireAuth();
    const userLibrary = await ensureUserLibrary(user.id, libraryId);

    await db
      .delete(libraryBook)
      .where(
        and(
          eq(libraryBook.bookId, bookId),
          eq(libraryBook.libraryId, userLibrary.id),
        ),
      );

    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error("[Action Error] removeBookFromLibrary:", error);
    return { success: false };
  }
}

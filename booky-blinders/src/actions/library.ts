"use server";

import { db } from "@/db";
import { book, library, libraryBook } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getBookById } from "@/services/google-books";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { UserLibraryBook, ReadingStatus, ActionResponse } from "@/types/library";

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

/**
 * Fetches book details from Google Books API, upserts the book record,
 * and associates it with the authenticated user's primary library.
 * * @param googleId - The unique identifier from Google Books API
 * @returns ActionResponse indicating success or failure
 */
export async function addBookToLibrary(googleId: string): Promise<ActionResponse> {
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
      const insertedBooks = await db.insert(book).values({
        googleId: googleId,
        title: googleBookData.volumeInfo.title,
        author: googleBookData.volumeInfo.authors?.join(", ") || null,
        description: googleBookData.volumeInfo.description || null,
        cover: googleBookData.volumeInfo.imageLinks?.thumbnail || null,
        publishedAt: googleBookData.volumeInfo.publishedDate || null,
      }).returning();
      
      existingBook = insertedBooks[0];
    }

    // Resolve user's primary library
    let userLibrary = await db.query.library.findFirst({
      where: eq(library.userId, user.id),
    });

    // Create a default library if the user does not have one
    if (!userLibrary) {
      const insertedLibs = await db.insert(library).values({
        userId: user.id,
        name: "My Collection",
        isPublic: false,
      }).returning();
      
      userLibrary = insertedLibs[0];
    }

    // Create junction record. Ignores conflict if association already exists.
    await db.insert(libraryBook).values({
      bookId: existingBook.id,
      libraryId: userLibrary.id,
      readStart: null,
      readEnd: null,
    }).onConflictDoNothing(); 

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
export async function getUserLibrary(): Promise<UserLibraryBook[]> {
  try {
    const user = await requireAuth();

    const userLibrary = await db.query.library.findFirst({
      where: eq(library.userId, user.id),
    });

    if (!userLibrary) return [];

    const myBooks = await db
      .select({
        id: book.id,
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
  status: ReadingStatus
): Promise<ActionResponse> {
  try {
    const user = await requireAuth();

    const userLibrary = await db.query.library.findFirst({
      where: eq(library.userId, user.id),
    });

    if (!userLibrary) throw new Error("Library not found");

    let readStart: string | null = null;
    let readEnd: string | null = null;
    
    const today = new Date().toISOString().split('T')[0];

    // Compute timestamps based on the provided status
    if (status === 'IN_PROGRESS') {
      readStart = today;
    } else if (status === 'READ') {
      readStart = today; 
      readEnd = today;
    }

    await db.update(libraryBook)
      .set({
        readStart,
        readEnd,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(libraryBook.bookId, bookId),
          eq(libraryBook.libraryId, userLibrary.id)
        )
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
export async function removeBookFromLibrary(bookId: number): Promise<ActionResponse> {
  try {
    const user = await requireAuth();

    const userLibrary = await db.query.library.findFirst({
      where: eq(library.userId, user.id),
    });

    if (!userLibrary) throw new Error("Library not found");

    await db.delete(libraryBook)
      .where(
        and(
          eq(libraryBook.bookId, bookId),
          eq(libraryBook.libraryId, userLibrary.id)
        )
      );

    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error("[Action Error] removeBookFromLibrary:", error);
    return { success: false };
  }
}
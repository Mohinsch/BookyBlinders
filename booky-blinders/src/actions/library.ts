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
import {
  createLibrarySchema,
  renameLibrarySchema,
  deleteLibrarySchema,
  addBookToLibrarySchema,
  updateReadingStatusSchema,
  removeBookFromLibrarySchema,
  getUserLibrarySchema,
  type CreateLibraryInput,
  type RenameLibraryInput,
  type DeleteLibraryInput,
  type AddBookToLibraryInput,
  type UpdateReadingStatusInput,
  type RemoveBookFromLibraryInput,
  type GetUserLibraryInput,
} from "@/lib/schemas";
import { validateWithZod } from "@/lib/validation";
import {
  libraryOperationLimiter,
  checkRateLimit,
  trackViolation,
} from "@/lib/rate-limit";
import { UI_TEXT, READING_STATUS, LOG_MESSAGES } from "@/constants";
import { ensureCategoriesExist, linkBookToCategories } from "@/lib/category-utils";
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
        name: UI_TEXT.BOOK.DEFAULT_LIBRARY,
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
    console.error(LOG_MESSAGES.ACTION.ERROR("getUserLibraries"), error);
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
    console.error(LOG_MESSAGES.ACTION.ERROR("getOwnedGoogleBookIds"), error);
    return [];
  }
}

export async function createLibrary(name: string): Promise<ActionResponse> {
  try {
    const validationResult = validateWithZod<CreateLibraryInput>(
      createLibrarySchema,
      { name },
    );
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    const user = await requireAuth();

    // ✅ Rate limiting: 100 operations per minute per user
    const rateLimitKey = `library:${user.id}:create`;
    const { allowed, error } = checkRateLimit(
      libraryOperationLimiter,
      rateLimitKey
    );

    if (!allowed) {
      console.warn(
        `[Action] Rate limit exceeded for user ${user.id}: ${error}`
      );
      trackViolation(user.id, "create-library", "server-action");
      return {
        success: false,
        message: error || "Too many requests. Please try again later.",
      };
    }

    await db.insert(library).values({
      userId: user.id,
      name: validationResult.data!.name,
      isPublic: false,
    });

    revalidatePath("/library");
    return { success: true, message: "Library created" };
  } catch (error) {
    console.error(LOG_MESSAGES.ACTION.ERROR("createLibrary"), error);
    const message = error instanceof Error ? error.message : "Failed to create library";
    return { success: false, message };
  }
}

export async function renameLibrary(
  libraryId: number,
  name: string,
): Promise<ActionResponse> {
  try {
    const validationResult = validateWithZod<RenameLibraryInput>(renameLibrarySchema, {
      libraryId,
      name,
    });
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    const user = await requireAuth();

    // ✅ Rate limiting: 100 operations per minute per user
    const rateLimitKey = `library:${user.id}:rename`;
    const { allowed, error } = checkRateLimit(
      libraryOperationLimiter,
      rateLimitKey
    );

    if (!allowed) {
      console.warn(
        `[Action] Rate limit exceeded for user ${user.id}: ${error}`
      );
      trackViolation(user.id, "rename-library", "server-action");
      return {
        success: false,
        message: error || "Too many requests. Please try again later.",
      };
    }

    const ownedLibrary = await db.query.library.findFirst({
      where: and(eq(library.id, validationResult.data!.libraryId), eq(library.userId, user.id)),
      columns: { id: true },
    });

    if (!ownedLibrary) {
      return {
        success: false,
        message: "Library not found or not authorized",
      };
    }

    await db
      .update(library)
      .set({
        name: validationResult.data!.name,
        updatedAt: new Date(),
      })
      .where(and(eq(library.id, validationResult.data!.libraryId), eq(library.userId, user.id)));

    revalidatePath("/library");
    return { success: true, message: "Library renamed" };
  } catch (error) {
    console.error(LOG_MESSAGES.ACTION.ERROR("renameLibrary"), error);
    const message = error instanceof Error ? error.message : "Failed to rename library";
    return { success: false, message };
  }
}

export async function deleteLibrary(
  libraryId: number,
): Promise<ActionResponse> {
  try {
    const validationResult = validateWithZod<DeleteLibraryInput>(deleteLibrarySchema, { libraryId });
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    const user = await requireAuth();

    // ✅ Rate limiting: 100 operations per minute per user
    const rateLimitKey = `library:${user.id}:delete`;
    const { allowed, error } = checkRateLimit(
      libraryOperationLimiter,
      rateLimitKey
    );

    if (!allowed) {
      console.warn(
        `[Action] Rate limit exceeded for user ${user.id}: ${error}`
      );
      trackViolation(user.id, "delete-library", "server-action");
      return {
        success: false,
        message: error || "Too many requests. Please try again later.",
      };
    }

    const userLibraries = await db.query.library.findMany({
      where: eq(library.userId, user.id),
      columns: { id: true },
    });

    if (userLibraries.length <= 1) {
      return {
        success: false,
        message: "Cannot delete your last library",
      };
    }

    const ownedLibrary = userLibraries.find((entry) => entry.id === validationResult.data!.libraryId);
    if (!ownedLibrary) {
      return {
        success: false,
        message: "Library not found or not authorized",
      };
    }

    await db
      .delete(library)
      .where(and(eq(library.id, validationResult.data!.libraryId), eq(library.userId, user.id)));

    revalidatePath("/library");
    return { success: true, message: "Library deleted" };
  } catch (error) {
    console.error(LOG_MESSAGES.ACTION.ERROR("deleteLibrary"), error);
    const message = error instanceof Error ? error.message : "Failed to delete library";
    return { success: false, message };
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
    const validationResult = validateWithZod<AddBookToLibraryInput>(
      addBookToLibrarySchema,
      {
        googleId,
        libraryId,
      },
    );
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    const user = await requireAuth();

    // ✅ Rate limiting: 100 operations per minute per user
    const rateLimitKey = `library:${user.id}:add-book`;
    const { allowed, error } = checkRateLimit(
      libraryOperationLimiter,
      rateLimitKey
    );

    if (!allowed) {
      console.warn(
        `[Action] Rate limit exceeded for user ${user.id}: ${error}`
      );
      trackViolation(user.id, "add-book", "server-action");
      return {
        success: false,
        message: error || "Too many requests. Please try again later.",
      };
    }

    // Fetch book metadata from external API
    const googleBookData = await getBookById(validationResult.data!.googleId);
    if (!googleBookData) {
      return { success: false, message: "Book not found" };
    }

    // Check for existing book record to prevent duplicates
    let existingBook = await db.query.book.findFirst({
      where: eq(book.googleId, validationResult.data!.googleId),
    });

    // Insert new book record if it does not exist
    if (!existingBook) {
      const insertedBooks = await db
        .insert(book)
        .values({
          googleId: validationResult.data!.googleId,
          title: googleBookData.volumeInfo.title,
          author: googleBookData.volumeInfo.authors?.join(", ") || null,
          description: googleBookData.volumeInfo.description || null,
          cover: googleBookData.volumeInfo.imageLinks?.thumbnail || null,
          publishedAt: googleBookData.volumeInfo.publishedDate || null,
        })
        .returning();

      existingBook = insertedBooks[0];
    }

    const userLibrary = await ensureUserLibrary(user.id, validationResult.data!.libraryId);

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
    console.error(LOG_MESSAGES.ACTION.ERROR("addBookToLibrary"), error);
    const message = error instanceof Error ? error.message : "Failed to add book";
    return { success: false, message };
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
    const validationResult = validateWithZod<GetUserLibraryInput>(getUserLibrarySchema, {
      libraryId,
    });
    if (!validationResult.success) {
      console.error(LOG_MESSAGES.ACTION.VALIDATION_ERROR("getUserLibrary"), validationResult.errors);
      return [];
    }

    const user = await requireAuth();
    const userLibrary = await ensureUserLibrary(user.id, validationResult.data!.libraryId);

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
    console.error(LOG_MESSAGES.ACTION.ERROR("getUserLibrary"), error);
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
    const validationResult = validateWithZod<UpdateReadingStatusInput>(
      updateReadingStatusSchema,
      {
        bookId,
        status,
        libraryId,
      },
    );
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    const user = await requireAuth();

    // ✅ Rate limiting: 100 operations per minute per user
    const rateLimitKey = `library:${user.id}:update-status`;
    const { allowed, error } = checkRateLimit(
      libraryOperationLimiter,
      rateLimitKey
    );

    if (!allowed) {
      console.warn(
        `[Action] Rate limit exceeded for user ${user.id}: ${error}`
      );
      trackViolation(user.id, "update-status", "server-action");
      return {
        success: false,
        message: error || "Too many requests. Please try again later.",
      };
    }

    const userLibrary = await ensureUserLibrary(user.id, validationResult.data!.libraryId);

    let readStart: string | null = null;
    let readEnd: string | null = null;

    const today = new Date().toISOString().split("T")[0];

    // Compute timestamps based on the provided status
    if (validationResult.data!.status === READING_STATUS.IN_PROGRESS) {
      readStart = today;
    } else if (validationResult.data!.status === READING_STATUS.READ) {
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
          eq(libraryBook.bookId, validationResult.data!.bookId),
          eq(libraryBook.libraryId, userLibrary.id),
        ),
      );

    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error(LOG_MESSAGES.ACTION.ERROR("updateReadingStatus"), error);
    const message = error instanceof Error ? error.message : "Failed to update reading status";
    return { success: false, message };
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
    const validationResult = validateWithZod<RemoveBookFromLibraryInput>(
      removeBookFromLibrarySchema,
      {
        bookId,
        libraryId,
      },
    );
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    const user = await requireAuth();

    // ✅ Rate limiting: 100 operations per minute per user
    const rateLimitKey = `library:${user.id}:remove-book`;
    const { allowed, error } = checkRateLimit(
      libraryOperationLimiter,
      rateLimitKey
    );

    if (!allowed) {
      console.warn(
        `[Action] Rate limit exceeded for user ${user.id}: ${error}`
      );
      trackViolation(user.id, "remove-book", "server-action");
      return {
        success: false,
        message: error || "Too many requests. Please try again later.",
      };
    }

    const userLibrary = await ensureUserLibrary(user.id, validationResult.data!.libraryId);

    await db
      .delete(libraryBook)
      .where(
        and(
          eq(libraryBook.bookId, validationResult.data!.bookId),
          eq(libraryBook.libraryId, userLibrary.id),
        ),
      );

    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error(LOG_MESSAGES.ACTION.ERROR("removeBookFromLibrary"), error);
    const message = error instanceof Error ? error.message : "Failed to remove book";
    return { success: false, message };
  }
}

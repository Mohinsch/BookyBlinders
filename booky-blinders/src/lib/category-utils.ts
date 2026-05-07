/**
 * Database utilities for managing book categories
 * Handles category creation and linking with proper error handling
 */

import { db } from "@/db";
import { category, bookCategory } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * Ensures categories exist in the database.
 * Creates missing categories and returns their IDs.
 * 
 * Handles category hierarchies: "Science Fiction / Fantasy" → ["Science Fiction", "Fantasy"]
 * 
 * @param categoryNames - Array of category names (may contain "/" for hierarchies)
 * @returns Array of category IDs
 */
export async function ensureCategoriesExist(
  categoryNames: string[] | undefined | null
): Promise<number[]> {
  if (!categoryNames || categoryNames.length === 0) {
    return [];
  }

  // Split categories by "/" and normalize: trim, lowercase for matching
  const normalizedNames = categoryNames
    .flatMap((name) => name.split("/").map((n) => n.trim().toLowerCase()))
    .filter(Boolean);

  if (normalizedNames.length === 0) {
    return [];
  }

  // Remove duplicates (in case Google Books returns overlapping hierarchies)
  const uniqueNames = [...new Set(normalizedNames)];

  try {
    // Find existing categories
    const existingCategories = await db.query.category.findMany({
      where: inArray(category.name, uniqueNames),
    });

    const existingNames = new Set(
      existingCategories.map((c) => c.name.toLowerCase())
    );
    const missingNames = uniqueNames.filter(
      (name) => !existingNames.has(name.toLowerCase())
    );

    // Insert missing categories
    let newCategories: typeof category.$inferSelect[] = [];
    if (missingNames.length > 0) {
      newCategories = await db
        .insert(category)
        .values(missingNames.map((name) => ({ name })))
        .returning();
    }

    // Combine and return all category IDs
    return [...existingCategories, ...newCategories].map((c) => c.id);
  } catch (error) {
    console.error("[Database] Error ensuring categories exist:", error);
    return [];
  }
}

/**
 * Links a book to its categories.
 * Creates entries in the book_category junction table.
 * Uses onConflictDoNothing to handle duplicates gracefully.
 * @param bookId - The book ID to link categories to
 * @param categoryIds - Array of category IDs to link
 */
export async function linkBookToCategories(
  bookId: number,
  categoryIds: number[]
): Promise<void> {
  if (!bookId || categoryIds.length === 0) {
    return;
  }

  try {
    await db
      .insert(bookCategory)
      .values(categoryIds.map((categoryId) => ({ bookId, categoryId })))
      .onConflictDoNothing();
  } catch (error) {
    console.error("[Database] Error linking book to categories:", error);
  }
}

/**
 * Removes all categories from a book before relinking.
 * Useful for updates where categories need to be replaced.
 * @param bookId - The book ID to remove categories from
 */
export async function removeBookCategories(bookId: number): Promise<void> {
  if (!bookId) return;

  try {
    await db
      .delete(bookCategory)
      .where(eq(bookCategory.bookId, bookId));
  } catch (error) {
    console.error("[Database] Error removing book categories:", error);
  }
}

/**
 * Updates a book's categories.
 * Removes old categories and links new ones.
 * @param bookId - The book ID to update
 * @param categoryNames - New category names
 */
export async function updateBookCategories(
  bookId: number,
  categoryNames: string[] | undefined | null
): Promise<void> {
  await removeBookCategories(bookId);

  if (!categoryNames || categoryNames.length === 0) {
    return;
  }

  const categoryIds = await ensureCategoriesExist(categoryNames);
  await linkBookToCategories(bookId, categoryIds);
}

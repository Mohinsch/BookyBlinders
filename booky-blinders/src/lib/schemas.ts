import { z } from "zod";
import type { ReadingStatus } from "@/types/library";

/**
 * Auth Schemas
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Library Schemas
 */
export const createLibrarySchema = z.object({
  name: z
    .string()
    .min(1, "Library name is required")
    .max(100, "Library name must be less than 100 characters")
    .trim(),
});

export const renameLibrarySchema = z.object({
  libraryId: z.number().int().positive("Invalid library ID"),
  name: z
    .string()
    .min(1, "Library name is required")
    .max(100, "Library name must be less than 100 characters")
    .trim(),
});

export const deleteLibrarySchema = z.object({
  libraryId: z.number().int().positive("Invalid library ID"),
});

/**
 * Book Schemas
 */
export const addBookToLibrarySchema = z.object({
  googleId: z.string().min(1, "Google Book ID is required"),
  libraryId: z.number().int().positive("Invalid library ID").optional(),
});

export const updateReadingStatusSchema = z.object({
  bookId: z.number().int().positive("Invalid book ID"),
  status: z
    .string()
    .refine((val) => ["TO_READ", "IN_PROGRESS", "READ"].includes(val), {
      message: "Invalid reading status",
    }) as z.ZodType<ReadingStatus>,
  libraryId: z.number().int().positive("Invalid library ID").optional(),
});

export const removeBookFromLibrarySchema = z.object({
  bookId: z.number().int().positive("Invalid book ID"),
  libraryId: z.number().int().positive("Invalid library ID").optional(),
});

export const getUserLibrarySchema = z.object({
  libraryId: z.number().int().positive("Invalid library ID").optional(),
});

/**
 * Export types for TypeScript inference
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateLibraryInput = z.infer<typeof createLibrarySchema>;
export type RenameLibraryInput = z.infer<typeof renameLibrarySchema>;
export type DeleteLibraryInput = z.infer<typeof deleteLibrarySchema>;
export type AddBookToLibraryInput = z.infer<typeof addBookToLibrarySchema>;
export type UpdateReadingStatusInput = z.infer<
  typeof updateReadingStatusSchema
>;
export type RemoveBookFromLibraryInput = z.infer<
  typeof removeBookFromLibrarySchema
>;
export type GetUserLibraryInput = z.infer<typeof getUserLibrarySchema>;

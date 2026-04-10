import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  date,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- 1. USER TABLE (ERD + Better-Auth requirements) ---
export const users = pgTable("user", {
  id: text("id").primaryKey(), // Better-Auth requires text ID
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  password: text("password"), // Hashed credential
  image: text("image"), // Profile picture URL
  role: varchar("role", { length: 20 }).default("user").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// --- 2. LIBRARY TABLE (Entity) ---
export const libraries = pgTable("library", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// --- 3. BOOK TABLE (Entity) ---
export const books = pgTable("book", {
  id: serial("id").primaryKey(),
  googleId: text("google_id").notNull().unique(), // Google Books API reference
  title: text("title").notNull(),
  cover: text("cover"), // Image URL/ID
  author: text("author"),
  description: text("description"),
  isbn: varchar("isbn", { length: 50 }),
  publisher: text("publisher"),
  publishedAt: date("published_at"),
});

// --- 4. LIBRARY_BOOK TABLE (Pivot / Junction) ---
export const libraryBooks = pgTable("library_book", {
  id: serial("id").primaryKey(),
  comment: text("comment"), // Personal note
  readStart: date("read_start"),
  readEnd: date("read_end"),
  libraryId: integer("library_id")
    .notNull()
    .references(() => libraries.id, { onDelete: "cascade" }),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  uniqueBookInLibrary: uniqueIndex("unique_book_library").on(table.libraryId, table.bookId),
}));

// --- 5. CATEGORY & PIVOTS ---
export const categories = pgTable("category", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const bookCategories = pgTable("book_category", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  bookId: integer("book_id").notNull().references(() => books.id),
});

export const userCategories = pgTable("user_category", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  userId: text("user_id").notNull().references(() => users.id),
});

// --- 6. REVIEWS (Evolution) ---
export const reviews = pgTable("review", {
  id: serial("id").primaryKey(),
  content: text("content"),
  rating: integer("rating"), // 0 to 10 as per ERD
  userId: text("user_id").notNull().references(() => users.id),
  bookId: integer("book_id").notNull().references(() => books.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// --- 7. BETTER-AUTH MANDATORY TABLES ---
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
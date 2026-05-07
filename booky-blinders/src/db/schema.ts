// src/db/schema.ts
import { pgTable, text, timestamp, boolean, serial, varchar, date, integer, unique, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. BETTER-AUTH CORE TABLES (Merged & Optimized)
// ==========================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // username
  email: text("email").notNull().unique(), // auth credential
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"), // profile picture URL
  role: varchar("role", { length: 50 }).default("user").notNull(), // Added: permissions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"), // Added: soft delete
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(), // Required by Better-Auth
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => [
  index("session_userId_idx").on(table.userId)
]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"), // Better-Auth specific
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"), // Better-Auth specific
  scope: text("scope"),
  password: text("password"), // hashed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("account_userId_idx").on(table.userId)
]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("verification_identifier_idx").on(table.identifier)
]);

// ==========================================
// 2. MVP CORE TABLES (Business Logic)
// ==========================================

export const library = pgTable("library", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  isPublic: boolean("is_public").default(false).notNull(), // visibility toggle
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const book = pgTable("book", {
  id: serial("id").primaryKey(),
  googleId: varchar("google_id", { length: 255 }).unique(), // Google Books API reference
  title: varchar("title", { length: 255 }).notNull(),
  cover: text("cover"), // image URL/ID
  author: varchar("author", { length: 255 }),
  description: text("description"),
  isbn: varchar("isbn", { length: 50 }),
  publisher: varchar("publisher", { length: 255 }),
  publishedAt: varchar("published_at", { length: 20 }),
});

export const libraryBook = pgTable("library_book", {
  id: serial("id").primaryKey(),
  comment: text("comment"), // personal note
  readStart: date("read_start"),
  readEnd: date("read_end"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  bookId: integer("book_id").notNull().references(() => book.id, { onDelete: "cascade" }),
  libraryId: integer("library_id").notNull().references(() => library.id, { onDelete: "cascade" }),
}, (t) => ({
  // Composite unique constraint: prevents adding the same book to the same library multiple times
  unq: unique().on(t.libraryId, t.bookId),
  // Index for fast lookups by library
  libraryIdx: index("library_book_library_id_idx").on(t.libraryId),
  // Index for fast lookups by book
  bookIdx: index("library_book_book_id_idx").on(t.bookId),
}));

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const bookCategory = pgTable("book_category", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => category.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => book.id, { onDelete: "cascade" }),
}, (t) => ({
  // Composite unique constraint: prevents duplicate book-category links
  unq: unique().on(t.bookId, t.categoryId),
  // Index for fast lookups by book
  bookIdx: index("book_category_book_id_idx").on(t.bookId),
  // Index for fast lookups by category
  categoryIdx: index("book_category_category_id_idx").on(t.categoryId),
}));

export const userCategory = pgTable("user_category", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => category.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (t) => ({
  // Composite unique constraint: prevents a user from having duplicate favorite categories
  unq: unique().on(t.userId, t.categoryId),
  // Index for fast lookups by user
  userIdx: index("user_category_user_id_idx").on(t.userId),
  // Index for fast lookups by category
  categoryIdx: index("user_category_category_id_idx").on(t.categoryId),
}));

// ==========================================
// 3. EVOLUTION TABLES (V2)
// ==========================================

export const review = pgTable("review", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(), // 0 to 10
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  bookId: integer("book_id").notNull().references(() => book.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

// ==========================================
// 4. RELATIONS (Auth + Business)
// ==========================================

// Relation: A user has many libraries, reviews, sessions, and accounts
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  libraries: many(library),
  reviews: many(review),
  favoriteCategories: many(userCategory),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Relation: A library belongs to a user and contains many books
export const libraryRelations = relations(library, ({ one, many }) => ({
  owner: one(user, {
    fields: [library.userId],
    references: [user.id],
  }),
  books: many(libraryBook),
}));

// Relation: A book can be in multiple libraries, categories, and have many reviews
export const bookRelations = relations(book, ({ many }) => ({
  libraries: many(libraryBook),
  categories: many(bookCategory),
  reviews: many(review),
}));

// Relation: A category has many books and interested users
export const categoryRelations = relations(category, ({ many }) => ({
  books: many(bookCategory),
  users: many(userCategory),
}));

// Pivot Relation: Link between Library and Book
export const libraryBookRelations = relations(libraryBook, ({ one }) => ({
  book: one(book, {
    fields: [libraryBook.bookId],
    references: [book.id],
  }),
  library: one(library, {
    fields: [libraryBook.libraryId],
    references: [library.id],
  }),
}));

// Pivot Relation: Link between Book and Category
export const bookCategoryRelations = relations(bookCategory, ({ one }) => ({
  book: one(book, {
    fields: [bookCategory.bookId],
    references: [book.id],
  }),
  category: one(category, {
    fields: [bookCategory.categoryId],
    references: [category.id],
  }),
}));

// Pivot Relation: Link between User and Category
export const userCategoryRelations = relations(userCategory, ({ one }) => ({
  user: one(user, {
    fields: [userCategory.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [userCategory.categoryId],
    references: [category.id],
  }),
}));

// Relation: Review (Belongs to User and Book)
export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  book: one(book, {
    fields: [review.bookId],
    references: [book.id],
  }),
}));
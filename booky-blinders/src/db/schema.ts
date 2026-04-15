// src/db/schema.ts
import { pgTable, text, timestamp, boolean, serial, varchar, date, integer, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. BETTER-AUTH CORE TABLES
// ==========================================

export const user = pgTable("user", {
  id: text("id").primaryKey(), // Managed by Better-Auth (UUID/CUID)
  name: text("name").notNull(), // username
  email: text("email").notNull().unique(), // auth credential
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"), // profile picture URL
  role: varchar("role", { length: 50 }).default("user").notNull(), // permissions
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: timestamp("expires_at"),
  password: text("password"), // Hashed password isolated from identity
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// ==========================================
// 2. MVP CORE TABLES
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
  publishedAt: date("published_at"),
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
  // Prevents adding the same book to the same library multiple times
  unq: unique().on(t.libraryId, t.bookId),
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
  // Prevents linking the same category to the same book multiple times
  unq: unique().on(t.bookId, t.categoryId),
}));

export const userCategory = pgTable("user_category", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => category.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (t) => ({
  // Prevents a user from having duplicate favorite categories
  unq: unique().on(t.userId, t.categoryId),
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
// 4. RELATIONS
// ==========================================

// Relation: A user has many libraries, reviews, and favorite categories
export const userRelations = relations(user, ({ many }) => ({
  libraries: many(library),
  reviews: many(review),
  favoriteCategories: many(userCategory),
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
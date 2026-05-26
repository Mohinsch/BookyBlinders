import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

const REQUIRED_ENV = ["DATABASE_URL"];

const ensureEnv = () => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${missing.join(", ")}. Set them before running the seed.`,
    );
  }
};

const shouldReset = process.env.SEED_RESET !== "false";

const seed = async () => {
  ensureEnv();

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    if (shouldReset) {
      await reset(db, schema);
    }

    const users = [
      {
        id: "user_demo_alice",
        name: "Alice Reader",
        email: "alice@booky.local",
        emailVerified: true,
        image: null,
        role: "user",
      },
      {
        id: "user_demo_bob",
        name: "Bob Librarian",
        email: "bob@booky.local",
        emailVerified: true,
        image: null,
        role: "user",
      },
      {
        id: "user_demo_admin",
        name: "Admin Archivist",
        email: "admin@booky.local",
        emailVerified: true,
        image: null,
        role: "admin",
      },
    ];

    await db.insert(schema.user).values(users);

    const categories = await db
      .insert(schema.category)
      .values([
        { name: "Classics", isActive: true },
        { name: "Sci-Fi", isActive: true },
        { name: "Fantasy", isActive: true },
        { name: "Non-fiction", isActive: true },
      ])
      .returning();

    const categoriesByName = Object.fromEntries(
      categories.map((category) => [category.name, category.id]),
    );

    const books = await db
      .insert(schema.book)
      .values([
        {
          googleId: "demo_gatsby",
          title: "The Great Gatsby",
          cover: null,
          author: "F. Scott Fitzgerald",
          description: "A portrait of the Jazz Age and its fractured dreams.",
          isbn: "9780743273565",
          publisher: "Scribner",
          publishedAt: "1925",
        },
        {
          googleId: "demo_1984",
          title: "1984",
          cover: null,
          author: "George Orwell",
          description: "A chilling dystopia about surveillance and control.",
          isbn: "9780451524935",
          publisher: "Secker & Warburg",
          publishedAt: "1949",
        },
        {
          googleId: "demo_missing_author",
          title: "Untitled Manuscript",
          cover: null,
          author: null,
          description: "Edge case: missing author and cover.",
          isbn: null,
          publisher: null,
          publishedAt: null,
        },
        {
          googleId: "demo_long_title",
          title: "A Very Long Book Title Used to Stress the UI Layout in Lists",
          cover: null,
          author: "Various Authors",
          description:
            "A deliberately long title to verify wrapping in cards and tables.",
          isbn: "9780000000001",
          publisher: "Booky Press",
          publishedAt: "2020",
        },
        {
          googleId: "demo_sparse",
          title: "The Silent Shelf",
          cover: null,
          author: "Unknown",
          description: null,
          isbn: null,
          publisher: null,
          publishedAt: null,
        },
        {
          googleId: "demo_future_release",
          title: "Tomorrow's Archive",
          cover: null,
          author: "Future Writer",
          description: "A future-dated release to test sorting and filters.",
          isbn: "9780000000002",
          publisher: "Next Editions",
          publishedAt: "2035",
        },
      ])
      .returning();

    const booksByGoogleId = Object.fromEntries(
      books
        .filter((book) => Boolean(book.googleId))
        .map((book) => [book.googleId as string, book.id]),
    );

    const libraries = await db
      .insert(schema.library)
      .values([
        {
          name: "Main Library",
          isPublic: false,
          userId: users[0].id,
        },
        { name: "Wishlist", isPublic: true, userId: users[0].id },
        { name: "Tech Reads", isPublic: false, userId: users[1].id },
        { name: "Empty Library", isPublic: false, userId: users[1].id },
      ])
      .returning();

    const librariesByName = Object.fromEntries(
      libraries.map((library) => [library.name, library.id]),
    );

    const libraryBookRows: Array<typeof schema.libraryBook.$inferInsert> = [
      {
        comment: "Re-read for the book club.",
        readStart: "2024-01-05",
        readEnd: "2024-01-20",
        bookId: booksByGoogleId.demo_gatsby,
        libraryId: librariesByName["Main Library"],
      },
      {
        comment: "Re-read in summer.",
        readStart: null,
        readEnd: null,
        bookId: booksByGoogleId.demo_1984,
        libraryId: librariesByName["Main Library"],
      },
      {
        comment: "Currently reading.",
        readStart: "2024-02-10",
        readEnd: null,
        bookId: booksByGoogleId.demo_long_title,
        libraryId: librariesByName["Main Library"],
      },
      {
        comment: "Added from search.",
        readStart: null,
        readEnd: null,
        bookId: booksByGoogleId.demo_missing_author,
        libraryId: librariesByName.Wishlist,
      },
      {
        comment: "Started, not finished yet.",
        readStart: "2024-03-01",
        readEnd: null,
        bookId: booksByGoogleId.demo_sparse,
        libraryId: librariesByName["Tech Reads"],
      },
      {
        comment: "Finished recently.",
        readStart: "2024-02-01",
        readEnd: "2024-02-18",
        bookId: booksByGoogleId.demo_1984,
        libraryId: librariesByName["Tech Reads"],
      },
    ];

    await db.insert(schema.libraryBook).values(libraryBookRows);

    await db.insert(schema.bookCategory).values([
      {
        categoryId: categoriesByName.Classics,
        bookId: booksByGoogleId.demo_gatsby,
      },
      {
        categoryId: categoriesByName["Sci-Fi"],
        bookId: booksByGoogleId.demo_1984,
      },
      {
        categoryId: categoriesByName.Fantasy,
        bookId: booksByGoogleId.demo_long_title,
      },
      {
        categoryId: categoriesByName["Non-fiction"],
        bookId: booksByGoogleId.demo_future_release,
      },
    ]);

    await db.insert(schema.userCategory).values([
      { categoryId: categoriesByName.Classics, userId: users[0].id },
      { categoryId: categoriesByName["Sci-Fi"], userId: users[0].id },
      { categoryId: categoriesByName.Fantasy, userId: users[1].id },
    ]);

    await db.insert(schema.review).values([
      {
        content: "Must-read, perfect atmosphere.",
        rating: 10,
        bookId: booksByGoogleId.demo_gatsby,
        userId: users[0].id,
      },
      {
        content: "Intriguing but hard to revisit.",
        rating: 6,
        bookId: booksByGoogleId.demo_1984,
        userId: users[1].id,
      },
      {
        content: "Disorienting, yet fascinating.",
        rating: 0,
        bookId: booksByGoogleId.demo_long_title,
        userId: users[2].id,
      },
    ]);

    console.log("Seed completed successfully.");
  } finally {
    await pool.end();
  }
};

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});

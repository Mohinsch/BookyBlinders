import { LibraryDashboard } from "@/components/library/LibraryDashboard";
import type { UserLibraryBook } from "@/types/library";

const MOCK_LIBRARIES = [
  { id: 1, name: "My Primary Collection" },
  { id: 2, name: "Wishlist 1920" },
];

const MOCK_BOOKS: UserLibraryBook[] = [
  {
    id: 1,
    googleId: "abc",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "http://books.google.com/books/content?id=iXn5U2IzTKsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    readStart: "2026-04-01",
    readEnd: "2026-04-15",
    addedAt: new Date("2026-03-20"),
  },
  {
    id: 2,
    googleId: "def",
    title: "1984",
    author: "George Orwell",
    cover: "http://books.google.com/books/content?id=kotPYEqx7pmMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    readStart: "2026-04-20",
    readEnd: null,
    addedAt: new Date("2026-04-10"),
  },
  {
    id: 3,
    googleId: "ghi",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    cover: null,
    readStart: null,
    readEnd: null,
    addedAt: new Date("2026-04-25"),
  }
];

export default function LibraryPage() {
  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      <h1 style={{ fontFamily: "var(--font-garamond)", fontSize: "3rem", color: "var(--color-primary)", marginBottom: "2rem" }}>
        The Ledger
      </h1>
      <LibraryDashboard initialBooks={MOCK_BOOKS} libraries={MOCK_LIBRARIES} />
    </main>
  );
}
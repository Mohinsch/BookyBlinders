import type { BOOK_SOURCES } from "@/constants";

export interface BookDetailsViewModel {
  source: (typeof BOOK_SOURCES)[keyof typeof BOOK_SOURCES];
  routeId: string;
  internalId: number | null;
  googleId: string | null;
  title: string;
  authors: string[];
  cover: string | null;
  publisher: string | null;
  publishedDate: string | null;
  pageCount: number | null;
  isbn: string | null;
  categories: string[];
  description: string;
}

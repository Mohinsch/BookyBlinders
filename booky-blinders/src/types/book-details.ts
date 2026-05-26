export interface BookDetailsViewModel {
  source: "internal" | "external";
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

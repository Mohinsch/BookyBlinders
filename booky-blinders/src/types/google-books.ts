// src/types/google-books.ts

export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  categories?: string[];
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export interface GoogleBooksResponse {
  items?: GoogleBookItem[];
  totalItems: number;
}

export interface UserLibraryBook {
  id: number;
  libraryId: number;
  googleId: string | null;
  title: string;
  author: string | null;
  cover: string | null;
  readStart: string | null;
  readEnd: string | null;
  addedAt: Date;
}

export type ReadingStatus = "TO_READ" | "IN_PROGRESS" | "READ";

export interface UserLibrarySummary {
  id: number;
  name: string;
}

export interface ActionResponse {
  success: boolean;
  message?: string;
}

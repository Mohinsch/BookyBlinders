import { READING_STATUS } from "@/constants";
import type { ReadingStatus, UserLibraryBook } from "@/types/library";

export const getReadingStatus = (book: UserLibraryBook): ReadingStatus => {
  if (book.readEnd) return READING_STATUS.READ;
  if (book.readStart) return READING_STATUS.IN_PROGRESS;
  return READING_STATUS.TO_READ;
};

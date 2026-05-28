import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ensureCategoriesExist,
  linkBookToCategories,
  removeBookCategories,
  updateBookCategories,
} from "./category-utils";

const findManyMock = vi.fn();
const insertMock = vi.fn();
const valuesMock = vi.fn();
const returningMock = vi.fn();
const onConflictDoNothingMock = vi.fn();
const deleteMock = vi.fn();
const whereMock = vi.fn();

vi.mock("@/db", () => ({
  db: {
    query: {
      category: {
        findMany: (...args: unknown[]) => findManyMock(...args),
      },
    },
    insert: (...args: unknown[]) => insertMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
  },
}));

insertMock.mockReturnValue({
  values: (...args: unknown[]) => valuesMock(...args),
});

valuesMock.mockReturnValue({
  returning: (...args: unknown[]) => returningMock(...args),
  onConflictDoNothing: (...args: unknown[]) => onConflictDoNothingMock(...args),
});

deleteMock.mockReturnValue({
  where: (...args: unknown[]) => whereMock(...args),
});

describe("category utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array for missing categories", async () => {
    const result = await ensureCategoriesExist(undefined);
    expect(result).toEqual([]);
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it("creates missing categories and returns IDs", async () => {
    findManyMock.mockResolvedValueOnce([{ id: 1, name: "fantasy" }]);
    returningMock.mockResolvedValueOnce([{ id: 2, name: "sci-fi" }]);

    const result = await ensureCategoriesExist([
      "Fantasy",
      "Sci-Fi",
      "Fantasy",
    ]);

    expect(result).toEqual([1, 2]);
    expect(insertMock).toHaveBeenCalled();
    expect(returningMock).toHaveBeenCalled();
  });

  it("returns empty array when normalized names are empty", async () => {
    const result = await ensureCategoriesExist([" / ", "   "]);
    expect(result).toEqual([]);
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it("handles database errors gracefully", async () => {
    findManyMock.mockRejectedValueOnce(new Error("DB error"));

    const result = await ensureCategoriesExist(["Mystery"]);

    expect(result).toEqual([]);
  });

  it("links book categories with conflict handling", async () => {
    await linkBookToCategories(10, [1, 2]);

    expect(insertMock).toHaveBeenCalled();
    expect(onConflictDoNothingMock).toHaveBeenCalled();
  });

  it("returns early when no category IDs are provided", async () => {
    await linkBookToCategories(10, []);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("handles errors when linking book categories", async () => {
    insertMock.mockImplementationOnce(() => {
      throw new Error("Insert failed");
    });

    await linkBookToCategories(10, [1]);

    expect(insertMock).toHaveBeenCalled();
  });

  it("removes categories before updating them", async () => {
    findManyMock.mockResolvedValueOnce([{ id: 5, name: "history" }]);
    returningMock.mockResolvedValueOnce([]);

    await updateBookCategories(10, ["History"]);

    expect(deleteMock).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
    expect(onConflictDoNothingMock).toHaveBeenCalled();
  });

  it("skips updates when no new categories provided", async () => {
    await removeBookCategories(10);
    await updateBookCategories(10, []);

    expect(deleteMock).toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("handles errors when removing book categories", async () => {
    deleteMock.mockImplementationOnce(() => {
      throw new Error("Delete failed");
    });

    await removeBookCategories(42);

    expect(deleteMock).toHaveBeenCalled();
  });
});

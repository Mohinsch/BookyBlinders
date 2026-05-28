import { describe, expect, it } from "vitest";
import { getReadingStatus } from "./library-status";

describe("getReadingStatus", () => {
  it("returns READ when readEnd exists", () => {
    expect(
      getReadingStatus({
        id: 1,
        libraryId: 1,
        googleId: null,
        title: "Book",
        author: null,
        cover: null,
        readStart: null,
        readEnd: "2026-05-27",
        addedAt: new Date(),
      }),
    ).toBe("READ");
  });

  it("returns IN_PROGRESS when only readStart exists", () => {
    expect(
      getReadingStatus({
        id: 1,
        libraryId: 1,
        googleId: null,
        title: "Book",
        author: null,
        cover: null,
        readStart: "2026-05-27",
        readEnd: null,
        addedAt: new Date(),
      }),
    ).toBe("IN_PROGRESS");
  });

  it("returns TO_READ when no dates exist", () => {
    expect(
      getReadingStatus({
        id: 1,
        libraryId: 1,
        googleId: null,
        title: "Book",
        author: null,
        cover: null,
        readStart: null,
        readEnd: null,
        addedAt: new Date(),
      }),
    ).toBe("TO_READ");
  });
});

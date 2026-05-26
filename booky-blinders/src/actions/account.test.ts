import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@/lib/auth";
import { changePassword, deleteAccount } from "./account";

const headersMock = vi.fn(() => Promise.resolve(new Headers()));

vi.mock("next/headers", () => ({
  headers: () => headersMock(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: { getSession: vi.fn() },
  },
}));

const whereMock = vi.fn();
const returningMock = vi.fn();

vi.mock("@/db", () => ({
  db: {
    delete: () => ({
      where: (...args: unknown[]) => whereMock(...args),
    }),
  },
}));

whereMock.mockReturnValue({ returning: returningMock });

describe("Account Server Actions", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, BETTER_AUTH_URL: "http://localhost:3000" };
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-123" },
    } as never);
    global.fetch = vi.fn();
  });

  it("rejects changePassword when not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as never);

    const result = await changePassword("old", "new-password");

    expect(result).toEqual({ success: false, message: "Unauthorized" });
  });

  it("validates changePassword inputs", async () => {
    const missingCurrent = await changePassword("", "new-password");
    const missingNew = await changePassword("old", "");
    const tooShort = await changePassword("old", "short");
    const samePassword = await changePassword("same-password", "same-password");

    expect(missingCurrent).toEqual({
      success: false,
      message: "Current password is required",
    });
    expect(missingNew).toEqual({
      success: false,
      message: "New password is required",
    });
    expect(tooShort).toEqual({
      success: false,
      message: "Password must be at least 8 characters",
    });
    expect(samePassword).toEqual({
      success: false,
      message: "New password must be different",
    });
  });

  it("returns success when password change succeeds", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    const result = await changePassword("old-pass", "new-password");

    expect(result).toEqual({
      success: true,
      message: "Password changed successfully",
    });
  });

  it("handles errors from the password change endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Bad request" }),
    } as Response);

    const result = await changePassword("old-pass", "new-password");

    expect(result).toEqual({
      success: false,
      message: "Bad request",
    });
  });

  it("rejects deleteAccount when password is missing", async () => {
    const result = await deleteAccount("");

    expect(result).toEqual({
      success: false,
      message: "Password is required to delete account",
    });
  });

  it("rejects deleteAccount when password verification fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);

    const result = await deleteAccount("wrong-pass");

    expect(result).toEqual({ success: false, message: "Incorrect password" });
  });

  it("returns not found when user deletion fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);
    returningMock.mockResolvedValueOnce([]);

    const result = await deleteAccount("correct-pass");

    expect(result).toEqual({ success: false, message: "User not found" });
  });

  it("returns success when account is deleted", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);
    returningMock.mockResolvedValueOnce([{ id: "user-123" }]);

    const result = await deleteAccount("correct-pass");

    expect(result.success).toBe(true);
  });

  it("returns an error when deleteAccount throws", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network down"));

    const result = await deleteAccount("correct-pass");

    expect(result).toEqual({ success: false, message: "Network down" });
  });
});

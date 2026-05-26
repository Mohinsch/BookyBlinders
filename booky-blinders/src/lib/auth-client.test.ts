import { createAuthClient } from "better-auth/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("better-auth/react", () => ({
  createAuthClient: vi.fn(() => ({
    signIn: vi.fn(),
    signUp: vi.fn(),
    useSession: vi.fn(),
  })),
}));

describe("auth-client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    delete (globalThis as { window?: unknown }).window;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    delete (globalThis as { window?: unknown }).window;
    vi.resetModules();
  });

  it("uses window origin when available", async () => {
    (globalThis as { window?: { location: { origin: string } } }).window = {
      location: { origin: "https://example.com" },
    };

    await import("./auth-client");

    const calls = vi.mocked(createAuthClient).mock.calls;
    expect(calls[0][0]).toEqual({ baseURL: "https://example.com" });
  });

  it("uses BETTER_AUTH_URL when window is not available", async () => {
    process.env = { ...originalEnv, BETTER_AUTH_URL: "https://auth.example" };

    await import("./auth-client");

    const calls = vi.mocked(createAuthClient).mock.calls;
    expect(calls[0][0]).toEqual({ baseURL: "https://auth.example" });
  });

  it("falls back to localhost when no env is provided", async () => {
    process.env = { ...originalEnv };

    await import("./auth-client");

    const calls = vi.mocked(createAuthClient).mock.calls;
    expect(calls[0][0]).toEqual({ baseURL: "http://localhost:3000" });
  });
});

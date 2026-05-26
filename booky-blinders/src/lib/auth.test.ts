import { describe, expect, it, vi } from "vitest";

const betterAuthMock = vi.fn(() => ({ api: {} }));
const drizzleAdapterMock = vi.fn(() => "adapter");

vi.mock("better-auth", () => ({
  betterAuth: (...args: unknown[]) => betterAuthMock(...args),
}));

vi.mock("better-auth/adapters/drizzle", () => ({
  drizzleAdapter: (...args: unknown[]) => drizzleAdapterMock(...args),
}));

vi.mock("@/db", () => ({ db: {} }));
vi.mock("@/db/schema", () => ({
  user: {},
  session: {},
  account: {},
  verification: {},
}));

describe("auth", () => {
  it("initializes Better Auth with the drizzle adapter", async () => {
    const { PROVIDER, auth } = await import("./auth");

    expect(PROVIDER).toBe("pg");
    expect(auth).toBeDefined();
    expect(drizzleAdapterMock).toHaveBeenCalled();
    expect(betterAuthMock).toHaveBeenCalled();
  });
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "node",
    restoreMocks: true,
    coverage: {
      include: [
        "src/actions/books.ts",
        "src/actions/account.ts",
        "src/lib/**/*.{ts,tsx}",
        "src/services/**/*.{ts,tsx}",
        "src/proxy.ts",
      ],
      exclude: [
        "src/app/**/*",
        "src/components/**/*",
        "src/constants/**/*",
        "src/db/**/*",
        "src/hooks/**/*",
        "src/locales/**/*",
        "src/store/**/*",
        "src/styles/**/*",
        "src/types/**/*",
      ],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90,
      },
    },
  },
});

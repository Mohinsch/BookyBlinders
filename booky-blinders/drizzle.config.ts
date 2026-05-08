// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  // Print all SQL statements executed in the terminal (for debugging)
  verbose: true,
  // Require manual confirmation before running migrations (safety measure)
  strict: true,
});

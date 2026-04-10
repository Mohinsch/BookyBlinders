import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create a connection pool using the environment variable defined in Docker
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle with our schema
export const db = drizzle(pool, { schema });
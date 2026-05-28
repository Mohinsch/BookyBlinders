import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const PROVIDER = "pg";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: PROVIDER,
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  passwordReset: {
    expiresIn: 900, // 15 minutes
  },
});

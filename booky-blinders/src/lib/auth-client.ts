import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    // Make sure this matches your local environment URL
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000"
});
export const { signIn, signUp, useSession } = createAuthClient()

// src/middleware.ts

import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth";
import { type NextRequest, NextResponse } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  // Ping the auth API to check if the current user has a valid session cookie.
  // We must forward the incoming cookie header so Better-Auth can identify the user.
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const path = request.nextUrl.pathname;
  const isLibraryRoute = path.startsWith("/library");
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

  // Protect private routes: kick unauthenticated users back to the login page.
  if (isLibraryRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // UX improvement: prevent already authenticated users from accessing auth pages.
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/library", request.url));
  }

  // Let the request proceed normally.
  return NextResponse.next();
}

// Restrict middleware execution to specific paths to avoid unnecessary performance overhead.
export const config = {
  matcher: ["/library/:path*", "/login", "/register"],
};

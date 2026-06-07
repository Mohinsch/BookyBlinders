# Server Actions — API Contract

**Date:** May 2026
**Scope:** `src/actions/*.ts`

## 1. Overview

Booky Blinders does not expose a public REST API. The client/server boundary is implemented through **Next.js Server Actions** (functions marked `"use server"` in `src/actions/`). This document is the formal contract for these actions: signatures, parameters, return types, validation rules, side effects, and error semantics.

It is the equivalent of an OpenAPI / Swagger reference, adapted to the Server Action architecture.

### Conventions

- **Authentication:** every action that mutates user data calls `requireAuth()` (Better Auth session validation). An unauthenticated call rejects with a thrown error caught by the action's try/catch and returned as `{ success: false, message: "Unauthorized" }`.
- **Validation:** every input is validated by a Zod schema declared in `src/lib/schemas.ts`. Validation failures return either an `ActionResponse` with `errors[]` or, for read actions, a safe empty value (`[]` / `null`).
- **Rate limiting:** mutating actions are guarded by limiters from `src/lib/rate-limit.ts`. When the quota is exceeded the action returns `{ success: false, message }` (or empty value for reads) and tracks the violation.
- **Cache invalidation:** library mutations call `revalidatePath("/library")` to purge the Next.js Router Cache.
- **Error handling:** actions never throw to the client. Uncaught errors are logged server-side and converted into a standard `ActionResponse`.

### Common types

```ts
// src/types/actions.ts
interface ValidationErrorDetail {
  field: string;
  message: string;
}

interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: ValidationErrorDetail[];
}
```

```ts
// src/types/library.ts
type ReadingStatus = "TO_READ" | "IN_PROGRESS" | "READ";

interface UserLibrarySummary {
  id: number;
  name: string;
}

interface UserLibraryBook {
  id: number;
  libraryId: number;
  googleId: string | null;
  title: string;
  author: string | null;
  cover: string | null;
  readStart: string | null;
  readEnd: string | null;
  addedAt: Date;
}
```

### Rate limit reference

| Limiter                     | Quota                  | Applies to                                              |
| --------------------------- | ---------------------- | ------------------------------------------------------- |
| `googleBooksSearchLimiter`  | 30 req / minute / user | `searchBooksAction`, `getBookDetailsAction`             |
| `libraryOperationLimiter`   | 100 req / minute / user| All library mutations (`createLibrary`, `addBook`, ...) |
| `authLoginLimiter`          | 5 req / 15 min / user  | Login (consumed inside Better Auth route)               |
| `authSignupLimiter`         | 3 req / hour / user    | Signup (consumed inside Better Auth route)              |

---

## 2. Library actions — `src/actions/library.ts`

### `getUserLibraries()`

Returns the list of libraries owned by the authenticated user. Auto-creates a default library if the user has none.

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| Signature       | `() => Promise<UserLibrarySummary[]>`  |
| Auth required   | yes                                    |
| Validation      | —                                      |
| Rate limit      | —                                      |
| Side effects    | May `INSERT` a default library row     |
| Cache revalidate| —                                      |
| Failure mode    | Returns `[]` on any error              |

---

### `getOwnedGoogleBookIds()`

Returns the deduplicated list of Google Books IDs already present in any of the user's libraries. Used by the UI to mark books as "owned".

| Property        | Value                          |
| --------------- | ------------------------------ |
| Signature       | `() => Promise<string[]>`      |
| Auth required   | yes                            |
| Validation      | —                              |
| Rate limit      | —                              |
| Side effects    | none (read-only)               |
| Failure mode    | Returns `[]` on any error      |

---

### `createLibrary(name)`

Creates a new private library for the authenticated user.

| Property        | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| Signature       | `(name: string) => Promise<ActionResponse>`                |
| Auth required   | yes                                                        |
| Validation      | `createLibrarySchema` — `name`: string, 1–100 chars, trim  |
| Rate limit      | `libraryOperationLimiter` (key `library:{userId}:create`)  |
| Side effects    | `INSERT` into `library`                                    |
| Cache revalidate| `/library`                                                 |
| Success         | `{ success: true, message: "Library created" }`            |
| Failure         | `{ success: false, message? , errors? }`                   |

---

### `renameLibrary(libraryId, name)`

Renames a library owned by the authenticated user.

| Property        | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Signature       | `(libraryId: number, name: string) => Promise<ActionResponse>` |
| Auth required   | yes                                                            |
| Validation      | `renameLibrarySchema`                                          |
| Rate limit      | `libraryOperationLimiter` (key `library:{userId}:rename`)      |
| Authorization   | Library must belong to the caller                              |
| Side effects    | `UPDATE library SET name, updatedAt`                           |
| Cache revalidate| `/library`                                                     |
| Errors          | `"Library not found or not authorized"` if ownership fails     |

---

### `deleteLibrary(libraryId)`

Deletes a library owned by the caller. Refuses to delete the user's last library to prevent orphaned books.

| Property        | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Signature       | `(libraryId: number) => Promise<ActionResponse>`            |
| Auth required   | yes                                                         |
| Validation      | `deleteLibrarySchema`                                       |
| Rate limit      | `libraryOperationLimiter` (key `library:{userId}:delete`)   |
| Authorization   | Library must belong to the caller                           |
| Business rule   | Caller must own at least 2 libraries                        |
| Side effects    | `DELETE FROM library` (cascade to `library_book`)           |
| Cache revalidate| `/library`                                                  |
| Errors          | `"Cannot delete your last library"`, `"Library not found …"`|

---

### `addBookToLibrary(googleId, libraryId?)`

Fetches the book from Google Books, upserts it into the `book` table, and links it to the target library (or the user's default library if `libraryId` is omitted).

| Property        | Value                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| Signature       | `(googleId: string, libraryId?: number) => Promise<ActionResponse>`     |
| Auth required   | yes                                                                     |
| Validation      | `addBookToLibrarySchema`                                                |
| Rate limit      | `libraryOperationLimiter` (key `library:{userId}:add-book`)             |
| External call   | `getBookById(googleId)` (Google Books API)                              |
| Side effects    | `INSERT` into `book` if new, `INSERT` into `library_book` (idempotent)  |
| Cache revalidate| `/library`                                                              |
| Errors          | `"Book not found"` (Google Books returned nothing)                      |

The junction insert uses `onConflictDoNothing()`; calling twice with the same `(googleId, libraryId)` is safe.

---

### `getUserLibrary(libraryId?)`

Returns all books in a given library (defaults to the user's primary library).

| Property        | Value                                              |
| --------------- | -------------------------------------------------- |
| Signature       | `(libraryId?: number) => Promise<UserLibraryBook[]>` |
| Auth required   | yes                                                |
| Validation      | `getUserLibrarySchema`                             |
| Rate limit      | —                                                  |
| Authorization   | Library must belong to the caller                  |
| Ordering        | `library_book.added_at DESC`                       |
| Failure mode    | Returns `[]` on any error                          |

---

### `updateReadingStatus(bookId, status, libraryId?)`

Updates the `readStart` / `readEnd` timestamps of a book in the user's library according to the chosen reading status.

| Property        | Value                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| Signature       | `(bookId: number, status: ReadingStatus, libraryId?: number) => Promise<ActionResponse>` |
| Auth required   | yes                                                                                  |
| Validation      | `updateReadingStatusSchema`                                                          |
| Rate limit      | `libraryOperationLimiter` (key `library:{userId}:update-status`)                     |
| Status mapping  | `TO_READ` → `(null, null)`, `IN_PROGRESS` → `(today, null)`, `READ` → `(today, today)` |
| Side effects    | `UPDATE library_book SET readStart, readEnd, updatedAt`                              |
| Cache revalidate| `/library`                                                                           |

---

### `removeBookFromLibrary(bookId, libraryId?)`

Removes the link between a book and a library. The book row in the `book` table is preserved.

| Property        | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| Signature       | `(bookId: number, libraryId?: number) => Promise<ActionResponse>`    |
| Auth required   | yes                                                                  |
| Validation      | `removeBookFromLibrarySchema`                                        |
| Rate limit      | `libraryOperationLimiter` (key `library:{userId}:remove-book`)       |
| Side effects    | `DELETE FROM library_book WHERE bookId = ? AND libraryId = ?`        |
| Cache revalidate| `/library`                                                           |

---

## 3. Book search actions — `src/actions/books.ts`

### `searchBooksAction(query)`

Searches Google Books and returns the raw `volumeInfo` items.

| Property        | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Signature       | `(query: string) => Promise<GoogleBookItem[]>`                 |
| Auth required   | no (anonymous users get their own bucket via `"anonymous"` key)|
| Validation      | `searchBooksActionSchema` — `query`: trimmed, min 1 char       |
| Rate limit      | `googleBooksSearchLimiter` (key `search:{userId}`)             |
| External call   | `searchBooks(query)` (Google Books API)                        |
| Failure mode    | Returns `[]` on validation, rate limit or API error            |

---

### `getBookDetailsAction(googleId)`

Fetches full details of a single Google Books entry.

| Property        | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Signature       | `(googleId: string) => Promise<GoogleBookItem \| null>`        |
| Auth required   | no                                                             |
| Validation      | `getBookDetailsActionSchema`                                   |
| Rate limit      | `googleBooksSearchLimiter` (key `book-details:{userId}`)       |
| External call   | `getBookById(googleId)` (Google Books API)                     |
| Failure mode    | Returns `null` on validation, rate limit or API error          |

---

## 4. Account actions — `src/actions/account.ts`

These actions delegate sensitive operations to Better Auth via internal `fetch` calls, forwarding the user's session cookie.

### `changePassword(currentPassword, newPassword)`

Changes the authenticated user's password through Better Auth's `change-password` endpoint.

| Property        | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| Signature       | `(currentPassword: string, newPassword: string) => Promise<ActionResponse>` |
| Auth required   | yes                                                                |
| Validation      | `changePasswordSchema` — `newPassword`: min 8 chars                |
| Business rule   | `newPassword` must differ from `currentPassword`                   |
| External call   | `POST {BETTER_AUTH_URL}/api/auth/change-password`                  |
| Errors          | `"New password must be different"`, `"Failed to change password"`  |

---

### `deleteAccount(password)`

Verifies the password through Better Auth, then deletes the user row. Cascade deletes propagate to: `session`, `account`, `verification`, `library`, `library_book`, `user_categories`, `reviews`.

| Property        | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Signature       | `(password: string) => Promise<ActionResponse>`                |
| Auth required   | yes                                                            |
| Validation      | `deleteAccountSchema`                                          |
| External call   | `POST {BETTER_AUTH_URL}/api/auth/verify-password`              |
| Side effects    | `DELETE FROM user WHERE id = ?` (cascade)                      |
| Errors          | `"Incorrect password"`, `"User not found"`                     |

The client must trigger logout after a successful response (the message hints "You will be logged out shortly").

---

## 5. Error model

Every action follows the same envelope discipline:

| Action category                        | Success                            | Failure                                                  |
| -------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| Mutations (`ActionResponse`)           | `{ success: true, message? }`      | `{ success: false, message?, errors? }`                  |
| Reads returning a list                 | `T[]`                              | `[]`                                                     |
| Reads returning a single object        | `T`                                | `null`                                                   |

`errors` is only populated for input validation failures and contains one entry per offending field:

```ts
{
  success: false,
  errors: [
    { field: "name", message: "Library name is required" }
  ]
}
```

Server-side errors are logged through `LOG_MESSAGES.ACTION.ERROR("<actionName>")` and never propagate the original stack to the client.

---

## 6. Calling Server Actions from the client

```tsx
"use client";
import { createLibrary } from "@/actions/library";

const result = await createLibrary("Reading list 2026");
if (!result.success) {
  // result.errors → field-level Zod issues
  // result.message → user-facing fallback
}
```

Server Actions are also usable inside React form actions and Server Components — they are plain async functions on the server but invoked through Next.js' RSC RPC bridge from the client.

---

## 7. Maintenance

When adding a new action:

1. Add the Zod schema and inferred type in `src/lib/schemas.ts`.
2. Implement the action in `src/actions/<domain>.ts` with `requireAuth()`, validation, rate limit, try/catch, and (if mutating) `revalidatePath`.
3. Add a section to this document mirroring the existing tables (signature / auth / validation / rate limit / side effects / errors).
4. Add unit tests next to the action (`<domain>.test.ts`).

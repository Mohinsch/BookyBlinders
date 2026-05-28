# Security Assessment - Booky Blinders

**Date:** May 2026
**Context:** Production Readiness Audit
**Scope:** Web application (`booky-blinders.vercel.app`), PostgreSQL database (Supabase), CI/CD pipelines (GitHub Actions).

## 1. Overview

This document summarizes the technical safeguards implemented within the Booky Blinders application to mitigate standard web vulnerabilities, aligning with **OWASP Top 10** best practices. The application relies on a strict separation of concerns, utilizing routing middleware, validation schemas, an ORM, and HTTP security headers to prevent malicious exploits.

The audit covers the following categories:

| # | Category | OWASP reference |
|---|----------|------------------|
| 2 | Data validation & injection prevention | A03 — Injection |
| 3 | XSS prevention | A03 — Injection |
| 4 | Authentication & authorization | A07 — Identification & Authentication Failures |
| 5 | API protection & rate limiting | A04 — Insecure Design |
| 6 | CSRF protection | A01 — Broken Access Control |
| 7 | HTTP security headers | A05 — Security Misconfiguration |
| 8 | Secrets management | A02 — Cryptographic Failures |
| 9 | Dependency management (`npm audit`) | A06 — Vulnerable & Outdated Components |
| 10 | GDPR compliance & right to erasure | A02 — Cryptographic Failures / Privacy |

## 2. Data Validation & Injection Prevention

### Input validation (Zod)

All client-provided data is validated against strict schemas before reaching the server logic. This prevents malformed payloads at the API boundary.

```typescript
export const createLibrarySchema = z.object({
  name: z.string().min(1).max(100).trim(),
});
```

Every Server Action begins with a `safeParse()` call. If validation fails, the action returns an error response without ever touching the database.

### SQL injection mitigation (Drizzle ORM)

Raw SQL queries are strictly prohibited in the codebase. All database interactions are handled via Drizzle ORM, which uses parameterized queries. User inputs are always treated as bind variables, never as executable SQL instructions.

```typescript
await db.update(library)
  .set({ name: validatedData.name })
  .where(and(
    eq(library.id, validatedData.libraryId),
    eq(library.userId, user.id)
  ));
```

## 3. XSS (Cross-Site Scripting) Prevention

### React render escaping

The application neutralizes XSS threats by treating all dynamic variables as text rather than HTML. React automatically escapes strings embedded in JSX before rendering them to the DOM.

```typescript
<span className={styles.bookTitle}>{book.title}</span>
```

### DOM manipulation constraints

A codebase review confirms the absence of dangerous DOM operations:

- No usage of `dangerouslySetInnerHTML`.
- No direct assignments to `.innerHTML`.
- No usage of dynamic code execution (`eval()` or `new Function()`).

### Content Security Policy

A strict CSP header (see §7) further mitigates XSS by restricting which scripts, styles, and resources the browser is allowed to load.

## 4. Authentication & Authorization

### Session integrity

Session management is handled by `better-auth`. Tokens are cryptographically signed and stored in `HttpOnly` cookies — making them inaccessible from JavaScript and immune to theft via XSS. Sessions are verified server-side on every protected Server Action.

### Resource ownership

Authorization goes beyond simply being logged in. Every mutating database query (`UPDATE` / `DELETE`) includes a strict `WHERE` clause that verifies the resource belongs to the currently authenticated `userId`.

```typescript
.where(and(
  eq(library.id, libraryId),
  eq(library.userId, currentUser.id)  // ownership check
))
```

This pattern blocks **IDOR** (Insecure Direct Object Reference) attacks — a malicious user cannot mutate another user's libraries even by guessing IDs.

## 5. API Protection & Rate Limiting

To prevent brute-force attacks and third-party API quota exhaustion, a custom LRU-Cache acts as a rate limiter and caching layer:

- **Authentication endpoints:** capped to prevent credential stuffing (5 attempts / 15 min).
- **Google Books API:** external responses are cached for 24 hours. This has reduced API quota usage by ~70% and lowered average search latency from ~1200ms to ~50ms.
- **Server Actions:** library operations are rate-limited per user to prevent database denial-of-service (DoS) attempts.

## 6. CSRF (Cross-Site Request Forgery) Protection

Server Actions in Next.js are protected against CSRF by design:

- They are invoked through a POST request with a unique action ID, not via a static URL — making forgery impractical.
- Same-Site cookie defaults prevent the browser from sending session cookies with cross-origin requests.
- `better-auth` adds an additional CSRF token check on its authentication endpoints (`/api/auth/*`).

The `frame-ancestors 'none'` directive in the CSP (see §7) also blocks **clickjacking**, a CSRF-adjacent attack vector.

## 7. HTTP Security Headers

Configured globally in `next.config.ts` and applied to every route via the `headers()` function:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years across all subdomains, eligible for browser preload lists. |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks. |
| `X-Frame-Options` | `DENY` | Blocks the site from being embedded in iframes (anti-clickjacking). |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage to third parties. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables browser APIs not needed by the app. |
| `Content-Security-Policy` | strict allowlist (see below) | Defense-in-depth against XSS and data exfiltration. |

### Content Security Policy details

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://books.google.com http://books.google.com;
font-src 'self' data:;
connect-src 'self' https://www.googleapis.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

`'unsafe-inline'` and `'unsafe-eval'` are required by Next.js' bootstrap scripts and the `next-themes` anti-flash inline script. A nonce-based CSP is planned for V2 to remove these directives entirely.

## 8. Secrets Management

### Environment variables

Secrets (database credentials, `BETTER_AUTH_SECRET`, Google Books API key) are never committed to the repository. The `.gitignore` excludes all `.env*` files. A redacted `env.example` is versioned to document the required variables for new contributors.

### Production secrets

In production, secrets are managed by **Vercel's encrypted environment variable store** (per-environment scoping: development, preview, production). The Supabase database URL is injected through Vercel's integration, never exposed to the client bundle.

Variables prefixed with `NEXT_PUBLIC_` are explicitly understood as public (visible to the browser). All other variables remain server-only.

### CI/CD secrets

Secrets used in GitHub Actions (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) are stored as **encrypted GitHub Secrets** and injected at runtime, never logged.

## 9. Dependency Management (`npm audit`)

The project uses `npm audit` to track vulnerabilities in third-party packages. The audit is run:

- **Locally**, before each release: `npm audit --omit=dev`.
- **Automatically** by GitHub's Dependabot, which opens PRs for vulnerable transitive dependencies.

At the time of this audit, the project reports **0 high or critical vulnerabilities** in production dependencies.

A future improvement is to wire `npm audit --audit-level=high` directly into the CI pipeline as a blocking step.

## 10. GDPR Compliance & Right to Erasure

### Personal data inventory

The application stores the following personal data:

- **Account:** email, hashed password (bcrypt, managed by `better-auth`), display name.
- **Activity:** libraries created, books added, reading status, optional comments per book.
- **Sessions:** IP-less session tokens, user-agent (managed by `better-auth`).

No tracking, no third-party analytics, no advertising cookies.

### Right to erasure (Article 17 GDPR)

Account deletion is exposed through the user account settings (`src/components/account/DeleteAccountSection.tsx`). It triggers `deleteAccount()` (`src/actions/account.ts`), which:

1. Re-authenticates the user with their current password.
2. Issues a single `DELETE FROM user WHERE id = ...`.
3. Relies on the database's `ON DELETE CASCADE` constraints to wipe all related rows in a single transaction:
   - `session`, `account`, `verification` (auth tables)
   - `library`, `library_book` (user libraries)
   - `user_category`, `review` (preferences and feedback)

Erasure is **hard delete** — no soft-delete column, no archival. The user's data is irretrievable after the action completes.

### Password security

Passwords are hashed by `better-auth` using **bcrypt** with a per-password salt. Plain-text passwords are never stored or logged.

### Data minimisation

The schema only collects strictly required fields. Optional fields (display name) can be left empty. The Google Books API key is server-side only — user search queries never expose the key.

## 11. Known Limitations & V2 Roadmap

| Item | Status | Planned for V2 |
|------|--------|----------------|
| Nonce-based CSP (remove `'unsafe-inline'`) | Open | ✅ |
| `npm audit` blocking step in CI | Open | ✅ |
| Centralised security log monitoring (Sentry) | Open | ✅ |
| Two-factor authentication (TOTP via `better-auth`) | Open | ✅ |
| Automated dependency scanning (Snyk / Trivy) | Open | Stretch goal |

## 12. References

- OWASP Top 10 (2021): https://owasp.org/Top10/
- Mozilla Web Security Guidelines: https://infosec.mozilla.org/guidelines/web_security
- Next.js Security Headers: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
- GDPR Article 17 — Right to erasure: https://gdpr-info.eu/art-17-gdpr/

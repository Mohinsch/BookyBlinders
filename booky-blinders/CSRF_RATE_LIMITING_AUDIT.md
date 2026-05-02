# 🚨 CSRF & Rate Limiting Security Audit

**Date:** 2026-05-02  
**Status:** ⚠️ **VULNERABLE** - Critical protections missing

---

## Executive Summary

Your application is **missing critical protections** against:

1. ❌ **CSRF (Cross-Site Request Forgery)** - Partially protected by Better Auth, but needs verification
2. ❌ **Rate Limiting** - NO rate limiting found on any endpoints
3. ❌ **Brute Force Attacks** - Unprotected login endpoint
4. ❌ **API Quota Exhaustion** - Google Books API calls unprotected

### Risk Level: **HIGH**

| Vulnerability | Impact | Severity |
|---------------|--------|----------|
| CSRF | Unauth mutations | Medium |
| Rate Limiting | API spam/DOS | High |
| Brute Force | Account takeover | Critical |
| API Abuse | Quota exhaustion | Medium |

---

## Current State Analysis

### ✅ What Better Auth Provides

Better Auth v1.6.4 includes:
- ✅ CSRF tokens for mutations
- ✅ Session validation
- ✅ Safe cookie handling

**BUT:** Only for `/api/auth/[...all]` endpoints

### ❌ What's Missing

1. **No rate limiting on:**
   - `POST /api/auth/sign-in` (Brute force vulnerable)
   - `POST /api/auth/sign-up` (Account creation spam)
   - `POST /api/auth/verify-email` (Enumeration vulnerable)

2. **No protection on Google Books API calls:**
   - `searchBooksAction()` - Unprotected
   - `getBookDetailsAction()` - Unprotected
   - No caching → Quota exhaustion risk

3. **No custom Server Action protection:**
   - Library CRUD actions unprotected
   - No rate limits
   - No mutation throttling

---

## Detailed Findings

### Finding 1: Unprotected Authentication Endpoints

**File:** `src/lib/auth.ts`

```typescript
export const auth = betterAuth({
    database: drizzleAdapter(db, {...}),
    emailAndPassword: {
        enabled: true  // ← NO rate limiting configured
    },
    // Missing: rateLimit, security options
});
```

**Vulnerability:** Brute force attacks on login
```
Attacker can try 10,000 password combinations per minute
No protection against credential stuffing
```

### Finding 2: No Rate Limiting on Google Books API

**File:** `src/actions/books.ts`

```typescript
export async function searchBooksAction(query: string): Promise<GoogleBookItem[]> {
  // ❌ NO rate limiting
  // ❌ NO caching
  // ❌ NO quota tracking
  try {
    const results = await searchBooks(query);
    return results;
  } catch (error) {
    console.error("[Server Action] Failed to search books:", error);
    return [];
  }
}
```

**Vulnerability:** Quota exhaustion
```
Attacker can exhaust daily quota (1000 queries/day free tier)
No tracking of API calls
No caching of popular searches
```

### Finding 3: No Server Action Protection

**File:** `src/actions/library.ts`

```typescript
export async function createLibrary(name: string): Promise<ActionResponse> {
  // ✅ Zod validation
  // ✅ Auth check
  // ❌ NO rate limiting
  // ❌ NO mutation throttling
  const user = await requireAuth();
  // ... rest of function
}
```

**Vulnerability:** Spam collections creation
```
User could create 1000 collections per second
No limit on operations per user
```

---

## Attack Scenarios

### Scenario 1: Credential Stuffing Attack
```
Attacker has 100,000 leaked email/password pairs
  ↓
Sends 100 login requests per second
  ↓
❌ NO rate limiting on /api/auth/sign-in
  ↓
System processes all requests
  ↓
Attacker compromises 1000+ accounts
```

### Scenario 2: API Quota Exhaustion
```
Attacker searches for common terms in loop:
  "book"
  "library"
  "fiction"
  ... (1000x per minute)
  ↓
❌ NO rate limiting
❌ NO caching
  ↓
Google Books API quota depleted
  ↓
ALL users get "API limit exceeded" error
  ↓
Service degradation for legitimate users
```

### Scenario 3: Collection Spam
```
Attacker creates libraries via Server Action:
  ↓
  createLibrary("spam1")
  createLibrary("spam2")
  ... 1000x/sec
  ↓
❌ NO rate limiting
  ↓
Database bloated
Performance degradation
  ↓
Legitimate users experience slowness
```

---

## CSRF Status

### Better Auth CSRF Protection

Better Auth handles CSRF tokens for:
- ✅ `POST /api/auth/sign-in`
- ✅ `POST /api/auth/sign-up`
- ✅ Session validation

**However:**
- ⚠️ Limited to Built-In endpoints only
- ⚠️ Custom Server Actions NOT protected by default
- ⚠️ Requires client-side cooperation

### Issue: Server Actions Not Protected by Default

```typescript
// ❌ CSRF not validated for this custom action
export async function createLibrary(name: string) {
  // No CSRF token check
  // Relies on Same-Origin Policy only
  // Vulnerable if user visits attacker site
}
```

### How CSRF Could Work

```
1. User logged into bookyblinders.com
2. User visits attacker.com in another tab
3. Attacker site has invisible form:
   <form action="https://bookyblinders.com/api/actions">
     <input name="action" value="createLibrary">
     <input name="name" value="spam">
   </form>
   <script>document.form.submit()</script>

4. ❌ NO CSRF token required
5. Request executes with user's session
6. Collection created without user consent
```

---

## Recommended Protections

### ✅ Priority 1: Rate Limiting (CRITICAL)

```typescript
// 1. Install package
npm install lru-cache

// 2. Create rate limiting middleware
// src/lib/rate-limit.ts
import LRUCache from 'lru-cache';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

const createRateLimiter = (config: RateLimitConfig) => {
  const store = new LRUCache({
    max: 10000,
    ttl: config.windowMs,
  });

  return (key: string): boolean => {
    const count = (store.get(key) as number) || 0;
    if (count >= config.maxRequests) {
      return false; // Limit exceeded
    }
    store.set(key, count + 1);
    return true; // OK
  };
};

export const loginLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 5 attempts per 15 minutes
});

export const searchLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 30 requests per minute
});

export const apiLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 100 requests per minute per user
});
```

### ✅ Priority 2: Protect Login Endpoint

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
    database: drizzleAdapter(db, {...}),
    emailAndPassword: {
        enabled: true,
        // Add options for security
    },
    // Consider upgrading Better Auth for built-in rate limiting
});
```

### ✅ Priority 3: Protect Server Actions

```typescript
// src/actions/books.ts
import { loginLimiter } from "@/lib/rate-limit";

export async function searchBooksAction(query: string): Promise<GoogleBookItem[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Rate limit by user ID
  const userId = session?.user?.id || 'anonymous';
  if (!loginLimiter(`search:${userId}`)) {
    return []; // Or throw error
  }

  // ... rest of function
}
```

### ✅ Priority 4: API Caching

```typescript
// src/lib/cache.ts
import LRUCache from 'lru-cache';

const googleBooksCache = new LRUCache({
  max: 1000,
  ttl: 24 * 60 * 60 * 1000, // 24 hours
});

// In src/services/google-books.ts
export async function searchBooks(query: string) {
  const cacheKey = `search:${query}`;
  
  // Check cache
  const cached = googleBooksCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const endpoint = `?q=${encodeURIComponent(query)}&maxResults=12`;
  const data = await fetchFromGoogleBooks<GoogleBooksResponse>(endpoint);
  
  // Cache result
  if (data) {
    googleBooksCache.set(cacheKey, data.items || []);
  }
  
  return data?.items || [];
}
```

---

## Implementation Plan

### Step 1: Add Rate Limiting Package
```bash
npm install lru-cache express-rate-limit
npm install --save-dev @types/express-rate-limit
```

### Step 2: Create Rate Limiting Utilities
Create `src/lib/rate-limit.ts` with limiting functions

### Step 3: Protect Authentication
Update Better Auth configuration

### Step 4: Protect Server Actions
Add rate limit checks to:
- `searchBooksAction()`
- `createLibrary()`
- `renameLibrary()`
- `deleteLibrary()`

### Step 5: Add Caching
Implement LRU cache for Google Books API

### Step 6: Test & Monitor
- Load test with rate limits enabled
- Monitor API quota usage
- Alert on suspicious patterns

---

## Missing Security Headers

Your `next.config.ts` is missing critical headers:

```typescript
// ❌ Current - too minimal
const nextConfig: NextConfig = {
  reactCompiler: true,
};

// ✅ Should be
const nextConfig: NextConfig = {
  reactCompiler: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
      ]
    }
  ]
};
```

---

## CSRF Token Protection for Server Actions

**Note:** Next.js Server Actions are inherently protected by:
- Same-Origin Policy (SOP)
- Cookie SameSite=Strict (if configured)
- CORS headers

**However,** explicit CSRF protection is recommended:

```typescript
// src/lib/csrf.ts
import { randomUUID } from 'crypto';

const csrfTokens = new Map<string, boolean>();

export function generateCSRFToken(): string {
  const token = randomUUID();
  csrfTokens.set(token, true);
  
  // Expire token after 1 hour
  setTimeout(() => csrfTokens.delete(token), 3600000);
  
  return token;
}

export function verifyCSRFToken(token: string): boolean {
  return csrfTokens.has(token);
}
```

---

## Database Optimization for Rate Limiting

Consider adding a `rate_limit_log` table for persistence:

```sql
CREATE TABLE rate_limit_log (
  id UUID PRIMARY KEY,
  user_id UUID,
  action TEXT,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  INDEX (user_id, action, timestamp),
  INDEX (ip_address, timestamp)
);
```

This allows:
- Tracking across restarts
- Per-user and per-IP analytics
- Identifying attack patterns

---

## Monitoring & Alerting

```typescript
// src/lib/security-alerts.ts
export async function trackRateLimitViolation(
  userId: string,
  action: string,
  ipAddress: string
) {
  // Log to database
  await db.insert(rateLimitLog).values({
    userId,
    action,
    ipAddress,
    timestamp: new Date(),
  });
  
  // Alert if threshold exceeded
  const recentViolations = await db
    .select()
    .from(rateLimitLog)
    .where(
      and(
        eq(rateLimitLog.userId, userId),
        gt(rateLimitLog.timestamp, new Date(Date.now() - 3600000)) // Last hour
      )
    );
  
  if (recentViolations.length > 10) {
    // Send alert email to admin
    await sendSecurityAlert({
      type: 'rate_limit_abuse',
      userId,
      violationCount: recentViolations.length,
    });
  }
}
```

---

## Recommendations Summary

### 🔴 CRITICAL (Implement Immediately)
1. Add rate limiting to authentication endpoints
2. Add rate limiting to Google Books API calls
3. Implement API response caching

### 🟠 HIGH (Implement This Week)
1. Add security headers to next.config.ts
2. Add rate limiting to all Server Actions
3. Add database logging for security events

### 🟡 MEDIUM (Implement This Month)
1. Add CSRF tokens to custom Server Actions
2. Implement security monitoring & alerts
3. Add IP-based rate limiting

### 🟢 LOW (Nice-to-have)
1. Add advanced bot detection
2. Implement geographic blocking
3. Add behavioral anomaly detection

---

## Conclusion

Your application has **critical gaps** in CSRF and rate limiting protections:

- ❌ No rate limiting anywhere
- ⚠️ Brute force attacks possible
- ⚠️ API quota exhaustion risk
- ⚠️ Server Actions lack CSRF protection

**Recommendation:** Implement rate limiting and CSRF protection before deploying to production.

**Estimated Effort:** 2-4 hours
**Priority:** CRITICAL

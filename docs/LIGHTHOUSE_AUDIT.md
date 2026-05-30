# Lighthouse Performance Audit — Booky Blinders

**Owner:** Mohinî Schirinzi
**Last updated:** May 2026
**Scope:** Home page (`/`) audited on Chrome DevTools Lighthouse 12.2.1, mobile profile (Emulated Moto G Power, Slow 4G throttling), single page session, initial page load.

This document tracks the Lighthouse performance work done over a two-day window: a baseline capture in production, the optimisations applied locally, the localhost validation, and the final production capture once the changes were deployed.

## 1. Reports

The three Lighthouse reports are versioned alongside this document:

| Report | File | Captured | Environment |
|--------|------|----------|-------------|
| Baseline (before) | [`lighthouse_prod_before.pdf`](./lighthouse_prod_before.pdf) | 19/05/2026 20:18 GMT+2 | `https://booky-blinders.vercel.app/` |
| Validation (local) | [`lighthouse_localhost_after.pdf`](./lighthouse_localhost_after.pdf) | 20/05/2026 14:37 GMT+2 | `http://localhost:3000/` |
| Final (production) | [`lighthouse_prod_after.pdf`](./lighthouse_prod_after.pdf) | 20/05/2026 16:54 GMT+2 | `https://booky-blinders.vercel.app/` |

## 2. Before / After (production → production)

### 2.1 Category scores

| Category | Before | After | Δ |
|----------|-------:|------:|---:|
| **Performance** | 79 | **93** | **+14** |
| Accessibility | 94 | 94 | = |
| Best Practices | 100 | 100 | = |
| SEO | 100 | 100 | = |

### 2.2 Core Web Vitals & key metrics

| Metric | Before | After | Δ |
|--------|-------:|------:|---:|
| First Contentful Paint (FCP) | 1.4 s | **1.0 s** | −0.4 s |
| Largest Contentful Paint (LCP) | 3.6 s | 3.2 s | −0.4 s |
| Total Blocking Time (TBT) | 420 ms | **80 ms** | **−340 ms** |
| Cumulative Layout Shift (CLS) | 0 | 0 | = |
| Speed Index | 3.0 s | **1.5 s** | **−1.5 s** |
| Total network payload | 485 KiB | 418 KiB | −67 KiB |
| Unused JavaScript (potential savings) | **895 KiB** | 45 KiB | **−850 KiB** |
| Long main-thread tasks | 7 | 3 | −4 |
| Main-thread work | 3.1 s | 2.5 s | −0.6 s |

### 2.3 Diagnostics that disappeared after the fixes

These flags were present in the baseline report and no longer appear in the final report:

- *Reduce JavaScript execution time* — 1.5 s
- *Serve images in next-gen formats* — 47 KiB
- *Properly size images* — 69 KiB
- *Avoid serving legacy JavaScript to modern browsers* — 0 KiB

## 3. What changed — work log (19–20 May 2026)

### 3.1 Performance & SEO optimisations

- **UI/UX trade-off — Hero animation kept.** The complex `BlurText` animation in the Hero header was preserved on purpose: it carries the visual identity of the project and the cost (LCP staying at 3.2 s) is an accepted compromise. An attempt to remove it broke the visual experience and was reverted.
- **Code splitting (lazy loading).** `next/dynamic` is now used to dynamically import every section below the fold (`Features`, `Showcase`, `Discover`, `CTA`). This is the change that moved *Reduce unused JavaScript* from 895 KiB → 45 KiB and cut TBT from 420 ms → 80 ms.
- **Render-blocking resources.** `globals.scss` was cleaned up (removed external `@import` rules) so the app relies exclusively on Next.js' native `next/font` loading, which preloads font files and avoids extra round-trips on the critical path.
- **Hydration.** Added `suppressHydrationWarning` on the root layout so the `next-themes` Light/Dark anti-flash inline script can run without producing a hydration mismatch in the console — and without a visible flash for the user.

### 3.2 Local quality gate — pre-commit hook

This part is independent of the CI/CD pipeline. Its goal is to catch lint/format issues *before* they reach a Pull Request — so the CI never fails on something that could have been fixed locally, and the CI config does not need to be edited per branch.

- **Husky + lint-staged** are scoped to the application sub-folder (`./booky-blinders`), since the repo has a nested layout.
- **Biome (`biome check --write`)** runs automatically on staged files at commit time, formatting the code and fixing linter issues on the fly. The code that lands on GitHub is therefore always formatted and lint-clean.
- Reference: [Biome — Git Hooks](https://biomejs.dev/recipes/git-hooks/).

## 4. Remaining items (intentionally not addressed)

These items still appear in the final report. Each is either an accepted trade-off or scheduled for a later iteration.

| Item | Status | Rationale |
|------|--------|-----------|
| LCP = 3.2 s (Hero element) | **Accepted** | Driven by the Hero `BlurText` animation, which is intentionally preserved for the brand's visual identity. |
| 22 non-composited animations | **Accepted** | Same trade-off — the animations are part of the design language. |
| Minimize main-thread work — 2.5 s | Open / informational | Mostly Next.js hydration cost. No impact on TBT (80 ms ✓). |
| DOM size — 360 elements | Open / informational | Within Lighthouse's "OK" threshold. |
| Accessibility — 3 manual fixes (contrast, heading order, ARIA on incompatible element) | Open | Tracked separately, not part of this performance pass. |

## 5. Methodology

- **Tool:** Chrome DevTools Lighthouse 12.2.1 (Chromium 132).
- **Profile:** Mobile (Emulated Moto G Power), Slow 4G throttling, single page session, initial page load. This is the most demanding default profile and the one used for Core Web Vitals reporting.
- **Why three reports?** The baseline (`prod_before`) establishes the starting point. The localhost capture validates that the optimisations work on the dev build before merging. The final production capture confirms the gain is real once Vercel has deployed the changes — it is not just a local artifact.
- **Threshold reference:** the production gate in [`PRE_PROD_CHECKLIST.md`](./PRE_PROD_CHECKLIST.md) §4.7 requires Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95 on mobile. The final score (93) clears the Performance threshold by a comfortable margin.

## 6. Next steps

- General codebase refactor.
- Final project documentation pass.

# Changelog

All notable changes to this project are documented below, based on the git history.

## 2026-05-28
- chore: flatten repo structure (move booky-blinders/ to root) (2b9c6c0)
- hore: update CI, husky and gitignore for flat structure (b284dd0)
- Merge pull request #27 from Mohinsch/feat/refacto-and-lighthouse (73f38ac)
- chore: update changelog (5e423ad)
- Merge branch 'dev' into chore/flatten-structure (88298bb)
- git config core.hooksPath .husky (8f1cc69)
- Merge pull request #26 from Mohinsch/chore/flatten-structure (9822b61)

## 2026-05-27
- refactor: improve architecture, server actions security, and accessibility (7fdd339)
- refacto: organize files and clean code (8b0f045)
- test: add error handling for password change and account deletion (5e74d31)
- fix: ensure error messages are always an array in LoginForm and RegisterForm (f1fa842)
- Merge pull request #24 from Mohinsch/feat/refacto-and-lighthouse (75cc259)
- chore: update changelog (04c4c9b)
- fix: add token to introduce codecov (b772520)
- fix: add actual branche to testing coverage (107cb32)
- Merge pull request #25 from Mohinsch/feat/refacto-and-lighthouse (80ca176)
- chore: update changelog (2d68d5d)
- refacto: remove unused Docker integration job from CI workflow (82444b3)

## 2026-05-26
- feat: update CI configuration and add Vercel deployment steps to todo list (6389567)
- feat: add changelog workflow to automate CHANGELOG.md generation (1870f20)
- refactor: replace SCSS variables with CSS custom properties for consistency (4322ac4)
- feat: add comprehensive UI test cases for improved coverage (445cf7a)
- fix: add validation message for empty search query and update localization (1d79b60)
- chore: add task to modify recovery password in todo list (5b63e18)
- fix: implement book redirection on selection in SearchModal (c04d096)
- fix: implement focus trap hook and integrate it into modals for accessibility (95d9883)
- Merge pull request #23 from Mohinsch/feat/refacto-and-lighthouse (7ad881b)
- chore: update changelog (feefb2d)
- feat: add database seeding and dumping scripts to enhance data management (627009e)
- feat(tests): add comprehensive tests for account actions, book actions, and UI components (4a42782)
- docs: enhance test plan with success and error path descriptions (e5c3bf3)
- refactor: reorganize type definitions and imports for better structure (0a35e0b)

## 2026-05-25
- fix: change tree structure conception (e45004d)
- feat: add zoningweb for conception (cef955a)
- feat: add architecture diagram for conception (ce02564)

## 2026-05-20
- feat: refactor AuthCTA component to handle hydration mismatch and improve loading state (f970bd4)
- Merge pull request #19 from Mohinsch/feat/refacto-and-lighthouse (d88a56e)
- feat: reorder imports for consistency and optimize image width/height parsing (0bbab2d)
- feat: remove space before comments for consistency in LCP optimization annotations (c512084)
- Merge pull request #20 from Mohinsch/feat/refacto-and-lighthouse (a964f9b)
- feat: remove emoji from priority comments for consistency in LCP optimization (173b92e)
- feat: optimize hydration handling and lazy load components for improved performance (34a9159)
- Merge pull request #21 from Mohinsch/feat/refacto-and-lighthouse (4acad70)
- feat: add husky and lint-staged for pre-commit hooks and improve code quality (db10c1a)
- Merge pull request #22 from Mohinsch/feat/refacto-and-lighthouse (bd6085f)

## 2026-05-19
- feat: add language for any page and linter reset (68045d8)
- Merge pull request #17 from Mohinsch/feat/Advanced-user-experience (cedb7fe)
- fix: delete md translation summary (2c99ded)
- feat: update dependencies and add new documentation files (d6ee1a5)
- Merge pull request #18 from Mohinsch/feat/Advanced-user-experience (ea192e1)
- feat: refactor components for dynamic imports and optimize images (b6cde09)

## 2026-05-11
- Complete French internationalization for all remaining pages and error messages (11fdbe8)
- feat: enhance localization support for About Us and Search Modal components (2198ba1)
- Merge pull request #16 from Mohinsch/feat/Advanced-user-experience (f29d21b)

## 2026-05-08
- refactor: clean up CI workflow comments and improve job descriptions (6cccd48)
- Merge pull request #14 from Mohinsch/feat/ci-cd (e9fb2c7)
- fix: update branch name in CI workflow and mark unique index checks as complete in todo (b9d6337)
- feat: add account management features including password change and account deletion (f2cd2df)
- feat: add Privacy Policy and Terms of Service pages with styling (73f5ffd)
- fix: reorder imports in Header component for consistency (780008d)
- Merge pull request #15 from Mohinsch/feat/user-section (4b7161f)
- feat: implement theme switching with next-themes and update styles for dark/light modes (432d414)
- feat: add localization support with language switcher and context provider (beb8d2d)
- fix: remove obsolete branch references from CI configuration files (c90a3be)

## 2026-05-07
- Merge pull request #12 from Mohinsch/feat/ui-register-login-page (f905576)
- feat: add category management utilities and enhance database schema with indexes (727fb88)
- feat: replace Button with AuthCTA for authentication-aware call-to-action in CtaSection and HeroSection (568aee1)
- Merge pull request #13 from Mohinsch/refacto/clean-code-and-refacto (671b492)
- feat: add CI workflow for linting, testing, and building Next.js application (cc04988)
- feat: add CI workflow for linting, testing, and building Next.js application (7135e6c)
- chore update package lock (072ac8a)
- Add comprehensive security documentation and audits (7535c79)
- fix: change dependency installation command from npm ci to npm install (513daaa)
- feat: add .npmrc to .gitignore (3cbb6cb)
- chore: fix 401 unauthorized in lockfile (724a4e5)
- fix: update dependency installation to set npm registry before install (2de6df4)
- chore: cleanup root node_modules and refresh app lockfile (32d1b33)
- fix: update dependency installation command to avoid package lock and audits (fa4d79b)
- Refactor code for consistency and readability (ac72d38)
- feat: add button types for accessibility and improve role attributes in components (0690a70)
- fix: improve accessibility and key assignment in UI components (b9fa37a)
- fix: update error messages in addBookToLibrary function for clarity (826a7db)
- fix: ensure non-null assertion for validationResult data in library actions (71ae46a)
- refactor: remove LRU cache implementation and utilize Next.js native data caching (6833e07)
- fix: add comments for dynamic rendering and clarify export statement (a2c19e2)
- fix: ensure non-null assertion for validationResult data in library actions and improve fetch options in Google Books service (669b95b)
- fix: format tags array in searchBooks test for improved readability (1ffbe5f)
- feat: add CI workflow for production with linting, testing, and database migration (d2c752e)
- fix: remove footer section from HomePage for cleaner layout (3f2a942)
- feat: add Supabase dependencies for enhanced backend integration (0d5da77)
- refactor: remove AuthErrorDisplay and related error handling from AuthPage (0f4596e)

## 2026-05-04
- feat: remove outdated validation guide and CSRF audit documentation (812dd0d)
- feat: implement book details modal and enhance book retrieval functionality (b75eca1)
- feat: centralize constants and improve error handling across components (d6947bd)

## 2026-05-03
- feat: update error messages to English and refactor authentication components for improved readability (8f0f50b)
- feat: update comment for future social network integration in authentication (afad646)

## 2026-05-02
- Merge pull request #9 from Mohinsch/feat/dev-ui-pages (fa4c2fa)
- feat: add mounted state to BookCard component and update loading condition (9fb64c8)
- Merge pull request #10 from Mohinsch/feat/dev-ui-pages (c8e03ae)
- Rename TreeStructure diagram to conception folder (37c19ef)
- feat: implement Zod validation for library actions and add validation guide (3d707dd)
- feat: add comprehensive security audit for SQL/NoSQL injection protection (0cfd3e8)
- Add comprehensive frontend security summary and XSS audit reports (fe63e83)
- feat: implement rate limiting and caching for Google Books API interactions (da917aa)
- feat: add comprehensive rate limiting and CSRF protection implementation guide (c1e5261)
- feat: add comprehensive security documentation and certification reports (9130dd9)
- Merge pull request #11 from Mohinsch/feat/cyber-and-zod (f73c70a)
- feat: refactor authentication components and enhance error handling (4c6d98b)

## 2026-05-01
- feat: add final bookcard components style (433dd7c)
- feat: add about-us page (6145b77)
- fix: delete old herobrass (6b8652e)
- feat: add store and create search modal (ed07302)
- feat: introduce search modale (b319964)
- feat: add library page draft (7fce98b)
- feat: add button to add book in my library (33b2288)
- feat: add tanstack table (6c983b9)
- fix: change import better-auth session (577c7ef)
- feat: refacto library page (dde6130)
- feat: finish page library (930d28f)
- feat: refacto with biome (5ee9c39)
- feat: enhance SearchModal and BookCard components with library management features (48af6b2)
- feat: improve searchBooks function to handle empty queries and streamline API calls (50d8a25)
- feat: enhance Header component with logout functionality and loading state (220e2fa)

## 2026-04-30
- feat: refacto homepage division and style with figma moqups (ae99e36)
- feat: change navlink dynamique footer (31dcb7b)
- fix: change variant in header (a64a0e9)

## 2026-04-29
- feat: Implement dynamic Header states (Login/Logout buttons depending on auth state). (c96abc9)
- feat: draft Integrate the presentation text and hero section. (7701a30)
- feat: add react lucide (353e130)
- feat: divise herosection from page (541f86e)
- feat: add animation in the header (13fa6bf)
- feat: add framer motion (b762194)
- feat: add effect in hero section (eca703b)
- feat: add animation for featureSection and divide from homepage (f09b4ca)
- feat: divide showcase section from homepage and add animation (37473e1)

## 2026-04-24
- feat: add new logo by figma (953c8cf)
- feat: dev ui footer for mobile and desktop (ef1f191)
- feat: add footer in layout (77fa7b5)
- fix: footer padding and gap (cf8ff1a)
- feat: add Header for mobile and desktop (2378cc2)
- feat: todo add given then when in test (8b8f113)
- Merge pull request #8 from Mohinsch/feat/dev-ui-pages (d1af2a2)
- fix: todo to separate const in the code (c9df48f)

## 2026-04-21
- fix: change name middleware (d123bcc)
- feat: install vitest and test plan (10c0683)
- feat: add proxy middleware tests (0e26cf4)
- feat: add books tests (1ef2229)
- feat: add library tests (7e17ef6)
- feat: add api google tests (31816a8)
- Merge pull request #7 from Mohinsch/feat/dev-CRUD-for-mvp (6eba5b9)
- feat: install scss (6614910)
- feat: add mixins, variables, globals and homepage start ui (0a7b8b8)

## 2026-04-20
- feat: add new migration to change type of published_at (99664f0)
- feat: add crud for book and library (e5a7afa)
- feat: add testpage to test the CRUD (d3cbe33)
- feat: add test for crud with vitest config (22534db)
- todo: add task to check next steps (21ca7f4)
- Merge pull request #6 from Mohinsch/feat/dev-CRUD-for-mvp (d3b092a)

## 2026-04-19
- feat: add service for google api books with types (9ad50cf)
- feat: test the API with extension Http CLIENT (10a7524)
- feat: add server actions for google api books (62f8d8e)
- feat: add draft to test the api in the homepage (b4deb5f)
- Merge pull request #5 from Mohinsch/feat/google-api-setup (841d2e8)

## 2026-04-17
- feat: init better-auth connection with authentification page (6383145)
- feat: add better-auth config for login page and config zod schema (016ebb7)
- feat: add todo list for next steps and empty file for middleware (fef4595)
- fix: clean code comments (32a67c6)
- feat: add middleware for cookies (23448ed)
- feat: add logout button (9c2c403)
- feat: add header to test logout (3933428)
- feat: add header in layout (801c7ad)
- feat: add footer static to test all auth process (9042a32)
- Merge pull request #4 from Mohinsch/feat/better-auth (217ca0a)

## 2026-04-15
- feat: install better-auth (b2734e1)
- Merge pull request #3 from Mohinsch/chore/project-setup (e7a0895)
- fix: add new erd schema to complete better-auth definition schema (82562b4)
- fix: init better-auth definition schema (08b439f)
- feat: new migration with table for better auth (c53b6f9)

## 2026-04-14
- fix: change node version and docker compose restrictions, add healthcheck (a87ade8)
- fix: change ERD to add table for Better-Auth (2cf2ac1)
- feat: add dockerignore (4d77dce)
- feat: add drizzle config (d3483b3)
- feat: Add drizzle index and schema (ea3fe07)
- feat: migration drizzle done (51ad32c)
- feat: add new deps (5246f3f)

## 2026-04-10
- feat: add docker environments (56a42c0)
- feat: add base globals style (09b1644)
- feat: start schema drizzle (27d041e)

## 2026-04-07
- feat: add moqups (b02e46f)
- Merge pull request #2 from Mohinsch/feat/sprint0-conception (7c35ae7)

## 2026-03-21
- feat: add activity diagram (4c1b6f0)

## 2026-03-10
- feat: add wireframes for desktop (f8d81de)

## 2026-03-08
- feat: add wireframe for mobile (b3121c5)

## 2026-03-03
- fix: fix md erd (09adf11)
- feat: add sequence diagram (e6ff7b3)
- feat: add use case diagram (dca82c9)
- fix: check todo list (1e97733)
- feat: add data dictionnary (60badc9)
- fix: changes files names (eb00be4)

## 2026-03-02
- chore: add new arborescence front (333db9b)
- chore: add new erd diagram (b63487d)
- feat: add todo list (9149bfb)

## 2026-02-28
- Initial commit (b32327d)
- chore: add vscode in gitignore (85c47f0)
- chore: setup init project with nextjs, scss and biome (fe86660)
- Merge pull request #1 from Mohinsch/chore/project-setup (92619d9)
- feat: add different logos for the application (e3d9d27)
- feat: remove unused files and unselected logo (caa4c6a)

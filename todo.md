# Todo List
<!-- TODO:  contrainte unicité sur listBook, userCategory, bookCategory Action :  règle de gestion. Dans code Drizzle, créer une Primary Key composée ou un Unique Index sur les deux IDs de chaque table pivot. -->
- [x] Verify unique constraints on pivot tables @priority(high)
  Business Rule: Ensure Drizzle code includes a Composite Primary Key or a Unique Index on the two foreign keys for pivot tables to prevent duplicates.
  - [x] Check `uniqueIndex` on `library_books`
  - [x] Check `uniqueIndex` on `user_categories` (Future evolution)
  - [x] Check `uniqueIndex` on `book_categories` (Future evolution)
- [ ] Integrate Social Authentication @priority(low)
  Enable third-party login providers in Better-Auth configuration.
  - [ ] Configure Google OAuth provider
  - [ ] Configure GitHub OAuth provider
- [ ] Codebase Refactoring & Maintenance @priority(medium)
  - [x] Rename src/middleware.ts to src/proxy.ts to comply with Next.js 16.1.6 deprecation warnings and clean up server log
  - [ ] Add "Given then when" in all test files
  - [x] Replace magic word in code , separation variable and const
- [ ] E2E Testing Strategy Evolution @priority(medium)
  - [ ] Evaluate the transition from Cypress to Playwright for end-to-end testing. @id(test01)
  - [ ] Goal: Improve execution speed with Turbopack and ensure better support for multi-tab authentication flows.
- [ ] Setup vercel deploy in ci/cd prod @priority(high)
- [ ] Setup modify recovery password @priority(low)
<!-- Format de la Todo List :
- [ ] Tâche @id(abc123)
  - [ ] Sous-tâche @id(def456)
-->


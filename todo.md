# Todo List
<!-- TODO:  contrainte unicité sur listBook, userCategory, bookCategory Action :  règle de gestion. Dans code Drizzle, créer une Primary Key composée ou un Unique Index sur les deux IDs de chaque table pivot. -->
- [x] Verify unique constraints on pivot tables @priority(high)
  Business Rule: Ensure Drizzle code includes a Composite Primary Key or a Unique Index on the two foreign keys for pivot tables to prevent duplicates.
  - [x] Check `uniqueIndex` on `library_books`
  - [ ] Check `uniqueIndex` on `user_categories` (Future evolution)
  - [ ] Check `uniqueIndex` on `book_categories` (Future evolution)
- [ ] Integrate Social Authentication @priority(low)
  Enable third-party login providers in Better-Auth configuration.
  - [ ] Configure Google OAuth provider
  - [ ] Configure GitHub OAuth provider
<!-- Format de la Todo List :
- [ ] Tâche @id(abc123)
  - [ ] Sous-tâche @id(def456)
-->


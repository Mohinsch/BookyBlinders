# Rollback Procedure - Booky Blinders

**Owner:** Mohinî Schirinzi
**Last updated:** May 2026
**Scope:** How to revert a production deployment when a critical bug, regression, or incident is detected after a merge to `main`.

This document covers two layers that must be considered separately:

1. **Application layer** (Next.js code on Vercel) — usually safe to roll back instantly.
2. **Database layer** (PostgreSQL on Supabase) — irreversible if the migration was destructive; requires careful planning.

---

## 1. Decision matrix — when to roll back

| Severity | Symptoms | Action |
|----------|----------|--------|
| 🔴 **Critical** | Site down, login broken, data corruption, data leak | **Immediate rollback** — see §2. |
| 🟠 **High** | Core feature broken (search, add book, account deletion), but site still loads | Rollback within 15 min unless a hotfix is ready and tested in <30 min. |
| 🟡 **Medium** | Cosmetic regression, minor feature bug, slow page on a single route | Roll forward — open a fix PR, no rollback. |
| 🟢 **Low** | Translation typo, minor styling | Roll forward — fix in next release. |

**Decision authority:** the release owner (project lead). For critical incidents, no approval is needed — restore service first, investigate after.

## 2. Application rollback (Vercel "Instant Rollback")

Vercel keeps every previous production deployment. Reverting takes ~5 seconds and does not require a rebuild.

### 2.1 Procedure (UI)

1. Go to https://vercel.com/<team>/booky-blinders/deployments.
2. Filter by `Environment: Production`.
3. Find the last known good deployment (the one **before** the broken release).
4. Click the `⋯` menu → **"Promote to Production"**.
5. Confirm. Vercel will instantly route production traffic to that deployment.

### 2.2 Procedure (CLI alternative)

```bash
# List recent production deployments
vercel ls booky-blinders --prod --token=$VERCEL_TOKEN

# Promote the chosen deployment URL to production
vercel promote <deployment-url> --token=$VERCEL_TOKEN
```

### 2.3 Verification (must do)

After the rollback completes:

- [ ] Open https://booky-blinders.vercel.app in an incognito browser window.
- [ ] Confirm the homepage loads and the bug is gone.
- [ ] Test login with a known account.
- [ ] Add a book to verify the database connection still works.
- [ ] Check Vercel logs for new errors during the past 5 minutes.

If the rollback succeeded and §3 (database) does not apply, the incident is contained.

### 2.4 Post-rollback follow-up

- Open a GitHub issue describing the failure, the rollback timestamp, and the root cause.
- Revert the offending commit on `main` via a new PR (`git revert <sha>`) so the next release does not re-introduce the bug.
- If the regression slipped past CI, add a regression test before re-deploying.

## 3. Database rollback (Supabase / Drizzle)

> ⚠️ **This is the dangerous part.** A schema migration is **not** automatically reversible. Drizzle does not generate `down` migrations.

### 3.1 When does the database need a rollback?

| Migration content | Rollback action |
|-------------------|-----------------|
| Adding a column (nullable) | Usually no rollback needed — the new column is ignored by the previous code. |
| Adding a column (NOT NULL) | App rollback alone may fail (old code does not write the column). Either accept downtime or write a manual `ALTER TABLE` to drop the constraint. |
| Adding an index | No rollback needed (indexes don't break old code). |
| Adding a table | Old code ignores the new table. No rollback needed. |
| Renaming a column | **Critical** — old code queries the old name. Must run a manual SQL `ALTER TABLE ... RENAME COLUMN ...` to restore. |
| Dropping a column | **Data loss** — only restorable from a backup. See §3.3. |
| Dropping a table | **Data loss** — only restorable from a backup. See §3.3. |

### 3.2 Manual schema rollback

Drizzle does not provide automatic down migrations, so reverse changes are applied by hand:

1. Connect to the production database via Supabase SQL editor or `psql` with the production `DATABASE_URL`.
2. Run the **inverse** of the offending migration. Example for a column rename:
   ```sql
   ALTER TABLE library RENAME COLUMN display_name TO name;
   ```
3. After the SQL runs:
   - Delete the offending migration file from `src/db/migrations/`.
   - Update `src/db/migrations/meta/_journal.json` to remove the entry.
   - Adjust `src/db/schema.ts` to match the rolled-back state.
4. Open a PR with these changes so the schema source-of-truth matches production again.

### 3.3 Restore from Supabase backup (last resort)

For destructive migrations (DROP COLUMN, DROP TABLE), only a backup can restore the data.

1. Go to https://supabase.com/dashboard/project/<project>/database/backups.
2. Identify the most recent backup taken **before** the incident (Supabase free tier keeps daily backups for 7 days).
3. Click **"Restore"** on the chosen backup.
4. Restoring will **overwrite the current database** — any data written between the backup and now will be lost.
5. Confirm the restore.

After the restore, follow §2 to roll back the application as well, so the code matches the older schema.

### 3.4 Verification

- [ ] Connect to the database via Adminer (locally pointed at the prod URL via SSH tunnel) or Supabase Studio.
- [ ] Confirm the schema matches the previous good state.
- [ ] Run a sanity query: `SELECT count(*) FROM "user";` — confirm the count is sensible.
- [ ] Verify the application reads and writes correctly with a test account.

## 4. Roles & decision flow

```
Critical incident detected (alert / user report / smoke test failure)
        │
        ▼
  Release owner notified
        │
        ▼
  Severity assessed (table §1)
        │
        ├─ Critical / High ──► §2 Vercel Instant Rollback (≤ 5 min)
        │                       │
        │                       ▼
        │                  Database affected? ──► §3 DB rollback
        │                       │
        │                       ▼
        │                  Service restored ──► incident issue + revert PR
        │
        └─ Medium / Low ─────► Roll forward (open hotfix PR)
```

**Single-developer note:** today the release owner is also the developer. In V2, if a second contributor joins, the rollback authority must remain with one named person to avoid concurrent decisions.

## 5. Drills & maintenance

- Once per quarter, perform a **dry-run rollback** on a Vercel preview deployment to confirm the procedure still works and credentials are valid.
- After every Supabase or Vercel API change, re-validate the CLI commands in §2.2.
- Keep `VERCEL_TOKEN` and Supabase credentials in a password manager — never commit them.

## 6. References

- Vercel Instant Rollback: https://vercel.com/docs/deployments/instant-rollback
- Supabase backups: https://supabase.com/docs/guides/platform/backups
- Drizzle migrations: https://orm.drizzle.team/docs/migrations
- Pre-merge checklist: [PRE_PROD_CHECKLIST.md](./PRE_PROD_CHECKLIST.md)

# Smart Expenses: agent working rules

Web app for tracking expenses with receipt OCR. Next.js 15 (App Router, TypeScript), Postgres via Drizzle,
Azure Blob Storage (Azurite locally). Target hosting: Azure Container Apps. See DECISIONS.md for why.

## Start of every session ("clock in")
1. Read `PROGRESS.md` (especially "Next steps") and `DECISIONS.md`.
2. Make sure Docker is running, then run `./init.sh`. If it fails, fixing that comes before anything else.
3. Pick the `active` feature in `feature_list.json`, or the first `not_started` one, and set it to `active`.

## Working rules
- **One feature at a time (WIP=1).** Don't touch code outside the active feature's scope. If you notice something
  else that needs doing, write it under "Known issues" in PROGRESS.md and don't fix it now.
- `feature_list.json` is the only list of what to build. Don't invent features. If one is too big or unclear,
  set it to `blocked` with a note and stop.
- **Never set a feature to `passing` yourself.** Run `npm run verify -- <id>`; only that script changes the state to passing.
- Write the e2e test named in the feature's `verification` first and watch it fail, then implement.
- All config comes from env vars via `src/lib/config.ts`. No secrets in code. Add new vars to `.env.example`.
- Who the user is comes only from `getCurrentUser()` (`src/lib/current-user.ts`). Every user-owned table has `user_id`.
- Money is stored as integer minor units plus an ISO 4217 currency code. Never use floats.
- Schema changes: edit `src/db/schema.ts`, run `npm run db:generate`, then `npm run db:migrate`. Commit the generated SQL.
- External services (OCR, storage) go behind an interface so tests can use a stub.

## Definition of done (for a feature)
`npm run verify -- <id>` passes, which means lint, types, unit tests, build and the feature's e2e test all pass
against the production build. "Compiles" or "looks right" doesn't count.

## End of every session ("clock out")
1. `npm run check` passes (or the failure is written down in PROGRESS.md under "Known issues").
2. Update `PROGRESS.md`: what was done, the current state, and concrete next steps.
3. Record any non-obvious decision in `DECISIONS.md`, including the alternatives you rejected.
4. No stray files, debug code or commented-out blocks. Commit.

## Commands
| Command | Purpose |
|---|---|
| `./init.sh` | setup + full check (idempotent) |
| `npm run dev` | dev server on :3000 |
| `npm run check` | lint, typecheck, unit tests, build, e2e |
| `npm run verify -- F01` | run a feature's verification and record the result |
| `npm run db:generate` / `db:migrate` | create / apply migrations |

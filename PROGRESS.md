# Progress

## Current state
F01 passing (2026-11-25). The home page has an add-expense form and lists the user's expenses newest first.
`./init.sh` brings a fresh clone to a green `npm run check`.

## Completed
- 2026-11-20 Session 1: Next.js 15 scaffold, Postgres + Azurite via docker-compose, Drizzle with the `users`
  table and seeded default user, `getCurrentUser()` seam, `/api/health` readiness endpoint (DB + storage),
  Vitest + Playwright, production Dockerfile (standalone output), harness files.
- 2026-11-25 Session 2:
  - Fixed `./init.sh`: the unquoted `STORAGE_CONNECTION_STRING` in `.env.example` was split at `;` when bash
    sourced it, the truncated exported value overrode Next's `.env`, health returned 503 and Playwright's
    webServer timed out. The value is now single-quoted. **Existing clones must quote it in their own `.env` too.**
  - F01: `expenses` table (migration `0001_expenses`), `src/lib/money.ts` (string-based parsing/formatting,
    no floats), `src/expenses/input.ts` (pure validation), `src/expenses/repository.ts`, server action
    `src/app/actions.ts`, client form `src/app/expense-form.tsx`, e2e `e2e/add-expense.spec.ts`.

## In progress
Nothing.

## Known issues
- npm blocks `sharp`'s install script (allow-scripts). Next.js image optimisation then falls back.
  Not needed until we show receipt thumbnails; approve with `npm approve-scripts sharp` if needed.
- Playwright starts the app with `next start`, which warns under `output: standalone`. It works, but isn't
  byte-identical to the container. The Docker image itself was verified manually (health = ok); F02 makes the
  smoke test run against the real container/deployment.
- e2e tests insert real rows (tagged `e2e-<timestamp>`) and never delete them. Locally that's harmless; once
  F02 runs add-expense.spec.ts against the deployed app, they would land in the owner's real data. Decide in F02
  (separate test user/DB, or cleanup once F03 adds delete).
- The form's default date is the server's UTC date, so close to midnight it can be off by a day for the user.
- Display locale is fixed to en-US (`src/lib/money.ts`); the dates in the list are shown as ISO YYYY-MM-DD.

## Next steps
1. Before F02: create a GitHub repo and push; have an Azure subscription/resource group ready plus rights to
   create an Entra app registration with a federated credential for GitHub OIDC (D7).
2. F02: also decide how e2e runs against Easy Auth and where its test data goes (see Known issues).
3. F03 (edit/delete, monthly total) can build on `src/expenses/repository.ts`. The monthly total needs a
   per-currency sum, since there's no FX conversion.

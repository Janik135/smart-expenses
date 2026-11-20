# Progress

## Current state
Session 1 (initialization) done. No features implemented yet. `./init.sh` brings a fresh clone to a green `npm run check`.

## Completed
- 2026-11-20 Session 1: Next.js 15 scaffold, Postgres + Azurite via docker-compose, Drizzle with the `users`
  table and seeded default user, `getCurrentUser()` seam, `/api/health` readiness endpoint (DB + storage),
  Vitest + Playwright, production Dockerfile (standalone output), harness files.

## In progress
Nothing.

## Known issues
- npm blocks `sharp`'s install script (allow-scripts). Next.js image optimisation then falls back.
  Not needed until we show receipt thumbnails; approve with `npm approve-scripts sharp` if needed.
- Playwright starts the app with `next start`, which warns under `output: standalone`. It works, but isn't
  byte-identical to the container. The Docker image itself was verified manually (health = ok); F02 makes the
  smoke test run against the real container/deployment.

## Next steps
1. Start F01: write `e2e/add-expense.spec.ts` first, then add the `expenses` table, a server action and the form + list.
2. Before F02: decide D7 (GitHub Actions vs Azure Pipelines).

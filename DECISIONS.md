# Decisions

## D1: Web app first (2026-11-20)
Web is the fastest platform to verify end-to-end with Playwright. Rejected for now: native mobile.

## D2: First "smart" feature is receipt OCR (2026-11-20)
Rejected for v1: auto-categorisation, spending insights. Categories come later as a plain feature (F07).

## D3: Azure as target; local stand-ins mirror Azure services (2026-11-20)
Container Apps for hosting, PostgreSQL Flexible Server, Blob Storage, Document Intelligence for OCR.
Locally: Postgres 17 and Azurite in docker-compose.
Rejected: SQLite (file locking issues on Azure Files; we'd have different engines locally and in prod),
browser-only storage (the OCR API key can't live in the browser; receipt images in IndexedDB are awkward).

## D4: All config via environment variables (2026-11-20)
One `loadConfig()` that fails fast. In Azure, Key Vault references and managed identity replace the
connection strings (F02).

## D5: No auth in code yet; single default user behind getCurrentUser() (2026-11-20)
On Azure the app sits behind Container Apps built-in auth (Easy Auth, Entra ID), restricted to the owner.
Every user-owned table has user_id now, so multi-user is a change to getCurrentUser() only.
Rejected: building auth first (every e2e test would need a login; it's scope creep for a single-user app).

## D6: Deploy early as F02 (walking skeleton) (2026-11-20)
Azure problems (identity, networking, migrations, cold start) show up while the app is still tiny.

## D7: CI/CD via GitHub Actions (2026-11-20)
Deploy to Azure with OIDC federated credentials (`azure/login`, no stored client secrets). Images go to
Azure Container Registry. Rejected: Azure Pipelines.

## D8: OCR via Azure AI Document Intelligence prebuilt-receipt, behind a ReceiptParser interface (2026-11-20)
It returns structured fields, so we can verify it with fixture receipts. A general vision LLM stays possible as
another implementation of the same interface.

## D9: Money input and storage details (2026-11-25)
`amount_minor` is a Postgres `integer` (max 2,147,483,647 minor units, e.g. about 21 M EUR), which is plenty
for personal expenses. User input is parsed as a string into minor units using the currency's ISO 4217
minor digits (EUR 2, JPY 0, KWD 3, IQD 3, HUF 2) from a table of the non-2-digit currencies in `src/lib/money.ts`;
too many decimals are rejected, not rounded. Display passes an exact decimal string to `Intl.NumberFormat`, forced
to the same number of digits. The form offers a short currency list, but the server accepts any ISO 4217 code.
Rejected: `numeric`/`bigint` columns (bigint comes back as a string in node-postgres; not needed at this scale),
parsing with `parseFloat` (`0.29 * 100` is not 29), taking the digits from `Intl` (that's CLDR display
precision, which says 0 for e.g. HUF, COP, IDR and IQD and so differs from the ISO minor units we store).
The table has to be updated by hand if ISO 4217 changes.

## D10: Expense list order and date type (2026-11-25)
Newest first means by `spent_on` (the date the user entered) descending, then `created_at` descending.
`spent_on` is a SQL `date` read as a `YYYY-MM-DD` string, so no timezone shifts. Rejected: ordering by
`created_at` only (back-dated expenses would show at the top).

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

## D7: CI/CD system (OPEN)
GitHub Actions or Azure Pipelines. Decide before starting F02.

## D8: OCR via Azure AI Document Intelligence prebuilt-receipt, behind a ReceiptParser interface (2026-11-20)
It returns structured fields, so we can verify it with fixture receipts. A general vision LLM stays possible as
another implementation of the same interface.

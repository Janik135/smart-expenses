# Smart Expenses

Expense tracking with receipt OCR. Next.js + Postgres + Azure Blob Storage, deployed to Azure Container Apps.

## Getting started
Requires Node.js 24 and Docker Desktop (running).

```bash
./init.sh      # installs, starts Postgres + Azurite, migrates, runs all checks
npm run dev    # http://localhost:3000
```

Working rules for agents and humans are in [CLAUDE.md](CLAUDE.md). Progress is in [PROGRESS.md](PROGRESS.md),
the roadmap in [feature_list.json](feature_list.json), and the reasoning in [DECISIONS.md](DECISIONS.md).

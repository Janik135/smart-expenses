#!/usr/bin/env bash
# Brings a fresh clone to a verified, runnable state. Safe to run repeatedly.
# Usage: ./init.sh            setup + full check
#        ./init.sh --no-check setup only
set -euo pipefail
cd "$(dirname "$0")"

step() { printf '\n==> %s\n' "$1"; }
fail() { printf '\nINIT FAILED: %s\n' "$1" >&2; exit 1; }

step "Checking prerequisites"
command -v node >/dev/null || fail "node not found. Install Node.js 24."
docker info >/dev/null 2>&1 || fail "Docker daemon not reachable. Start Docker Desktop, then rerun ./init.sh."

step "Environment file"
[ -f .env ] || { cp .env.example .env; echo "created .env from .env.example"; }
set -a; . ./.env; set +a

step "Installing dependencies"
npm ci --no-audit --no-fund
npx playwright install chromium

step "Starting Postgres + Azurite"
docker compose up -d --wait

step "Applying migrations"
npm run db:migrate

if [ "${1:-}" != "--no-check" ]; then
  step "Running full check"
  npm run check
fi

printf '\nREADY. Start the app with: npm run dev  (http://localhost:3000)\n'

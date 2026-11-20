import { expect, test } from "@playwright/test";

// Also runs against the deployed app later: E2E_BASE_URL=https://... npx playwright test e2e/smoke.spec.ts
test("health endpoint reports database and storage ok", async ({ request }) => {
  const res = await request.get("/api/health");
  const body = await res.json();
  expect(body, JSON.stringify(body)).toMatchObject({ status: "ok", checks: { database: "ok", storage: "ok" } });
});

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Smart Expenses" })).toBeVisible();
});

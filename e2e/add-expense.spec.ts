import { expect, test } from "@playwright/test";

// The database persists between runs (and later is the deployed one), so every run tags its own expenses.
const run = `e2e-${Date.now()}`;

async function addExpense(
  page: import("@playwright/test").Page,
  e: { amount: string; currency: string; date: string; description: string },
) {
  await page.getByLabel("Amount").fill(e.amount);
  await page.getByLabel("Currency").selectOption(e.currency);
  await page.getByLabel("Date").fill(e.date);
  await page.getByLabel("Description").fill(e.description);
  await page.getByRole("button", { name: "Add expense" }).click();
}

test("added expenses are listed newest first and survive a reload", async ({ page }) => {
  await page.goto("/");
  const list = page.getByRole("list", { name: "Expenses" });
  const mine = list.getByRole("listitem").filter({ hasText: run });

  await addExpense(page, { amount: "12.34", currency: "EUR", date: "2099-01-01", description: `Lunch ${run}` });
  await expect(mine).toHaveCount(1);
  await addExpense(page, { amount: "1500", currency: "JPY", date: "2099-01-02", description: `Taxi ${run}` });
  await expect(mine).toHaveCount(2);

  await page.reload();
  await expect(mine).toHaveCount(2);
  await expect(mine.nth(0)).toContainText(`Taxi ${run}`);
  await expect(mine.nth(0)).toContainText("¥1,500");
  await expect(mine.nth(0)).toContainText("2099-01-02");
  await expect(mine.nth(1)).toContainText(`Lunch ${run}`);
  await expect(mine.nth(1)).toContainText("€12.34");
  await expect(mine.nth(1)).toContainText("2099-01-01");
});

test("an invalid amount is rejected with a message and nothing is saved", async ({ page }) => {
  await page.goto("/");
  await addExpense(page, { amount: "12.345", currency: "EUR", date: "2099-01-03", description: `Bad ${run}` });
  // Next.js renders its own (empty) route-announcer alert, so match ours by its text.
  await expect(page.getByRole("alert").filter({ hasText: "Amount must be" })).toBeVisible();
  await expect(page.getByLabel("Description")).toHaveValue(`Bad ${run}`);
  await page.reload();
  await expect(page.getByRole("list", { name: "Expenses" }).getByRole("listitem").filter({ hasText: `Bad ${run}` })).toHaveCount(0);
});

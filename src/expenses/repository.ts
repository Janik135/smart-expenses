import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { expenses } from "@/db/schema";
import type { ExpenseInput } from "./input";

export type Expense = typeof expenses.$inferSelect;

/** The user's expenses, newest first (by date spent, then by when they were entered). */
export async function listExpenses(userId: string): Promise<Expense[]> {
  return getDb()
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.spentOn), desc(expenses.createdAt));
}

export async function insertExpense(userId: string, input: ExpenseInput): Promise<void> {
  await getDb().insert(expenses).values({ userId, ...input });
}

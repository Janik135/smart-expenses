"use server";

import { revalidatePath } from "next/cache";
import { type ExpenseField, parseExpenseInput } from "@/expenses/input";
import { insertExpense } from "@/expenses/repository";
import { getCurrentUser } from "@/lib/current-user";

export type AddExpenseState = {
  /** Increments on every submission so the form remounts with the right values. */
  attempt: number;
  errors: Partial<Record<ExpenseField, string>>;
  /** What the user typed, echoed back when validation fails. */
  values: Partial<Record<ExpenseField, string>>;
};

const FIELDS: ExpenseField[] = ["amount", "currency", "date", "description"];

export async function addExpense(prev: AddExpenseState, formData: FormData): Promise<AddExpenseState> {
  const raw = Object.fromEntries(FIELDS.map((f) => [f, String(formData.get(f) ?? "")]));
  const result = parseExpenseInput(raw);
  if (!result.ok) return { attempt: prev.attempt + 1, errors: result.errors, values: raw };

  const user = await getCurrentUser();
  await insertExpense(user.id, result.value);
  revalidatePath("/");
  return { attempt: prev.attempt + 1, errors: {}, values: {} };
}

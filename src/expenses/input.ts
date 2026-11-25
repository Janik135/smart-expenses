import { isCurrencyCode, minorDigits, parseAmountToMinor } from "@/lib/money";

export const DESCRIPTION_MAX_LENGTH = 200;

export type ExpenseField = "amount" | "currency" | "date" | "description";

export type ExpenseInput = {
  amountMinor: number;
  currency: string;
  /** Calendar date, YYYY-MM-DD. */
  spentOn: string;
  description: string;
};

export type ParseResult =
  | { ok: true; value: ExpenseInput }
  | { ok: false; errors: Partial<Record<ExpenseField, string>> };

function isCalendarDate(s: string): boolean {
  if (!/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

/** Validates raw form values. Pure, so it is unit-tested; the server action only wires it to the DB. */
export function parseExpenseInput(raw: Partial<Record<ExpenseField, string>>): ParseResult {
  const amount = raw.amount ?? "";
  const currency = raw.currency ?? "";
  const spentOn = raw.date ?? "";
  const description = (raw.description ?? "").trim();
  const errors: Partial<Record<ExpenseField, string>> = {};

  const currencyOk = isCurrencyCode(currency);
  if (!currencyOk) errors.currency = "Currency must be an ISO 4217 code such as EUR.";

  const amountMinor = currencyOk ? parseAmountToMinor(amount, currency) : null;
  if (currencyOk ? amountMinor === null : amount.trim() === "") {
    const digits = currencyOk ? minorDigits(currency) : 2;
    errors.amount = `Amount must be a positive number with at most ${digits} decimal place${digits === 1 ? "" : "s"}.`;
  }

  if (!isCalendarDate(spentOn)) errors.date = "Date must be a valid date (YYYY-MM-DD).";

  if (description === "") errors.description = "Description is required.";
  else if (description.length > DESCRIPTION_MAX_LENGTH)
    errors.description = `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`;

  if (Object.keys(errors).length > 0 || amountMinor === null) return { ok: false, errors };
  return { ok: true, value: { amountMinor, currency, spentOn, description } };
}

"use client";

import { useActionState } from "react";
import { addExpense, type AddExpenseState } from "./actions";

const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "JPY", "SEK", "NOK", "DKK", "PLN", "CZK"];
const initialState: AddExpenseState = { attempt: 0, errors: {}, values: {} };

const inputClass = "mt-1 block w-full rounded border border-gray-300 px-2 py-1";

export function ExpenseForm({ defaultCurrency, today }: { defaultCurrency: string; today: string }) {
  const [state, formAction, pending] = useActionState(addExpense, initialState);
  const { errors, values } = state;
  const messages = Object.values(errors);

  return (
    <form key={state.attempt} action={formAction} className="mt-6 grid grid-cols-2 gap-4" noValidate>
      <label className="text-sm">
        Amount
        <input
          name="amount"
          inputMode="decimal"
          required
          defaultValue={values.amount}
          aria-invalid={!!errors.amount}
          className={inputClass}
        />
      </label>
      <label className="text-sm">
        Currency
        <select
          name="currency"
          defaultValue={values.currency ?? defaultCurrency}
          aria-invalid={!!errors.currency}
          className={inputClass}
        >
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Date
        <input
          name="date"
          type="date"
          required
          defaultValue={values.date ?? today}
          aria-invalid={!!errors.date}
          className={inputClass}
        />
      </label>
      <label className="text-sm">
        Description
        <input
          name="description"
          required
          maxLength={200}
          defaultValue={values.description}
          aria-invalid={!!errors.description}
          className={inputClass}
        />
      </label>
      {messages.length > 0 && (
        <ul role="alert" className="col-span-2 text-sm text-red-700">
          {messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
      <button
        type="submit"
        disabled={pending}
        className="col-span-2 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        Add expense
      </button>
    </form>
  );
}

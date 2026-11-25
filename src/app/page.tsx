import { listExpenses } from "@/expenses/repository";
import { getCurrentUser } from "@/lib/current-user";
import { formatMoney } from "@/lib/money";
import { ExpenseForm } from "./expense-form";

// Reads the database on every request; nothing to prerender at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  const expenses = await listExpenses(user.id);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">Smart Expenses</h1>
      <p className="mt-2 text-gray-600">Track expenses and let receipts fill themselves in.</p>

      <ExpenseForm defaultCurrency="EUR" today={today} />

      <h2 className="mt-10 text-xl font-semibold">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="mt-2 text-gray-600">No expenses yet.</p>
      ) : (
        <ul aria-label="Expenses" className="mt-2 divide-y divide-gray-200">
          {expenses.map((e) => (
            <li key={e.id} className="flex items-baseline gap-4 py-2">
              <time dateTime={e.spentOn} className="w-24 shrink-0 text-sm text-gray-600">
                {e.spentOn}
              </time>
              <span className="flex-1">{e.description}</span>
              <span className="font-mono">{formatMoney(e.amountMinor, e.currency)}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

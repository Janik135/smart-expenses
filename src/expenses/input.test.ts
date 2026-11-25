import { describe, expect, it } from "vitest";
import { parseExpenseInput } from "./input";

const valid = { amount: "12.34", currency: "EUR", date: "2026-11-25", description: " Lunch " };

describe("parseExpenseInput", () => {
  it("returns normalised values for valid input", () => {
    expect(parseExpenseInput(valid)).toEqual({
      ok: true,
      value: { amountMinor: 1234, currency: "EUR", spentOn: "2026-11-25", description: "Lunch" },
    });
  });

  it.each([
    [{ amount: "12.345" }, "amount"],
    [{ amount: "" }, "amount"],
    [{ currency: "XYZ" }, "currency"],
    [{ date: "2026-02-30" }, "date"],
    [{ date: "25.11.2026" }, "date"],
    [{ description: "   " }, "description"],
    [{ description: "x".repeat(201) }, "description"],
  ])("rejects %j", (override, field) => {
    const result = parseExpenseInput({ ...valid, ...override });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toEqual([field]);
  });

  it("treats missing fields as invalid", () => {
    const result = parseExpenseInput({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["amount", "currency", "date", "description"]);
  });
});

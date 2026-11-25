import { describe, expect, it } from "vitest";
import { formatMoney, isCurrencyCode, parseAmountToMinor } from "./money";

describe("parseAmountToMinor", () => {
  it.each([
    ["12.34", "EUR", 1234],
    ["12", "EUR", 1200],
    ["12.5", "EUR", 1250],
    ["0.01", "USD", 1],
    ["1,5", "EUR", 150],
    [" 7.00 ", "EUR", 700],
    ["1500", "JPY", 1500],
    ["1.234", "KWD", 1234],
    ["1", "IQD", 1000],
    ["1.234", "IQD", 1234],
    ["0.29", "EUR", 29], // 0.29 * 100 is 28.999999999999996 in floating point
  ])("%s %s -> %i", (input, currency, expected) => {
    expect(parseAmountToMinor(input, currency)).toBe(expected);
  });

  it.each([
    ["12.345", "EUR"],
    ["1.5", "JPY"],
    ["", "EUR"],
    ["abc", "EUR"],
    ["-5", "EUR"],
    ["0", "EUR"],
    ["1e3", "EUR"],
    ["99999999999", "EUR"],
  ])("rejects %j %s", (input, currency) => {
    expect(parseAmountToMinor(input, currency)).toBeNull();
  });
});

describe("isCurrencyCode", () => {
  it("accepts ISO 4217 codes and rejects anything else", () => {
    expect(isCurrencyCode("EUR")).toBe(true);
    expect(isCurrencyCode("JPY")).toBe(true);
    expect(isCurrencyCode("eur")).toBe(false);
    expect(isCurrencyCode("XYZ")).toBe(false);
    expect(isCurrencyCode("EURO")).toBe(false);
  });
});

describe("formatMoney", () => {
  it("formats minor units without floating point", () => {
    expect(formatMoney(1234, "EUR")).toBe("€12.34");
    expect(formatMoney(5, "USD")).toBe("$0.05");
    expect(formatMoney(150000, "JPY")).toBe("¥150,000");
    expect(formatMoney(1234, "KWD")).toBe("KWD 1.234");
    expect(formatMoney(1234, "IQD")).toBe("IQD 1.234");
  });
});

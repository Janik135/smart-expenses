// Money is integer minor units + ISO 4217 code (CLAUDE.md). Nothing here goes through floating point.

const LOCALE = "en-US";

/** Upper bound of a Postgres `integer` column. */
const MAX_MINOR = 2_147_483_647;

const supportedCurrencies = new Set(Intl.supportedValuesOf("currency"));
const ISO_MINOR_DIGITS: Partial<Record<string, number>> = {
  BHD: 3,
  BIF: 0,
  CLF: 4,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  IQD: 3,
  ISK: 0,
  JOD: 3,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  KWD: 3,
  LYD: 3,
  OMR: 3,
  PYG: 0,
  RWF: 0,
  TND: 3,
  UGX: 0,
  UYI: 0,
  UYW: 4,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
};

export function isCurrencyCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code) && supportedCurrencies.has(code);
}

/** Number of minor-unit digits of a currency, e.g. EUR 2, JPY 0, KWD 3. */
export function minorDigits(currency: string): number {
  const formatter = new Intl.NumberFormat(LOCALE, { style: "currency", currency });
  const isoDigits = ISO_MINOR_DIGITS[currency];
  if (isoDigits !== undefined) return isoDigits;
  return supportedCurrencies.has(currency) ? 2 : formatter.resolvedOptions().maximumFractionDigits ?? 2;
}

/**
 * Parses a user-entered positive amount such as "12.34" or "12,34" into minor units.
 * Returns null if it isn't a valid positive amount for the currency (e.g. too many decimals).
 */
export function parseAmountToMinor(input: string, currency: string): number | null {
  const match = /^(\d+)(?:[.,](\d+))?$/.exec(input.trim());
  if (!match) return null;
  const [, whole, fraction = ""] = match;
  const digits = minorDigits(currency);
  if (fraction.length > digits) return null;
  const minorDigitString = (whole + fraction.padEnd(digits, "0")).replace(/^0+/, "");
  // Up to 10 digits is an exact integer in a JS number, so the bound check below is exact too.
  if (minorDigitString === "" || minorDigitString.length > 10) return null;
  const minor = Number(minorDigitString);
  return minor > MAX_MINOR ? null : minor;
}

export function formatMoney(amountMinor: number, currency: string): string {
  const digits = minorDigits(currency);
  const padded = String(amountMinor).padStart(digits + 1, "0");
  const decimal = digits === 0 ? padded : `${padded.slice(0, -digits)}.${padded.slice(-digits)}`;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(decimal as `${number}`);
}

/**
 * Multi-currency formatting and conversion helpers.
 */
export interface Currency {
  code: string;
  symbol: string;
  rate: number; // relative to USD
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'IDR', symbol: 'Rp', rate: 15600 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 },
  { code: 'NZD', symbol: 'NZ$', rate: 1.63 },
];

export function formatMoney(amount: number, code: string): string {
  const c = CURRENCIES.find((x) => x.code === code) ?? CURRENCIES[0];
  const converted = amount * c.rate;
  if (c.rate > 100) return `${c.symbol}${Math.round(converted).toLocaleString()}`;
  return `${c.symbol}${converted.toFixed(2)}`;
}

export function toUsd(amount: number, code: string): number {
  const c = CURRENCIES.find((x) => x.code === code) ?? CURRENCIES[0];
  return amount / c.rate;
}

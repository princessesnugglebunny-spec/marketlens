import { describe, it, expect } from 'vitest';
import { formatMoney, toUsd, CURRENCIES } from '../src/lib/currency';

describe('currency', () => {
  it('formats USD', () => {
    expect(formatMoney(100, 'USD')).toBe('$100.00');
  });
  it('formats IDR', () => {
    expect(formatMoney(1, 'IDR')).toContain('Rp');
  });
  it('converts to USD', () => {
    expect(toUsd(15600, 'IDR')).toBeCloseTo(1, 5);
  });
  it('lists currencies', () => {
    expect(CURRENCIES.length).toBeGreaterThan(5);
  });
});

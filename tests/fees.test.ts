import { describe, it, expect } from 'vitest';
import { totalFees, netProfit, maxBuyPrice, dealVerdict, DEFAULT_FEES } from '../src/lib/fees';

describe('fees', () => {
  it('totalFees for ebay-us at 100', () => {
    const s = DEFAULT_FEES.find((f) => f.id === 'ebay-us')!;
    expect(totalFees(s, 100)).toBeCloseTo(0.30 + 13.25, 5);
  });
  it('netProfit', () => {
    const s = DEFAULT_FEES.find((f) => f.id === 'local-cash')!;
    expect(netProfit(50, 100, s)).toBe(50);
  });
  it('maxBuyPrice', () => {
    const s = DEFAULT_FEES.find((f) => f.id === 'local-cash')!;
    expect(maxBuyPrice(100, 0.5, s)).toBeCloseTo(66.666, 2);
  });
  it('dealVerdict', () => {
    expect(dealVerdict(40, 100)).toBe('good');
    expect(dealVerdict(15, 100)).toBe('negotiate');
    expect(dealVerdict(5, 100)).toBe('pass');
  });
  it('throws on negative', () => {
    const s = DEFAULT_FEES[0];
    expect(() => totalFees(s, -1)).toThrow();
  });
});

import { describe, it, expect } from 'vitest';
import { findArbitrage } from '../src/lib/arbitrage';

describe('arbitrage', () => {
  it('finds opportunities', () => {
    const prices = [
      { platform: 'FB', price: 50, url: '' },
      { platform: 'eBay', price: 80, url: '' },
    ];
    const opps = findArbitrage('Chair', prices);
    expect(opps).toHaveLength(1);
    expect(opps[0].profit).toBe(30);
  });
  it('returns empty when no profit', () => {
    const prices = [
      { platform: 'FB', price: 50, url: '' },
      { platform: 'eBay', price: 50, url: '' },
    ];
    expect(findArbitrage('Chair', prices)).toHaveLength(0);
  });
});

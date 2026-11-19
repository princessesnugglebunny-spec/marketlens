import { describe, it, expect } from 'vitest';
import { summarize } from '../src/lib/analytics';
import type { BuyEntry } from '../src/lib/buylog';

describe('analytics', () => {
  it('summarizes empty', () => {
    const s = summarize([]);
    expect(s.totalItems).toBe(0);
    expect(s.profit).toBe(0);
  });
  it('summarizes sold items', () => {
    const entries: BuyEntry[] = [
      { id: '1', title: 'A', buyPrice: 50, sellPrice: 100, platform: 'x', status: 'sold', createdAt: Date.now() - 86400000 },
    ];
    const s = summarize(entries);
    expect(s.soldCount).toBe(1);
    expect(s.revenue).toBe(100);
    expect(s.profit).toBe(50);
    expect(s.turnoverRate).toBe(1);
  });
});

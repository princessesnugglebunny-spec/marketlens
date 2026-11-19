import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { trackItem, listTracked, priceDrop } from '../src/lib/pricetrack';

describe('pricetrack', () => {
  beforeEach(() => __resetMemStore());
  it('tracks and lists', async () => {
    await trackItem({ title: 'Chair', url: 'http://x', lastPrice: 100, targetPrice: 80 });
    const items = await listTracked();
    expect(items).toHaveLength(1);
  });
  it('detects price drop', () => {
    const item = { id: '1', title: 'x', url: '', lastPrice: 100, targetPrice: 80, createdAt: 0 };
    expect(priceDrop(item, 75)).toBe(true);
    expect(priceDrop(item, 100)).toBe(false);
  });
});

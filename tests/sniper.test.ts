import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { createSnipe, isMatch, isNewListing, snipeSpeed } from '../src/lib/sniper';

describe('sniper', () => {
  beforeEach(() => __resetMemStore());
  it('creates snipe', async () => {
    const s = await createSnipe({ keywords: 'chair', maxPrice: 100, minPrice: 0, categories: [], enabled: true, checkIntervalMs: 5000 });
    expect(s.id).toBeTruthy();
    expect(s.enabled).toBe(true);
  });
  it('matches listing', async () => {
    const s = await createSnipe({ keywords: 'chair', maxPrice: 100, minPrice: 0, categories: [], enabled: true, checkIntervalMs: 5000 });
    expect(isMatch({ title: 'Office chair', price: 80 }, s)).toBe(true);
    expect(isMatch({ title: 'Table', price: 80 }, s)).toBe(false);
    expect(isMatch({ title: 'Chair', price: 200 }, s)).toBe(false);
  });
  it('detects new listing', async () => {
    const s = await createSnipe({ keywords: '', maxPrice: 0, minPrice: 0, categories: [], enabled: true, checkIntervalMs: 5000 });
    expect(isNewListing('abc', s)).toBe(true);
  });
  it('calculates speed', () => {
    expect(snipeSpeed(1000, 500)).toBe(500);
    expect(snipeSpeed(500, 1000)).toBe(0);
  });
});

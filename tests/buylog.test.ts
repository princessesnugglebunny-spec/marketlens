import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { addEntry, listEntries, toCsv } from '../src/lib/buylog';

describe('buylog', () => {
  beforeEach(() => __resetMemStore());
  it('adds and lists entries', async () => {
    await addEntry({ title: 'Chair', buyPrice: 50, sellPrice: 100, platform: 'ebay-us', status: 'in-stock' });
    const list = await listEntries();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('Chair');
  });
  it('exports csv', async () => {
    await addEntry({ title: 'Chair', buyPrice: 50, sellPrice: 100, platform: 'ebay-us', status: 'in-stock' });
    const csv = toCsv(await listEntries());
    expect(csv).toContain('Chair');
    expect(csv.split('\n')).toHaveLength(2);
  });
});

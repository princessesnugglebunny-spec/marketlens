import { describe, it, expect } from 'vitest';
import { parseCsv } from '../src/lib/bulkimport';

describe('bulkimport', () => {
  it('parses csv', () => {
    const csv = 'title,price,notes\nChair,50,wooden\nTable,100,oak';
    const rows = parseCsv(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0].title).toBe('Chair');
    expect(rows[0].price).toBe(50);
  });
  it('returns empty for header only', () => {
    expect(parseCsv('title,price,notes')).toHaveLength(0);
  });
});

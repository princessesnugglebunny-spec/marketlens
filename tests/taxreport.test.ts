import { describe, it, expect } from 'vitest';
import { buildTaxReport, toTaxCsv, taxSummary } from '../src/lib/taxreport';

describe('taxreport', () => {
  it('builds report', () => {
    const entries = [{ id: '1', title: 'Chair', buyPrice: 50, sellPrice: 100, platform: 'ebay', status: 'sold', createdAt: Date.now() }];
    const rows = buildTaxReport(entries);
    expect(rows).toHaveLength(1);
    expect(rows[0].profit).toBe(50);
  });
  it('exports csv', () => {
    const rows = [{ date: '2026-01-01', description: 'Chair', buyPrice: 50, sellPrice: 100, profit: 50, platform: 'ebay', status: 'sold' }];
    expect(toTaxCsv(rows)).toContain('Chair');
  });
  it('summarizes', () => {
    const rows = [{ date: '2026-01-01', description: 'Chair', buyPrice: 50, sellPrice: 100, profit: 50, platform: 'ebay', status: 'sold' }];
    const s = taxSummary(rows);
    expect(s.totalProfit).toBe(50);
    expect(s.totalRevenue).toBe(100);
  });
});

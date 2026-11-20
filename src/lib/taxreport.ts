/**
 * Tax report generation from buy log.
 */
import type { BuyEntry } from './buylog';

export interface TaxRow {
  date: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  platform: string;
  status: string;
}

export function buildTaxReport(entries: BuyEntry[]): TaxRow[] {
  return entries.map((e) => ({
    date: new Date(e.createdAt).toISOString().slice(0, 10),
    description: e.title,
    buyPrice: e.buyPrice,
    sellPrice: e.sellPrice,
    profit: e.sellPrice - e.buyPrice,
    platform: e.platform,
    status: e.status,
  }));
}

export function toTaxCsv(rows: TaxRow[]): string {
  const header = 'date,description,buy_price,sell_price,profit,platform,status';
  const lines = rows.map((r) =>
    `${r.date},"${r.description.replace(/"/g, '""')}",${r.buyPrice},${r.sellPrice},${r.profit},${r.platform},${r.status}`,
  );
  return [header, ...lines].join('\n');
}

export function taxSummary(rows: TaxRow[]): { totalProfit: number; totalRevenue: number; totalCost: number; itemCount: number } {
  return {
    totalProfit: rows.reduce((a, r) => a + r.profit, 0),
    totalRevenue: rows.reduce((a, r) => a + r.sellPrice, 0),
    totalCost: rows.reduce((a, r) => a + r.buyPrice, 0),
    itemCount: rows.length,
  };
}

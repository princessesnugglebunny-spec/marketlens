/**
 * Analytics over the buy log: revenue, profit, days-to-sell, turnover.
 */
import type { BuyEntry } from './buylog';

export interface AnalyticsSummary {
  totalItems: number;
  soldCount: number;
  revenue: number;
  profit: number;
  avgDaysToSell: number;
  turnoverRate: number;
}

export function summarize(entries: BuyEntry[]): AnalyticsSummary {
  const sold = entries.filter((e) => e.status === 'sold');
  const revenue = sold.reduce((a, e) => a + e.sellPrice, 0);
  const cost = sold.reduce((a, e) => a + e.buyPrice, 0);
  const profit = revenue - cost;
  const days = sold.map((e) => (Date.now() - e.createdAt) / (1000 * 60 * 60 * 24));
  const avgDaysToSell = days.length ? days.reduce((a, b) => a + b, 0) / days.length : 0;
  const turnoverRate = entries.length ? sold.length / entries.length : 0;
  return {
    totalItems: entries.length,
    soldCount: sold.length,
    revenue,
    profit,
    avgDaysToSell: Math.round(avgDaysToSell * 10) / 10,
    turnoverRate: Math.round(turnoverRate * 100) / 100,
  };
}

/**
 * Price history tracking for items over time.
 */
import { get, set } from './storage';

export interface PricePoint {
  price: number;
  timestamp: number;
}

export interface PriceHistory {
  itemId: string;
  points: PricePoint[];
}

export async function recordPrice(itemId: string, price: number): Promise<void> {
  const histories = await get<PriceHistory[]>('mlf_price_history', []);
  let h = histories.find((x) => x.itemId === itemId);
  if (!h) { h = { itemId, points: [] }; histories.push(h); }
  h.points.push({ price, timestamp: Date.now() });
  // Keep last 90 days
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  h.points = h.points.filter((p) => p.timestamp > cutoff);
  await set('mlf_price_history', histories);
}

export async function getPriceHistory(itemId: string): Promise<PricePoint[]> {
  const histories = await get<PriceHistory[]>('mlf_price_history', []);
  return histories.find((x) => x.itemId === itemId)?.points ?? [];
}

export function priceTrend(points: PricePoint[]): 'up' | 'down' | 'stable' {
  if (points.length < 2) return 'stable';
  const first = points[0].price;
  const last = points[points.length - 1].price;
  const change = (last - first) / first;
  if (change > 0.05) return 'up';
  if (change < -0.05) return 'down';
  return 'stable';
}

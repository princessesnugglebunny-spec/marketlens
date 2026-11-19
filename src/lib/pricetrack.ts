/**
 * Read-only price tracking: store tracked items and compare prices.
 */
import { get, set } from './storage';

export interface TrackedItem {
  id: string;
  title: string;
  url: string;
  lastPrice: number;
  targetPrice: number;
  createdAt: number;
}

export async function trackItem(item: Omit<TrackedItem, 'id' | 'createdAt'>): Promise<TrackedItem> {
  const items = await get<TrackedItem[]>('mlf_tracked', []);
  const full: TrackedItem = { ...item, id: `${Date.now()}`, createdAt: Date.now() };
  items.push(full);
  await set('mlf_tracked', items);
  return full;
}

export async function listTracked(): Promise<TrackedItem[]> {
  return get<TrackedItem[]>('mlf_tracked', []);
}

export function priceDrop(item: TrackedItem, newPrice: number): boolean {
  return newPrice < item.lastPrice || (item.targetPrice > 0 && newPrice <= item.targetPrice);
}

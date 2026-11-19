/**
 * Buy log: local storage of purchased items with CSV export.
 */
import { get, set } from './storage';

export interface BuyEntry {
  id: string;
  title: string;
  buyPrice: number;
  sellPrice: number;
  platform: string;
  status: 'in-stock' | 'listed' | 'sold';
  createdAt: number;
}

export async function addEntry(entry: Omit<BuyEntry, 'id' | 'createdAt'>): Promise<BuyEntry> {
  const entries = await get<BuyEntry[]>('mlf_buy_log', []);
  const full: BuyEntry = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() };
  entries.push(full);
  await set('mlf_buy_log', entries);
  return full;
}

export async function listEntries(): Promise<BuyEntry[]> {
  return get<BuyEntry[]>('mlf_buy_log', []);
}

export async function updateStatus(id: string, status: BuyEntry['status']): Promise<void> {
  const entries = await get<BuyEntry[]>('mlf_buy_log', []);
  const e = entries.find((x) => x.id === id);
  if (e) e.status = status;
  await set('mlf_buy_log', entries);
}

export function toCsv(entries: BuyEntry[]): string {
  const header = 'id,title,buyPrice,sellPrice,platform,status,createdAt';
  const rows = entries.map((e) =>
    [e.id, `"${e.title.replace(/"/g, '""')}"`, e.buyPrice, e.sellPrice, e.platform, e.status, new Date(e.createdAt).toISOString()].join(','),
  );
  return [header, ...rows].join('\n');
}

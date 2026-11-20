/**
 * Product sniping: fast monitoring of saved searches with instant alerts.
 * Read-only — never acts on the user's account.
 */
import { get, set } from './storage';

export interface SnipeConfig {
  id: string;
  keywords: string;
  maxPrice: number;
  minPrice: number;
  categories: string[];
  enabled: boolean;
  checkIntervalMs: number;
  lastCheck: number;
  seenIds: string[];
  alertCount: number;
}

export interface SnipeMatch {
  listingId: string;
  title: string;
  price: number;
  url: string;
  matchedAt: number;
  snipeId: string;
}

export async function createSnipe(config: Omit<SnipeConfig, 'id' | 'lastCheck' | 'seenIds' | 'alertCount'>): Promise<SnipeConfig> {
  const snipes = await get<SnipeConfig[]>('mlf_snipes', []);
  const full: SnipeConfig = { ...config, id: `${Date.now()}`, lastCheck: 0, seenIds: [], alertCount: 0 };
  snipes.push(full);
  await set('mlf_snipes', snipes);
  return full;
}

export async function listSnipes(): Promise<SnipeConfig[]> {
  return get<SnipeConfig[]>('mlf_snipes', []);
}

export async function updateSnipe(id: string, patch: Partial<SnipeConfig>): Promise<void> {
  const snipes = await get<SnipeConfig[]>('mlf_snipes', []);
  const idx = snipes.findIndex((s) => s.id === id);
  if (idx >= 0) Object.assign(snipes[idx], patch);
  await set('mlf_snipes', snipes);
}

export async function deleteSnipe(id: string): Promise<void> {
  const snipes = await get<SnipeConfig[]>('mlf_snipes', []);
  await set('mlf_snipes', snipes.filter((s) => s.id !== id));
}

export function isMatch(listing: { title: string; price: number; category?: string }, snipe: SnipeConfig): boolean {
  if (!snipe.enabled) return false;
  if (snipe.keywords && !listing.title.toLowerCase().includes(snipe.keywords.toLowerCase())) return false;
  if (snipe.maxPrice > 0 && listing.price > snipe.maxPrice) return false;
  if (snipe.minPrice > 0 && listing.price < snipe.minPrice) return false;
  if (snipe.categories.length > 0 && listing.category && !snipe.categories.includes(listing.category)) return false;
  return true;
}

export function isNewListing(listingId: string, snipe: SnipeConfig): boolean {
  return !snipe.seenIds.includes(listingId);
}

export async function recordMatch(snipeId: string, listingId: string): Promise<void> {
  const snipes = await get<SnipeConfig[]>('mlf_snipes', []);
  const snipe = snipes.find((s) => s.id === snipeId);
  if (snipe) {
    snipe.seenIds.push(listingId);
    snipe.alertCount++;
    snipe.lastCheck = Date.now();
    await set('mlf_snipes', snipes);
  }
}

export function snipeSpeed(matchedAt: number, listedAt: number): number {
  return Math.max(0, matchedAt - listedAt);
}

/**
 * Inventory tracker: cost basis and stock levels.
 */
import { get, set } from './storage';

export interface InventoryItem {
  id: string;
  title: string;
  sku: string;
  quantity: number;
  costBasis: number;
  sellPrice: number;
  platform: string;
  createdAt: number;
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt'>): Promise<InventoryItem> {
  const items = await get<InventoryItem[]>('mlf_inventory', []);
  const full: InventoryItem = { ...item, id: `${Date.now()}`, createdAt: Date.now() };
  items.push(full);
  await set('mlf_inventory', items);
  return full;
}

export async function listInventory(): Promise<InventoryItem[]> {
  return get<InventoryItem[]>('mlf_inventory', []);
}

export async function updateQuantity(id: string, delta: number): Promise<void> {
  const items = await get<InventoryItem[]>('mlf_inventory', []);
  const item = items.find((i) => i.id === id);
  if (item) item.quantity = Math.max(0, item.quantity + delta);
  await set('mlf_inventory', items);
}

export function inventoryValue(items: InventoryItem[]): { totalCost: number; totalRetail: number; potentialProfit: number } {
  return {
    totalCost: items.reduce((a, i) => a + i.costBasis * i.quantity, 0),
    totalRetail: items.reduce((a, i) => a + i.sellPrice * i.quantity, 0),
    potentialProfit: items.reduce((a, i) => a + (i.sellPrice - i.costBasis) * i.quantity, 0),
  };
}

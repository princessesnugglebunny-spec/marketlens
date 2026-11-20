import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { addInventoryItem, listInventory, updateQuantity, inventoryValue } from '../src/lib/inventory';

describe('inventory', () => {
  beforeEach(() => __resetMemStore());
  it('adds and lists', async () => {
    await addInventoryItem({ title: 'Chair', sku: 'C1', quantity: 5, costBasis: 20, sellPrice: 50, platform: 'ebay' });
    const items = await listInventory();
    expect(items).toHaveLength(1);
  });
  it('updates quantity', async () => {
    const item = await addInventoryItem({ title: 'Chair', sku: 'C1', quantity: 5, costBasis: 20, sellPrice: 50, platform: 'ebay' });
    await updateQuantity(item.id, -2);
    const items = await listInventory();
    expect(items[0].quantity).toBe(3);
  });
  it('calculates value', () => {
    const items = [{ id: '1', title: 'Chair', sku: 'C1', quantity: 2, costBasis: 20, sellPrice: 50, platform: 'ebay', createdAt: 0 }];
    const v = inventoryValue(items);
    expect(v.totalCost).toBe(40);
    expect(v.totalRetail).toBe(100);
    expect(v.potentialProfit).toBe(60);
  });
});

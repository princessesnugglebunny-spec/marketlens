/**
 * Price drop notification: check tracked items and send webhook alerts.
 */
import { listTracked } from './pricetrack';
import { notifyAll, type WebhookConfig } from './webhooks';

export async function checkPriceDrops(cfg: WebhookConfig): Promise<number> {
  const items = await listTracked();
  let alerts = 0;
  for (const item of items) {
    // In a real implementation, fetch current price from page/API
    // Here we use stored lastPrice as baseline; caller updates prices
    if (item.targetPrice > 0 && item.lastPrice <= item.targetPrice) {
      await notifyAll(cfg, `Price alert: ${item.title} is at $${item.lastPrice} (target $${item.targetPrice})`);
      alerts++;
    }
  }
  return alerts;
}

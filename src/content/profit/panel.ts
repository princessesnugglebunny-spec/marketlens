/**
 * Profit panel injected on Marketplace item detail pages.
 */
import { totalFees, netProfit, maxBuyPrice, dealVerdict, DEFAULT_FEES } from '../../lib/fees';
import { get } from '../../lib/storage';

/** Extract the first price-like number from text. */
export function extractPrice(text: string): number | null {
  const m = text.match(/\$\s*([\d,]+(?:\.\d{2})?)/);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ''));
}

export async function injectProfitPanel(): Promise<void> {
  if (!location.pathname.startsWith('/marketplace/item/')) return;
  if (document.getElementById('mlf-profit-panel')) return;
  const price = extractPrice(document.body.textContent ?? '');
  if (price === null) return;
  const schedule = DEFAULT_FEES[0];
  const buyPrice = await get<number>('mlf_last_buy', 0);
  const profit = netProfit(buyPrice, price, schedule);
  const maxBuy = maxBuyPrice(price, 0.3, schedule);
  const verdict = dealVerdict(profit, price);

  const panel = document.createElement('div');
  panel.id = 'mlf-profit-panel';
  panel.style.cssText = 'position:fixed;bottom:80px;right:12px;background:#0f172a;color:#fff;padding:12px;border-radius:8px;font-size:12px;z-index:2147483645;box-shadow:0 2px 8px rgba(0,0,0,.3);min-width:180px;';
  panel.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;">MarketLens Profit</div>
    <div>Sale: $${price.toFixed(2)}</div>
    <div>Fees: $${totalFees(schedule, price).toFixed(2)}</div>
    <div>Profit: $${profit.toFixed(2)}</div>
    <div>Max buy (30% ROI): $${maxBuy.toFixed(2)}</div>
    <div>Verdict: ${verdict}</div>
  `;
  document.body.appendChild(panel);
}

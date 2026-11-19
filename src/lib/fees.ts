/**
 * Fee tables and profit calculation for resale platforms.
 * Pure functions; no DOM or chrome dependencies.
 */

/** A single platform's fee structure. */
export interface FeeSchedule {
  /** Platform identifier. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Fixed fee in the listing currency. */
  fixed: number;
  /** Percentage fee (0-1) applied to sale price. */
  percent: number;
  /** Optional payment processing fee percentage. */
  processingPercent: number;
  /** Shipping cost the seller pays (0 if buyer pays). */
  shipping: number;
}

/** Default fee schedules, editable by the user. */
export const DEFAULT_FEES: FeeSchedule[] = [
  { id: 'ebay-us', name: 'eBay US', fixed: 0.30, percent: 0.1325, processingPercent: 0, shipping: 0 },
  { id: 'ebay-uk', name: 'eBay UK', fixed: 0.30, percent: 0.128, processingPercent: 0, shipping: 0 },
  { id: 'poshmark', name: 'Poshmark', fixed: 0, percent: 0.20, processingPercent: 0, shipping: 0 },
  { id: 'mercari', name: 'Mercari', fixed: 0, percent: 0.10, processingPercent: 0.029, shipping: 0 },
  { id: 'depop', name: 'Depop', fixed: 0, percent: 0.10, processingPercent: 0.029, shipping: 0 },
  { id: 'vinted', name: 'Vinted', fixed: 0, percent: 0, processingPercent: 0, shipping: 0 },
  { id: 'fb-shipping', name: 'Facebook shipping', fixed: 0, percent: 0.05, processingPercent: 0, shipping: 0 },
  { id: 'local-cash', name: 'Local cash', fixed: 0, percent: 0, processingPercent: 0, shipping: 0 },
];

/**
 * Calculate the total fees for a sale at the given price.
 * @param schedule - fee schedule to apply
 * @param salePrice - expected sale price
 * @returns total fees
 */
export function totalFees(schedule: FeeSchedule, salePrice: number): number {
  if (salePrice < 0) throw new Error('salePrice must be >= 0');
  const percentFee = salePrice * schedule.percent;
  const processingFee = salePrice * schedule.processingPercent;
  return schedule.fixed + percentFee + processingFee + schedule.shipping;
}

/**
 * Calculate net profit for a flip.
 * @param buyPrice - price paid to acquire the item
 * @param salePrice - expected sale price
 * @param schedule - platform fee schedule
 * @returns net profit after fees
 */
export function netProfit(buyPrice: number, salePrice: number, schedule: FeeSchedule): number {
  if (buyPrice < 0) throw new Error('buyPrice must be >= 0');
  return salePrice - buyPrice - totalFees(schedule, salePrice);
}

/**
 * Maximum buy price to hit a target return on investment.
 * @param salePrice - expected sale price
 * @param targetRoi - target ROI as a fraction (e.g. 0.5 = 50%)
 * @param schedule - platform fee schedule
 * @returns max buy price
 */
export function maxBuyPrice(salePrice: number, targetRoi: number, schedule: FeeSchedule): number {
  if (targetRoi < 0) throw new Error('targetRoi must be >= 0');
  const fees = totalFees(schedule, salePrice);
  const keep = salePrice - fees;
  return keep / (1 + targetRoi);
}

/**
 * Deal verdict based on profit margin.
 * @param profit - net profit
 * @param salePrice - expected sale price
 * @returns verdict string
 */
export function dealVerdict(profit: number, salePrice: number): 'good' | 'negotiate' | 'pass' {
  if (salePrice <= 0) return 'pass';
  const margin = profit / salePrice;
  if (margin >= 0.3) return 'good';
  if (margin >= 0.1) return 'negotiate';
  return 'pass';
}

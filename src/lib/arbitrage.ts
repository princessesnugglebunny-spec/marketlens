/**
 * Cross-platform arbitrage finder: compare prices across platforms.
 */
export interface PlatformPrice {
  platform: string;
  price: number;
  url: string;
}

export interface ArbitrageOpportunity {
  item: string;
  buyPlatform: string;
  buyPrice: number;
  sellPlatform: string;
  sellPrice: number;
  profit: number;
  roi: number;
}

export function findArbitrage(item: string, prices: PlatformPrice[]): ArbitrageOpportunity[] {
  const opps: ArbitrageOpportunity[] = [];
  for (const buy of prices) {
    for (const sell of prices) {
      if (buy.platform === sell.platform) continue;
      if (sell.price <= buy.price) continue;
      const profit = sell.price - buy.price;
      const roi = profit / buy.price;
      opps.push({ item, buyPlatform: buy.platform, buyPrice: buy.price, sellPlatform: sell.platform, sellPrice: sell.price, profit, roi });
    }
  }
  return opps.sort((a, b) => b.roi - a.roi);
}

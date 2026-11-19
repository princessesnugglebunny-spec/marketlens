/**
 * Geographic helpers for Marketplace Declutter-style filtering.
 * Pure functions; city table is injected.
 */

export interface City {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export interface Settings {
  radiusMiles: number;
  graceMiles: number;
  hideShipping: boolean;
  hideAds: boolean;
  hideUnknown: boolean;
  allowGrace: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  radiusMiles: 40,
  graceMiles: 15,
  hideShipping: true,
  hideAds: true,
  hideUnknown: false,
  allowGrace: true,
};

/** Parse "City, ST" into components. Returns null on failure. */
export function parseCity(label: string): { city: string; state: string } | null {
  const m = label.trim().match(/^(.+?),\s*([A-Za-z]{2,4})$/);
  if (!m) return null;
  return { city: m[1].trim(), state: m[2].toUpperCase() };
}

/** Haversine distance in miles between two lat/lon points. */
export function distanceMiles(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 3958.8; // Earth radius miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Determine if a listing city is out of range.
 * @param listingCity - parsed city of the listing
 * @param center - user's center city
 * @param table - city lookup table
 * @param settings - filter settings
 * @returns 'in' | 'out' | 'unknown'
 */
export function classifyCity(
  listingCity: { city: string; state: string } | null,
  center: { city: string; state: string } | null,
  table: Map<string, City>,
  settings: Settings,
): 'in' | 'out' | 'unknown' {
  if (!listingCity || !center) return 'unknown';
  const key = (c: { city: string; state: string }) => `${c.city.toLowerCase()}|${c.state.toLowerCase()}`;
  const lc = table.get(key(listingCity));
  const cc = table.get(key(center));
  if (!lc || !cc) return 'unknown';
  const d = distanceMiles(lc, cc);
  const limit = settings.radiusMiles + (settings.allowGrace ? settings.graceMiles : 0);
  return d <= limit ? 'in' : 'out';
}

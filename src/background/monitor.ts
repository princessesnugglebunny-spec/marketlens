/**
 * Read-only monitoring: tracks saved search criteria and notifies on new matches.
 * Never performs actions on the user's Facebook account.
 */
export interface SavedSearch {
  id: string;
  keywords: string;
  maxPrice: number;
  lastSeenIds: string[];
}

export function isNewMatch(listingId: string, search: SavedSearch): boolean {
  return !search.lastSeenIds.includes(listingId);
}

export function matchesCriteria(title: string, price: number, search: SavedSearch): boolean {
  if (search.keywords && !title.toLowerCase().includes(search.keywords.toLowerCase())) return false;
  if (search.maxPrice > 0 && price > search.maxPrice) return false;
  return true;
}

/**
 * Card-level filter decisions for Marketplace listing cards.
 * Pure-ish: takes a card element + settings, returns a reason or null.
 */

export type HideReason = 'sponsored' | 'keyword' | 'out-of-range' | 'shipping' | 'ad' | 'unknown-city' | 'seen';

export interface FilterSettings {
  blockedWords: string[];
  hideSponsored: boolean;
  hideShipping: boolean;
  hideAds: boolean;
  hideUnknown: boolean;
  seenMode: 'fade' | 'hide' | 'off';
}

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  blockedWords: [],
  hideSponsored: true,
  hideShipping: true,
  hideAds: true,
  hideUnknown: false,
  seenMode: 'fade',
};

const ITEM_LINK = 'a[href*="/marketplace/item/"]';

/** Extract the item id from a card. */
export function itemId(card: Element): string | null {
  const a = card.querySelector(ITEM_LINK);
  const m = a?.getAttribute('href')?.match(/\/marketplace\/item\/(\d+)/);
  return m ? m[1] : null;
}

/** Get the text lines of a card (price, title, city, badges). */
export function cardLines(card: Element): string[] {
  return (card.textContent ?? '')
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Detect sponsored listing. */
export function isSponsored(card: Element): boolean {
  const text = (card.textContent ?? '').toLowerCase();
  return text.includes('sponsored') || text.includes('boosted');
}

/** Detect shipping-only listing. */
export function isShipping(card: Element): boolean {
  const text = (card.textContent ?? '').toLowerCase();
  return text.includes('ships to you');
}

/** Detect seller ad. */
export function isAd(card: Element): boolean {
  const text = (card.textContent ?? '').toLowerCase();
  return text.includes('ad from seller');
}

/** Detect blocked keyword in title. */
export function hasBlockedKeyword(card: Element, words: string[]): string | null {
  const lower = (card.textContent ?? '').toLowerCase();
  for (const w of words) {
    if (w && lower.includes(w.toLowerCase())) return w;
  }
  return null;
}

/**
 * Decide whether a card should be hidden and why.
 * @returns HideReason or null if visible
 */
export function decideHide(
  card: Element,
  settings: FilterSettings,
  seenIds: Set<string>,
  cityStatus: 'in' | 'out' | 'unknown',
): HideReason | null {
  if (settings.hideSponsored && isSponsored(card)) return 'sponsored';
  const kw = hasBlockedKeyword(card, settings.blockedWords);
  if (kw) return 'keyword';
  if (settings.hideShipping && isShipping(card)) return 'shipping';
  if (settings.hideAds && isAd(card)) return 'ad';
  if (cityStatus === 'out') return 'out-of-range';
  if (cityStatus === 'unknown' && settings.hideUnknown) return 'unknown-city';
  const id = itemId(card);
  if (id && seenIds.has(id) && settings.seenMode === 'hide') return 'seen';
  return null;
}

/** Apply a hide decision to a card element. */
export function applyHide(card: Element, reason: HideReason | null, seen: boolean, seenMode: FilterSettings['seenMode']): void {
  const el = card as HTMLElement;
  el.removeAttribute('data-mlf-hidden');
  el.style.opacity = '';
  if (reason) {
    card.setAttribute('data-mlf-hidden', reason);
    card.setAttribute('data-mlf-reason', reason);
  } else if (seen && seenMode === 'fade') {
    (card as HTMLElement).style.opacity = '0.35';
    card.setAttribute('data-mlf-seen', '1');
  } else {
    card.removeAttribute('data-mlf-seen');
  }
}

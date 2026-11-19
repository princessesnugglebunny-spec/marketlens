/**
 * Listing compliance rule engine (adapted from listing-pilot).
 * Pure functions; rules are data, not code paths.
 */

export interface RuleResult {
  rule: string;
  passed: boolean;
  detail: string;
}

export interface ListingDraft {
  title: string;
  bullets: string[];
  description: string;
  searchTerms: string;
}

const RESTRICTED = ['eco-friendly', 'non-toxic', 'antibacterial', 'bestseller', 'full refund', 'guarantee'];

/** Title length limit (Amazon US non-media, 2026-07-27). */
export const TITLE_MAX = 75;
/** Search terms byte limit. */
export const SEARCH_TERMS_MAX_BYTES = 249;

function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

/** Check a single listing draft against the rule set. */
export function checkListing(draft: ListingDraft): RuleResult[] {
  const results: RuleResult[] = [];

  // Title length
  results.push({
    rule: 'title-length',
    passed: draft.title.length <= TITLE_MAX,
    detail: `title is ${draft.title.length} chars (limit ${TITLE_MAX})`,
  });

  // Title forbidden punctuation
  const forbidden = /[!$?_{}^]/;
  results.push({
    rule: 'title-punctuation',
    passed: !forbidden.test(draft.title),
    detail: forbidden.test(draft.title) ? 'title contains forbidden punctuation' : 'ok',
  });

  // Title word repetition (no word more than twice)
  const words = draft.title.toLowerCase().split(/\s+/);
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  const repeated = [...counts.entries()].filter(([, n]) => n > 2);
  results.push({
    rule: 'title-word-repeat',
    passed: repeated.length === 0,
    detail: repeated.length ? `repeated: ${repeated.map(([w]) => w).join(', ')}` : 'ok',
  });

  // No ALL CAPS words longer than 3 chars
  const allCaps = draft.title.split(/\s+/).filter((w) => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  results.push({
    rule: 'title-all-caps',
    passed: allCaps.length === 0,
    detail: allCaps.length ? `all-caps words: ${allCaps.join(', ')}` : 'ok',
  });

  // Restricted claims anywhere
  const allText = [draft.title, ...draft.bullets, draft.description].join(' ').toLowerCase();
  const foundRestricted = RESTRICTED.filter((r) => allText.includes(r));
  results.push({
    rule: 'restricted-claims',
    passed: foundRestricted.length === 0,
    detail: foundRestricted.length ? `restricted: ${foundRestricted.join(', ')}` : 'ok',
  });

  // No URLs or contact details in bullets/description
  const urlOrContact = /(https?:\/\/|www\.|@|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b)/i;
  const contactHit = [draft.description, ...draft.bullets].some((t) => urlOrContact.test(t));
  results.push({
    rule: 'no-contact-info',
    passed: !contactHit,
    detail: contactHit ? 'URL or contact info found' : 'ok',
  });

  // No emojis
  const emojiRe = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
  const emojiHit = [draft.title, ...draft.bullets, draft.description].some((t) => emojiRe.test(t));
  results.push({
    rule: 'no-emojis',
    passed: !emojiHit,
    detail: emojiHit ? 'emoji found' : 'ok',
  });

  // Search terms byte limit
  results.push({
    rule: 'search-terms-bytes',
    passed: byteLength(draft.searchTerms) <= SEARCH_TERMS_MAX_BYTES,
    detail: `search terms ${byteLength(draft.searchTerms)} bytes (limit ${SEARCH_TERMS_MAX_BYTES})`,
  });

  // No guarantees/refund promises in bullets/description
  const guaranteeRe = /\b(refund|guarantee|warranty)\b/i;
  const gHit = [draft.description, ...draft.bullets].some((t) => guaranteeRe.test(t));
  results.push({
    rule: 'no-guarantees',
    passed: !gHit,
    detail: gHit ? 'guarantee/refund wording found' : 'ok',
  });

  return results;
}

/** Return only the failed rules. */
export function failedRules(results: RuleResult[]): RuleResult[] {
  return results.filter((r) => !r.passed);
}

/** Flag restricted claims in arbitrary text. */
export function flagRestricted(text: string): string[] {
  const lower = text.toLowerCase();
  return RESTRICTED.filter((r) => lower.includes(r));
}

/**
 * Listing drafting helpers: prompt building + compliance checking.
 */
import { checkListing, failedRules, flagRestricted, type ListingDraft } from './rules';

export interface DraftInput {
  notes: string;
  photoDescription?: string;
}

/** Build the system prompt for the listing drafter. */
export function buildDraftPrompt(input: DraftInput): string {
  const parts = [
    'You are a listing copywriter. Output JSON with keys: title, bullets (array of 5), description, searchTerms.',
    'Constraints: title <= 75 chars; no forbidden punctuation (! $ ? _ { } ^); no word more than twice; no ALL CAPS words; no promotional words; no restricted claims (eco-friendly, non-toxic, antibacterial, bestseller); no URLs/contact info/emojis; no guarantees/refunds; searchTerms <= 249 bytes.',
    `Seller notes: ${input.notes}`,
  ];
  if (input.photoDescription) parts.push(`Photo description: ${input.photoDescription}`);
  return parts.join('\n');
}

/** Validate a parsed draft; returns failed rules. */
export function validateDraft(draft: ListingDraft): ReturnType<typeof failedRules> {
  return failedRules(checkListing(draft));
}

/** Flag restricted claims in seller notes. */
export function preflightNotes(notes: string): string[] {
  return flagRestricted(notes);
}

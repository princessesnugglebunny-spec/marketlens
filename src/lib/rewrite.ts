/**
 * Targeted rewrite: given failed rules, build a prompt to fix only those.
 */
import { failedRules, checkListing, type ListingDraft } from './rules';

export function buildRewritePrompt(draft: ListingDraft): string {
  const failed = failedRules(checkListing(draft));
  if (failed.length === 0) return '';
  const instructions = failed.map((r) => `- Fix rule "${r.rule}": ${r.detail}`).join('\n');
  return `Rewrite only the parts needed to satisfy these failed rules:\n${instructions}\n\nCurrent draft:\n${JSON.stringify(draft)}`;
}

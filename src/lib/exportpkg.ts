/**
 * Export listing package: JSON + CSV + compliance report.
 */
import { checkListing, type ListingDraft } from './rules';

export interface ExportPackage {
  listing: ListingDraft;
  compliance: { rule: string; passed: boolean; detail: string }[];
  allPassed: boolean;
}

export function buildExportPackage(draft: ListingDraft): ExportPackage {
  const compliance = checkListing(draft);
  return {
    listing: draft,
    compliance,
    allPassed: compliance.every((r) => r.passed),
  };
}

export function toJson(pkg: ExportPackage): string {
  return JSON.stringify(pkg, null, 2);
}

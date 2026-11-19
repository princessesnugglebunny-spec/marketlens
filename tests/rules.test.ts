import { describe, it, expect } from 'vitest';
import { checkListing, failedRules, flagRestricted } from '../src/lib/rules';

describe('rules', () => {
  it('passes a clean listing', () => {
    const d = { title: 'Ember Row Soy Candle Cedarwood Vanilla', bullets: ['8 oz jar'], description: 'Soy wax candle', searchTerms: 'soy candle cedarwood' };
    const r = checkListing(d);
    expect(failedRules(r)).toHaveLength(0);
  });
  it('fails long title', () => {
    const d = { title: 'A'.repeat(80), bullets: [], description: '', searchTerms: '' };
    const r = checkListing(d);
    expect(failedRules(r).some((x) => x.rule === 'title-length')).toBe(true);
  });
  it('flags restricted claims', () => {
    expect(flagRestricted('eco-friendly non-toxic candle')).toEqual(expect.arrayContaining(['eco-friendly', 'non-toxic']));
  });
  it('fails search terms over byte limit', () => {
    const d = { title: 'T', bullets: [], description: '', searchTerms: 'a'.repeat(260) };
    const r = checkListing(d);
    expect(failedRules(r).some((x) => x.rule === 'search-terms-bytes')).toBe(true);
  });
});

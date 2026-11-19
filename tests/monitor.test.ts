import { describe, it, expect } from 'vitest';
import { isNewMatch, matchesCriteria } from '../src/background/monitor';

describe('monitor', () => {
  it('isNewMatch', () => {
    const s = { id: '1', keywords: '', maxPrice: 0, lastSeenIds: ['a'] };
    expect(isNewMatch('b', s)).toBe(true);
    expect(isNewMatch('a', s)).toBe(false);
  });
  it('matchesCriteria', () => {
    const s = { id: '1', keywords: 'chair', maxPrice: 100, lastSeenIds: [] };
    expect(matchesCriteria('Office chair', 80, s)).toBe(true);
    expect(matchesCriteria('Table', 80, s)).toBe(false);
    expect(matchesCriteria('Office chair', 200, s)).toBe(false);
  });
});

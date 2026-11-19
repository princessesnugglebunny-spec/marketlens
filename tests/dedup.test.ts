import { describe, it, expect } from 'vitest';
import { isSeen, markSeen } from '../src/lib/dedup';

describe('dedup', () => {
  it('tracks seen', () => {
    let s = new Set<string>();
    expect(isSeen('a', s)).toBe(false);
    s = markSeen('a', s);
    expect(isSeen('a', s)).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { analyzeSeo } from '../src/lib/seo';

describe('seo', () => {
  it('suggests for short title', () => {
    const s = analyzeSeo('Chair', 'A chair', []);
    expect(s.some((x) => x.type === 'title')).toBe(true);
  });
  it('suggests for few tags', () => {
    const s = analyzeSeo('A nice wooden chair for sale today', 'A nice wooden chair for sale today with details', []);
    expect(s.some((x) => x.type === 'keyword')).toBe(true);
  });
});

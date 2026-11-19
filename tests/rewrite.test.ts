import { describe, it, expect } from 'vitest';
import { buildRewritePrompt } from '../src/lib/rewrite';

describe('rewrite', () => {
  it('returns empty when no failures', () => {
    const d = { title: 'Good title', bullets: [], description: '', searchTerms: '' };
    expect(buildRewritePrompt(d)).toBe('');
  });
  it('returns instructions when failures', () => {
    const d = { title: 'A'.repeat(80), bullets: [], description: '', searchTerms: '' };
    const p = buildRewritePrompt(d);
    expect(p).toContain('title-length');
  });
});

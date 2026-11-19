import { describe, it, expect } from 'vitest';
import { buildDraftPrompt, preflightNotes, validateDraft } from '../src/lib/draft';

describe('draft', () => {
  it('builds prompt with notes', () => {
    expect(buildDraftPrompt({ notes: '8oz candle' })).toContain('8oz candle');
  });
  it('preflight flags restricted', () => {
    expect(preflightNotes('eco-friendly candle')).toContain('eco-friendly');
  });
  it('validateDraft returns failures', () => {
    const d = { title: 'A'.repeat(80), bullets: [], description: '', searchTerms: '' };
    expect(validateDraft(d).length).toBeGreaterThan(0);
  });
});

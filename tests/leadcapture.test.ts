import { describe, it, expect } from 'vitest';
import { extractLeadsFromText } from '../src/lib/leadcapture';

describe('leadcapture', () => {
  it('extracts leads', () => {
    const text = 'John: Is this still available?\nJane: What is the price?';
    const leads = extractLeadsFromText(text);
    expect(leads).toHaveLength(2);
    expect(leads[0].buyerName).toBe('John');
  });
  it('returns empty for no matches', () => {
    expect(extractLeadsFromText('hello world')).toHaveLength(0);
  });
});

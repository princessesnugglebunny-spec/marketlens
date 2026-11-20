import { describe, it, expect } from 'vitest';
import { TEMPLATES, getTemplate } from '../src/lib/templates';

describe('templates', () => {
  it('has 8 templates', () => {
    expect(TEMPLATES).toHaveLength(8);
  });
  it('gets by id', () => {
    expect(getTemplate('electronics')?.name).toBe('Electronics Seller');
  });
  it('returns undefined for unknown', () => {
    expect(getTemplate('nope')).toBeUndefined();
  });
});

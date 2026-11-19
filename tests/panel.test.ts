import { describe, it, expect } from 'vitest';
import { extractPrice } from '../src/content/profit/panel';

describe('panel', () => {
  it('extracts price', () => {
    expect(extractPrice('Price $1,234.56 foo')).toBe(1234.56);
  });
  it('returns null when no price', () => {
    expect(extractPrice('no price here')).toBeNull();
  });
});

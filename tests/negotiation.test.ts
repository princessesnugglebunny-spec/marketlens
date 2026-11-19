import { describe, it, expect } from 'vitest';
import { evaluateOffer, DEFAULT_NEGOTIATION } from '../src/lib/negotiation';

describe('negotiation', () => {
  it('accepts at asking', () => {
    const r = evaluateOffer(100, 100, DEFAULT_NEGOTIATION);
    expect(r.verdict).toBe('accept');
  });
  it('declines below floor', () => {
    const rules = { ...DEFAULT_NEGOTIATION, minPrice: 80, maxDiscountPercent: 10 };
    const r = evaluateOffer(50, 100, rules);
    expect(r.verdict).toBe('decline');
  });
  it('counters in range', () => {
    const rules = { ...DEFAULT_NEGOTIATION, minPrice: 80, maxDiscountPercent: 10 };
    const r = evaluateOffer(92, 100, rules);
    expect(r.verdict).toBe('counter');
  });
});

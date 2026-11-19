/**
 * Negotiation rules engine: given a buyer offer, suggest a counter within rules.
 * Advisory only — user sends the message.
 */
export interface NegotiationRules {
  minPrice: number;
  autoAcceptAbove: number;
  maxDiscountPercent: number;
  currency: string;
}

export const DEFAULT_NEGOTIATION: NegotiationRules = {
  minPrice: 0,
  autoAcceptAbove: 0,
  maxDiscountPercent: 10,
  currency: 'USD',
};

export type NegotiationVerdict = 'accept' | 'counter' | 'decline';

export function evaluateOffer(offer: number, asking: number, rules: NegotiationRules): { verdict: NegotiationVerdict; counter: number; reason: string } {
  if (offer >= asking) return { verdict: 'accept', counter: offer, reason: 'meets asking' };
  if (offer >= rules.autoAcceptAbove && rules.autoAcceptAbove > 0) return { verdict: 'accept', counter: offer, reason: 'above auto-accept threshold' };
  const floor = Math.max(rules.minPrice, asking * (1 - rules.maxDiscountPercent / 100));
  if (offer < floor) return { verdict: 'decline', counter: floor, reason: 'below floor' };
  const counter = Math.max(floor, offer + (asking - offer) * 0.5);
  return { verdict: 'counter', counter: Math.round(counter * 100) / 100, reason: 'negotiate' };
}

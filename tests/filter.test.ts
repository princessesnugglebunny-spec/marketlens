import { describe, it, expect } from 'vitest';
import { decideHide, isSponsored, isShipping, isAd, hasBlockedKeyword } from '../src/content/filters/filter';

describe('filter', () => {
  it('detects sponsored', () => {
    const el = document.createElement('div');
    el.textContent = 'Sponsored listing';
    expect(isSponsored(el)).toBe(true);
  });
  it('detects shipping', () => {
    const el = document.createElement('div');
    el.textContent = 'Ships to you';
    expect(isShipping(el)).toBe(true);
  });
  it('detects ad', () => {
    const el = document.createElement('div');
    el.textContent = 'Ad from seller';
    expect(isAd(el)).toBe(true);
  });
  it('hasBlockedKeyword', () => {
    const el = document.createElement('div');
    el.textContent = 'Broken chair for parts';
    expect(hasBlockedKeyword(el, ['broken', 'wanted'])).toBe('broken');
  });
  it('decideHide sponsored', () => {
    const el = document.createElement('div');
    el.textContent = 'Sponsored';
    const r = decideHide(el, { blockedWords: [], hideSponsored: true, hideShipping: true, hideAds: true, hideUnknown: false, seenMode: 'fade' }, new Set(), 'in');
    expect(r).toBe('sponsored');
  });
});

describe('filter applyHide', () => {
  it('hides card with reason', async () => {
    const { applyHide } = await import('../src/content/filters/filter');
    const el = document.createElement('div');
    applyHide(el, 'sponsored', false, 'fade');
    expect(el.getAttribute('data-mlf-hidden')).toBe('sponsored');
  });
  it('fades seen card', async () => {
    const { applyHide } = await import('../src/content/filters/filter');
    const el = document.createElement('div');
    applyHide(el, null, true, 'fade');
    expect(el.style.opacity).toBe('0.35');
  });
  it('clears when no reason', async () => {
    const { applyHide } = await import('../src/content/filters/filter');
    const el = document.createElement('div');
    el.setAttribute('data-mlf-hidden', 'x');
    applyHide(el, null, false, 'off');
    expect(el.getAttribute('data-mlf-hidden')).toBeNull();
  });
});

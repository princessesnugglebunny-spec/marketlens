import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { activateLicense, isPro, canUse } from '../src/lib/license';

describe('license', () => {
  beforeEach(() => __resetMemStore());
  it('starts free', async () => {
    expect(await isPro()).toBe(false);
  });
  it('activates pro', async () => {
    expect(await activateLicense('a'.repeat(20))).toBe(true);
    expect(await isPro()).toBe(true);
  });
  it('rejects short key', async () => {
    expect(await activateLicense('short')).toBe(false);
  });
  it('gates pro features', async () => {
    expect(await canUse('profit-calc')).toBe(true);
    await activateLicense('a'.repeat(20));
    expect(await canUse('max-buy')).toBe(true);
  });
});

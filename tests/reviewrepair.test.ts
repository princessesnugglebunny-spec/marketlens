import { describe, it, expect } from 'vitest';
import { reviewAndRepair } from '../src/lib/reviewrepair';

describe('reviewrepair', () => {
  it('succeeds on first try', async () => {
    const r = await reviewAndRepair(async () => ({ ok: true, issues: [] }), async () => {}, 3);
    expect(r.ok).toBe(true);
    expect(r.attempts).toBe(1);
  });
  it('retries and fails', async () => {
    const r = await reviewAndRepair(async () => ({ ok: false, issues: ['x'] }), async () => {}, 2);
    expect(r.ok).toBe(false);
    expect(r.attempts).toBe(2);
  });
});

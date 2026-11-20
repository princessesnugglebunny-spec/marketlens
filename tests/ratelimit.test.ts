import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { canPerform, recordAction } from '../src/lib/ratelimit';

describe('ratelimit', () => {
  beforeEach(() => __resetMemStore());
  it('allows initially', async () => {
    expect(await canPerform('reply')).toBe(true);
  });
  it('records action', async () => {
    await recordAction('reply');
    expect(await canPerform('reply')).toBe(true);
  });
});

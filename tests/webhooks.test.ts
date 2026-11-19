import { describe, it, expect } from 'vitest';
import { sendDiscord, sendTelegram } from '../src/lib/webhooks';

describe('webhooks', () => {
  it('returns false for empty url', async () => {
    expect(await sendDiscord('', 'hi')).toBe(false);
  });
  it('returns false for empty token', async () => {
    expect(await sendTelegram('', '1', 'hi')).toBe(false);
  });
});

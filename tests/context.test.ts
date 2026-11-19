import { describe, it, expect } from 'vitest';
import { trimContext } from '../src/agent/context';

describe('context', () => {
  it('keeps system messages', () => {
    const msgs = [
      { role: 'system' as const, content: 'sys' },
      { role: 'user' as const, content: 'hello' },
    ];
    const out = trimContext(msgs, 1000);
    expect(out.length).toBe(2);
  });
  it('trims when over budget', () => {
    const msgs = [
      { role: 'system' as const, content: 'sys' },
      { role: 'user' as const, content: 'a'.repeat(100) },
      { role: 'assistant' as const, content: 'b'.repeat(100) },
    ];
    const out = trimContext(msgs, 110);
    expect(out.length).toBeLessThanOrEqual(3);
    expect(out[0].role).toBe('system');
  });
});

import { describe, it, expect } from 'vitest';
import { isNightTime, getNightReply, DEFAULT_NIGHT_REPLY } from '../src/lib/nightreply';

describe('nightreply', () => {
  it('detects night time', () => {
    const cfg = { ...DEFAULT_NIGHT_REPLY, enabled: true, startHour: 22, endHour: 8 };
    expect(isNightTime(23, cfg)).toBe(true);
    expect(isNightTime(12, cfg)).toBe(false);
  });
  it('returns message at night', () => {
    const cfg = { ...DEFAULT_NIGHT_REPLY, enabled: true, startHour: 22, endHour: 8 };
    expect(getNightReply(23, cfg)).not.toBeNull();
    expect(getNightReply(12, cfg)).toBeNull();
  });
});

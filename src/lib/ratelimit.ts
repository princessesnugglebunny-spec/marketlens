/**
 * Rate limiter for reply suggestions and actions.
 */
import { get, set } from './storage';

export interface RateLimitConfig {
  maxPerHour: number;
  maxPerDay: number;
}

export const DEFAULT_RATE_LIMIT: RateLimitConfig = { maxPerHour: 30, maxPerDay: 200 };

export async function canPerform(action: string): Promise<boolean> {
  const now = Date.now();
  const hourKey = `rl_${action}_hour`;
  const dayKey = `rl_${action}_day`;
  const hourData = await get<{ count: number; resetAt: number }>(hourKey, { count: 0, resetAt: now + 3600000 });
  const dayData = await get<{ count: number; resetAt: number }>(dayKey, { count: 0, resetAt: now + 86400000 });

  if (now > hourData.resetAt) { hourData.count = 0; hourData.resetAt = now + 3600000; }
  if (now > dayData.resetAt) { dayData.count = 0; dayData.resetAt = now + 86400000; }

  const cfg = DEFAULT_RATE_LIMIT;
  if (hourData.count >= cfg.maxPerHour) return false;
  if (dayData.count >= cfg.maxPerDay) return false;
  return true;
}

export async function recordAction(action: string): Promise<void> {
  const now = Date.now();
  const hourKey = `rl_${action}_hour`;
  const dayKey = `rl_${action}_day`;
  const hourData = await get<{ count: number; resetAt: number }>(hourKey, { count: 0, resetAt: now + 3600000 });
  const dayData = await get<{ count: number; resetAt: number }>(dayKey, { count: 0, resetAt: now + 86400000 });
  if (now > hourData.resetAt) { hourData.count = 0; hourData.resetAt = now + 3600000; }
  if (now > dayData.resetAt) { dayData.count = 0; dayData.resetAt = now + 86400000; }
  hourData.count++;
  dayData.count++;
  await set(hourKey, hourData);
  await set(dayKey, dayData);
}

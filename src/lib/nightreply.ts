/**
 * Night reply scheduler: handle after-hours replies.
 */
export interface NightReplyConfig {
  enabled: boolean;
  startHour: number; // 0-23
  endHour: number;   // 0-23
  message: string;
}

export const DEFAULT_NIGHT_REPLY: NightReplyConfig = {
  enabled: false,
  startHour: 22,
  endHour: 8,
  message: 'Thanks for your message! I\'m away right now but will reply first thing in the morning.',
};

export function isNightTime(hour: number, config: NightReplyConfig): boolean {
  if (!config.enabled) return false;
  if (config.startHour < config.endHour) {
    return hour >= config.startHour || hour < config.endHour;
  }
  // wraps midnight
  return hour >= config.startHour || hour < config.endHour;
}

export function getNightReply(hour: number, config: NightReplyConfig): string | null {
  if (!isNightTime(hour, config)) return null;
  return config.message;
}

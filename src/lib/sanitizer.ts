/**
 * Sanitize model/tool output: strip scripts, enforce image policy.
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}

export function isImageAllowed(url: string, allowedHosts: string[]): boolean {
  try {
    const u = new URL(url);
    return allowedHosts.some((h) => u.hostname === h || u.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

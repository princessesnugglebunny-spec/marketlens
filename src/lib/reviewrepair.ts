/**
 * Review & repair loop: validate image, retry up to N times.
 */
export interface ReviewResult {
  ok: boolean;
  issues: string[];
  attempts: number;
}

export async function reviewAndRepair(
  check: () => Promise<{ ok: boolean; issues: string[] }>,
  repair: () => Promise<void>,
  maxAttempts: number = 3,
): Promise<ReviewResult> {
  let attempts = 0;
  let last: { ok: boolean; issues: string[] } = { ok: false, issues: [] };
  while (attempts < maxAttempts) {
    attempts++;
    last = await check();
    if (last.ok) return { ok: true, issues: [], attempts };
    if (attempts < maxAttempts) await repair();
  }
  return { ok: false, issues: last.issues, attempts };
}

/**
 * Deduplication helper: track seen post IDs.
 */
export function isSeen(id: string, seen: Set<string>): boolean {
  return seen.has(id);
}

export function markSeen(id: string, seen: Set<string>): Set<string> {
  const next = new Set(seen);
  next.add(id);
  return next;
}

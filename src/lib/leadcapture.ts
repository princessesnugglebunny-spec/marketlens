/**
 * Lead auto-capture: extract buyer info from visible conversation DOM (read-only).
 */
export interface CapturedLead {
  buyerName: string;
  messageSnippet: string;
  timestamp: number;
}

export function extractLeadsFromText(text: string): CapturedLead[] {
  const leads: CapturedLead[] = [];
  // Simple heuristic: lines starting with a name followed by a message
  const lines = text.split('\n').filter((l) => l.trim());
  for (const line of lines) {
    const m = line.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)?):\s*(.+)$/);
    if (m) {
      leads.push({ buyerName: m[1], messageSnippet: m[2].slice(0, 100), timestamp: Date.now() });
    }
  }
  return leads;
}

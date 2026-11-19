/**
 * Rolling context window with simple truncation (hierarchical summarization
 * is a future enhancement).
 */

export interface ContextMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export function trimContext(messages: ContextMessage[], maxChars: number): ContextMessage[] {
  if (messages.length === 0) return messages;
  const system = messages.filter((m) => m.role === 'system');
  const rest = messages.filter((m) => m.role !== 'system');
  let total = system.reduce((a, m) => a + m.content.length, 0);
  const kept: ContextMessage[] = [];
  for (let i = rest.length - 1; i >= 0; i--) {
    const m = rest[i];
    if (total + m.content.length > maxChars && kept.length > 0) break;
    kept.unshift(m);
    total += m.content.length;
  }
  return [...system, ...kept];
}

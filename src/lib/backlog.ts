/**
 * Backlog processing: scan existing conversations on startup.
 */
import { get, set } from './storage';

export interface BacklogItem {
  conversationId: string;
  messageCount: number;
  lastMessage: string;
  processed: boolean;
}

export async function scanBacklog(conversationIds: string[]): Promise<BacklogItem[]> {
  const backlog = await get<BacklogItem[]>('mlf_backlog', []);
  const existing = new Set(backlog.map((b) => b.conversationId));
  for (const id of conversationIds) {
    if (!existing.has(id)) {
      backlog.push({ conversationId: id, messageCount: 0, lastMessage: '', processed: false });
    }
  }
  await set('mlf_backlog', backlog);
  return backlog;
}

export async function markProcessed(conversationId: string): Promise<void> {
  const backlog = await get<BacklogItem[]>('mlf_backlog', []);
  const item = backlog.find((b) => b.conversationId === conversationId);
  if (item) item.processed = true;
  await set('mlf_backlog', backlog);
}

export async function getUnprocessed(): Promise<BacklogItem[]> {
  const backlog = await get<BacklogItem[]>('mlf_backlog', []);
  return backlog.filter((b) => !b.processed);
}

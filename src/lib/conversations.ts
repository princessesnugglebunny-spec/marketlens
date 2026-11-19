/**
 * Conversation tracking: store chat threads locally.
 */
import { get, set } from './storage';

export interface Conversation {
  id: string;
  title: string;
  messages: { role: string; content: string }[];
  createdAt: number;
  updatedAt: number;
}

export async function saveConversation(conv: Conversation): Promise<void> {
  const list = await get<Conversation[]>('mlf_conversations', []);
  const idx = list.findIndex((c) => c.id === conv.id);
  if (idx >= 0) list[idx] = conv;
  else list.push(conv);
  await set('mlf_conversations', list);
}

export async function listConversations(): Promise<Conversation[]> {
  return get<Conversation[]>('mlf_conversations', []);
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const list = await get<Conversation[]>('mlf_conversations', []);
  return list.find((c) => c.id === id) ?? null;
}

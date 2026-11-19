/**
 * Service worker: alarms, notifications, OpenAI-compat client entry.
 */
import { get } from '../lib/storage';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}

/** Call an OpenAI-compatible chat completions endpoint. */
export async function chatComplete(opts: ChatOptions): Promise<string> {
  const url = opts.baseUrl.replace(/\/$/, '') + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({ model: opts.model, messages: opts.messages }),
  });
  if (!res.ok) throw new Error(`chat failed: ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? '';
}

/** Streaming chat completions (returns full text via SSE aggregation). */
export async function chatCompleteStream(opts: ChatOptions, onChunk: (chunk: string) => void): Promise<string> {
  const url = opts.baseUrl.replace(/\/$/, '') + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({ model: opts.model, messages: opts.messages, stream: true }),
  });
  if (!res.ok) throw new Error(`chat failed: ${res.status}`);
  const reader = res.body?.getReader();
  if (!reader) throw new Error('no stream');
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') continue;
      try {
        const json = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
        const chunk = json.choices?.[0]?.delta?.content;
        if (chunk) { full += chunk; onChunk(chunk); }
      } catch { /* ignore parse errors */ }
    }
  }
  return full;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('mlf-monitor', { periodInMinutes: 15 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'mlf-monitor') return;
  const enabled = await get<boolean>('mlf_monitor_enabled', false);
  if (!enabled) return;
  const searches = await get<unknown[]>('mlf_saved_searches', []);
  const count = Array.isArray(searches) ? searches.length : 0;
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('assets/icon128.png'),
    title: 'MarketLens',
    message: `Monitoring check complete (read-only). ${count} saved search(es).`,
  });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'chat') {
    (async () => {
      const payload = msg.payload as ChatOptions;
      const storedBase = await get<string>('mlf_api_base', payload.baseUrl);
      const storedKey = await get<string>('mlf_api_key', payload.apiKey);
      const storedModel = await get<string>('mlf_api_model', payload.model);
      try {
        const text = await chatComplete({ ...payload, baseUrl: storedBase, apiKey: storedKey, model: storedModel });
        sendResponse({ ok: true, text });
      } catch (e) {
        sendResponse({ ok: false, error: (e as Error).message });
      }
    })();
    return true;
  }
  return false;
});

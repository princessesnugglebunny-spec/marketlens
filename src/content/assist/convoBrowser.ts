/**
 * Conversation history browser: list saved conversations.
 */
import { listConversations } from '../../lib/conversations';

export async function injectConvoBrowser(): Promise<void> {
  if (document.getElementById('mlf-convo-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'mlf-convo-btn';
  btn.textContent = 'Conversations';
  btn.style.cssText = 'position:fixed;top:180px;right:12px;z-index:2147483645;padding:8px 16px;border-radius:8px;border:none;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3);font-size:12px;';

  btn.addEventListener('click', async () => {
    const convos = await listConversations();
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:100px;right:12px;width:280px;max-height:300px;overflow:auto;background:rgba(15,23,42,.95);color:#fff;padding:12px;border-radius:8px;z-index:2147483646;font-size:12px;';
    if (convos.length === 0) panel.innerHTML = '<p>No conversations saved.</p>';
    else panel.innerHTML = convos.map((c) => `<div style="padding:4px;border-bottom:1px solid #333;">${escapeHtml(c.title)} (${c.messages.length} msgs)</div>`).join('');
    const close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = 'position:absolute;top:4px;right:8px;background:none;border:none;color:#fff;cursor:pointer;font-size:16px;';
    close.addEventListener('click', () => panel.remove());
    panel.appendChild(close);
    document.body.appendChild(panel);
  });
  document.body.appendChild(btn);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Drafting assistant panel: user enters notes, gets compliant listing draft.
 * Uses background chat client; never posts anything.
 */
import { buildDraftPrompt, preflightNotes } from '../lib/draft';

export function injectDraftPanel(): void {
  if (document.getElementById('mlf-draft-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'mlf-draft-panel';
  panel.style.cssText = 'position:fixed;top:60px;right:12px;background:#0f172a;color:#fff;padding:12px;border-radius:8px;font-size:12px;z-index:2147483645;width:300px;box-shadow:0 2px 8px rgba(0,0,0,.3);';
  panel.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;">Draft Listing</div>
    <textarea id="mlf-notes" rows="4" style="width:100%;font-size:12px;" placeholder="Seller notes..."></textarea>
    <button id="mlf-draft-btn" style="margin-top:6px;padding:4px 8px;">Draft</button>
    <div id="mlf-draft-out" style="margin-top:8px;white-space:pre-wrap;max-height:200px;overflow:auto;"></div>
  `;
  document.body.appendChild(panel);

  const btn = panel.querySelector('#mlf-draft-btn') as HTMLButtonElement;
  const notes = panel.querySelector('#mlf-notes') as HTMLTextAreaElement;
  const out = panel.querySelector('#mlf-draft-out') as HTMLDivElement;

  btn.addEventListener('click', async () => {
    const text = notes.value.trim();
    if (!text) return;
    const restricted = preflightNotes(text);
    if (restricted.length) out.textContent = `Restricted claims flagged: ${restricted.join(', ')}\n`;
    else out.textContent = 'Drafting...';
    const chromeApi = (globalThis as unknown as { chrome?: typeof chrome }).chrome;
    const resp = await chromeApi?.runtime?.sendMessage?.({
      type: 'chat',
      payload: { baseUrl: '', apiKey: '', model: '', messages: [{ role: 'user', content: buildDraftPrompt({ notes: text }) }] },
    });
    const reply = resp?.ok ? resp.text : `Error: ${resp?.error ?? 'no response'}`;
    out.textContent = reply;
  });
}

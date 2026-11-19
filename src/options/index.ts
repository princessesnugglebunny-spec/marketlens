/**
 * Options page: blocked words, fee platforms, API configuration.
 */
import { get, set } from '../lib/storage';
import { listEntries } from '../lib/buylog';
import { summarize } from '../lib/analytics';

async function render(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  const words = await get<string>('mlf_blocked_words', '');
  const apiBase = await get<string>('mlf_api_base', '');
  const apiKey = await get<string>('mlf_api_key', '');
  const apiModel = await get<string>('mlf_api_model', 'gpt-4o-mini');
  const radius = await get<number>('mlf_radius', 40);
  const grace = await get<boolean>('mlf_grace', true);

  root.innerHTML = `
    <div style="font-family:sans-serif;padding:24px;max-width:760px;margin:0 auto;">
      <h1>MarketLens Settings</h1>
      <h2>Blocked words (one per line)</h2>
      <textarea id="words" rows="6" style="width:100%;">${escapeHtml(words)}</textarea>

      <h2>Geo filter</h2>
      <label>Radius (mi): <input id="radius" type="number" value="${radius}" /></label>
      <label style="margin-left:12px;"><input id="grace" type="checkbox" ${grace ? 'checked' : ''}/> Allow 15mi grace</label>

      <h2>OpenAI-compatible API</h2>
      <label>Base URL: <input id="apiBase" type="text" value="${escapeHtml(apiBase)}" style="width:100%;" placeholder="https://api.openai.com/v1" /></label><br/>
      <label>API Key: <input id="apiKey" type="password" value="${escapeHtml(apiKey)}" style="width:100%;" /></label><br/>
      <label>Model: <input id="apiModel" type="text" value="${escapeHtml(apiModel)}" style="width:100%;" /></label>

      <h2>Buy log &amp; analytics</h2>
      <div id="analytics"></div>
      <p><button id="exportCsv">Export CSV</button></p>

      <p style="margin-top:16px;"><button id="save">Save</button> <span id="status"></span></p>
    </div>
  `;

  (async () => {
    const entries = await listEntries();
    const a = summarize(entries);
    const el = document.getElementById('analytics');
    if (el) el.innerHTML = `<p>Items: ${a.totalItems} | Sold: ${a.soldCount} | Revenue: $${a.revenue.toFixed(2)} | Profit: $${a.profit.toFixed(2)} | Avg days to sell: ${a.avgDaysToSell} | Turnover: ${a.turnoverRate}</p>`;
  })();
  document.getElementById('exportCsv')?.addEventListener('click', async () => {
    const { toCsv } = await import('../lib/buylog');
    const entries = await listEntries();
    const csv = toCsv(entries);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'buylog.csv'; a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById('save')?.addEventListener('click', async () => {
    await set('mlf_blocked_words', (document.getElementById('words') as HTMLTextAreaElement).value);
    await set('mlf_radius', Number((document.getElementById('radius') as HTMLInputElement).value));
    await set('mlf_grace', (document.getElementById('grace') as HTMLInputElement).checked);
    await set('mlf_api_base', (document.getElementById('apiBase') as HTMLInputElement).value);
    await set('mlf_api_key', (document.getElementById('apiKey') as HTMLInputElement).value);
    await set('mlf_api_model', (document.getElementById('apiModel') as HTMLInputElement).value);
    const status = document.getElementById('status');
    if (status) status.textContent = 'Saved';
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

render();

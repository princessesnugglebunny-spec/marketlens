/**
 * Options page: settings, analytics dashboard, leads CRM, profile builder.
 */
import { get, set } from '../lib/storage';
import { listEntries } from '../lib/buylog';
import { summarize } from '../lib/analytics';
import { listLeads } from '../lib/leads';
import { getProfile, saveProfile, type Profile } from '../lib/profile';
import { t, setLocale, availableLocales } from '../lib/i18n';

async function render(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  const words = await get<string>('mlf_blocked_words', '');
  const apiBase = await get<string>('mlf_api_base', '');
  const apiKey = await get<string>('mlf_api_key', '');
  const apiModel = await get<string>('mlf_api_model', 'gpt-4o-mini');
  const radius = await get<number>('mlf_radius', 40);
  const grace = await get<boolean>('mlf_grace', true);
  const profile = await getProfile();

  root.innerHTML = `
    <div style="font-family:sans-serif;padding:24px;max-width:900px;margin:0 auto;">
      <h1>${t('app.name')} Settings</h1>

      <h2>Language</h2>
      <select id="locale">${availableLocales().map((l) => `<option value="${l}">${l}</option>`).join('')}</select>

      <h2>Blocked words (one per line)</h2>
      <textarea id="words" rows="4" style="width:100%;">${escapeHtml(words)}</textarea>

      <h2>Geo filter</h2>
      <label>Radius (mi): <input id="radius" type="number" value="${radius}" /></label>
      <label style="margin-left:12px;"><input id="grace" type="checkbox" ${grace ? 'checked' : ''}/> Allow 15mi grace</label>

      <h2>OpenAI-compatible API</h2>
      <label>Base URL: <input id="apiBase" type="text" value="${escapeHtml(apiBase)}" style="width:100%;" placeholder="https://api.openai.com/v1" /></label><br/>
      <label>API Key: <input id="apiKey" type="password" value="${escapeHtml(apiKey)}" style="width:100%;" /></label><br/>
      <label>Model: <input id="apiModel" type="text" value="${escapeHtml(apiModel)}" style="width:100%;" /></label>

      <h2>Profile (business)</h2>
      <label>Business name: <input id="bizName" type="text" value="${escapeHtml(profile.businessName)}" style="width:100%;" /></label><br/>
      <label>Tone: <select id="tone">
        <option value="professional" ${profile.tone === 'professional' ? 'selected' : ''}>Professional</option>
        <option value="friendly" ${profile.tone === 'friendly' ? 'selected' : ''}>Friendly</option>
        <option value="casual" ${profile.tone === 'casual' ? 'selected' : ''}>Casual</option>
      </select></label><br/>
      <label>Greeting: <input id="greeting" type="text" value="${escapeHtml(profile.greeting)}" style="width:100%;" /></label><br/>
      <label>Response length: <select id="respLen">
        <option value="short" ${profile.responseLength === 'short' ? 'selected' : ''}>Short</option>
        <option value="medium" ${profile.responseLength === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="long" ${profile.responseLength === 'long' ? 'selected' : ''}>Long</option>
      </select></label><br/>
      <label>Policies: <textarea id="policies" rows="3" style="width:100%;">${escapeHtml(profile.policies)}</textarea></label><br/>
      <label>Reply language: <input id="replyLang" type="text" value="${escapeHtml(profile.replyLanguage)}" /></label>

      <h2>Analytics dashboard</h2>
      <div id="analytics"></div>

      <h2>Leads CRM</h2>
      <div id="leads"></div>

      <h2>Buy log &amp; export</h2>
      <p><button id="exportCsv">${t('settings.save')} CSV</button></p>

      <p style="margin-top:16px;"><button id="save">${t('settings.save')}</button> <span id="status"></span></p>
    </div>
  `;

  // populate analytics
  const entries = await listEntries();
  const a = summarize(entries);
  const analyticsEl = document.getElementById('analytics');
  if (analyticsEl) analyticsEl.innerHTML = `<p>Items: ${a.totalItems} | Sold: ${a.soldCount} | Revenue: $${a.revenue.toFixed(2)} | Profit: $${a.profit.toFixed(2)} | Avg days to sell: ${a.avgDaysToSell} | Turnover: ${a.turnoverRate}</p>`;

  // populate leads
  const leads = await listLeads();
  const leadsEl = document.getElementById('leads');
  if (leadsEl) {
    if (leads.length === 0) leadsEl.innerHTML = '<p>No leads yet.</p>';
    else leadsEl.innerHTML = leads.map((l) => `<div style="padding:4px;border-bottom:1px solid #333;">${escapeHtml(l.buyerName)} — ${escapeHtml(l.itemTitle)} — $${l.offer} — ${l.status}</div>`).join('');
  }

  // locale change
  (document.getElementById('locale') as HTMLSelectElement)?.addEventListener('change', (e) => {
    setLocale((e.target as HTMLSelectElement).value as 'en' | 'es' | 'fr' | 'de');
  });

  // save
  document.getElementById('save')?.addEventListener('click', async () => {
    await set('mlf_blocked_words', (document.getElementById('words') as HTMLTextAreaElement).value);
    await set('mlf_radius', Number((document.getElementById('radius') as HTMLInputElement).value));
    await set('mlf_grace', (document.getElementById('grace') as HTMLInputElement).checked);
    await set('mlf_api_base', (document.getElementById('apiBase') as HTMLInputElement).value);
    await set('mlf_api_key', (document.getElementById('apiKey') as HTMLInputElement).value);
    await set('mlf_api_model', (document.getElementById('apiModel') as HTMLInputElement).value);
    const newProfile: Profile = {
      businessName: (document.getElementById('bizName') as HTMLInputElement).value,
      tone: (document.getElementById('tone') as HTMLSelectElement).value as Profile['tone'],
      greeting: (document.getElementById('greeting') as HTMLInputElement).value,
      responseLength: (document.getElementById('respLen') as HTMLSelectElement).value as Profile['responseLength'],
      policies: (document.getElementById('policies') as HTMLTextAreaElement).value,
      replyLanguage: (document.getElementById('replyLang') as HTMLInputElement).value,
    };
    await saveProfile(newProfile);
    const status = document.getElementById('status');
    if (status) status.textContent = t('settings.saved');
  });

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
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

render();

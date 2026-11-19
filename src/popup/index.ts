/**
 * Popup UI: hidden counts, quick toggles, open options.
 */
import { get, set } from '../lib/storage';

async function render(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  const enabled = await get<boolean>('mlf_enabled', true);
  const hidden = await get<number>('mlf_hidden_count', 0);
  const grace = await get<boolean>('mlf_grace', true);
  root.innerHTML = `
    <div style="font-family:sans-serif;padding:12px;min-width:240px;">
      <h3 style="margin:0 0 8px;">MarketLens</h3>
      <p>Hidden on this page: <strong>${hidden}</strong></p>
      <label><input type="checkbox" id="enabled" ${enabled ? 'checked' : ''}/> Enabled</label><br/>
      <label><input type="checkbox" id="grace" ${grace ? 'checked' : ''}/> Allow 15mi grace</label>
      <p style="margin-top:8px;"><a href="#" id="options">Settings</a></p>
    </div>
  `;
  (document.getElementById('enabled') as HTMLInputElement)?.addEventListener('change', (e) => {
    void set('mlf_enabled', (e.target as HTMLInputElement).checked);
  });
  (document.getElementById('grace') as HTMLInputElement)?.addEventListener('change', (e) => {
    void set('mlf_grace', (e.target as HTMLInputElement).checked);
  });
  document.getElementById('options')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

render();

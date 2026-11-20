/**
 * Assist mode: highlights suggested actions with one-click chips on the page.
 * Never acts without a user click.
 */
import { get, set } from '../../lib/storage';

let enabled = false;

export async function toggleAssistMode(): Promise<boolean> {
  enabled = !enabled;
  await set('mlf_assist_mode', enabled);
  if (enabled) injectAssistOverlay();
  else removeAssistOverlay();
  return enabled;
}

function injectAssistOverlay(): void {
  if (document.getElementById('mlf-assist-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'mlf-assist-overlay';
  overlay.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,.9);color:#fff;padding:8px 16px;border-radius:999px;font-size:12px;z-index:2147483645;display:flex;gap:8px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);';
  const chips = ['Filter', 'Profit', 'Draft', 'Track'];
  chips.forEach((c) => {
    const chip = document.createElement('button');
    chip.textContent = c;
    chip.style.cssText = 'padding:4px 10px;border-radius:999px;border:none;background:#12805c;color:#fff;cursor:pointer;font-size:11px;';
    chip.addEventListener('click', () => { chip.style.background = '#0a5a3f'; });
    overlay.appendChild(chip);
  });
  document.body.appendChild(overlay);
}

function removeAssistOverlay(): void {
  document.getElementById('mlf-assist-overlay')?.remove();
}

export async function initAssistMode(): Promise<void> {
  enabled = await get<boolean>('mlf_assist_mode', false);
  if (enabled) injectAssistOverlay();
}

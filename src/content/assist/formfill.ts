/**
 * Form-filling injector: pre-fills Marketplace listing form from a stored draft.
 * Never clicks Publish — user must confirm.
 */
import { get } from '../../lib/storage';

interface DraftData {
  title: string;
  price: string;
  description: string;
  location: string;
}

const FIELD_SELECTORS: Record<keyof DraftData, string[]> = {
  title: ['input[aria-label*="Title" i]', 'input[name="title"]', 'input[placeholder*="Title" i]'],
  price: ['input[aria-label*="Price" i]', 'input[name="price"]', 'input[placeholder*="Price" i]'],
  description: ['textarea[aria-label*="Description" i]', 'textarea[name="description"]', 'textarea[placeholder*="Description" i]'],
  location: ['input[aria-label*="Location" i]', 'input[name="location"]', 'input[placeholder*="Location" i]'],
};

function findField(key: keyof DraftData): HTMLInputElement | HTMLTextAreaElement | null {
  for (const sel of FIELD_SELECTORS[key]) {
    const el = document.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) return el;
  }
  return null;
}

function setFieldValue(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export async function injectFormFillButton(): Promise<void> {
  if (!location.pathname.includes('/marketplace/create') && !location.pathname.includes('/marketplace/edit')) return;
  if (document.getElementById('mlf-fill-btn')) return;

  const draft = await get<DraftData | null>('mlf_pending_draft', null);
  if (!draft) return;

  const btn = document.createElement('button');
  btn.id = 'mlf-fill-btn';
  btn.textContent = 'Fill from draft';
  btn.style.cssText = 'position:fixed;top:80px;right:12px;z-index:2147483645;padding:8px 16px;border-radius:8px;border:none;background:#12805c;color:#fff;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3);';

  btn.addEventListener('click', () => {
    let filled = 0;
    for (const key of Object.keys(FIELD_SELECTORS) as (keyof DraftData)[]) {
      const el = findField(key);
      if (el && draft[key]) {
        setFieldValue(el, draft[key]);
        filled++;
      }
    }
    btn.textContent = `Filled ${filled} fields — review & publish manually`;
    btn.disabled = true;
  });

  document.body.appendChild(btn);
}

export async function storeDraft(draft: DraftData): Promise<void> {
  await (await import('../../lib/storage')).set('mlf_pending_draft', draft);
}

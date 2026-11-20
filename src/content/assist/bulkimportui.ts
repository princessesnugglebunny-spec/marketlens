/**
 * Bulk import UI: parse CSV, queue drafts, review each.
 */
import { parseCsv } from '../../lib/bulkimport';
import { storeDraft } from './formfill';

export function injectBulkImportButton(): void {
  if (document.getElementById('mlf-bulk-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'mlf-bulk-btn';
  btn.textContent = 'Bulk import CSV';
  btn.style.cssText = 'position:fixed;top:130px;right:12px;z-index:2147483645;padding:8px 16px;border-radius:8px;border:none;background:#0284c7;color:#fff;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3);font-size:12px;';

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.style.display = 'none';

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) { alert('No valid rows found'); return; }
    // Queue first draft
    const first = rows[0];
    await storeDraft({ title: first.title, price: String(first.price), description: first.notes, location: '' });
    alert(`Imported ${rows.length} items. First draft queued — go to create listing page.`);
  });

  btn.addEventListener('click', () => input.click());
  document.body.appendChild(btn);
  document.body.appendChild(input);
}

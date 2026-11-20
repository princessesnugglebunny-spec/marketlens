/**
 * Sniper UI: configure and manage product snipes.
 */
import { createSnipe, listSnipes, deleteSnipe } from '../../lib/sniper';

export async function injectSniperUI(): Promise<void> {
  if (document.getElementById('mlf-sniper-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'mlf-sniper-btn';
  btn.textContent = 'Sniper';
  btn.style.cssText = 'position:fixed;top:230px;right:12px;z-index:2147483645;padding:8px 16px;border-radius:8px;border:none;background:#dc2626;color:#fff;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3);font-size:12px;';

  btn.addEventListener('click', async () => {
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:100px;right:12px;width:320px;max-height:400px;overflow:auto;background:rgba(15,23,42,.95);color:#fff;padding:12px;border-radius:8px;z-index:2147483646;font-size:12px;';

    const snipes = await listSnipes();
    let html = '<div style="font-weight:700;margin-bottom:8px;">Product Sniper</div>';
    html += '<div style="margin-bottom:8px;"><input id="snipe-kw" placeholder="Keywords" style="width:60%;padding:4px;font-size:11px;" /> <input id="snipe-max" type="number" placeholder="Max $" style="width:30%;padding:4px;font-size:11px;" /></div>';
    html += '<button id="snipe-add" style="padding:4px 8px;border-radius:4px;border:none;background:#12805c;color:#fff;cursor:pointer;font-size:11px;margin-bottom:8px;">Add Snipe</button>';
    if (snipes.length > 0) {
      html += '<div style="margin-top:8px;">';
      for (const s of snipes) {
        html += `<div style="padding:4px;border-bottom:1px solid #333;display:flex;justify-content:space-between;align-items:center;">
          <span>${escapeHtml(s.keywords || 'all')} (max $${s.maxPrice || '∞'}) — ${s.alertCount} alerts</span>
          <button data-del="${s.id}" style="background:#dc2626;border:none;color:#fff;border-radius:4px;cursor:pointer;font-size:10px;padding:2px 6px;">Del</button>
        </div>`;
      }
      html += '</div>';
    }
    panel.innerHTML = html;

    const close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = 'position:absolute;top:4px;right:8px;background:none;border:none;color:#fff;cursor:pointer;font-size:16px;';
    close.addEventListener('click', () => panel.remove());
    panel.appendChild(close);

    panel.querySelector('#snipe-add')?.addEventListener('click', async () => {
      const kw = (panel.querySelector('#snipe-kw') as HTMLInputElement).value;
      const max = Number((panel.querySelector('#snipe-max') as HTMLInputElement).value) || 0;
      await createSnipe({ keywords: kw, maxPrice: max, minPrice: 0, categories: [], enabled: true, checkIntervalMs: 5000 });
      panel.remove();
      await injectSniperUI();
    });

    panel.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = (btn as HTMLElement).getAttribute('data-del')!;
        await deleteSnipe(id);
        panel.remove();
        await injectSniperUI();
      });
    });

    document.body.appendChild(panel);
  });
  document.body.appendChild(btn);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Reply draft injector: shows suggested replies next to buyer messages.
 * User must click Send — never auto-sends.
 */
import { get } from '../../lib/storage';

export async function injectReplyDrafts(): Promise<void> {
  const composers = document.querySelectorAll('div[contenteditable="true"][role="textbox"], textarea[aria-label*="Message" i]');
  composers.forEach((composer) => {
    if (composer.parentElement?.querySelector('.mlf-reply-draft')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'mlf-reply-draft';
    wrapper.style.cssText = 'margin:4px 0;padding:6px;background:rgba(18,128,92,.15);border-radius:6px;font-size:12px;';
    const btn = document.createElement('button');
    btn.textContent = 'Insert suggested reply';
    btn.style.cssText = 'padding:4px 8px;border-radius:4px;border:none;background:#12805c;color:#fff;cursor:pointer;font-size:11px;';
    btn.addEventListener('click', async () => {
      const suggestion = await get<string>('mlf_suggested_reply', 'Thanks for your interest! Is this still available?');
      const el = composer as HTMLTextAreaElement | HTMLElement;
      if (el instanceof HTMLTextAreaElement) {
        el.value = suggestion;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        el.textContent = suggestion;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
      btn.textContent = 'Inserted — review and send manually';
      btn.disabled = true;
    });
    wrapper.appendChild(btn);
    composer.parentElement?.insertBefore(wrapper, composer);
  });
}

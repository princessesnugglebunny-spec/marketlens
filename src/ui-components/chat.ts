/**
 * Minimal chat web component. Reads API config from chrome.storage.
 */
class MlfChat extends HTMLElement {
  private messages: { role: string; content: string }[] = [];

  connectedCallback(): void {
    this.render();
  }

  private render(): void {
    this.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;font-family:sans-serif;">
        <div id="log" style="flex:1;overflow:auto;padding:8px;font-size:12px;"></div>
        <div style="display:flex;gap:4px;padding:8px;">
          <input id="input" type="text" style="flex:1;padding:4px;" placeholder="Ask MarketLens..." />
          <button id="send">Send</button>
        </div>
      </div>
    `;
    const send = this.querySelector('#send') as HTMLButtonElement;
    const input = this.querySelector('#input') as HTMLInputElement;
    const log = this.querySelector('#log') as HTMLDivElement;
    send.addEventListener('click', async () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.messages.push({ role: 'user', content: text });
      log.innerHTML += `<div><b>You:</b> ${escapeHtml(text)}</div>`;
      const chromeApi = (globalThis as unknown as { chrome?: typeof chrome }).chrome;
      const resp = await chromeApi?.runtime?.sendMessage?.({
        type: 'chat',
        payload: { baseUrl: '', apiKey: '', model: '', messages: this.messages },
      });
      const reply = resp?.ok ? resp.text : `Error: ${resp?.error ?? 'no response'}`;
      this.messages.push({ role: 'assistant', content: reply });
      log.innerHTML += `<div><b>Agent:</b> ${escapeHtml(reply)}</div>`;
    });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

customElements.define('mlf-chat', MlfChat);
export { MlfChat };

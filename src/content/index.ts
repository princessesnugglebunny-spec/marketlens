/**
 * Content script: mounts UI shell, runs card filters on Marketplace pages.
 */
import { DEFAULT_FILTER_SETTINGS, type FilterSettings, decideHide, applyHide, itemId } from './filters/filter';
import { parseCity, classifyCity, DEFAULT_SETTINGS as GEO_DEFAULTS, type Settings as GeoSettings } from '../lib/geo';
import { get, set } from '../lib/storage';
import '../ui-components/chat';
import { injectProfitPanel } from './profit/panel';
import { injectDraftPanel } from './draft-panel';
import { injectFormFillButton } from './assist/formfill';
import { injectReplyDrafts } from './assist/replydraft';
import { initAssistMode } from './assist/assistmode';
import { injectBulkImportButton } from './assist/bulkimportui';
import { injectConvoBrowser } from './assist/convoBrowser';
import { injectSniperUI } from './assist/sniperui';

const ITEM_LINK = 'a[href*="/marketplace/item/"]';

interface City {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

let filterSettings: FilterSettings = { ...DEFAULT_FILTER_SETTINGS };
let geoSettings: GeoSettings = { ...GEO_DEFAULTS };
const cityTable = new Map<string, City>();
let centerCity: { city: string; state: string } | null = null;
const seenIds = new Set<string>();
let hiddenCount = 0;

async function loadSettings(): Promise<void> {
  filterSettings = {
    ...DEFAULT_FILTER_SETTINGS,
    blockedWords: (await get<string>('mlf_blocked_words', '')).split(/\n/).map((s) => s.trim()).filter(Boolean),
  };
  const radius = await get<number>('mlf_radius', GEO_DEFAULTS.radiusMiles);
  const grace = await get<boolean>('mlf_grace', true);
  geoSettings = { ...GEO_DEFAULTS, radiusMiles: radius, allowGrace: grace };
  const seen = await get<string[]>('mlf_seen_ids', []);
  seen.forEach((id) => seenIds.add(id));
}

async function loadCityTable(): Promise<void> {
  try {
    for (const file of ['data/places.json', 'data/places-au.json', 'data/places-nz.json']) {
      const url = chrome.runtime.getURL(file);
      const res = await fetch(url);
      const data = (await res.json()) as Record<string, [number, number]>;
      for (const [key, v] of Object.entries(data)) {
        const parts = key.split('|');
        if (parts.length !== 2) continue;
        const city = parts[0].trim();
        const state = parts[1].trim().toUpperCase();
        if (!cityTable.has(`${city.toLowerCase()}|${state.toLowerCase()}`)) {
          cityTable.set(`${city.toLowerCase()}|${state.toLowerCase()}`, {
            name: city.charAt(0).toUpperCase() + city.slice(1),
            state,
            lat: v[0],
            lon: v[1],
          });
        }
      }
    }
  } catch {
    // table optional; unknown classification will be used
  }
}

function readFacebookLocation(): void {
  const btn = document.querySelector('[aria-label^="Location:"]') as HTMLElement | null;
  if (!btn) return;
  const label = btn.getAttribute('aria-label') ?? '';
  const m = label.match(/Location:\s*(.+?),\s*([A-Za-z]{2})/);
  if (m) {
    centerCity = { city: m[1].trim(), state: m[2].toUpperCase() };
    const rm = label.match(/Within\s+(\d+)\s*mi/);
    if (rm) geoSettings.radiusMiles = Number(rm[1]);
  }
}

function cellOf(anchor: Element): Element | null {
  const id = itemId(anchor);
  if (!id) return null;
  let node: Element | null = anchor;
  while (node && node.parentElement && node.parentElement !== document.body) {
    const parent = node.parentElement as HTMLElement;
    const itemLinks = [...parent.querySelectorAll(ITEM_LINK)];
    if (itemLinks.some((l) => itemId(l) !== id)) break;
    const rect = parent.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 100) break;
    if (rect.width > window.innerWidth * 0.95) break;
    node = parent;
  }
  return node;
}

function cardCity(card: Element): { city: string; state: string } | null {
  const lines = (card.textContent ?? '').split(/\n/).map((s) => s.trim()).filter(Boolean);
  for (const line of lines) {
    const p = parseCity(line);
    if (p) return p;
  }
  return null;
}

function processCard(card: Element): void {
  const id = itemId(card);
  if (!id) return;
  const cityStatus = classifyCity(cardCity(card), centerCity, cityTable, geoSettings);
  const reason = decideHide(card, filterSettings, seenIds, cityStatus);
  const isSeen = seenIds.has(id);
  applyHide(card, reason, isSeen, filterSettings.seenMode);
  if (reason) {
    hiddenCount += 1;
    void set('mlf_hidden_count', hiddenCount);
  }
  // mark seen on click
  card.addEventListener('click', () => {
    if (!seenIds.has(id)) {
      seenIds.add(id);
      void set('mlf_seen_ids', [...seenIds]);
    }
  }, { once: true });
}

function scan(): void {
  readFacebookLocation();
  const anchors = document.querySelectorAll(ITEM_LINK);
  const cards = new Set<Element>();
  anchors.forEach((a) => {
    const c = cellOf(a);
    if (c) cards.add(c);
  });
  cards.forEach(processCard);
}

function makeDraggable(el: HTMLElement, key: string): void {
  let dragging = false;
  let ox = 0;
  let oy = 0;
  el.addEventListener('mousedown', (e) => {
    dragging = true;
    ox = e.clientX - el.getBoundingClientRect().left;
    oy = e.clientY - el.getBoundingClientRect().top;
    el.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    el.style.left = `${e.clientX - ox}px`;
    el.style.top = `${e.clientY - oy}px`;
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.style.transform = 'none';
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    el.style.cursor = 'grab';
    void set(`mlf_pos_${key}`, { left: el.style.left, top: el.style.top });
  });
}

function mountShell(): void {
  if (document.getElementById('mlf-shell')) return;
  const shell = document.createElement('div');
  shell.id = 'mlf-shell';
  shell.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483646;';

  const fabStyle = 'pointer-events:auto;position:fixed;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:linear-gradient(135deg,#12805c,#0a5a3f);color:#fff;font-weight:700;cursor:grab;box-shadow:0 6px 18px rgba(18,128,92,.45),inset 0 1px 0 rgba(255,255,255,.2);backdrop-filter:blur(6px);transition:transform .15s,box-shadow .15s;font-size:16px;display:flex;align-items:center;justify-content:center;';

  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
  corners.forEach((corner) => {
    const btn = document.createElement('button');
    btn.className = `mlf-fab mlf-fab--${corner}`;
    btn.textContent = 'M';
    btn.style.cssText = fabStyle;
    const parts = corner.split('-');
    (btn.style as unknown as Record<string, string>)[parts[0]] = '14px';
    (btn.style as unknown as Record<string, string>)[parts[1]] = '14px';
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.08)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });
    makeDraggable(btn, `fab-${corner}`);
    shell.appendChild(btn);
  });

  // Chat bubble (bottom-right offset)
  const chatBubble = document.createElement('button');
  chatBubble.textContent = '💬';
  chatBubble.style.cssText = fabStyle + 'bottom:70px;right:14px;font-size:18px;';
  chatBubble.addEventListener('click', () => {
    const existing = document.getElementById('mlf-chat-panel');
    if (existing) { existing.remove(); return; }
    const panel = document.createElement('div');
    panel.id = 'mlf-chat-panel';
    panel.style.cssText = 'pointer-events:auto;position:fixed;bottom:130px;right:14px;width:320px;height:380px;background:rgba(15,23,42,.92);color:#fff;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.4);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.12);overflow:hidden;';
    const chat = document.createElement('mlf-chat') as HTMLElement;
    chat.style.cssText = 'display:block;height:100%;';
    panel.appendChild(chat);
    shell.appendChild(panel);
  });
  shell.appendChild(chatBubble);

  const barStyle = 'pointer-events:auto;position:fixed;left:50%;transform:translateX(-50%);background:rgba(15,23,42,.78);color:#fff;padding:6px 16px;border-radius:999px;font-size:12px;opacity:0.92;cursor:pointer;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);box-shadow:0 4px 14px rgba(0,0,0,.25);transition:opacity .2s,transform .2s;';

  const topBar = document.createElement('div');
  topBar.className = 'mlf-bar mlf-bar--top';
  topBar.textContent = 'MarketLens';
  topBar.style.cssText = barStyle + 'top:10px;';
  let topCollapsed = false;
  topBar.addEventListener('click', () => {
    topCollapsed = !topCollapsed;
    topBar.style.opacity = topCollapsed ? '0.35' : '0.92';
    topBar.textContent = topCollapsed ? 'ML' : 'MarketLens';
    void set('mlf_top_collapsed', topCollapsed);
  });
  shell.appendChild(topBar);

  const bottomBar = document.createElement('div');
  bottomBar.className = 'mlf-bar mlf-bar--bottom';
  bottomBar.textContent = 'Notifications';
  bottomBar.style.cssText = barStyle + 'bottom:10px;';
  let bottomCollapsed = false;
  bottomBar.addEventListener('click', () => {
    bottomCollapsed = !bottomCollapsed;
    bottomBar.style.opacity = bottomCollapsed ? '0.35' : '0.92';
    bottomBar.textContent = bottomCollapsed ? 'N' : 'Notifications';
    void set('mlf_bottom_collapsed', bottomCollapsed);
  });
  shell.appendChild(bottomBar);

  document.documentElement.appendChild(shell);
}

async function init(): Promise<void> {
  await loadSettings();
  await loadCityTable();
  mountShell();
  void injectProfitPanel();
  injectDraftPanel();
  void injectFormFillButton();
  void injectReplyDrafts();
  void initAssistMode();
  injectBulkImportButton();
  void injectConvoBrowser();
  void injectSniperUI();
  scan();
  const obs = new MutationObserver(() => scan());
  obs.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void init());
} else {
  void init();
}

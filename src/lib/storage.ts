/**
 * Storage helpers wrapping chrome.storage with an in-memory fallback for tests.
 */

const memStore: Record<string, unknown> = {};

function hasChrome(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage;
}

export async function get<T>(key: string, fallback: T): Promise<T> {
  if (hasChrome()) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (res) => {
        resolve((res[key] as T) ?? fallback);
      });
    });
  }
  return (memStore[key] as T) ?? fallback;
}

export async function set(key: string, value: unknown): Promise<void> {
  if (hasChrome()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  }
  memStore[key] = value;
}

export async function remove(key: string): Promise<void> {
  if (hasChrome()) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, () => resolve());
    });
  }
  delete memStore[key];
}

/** Reset in-memory store (tests only). */
export function __resetMemStore(): void {
  for (const k of Object.keys(memStore)) delete memStore[k];
}

/**
 * Theme management: dark/light toggle with persistence.
 */
import { get, set } from './storage';

export type Theme = 'dark' | 'light';

export const DARK_VARS: Record<string, string> = {
  '--mlf-bg': '#0f172a',
  '--mlf-fg': '#f8fafc',
  '--mlf-accent': '#38bdf8',
  '--mlf-primary': '#12805c',
};

export const LIGHT_VARS: Record<string, string> = {
  '--mlf-bg': '#f8fafc',
  '--mlf-fg': '#0f172a',
  '--mlf-accent': '#0284c7',
  '--mlf-primary': '#12805c',
};

export async function getTheme(): Promise<Theme> {
  return get<Theme>('mlf_theme', 'dark');
}

export async function setTheme(theme: Theme): Promise<void> {
  await set('mlf_theme', theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  const vars = theme === 'dark' ? DARK_VARS : LIGHT_VARS;
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
  root.setAttribute('data-mlf-theme', theme);
}

export async function initTheme(): Promise<void> {
  const theme = await getTheme();
  applyTheme(theme);
}

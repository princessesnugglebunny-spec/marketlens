import { describe, it, expect } from 'vitest';
import { applyTheme, DARK_VARS, LIGHT_VARS } from '../src/lib/theme';

describe('theme', () => {
  it('applies dark vars', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute('data-mlf-theme')).toBe('dark');
  });
  it('applies light vars', () => {
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-mlf-theme')).toBe('light');
  });
  it('has vars', () => {
    expect(Object.keys(DARK_VARS).length).toBeGreaterThan(0);
    expect(Object.keys(LIGHT_VARS).length).toBeGreaterThan(0);
  });
});

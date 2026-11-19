import { describe, it, expect } from 'vitest';
import { t, setLocale, getLocale, availableLocales } from '../src/lib/i18n';

describe('i18n', () => {
  it('defaults to english', () => {
    expect(getLocale()).toBe('en');
    expect(t('settings.save')).toBe('Save');
  });
  it('switches locale', () => {
    setLocale('es');
    expect(t('settings.save')).toBe('Guardar');
    setLocale('en');
  });
  it('falls back to key', () => {
    expect(t('nope.missing')).toBe('nope.missing');
  });
  it('lists locales', () => {
    expect(availableLocales()).toContain('fr');
  });
});

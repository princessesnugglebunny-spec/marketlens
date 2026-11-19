/**
 * Minimal i18n: English built-in, plus a few locales. t() falls back to English.
 */
export type Locale = 'en' | 'es' | 'fr' | 'de';

const DICTS: Record<Locale, Record<string, string>> = {
  en: {
    'app.name': 'MarketLens',
    'filter.hidden': 'Hidden',
    'profit.title': 'Profit',
    'draft.title': 'Draft Listing',
    'draft.button': 'Draft',
    'settings.save': 'Save',
    'settings.saved': 'Saved',
  },
  es: {
    'app.name': 'MarketLens',
    'filter.hidden': 'Oculto',
    'profit.title': 'Ganancia',
    'draft.title': 'Borrador de anuncio',
    'draft.button': 'Borrador',
    'settings.save': 'Guardar',
    'settings.saved': 'Guardado',
  },
  fr: {
    'app.name': 'MarketLens',
    'filter.hidden': 'Masque',
    'profit.title': 'Profit',
    'draft.title': "Brouillon d'annonce",
    'draft.button': 'Brouillon',
    'settings.save': 'Enregistrer',
    'settings.saved': 'Enregistre',
  },
  de: {
    'app.name': 'MarketLens',
    'filter.hidden': 'Ausgeblendet',
    'profit.title': 'Gewinn',
    'draft.title': 'Anzeigenentwurf',
    'draft.button': 'Entwurf',
    'settings.save': 'Speichern',
    'settings.saved': 'Gespeichert',
  },
};

let current: Locale = 'en';

export function setLocale(l: Locale): void {
  current = l;
}

export function getLocale(): Locale {
  return current;
}

export function t(key: string): string {
  return DICTS[current]?.[key] ?? DICTS.en[key] ?? key;
}

export function availableLocales(): Locale[] {
  return Object.keys(DICTS) as Locale[];
}

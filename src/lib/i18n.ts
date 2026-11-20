/**
 * Minimal i18n: English built-in, plus a few locales. t() falls back to English.
 */
export type Locale = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ja' | 'zh' | 'ko' | 'ru';

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
  pt: {
    'app.name': 'MarketLens',
    'filter.hidden': 'Oculto',
    'profit.title': 'Lucro',
    'draft.title': 'Rascunho de anuncio',
    'draft.button': 'Rascunho',
    'settings.save': 'Salvar',
    'settings.saved': 'Salvo',
  },
  it: {
    'app.name': 'MarketLens',
    'filter.hidden': 'Nascosto',
    'profit.title': 'Profitto',
    'draft.title': 'Bozza annuncio',
    'draft.button': 'Bozza',
    'settings.save': 'Salva',
    'settings.saved': 'Salvato',
  },
  ja: {
    'app.name': 'MarketLens',
    'filter.hidden': '非表示',
    'profit.title': '利益',
    'draft.title': 'リスティング下書き',
    'draft.button': '下書き',
    'settings.save': '保存',
    'settings.saved': '保存済み',
  },
  zh: {
    'app.name': 'MarketLens',
    'filter.hidden': '已隐藏',
    'profit.title': '利润',
    'draft.title': '列表草稿',
    'draft.button': '草稿',
    'settings.save': '保存',
    'settings.saved': '已保存',
  },
  ko: {
    'app.name': 'MarketLens',
    'filter.hidden': '숨김',
    'profit.title': '수익',
    'draft.title': '리스팅 초안',
    'draft.button': '초안',
    'settings.save': '저장',
    'settings.saved': '저장됨',
  },
  ru: {
    'app.name': 'MarketLens',
    'filter.hidden': 'Скрыто',
    'profit.title': 'Прибыль',
    'draft.title': 'Черновик объявления',
    'draft.button': 'Черновик',
    'settings.save': 'Сохранить',
    'settings.saved': 'Сохранено',
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

// src/utils/lang.js

/** RTL languages (we only support Arabic right now) */
export const RTL_LANGS = new Set(['ar']);

/** Languages we actually support */
export const SUPPORTED_LANGS = new Set(['en', 'ar']);

/** Normalize any input to one of our supported langs */
export function normalizeLang(lng = 'en') {
  const base = String(lng || 'en').toLowerCase().slice(0, 2);
  return SUPPORTED_LANGS.has(base) ? base : 'en';
}

/**
 * Map viewer country → default language guess.
 * You can tune this list anytime.
 */
export function countryToLang(country = 'ZZ') {
  const c = String(country || '').toUpperCase();

  // Arabic-speaking countries (wider than just GCC)
  const AR_COUNTRIES = new Set([
    'AE','SA','QA','KW','BH','OM', // GCC
    'EG','JO','LB','DZ','MA','TN','IQ','YE','LY','SD','SY','PS'
  ]);

  if (AR_COUNTRIES.has(c)) return 'ar';
  return 'en';
}

/** Set <html lang / dir> based on language */
export function applyHtmlLangDir(lang = 'en') {
  try {
    const l = normalizeLang(lang);
    const html = document.documentElement;
    html.setAttribute('lang', l);
    html.setAttribute('dir', RTL_LANGS.has(l) ? 'rtl' : 'ltr');
  } catch {}
}

/** Push to dataLayer (safe no-op if unavailable) */
export function pushDL(eventName, obj = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...obj });
  } catch {}
}

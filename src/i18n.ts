import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import tkm from './locales/tkm.json';
import { detectLanguage } from './content/detectLanguage';
import { IS_PREVIEW } from './content/cache';

const LANG_KEY = 'dowletli_lang';

// Priority: ?lang= URL param (used by the admin live preview) →
// the visitor's saved choice → region auto-detection.
function initialLanguage(): string {
  try {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (param === 'en' || param === 'ru' || param === 'tkm') return param;
  } catch {
    /* ignore */
  }
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'ru' || saved === 'tkm') return saved;
  } catch {
    /* ignore */
  }
  return detectLanguage();
}

// i18next merges edits INTO its resource objects, so give it copies — the
// imported JSON must stay pristine because it is the "reset to defaults" source.
const copy = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: copy(en) },
      ru: { translation: copy(ru) },
      tkm: { translation: copy(tkm) },
    },
    lng: initialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Remember the visitor's manual language choice — but NOT when the page is the
// admin preview (loaded with ?lang=…), so the preview can't change the real site.
i18n.on('languageChanged', (lng) => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (IS_PREVIEW) return; // the admin's preview must not change the visitor language
    localStorage.setItem(LANG_KEY, lng);
    // A ?lang= link set the first language; after a manual switch, drop it so a
    // reload keeps the visitor's choice.
    if (params.has('lang') && params.get('lang') !== lng) {
      params.delete('lang');
      const qs = params.toString();
      window.history.replaceState(window.history.state, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
    }
  } catch {
    /* ignore */
  }
});

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import tkm from './locales/tkm.json';
import { detectLanguage } from './content/detectLanguage';

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

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      tkm: { translation: tkm },
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
    if (new URLSearchParams(window.location.search).has('lang')) return;
    localStorage.setItem(LANG_KEY, lng);
  } catch {
    /* ignore */
  }
});

export default i18n;

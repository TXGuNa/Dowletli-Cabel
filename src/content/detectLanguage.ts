// Detects the best default language based on the visitor's region.
// Turkmenistan -> Turkmen, ex-USSR / Russian-speaking regions -> Russian, otherwise English.

export type Lang = 'en' | 'ru' | 'tkm';

// Time zones used across the former USSR (Russian as common language)
const CIS_TIMEZONES = new Set<string>([
  'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd',
  'Europe/Saratov', 'Europe/Astrakhan', 'Europe/Ulyanovsk', 'Europe/Kirov',
  'Europe/Minsk', 'Europe/Kiev', 'Europe/Kyiv', 'Europe/Simferopol',
  'Asia/Almaty', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Atyrau', 'Asia/Oral',
  'Asia/Qyzylorda', 'Asia/Qostanay', 'Asia/Bishkek', 'Asia/Tashkent',
  'Asia/Samarkand', 'Asia/Dushanbe', 'Asia/Baku', 'Asia/Yerevan',
  'Asia/Tbilisi', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk',
  'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Chita', 'Asia/Vladivostok',
  'Asia/Magadan', 'Asia/Kamchatka', 'Europe/Chisinau',
]);

const TURKMEN_TIMEZONES = new Set<string>(['Asia/Ashgabat', 'Asia/Ashkhabad']);

export function detectLanguage(): Lang {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (TURKMEN_TIMEZONES.has(tz)) return 'tkm';
    if (CIS_TIMEZONES.has(tz)) return 'ru';

    const langs = (navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en']
    ).map((l) => l.toLowerCase());

    if (langs.some((l) => l.startsWith('tk'))) return 'tkm';
    if (langs.some((l) => l.startsWith('ru'))) return 'ru';
  } catch {
    /* ignore – fall back to English */
  }
  return 'en';
}

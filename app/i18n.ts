import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import nag from './locales/nag.json';
import san from './locales/san.json';
import kok from './locales/kok.json';
import kru from './locales/kru.json';
import mni from './locales/mni.json';
import bn from './locales/bn.json';
import or from './locales/or.json';
import brx from './locales/brx.json';
import doi from './locales/doi.json';
import gu from './locales/gu.json';
import ks from './locales/ks.json';
import mai from './locales/mai.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';
import ne from './locales/ne.json';
import pa from './locales/pa.json';
import sa from './locales/sa.json';

// Configure i18n
const i18n = new I18n({
  en,
  hi,
  nag,
  san,
  kok,
  kru,
  mni,
  bn,
  or,
  brx,
  doi,
  gu,
  ks,
  mai,
  ml,
  mr,
  ne,
  pa,
  sa,
});

// Set the locale, defaulting to English
i18n.locale = (Localization as any).locale || 'en';

// Enable fallback to English if translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Function to change locale
export const changeLanguage = (locale: string) => {
  i18n.locale = locale;
};

export default i18n;

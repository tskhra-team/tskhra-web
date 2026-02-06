import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEN from '../locales/en/common.json';
import homeEN from '../locales/en/home.json';
import authEN from '../locales/en/auth.json';
import commonKA from '../locales/ka/common.json';
import homeKA from '../locales/ka/home.json';
import authKA from '../locales/ka/auth.json';

i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // React bindings
  .init({
    resources: {
      en: {
        common: commonEN,
        home: homeEN,
        auth: authEN,
      },
      ka: {
        common: commonKA,
        home: homeKA,
        auth: authKA,
      },
    },
    fallbackLng: 'en', // Fallback language
    defaultNS: 'common', // Default namespace
    debug: false, // Set to true for development debugging

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['cookie', 'navigator'], // Check cookie first, then browser
      caches: ['cookie'], // Store in cookie
      cookieOptions: {
        path: '/',
        sameSite: 'strict',
      },
    },
  });

export default i18n;

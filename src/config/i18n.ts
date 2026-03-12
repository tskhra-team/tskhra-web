import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Import translation files
import authEN from "../locales/en/auth.json";
import bookingEN from "../locales/en/booking.json";
import categoriesEN from "../locales/en/categories.json";
import commonEN from "../locales/en/common.json";
import ecommerceEN from "../locales/en/ecommerce.json";
import homeEN from "../locales/en/home.json";
import modalEN from "../locales/en/modal.json";
import profileEN from "../locales/en/profile.json";
import swappingEN from "../locales/en/swapping.json";
import verificationEN from "../locales/en/verification.json";
import authKA from "../locales/ka/auth.json";
import bookingKA from "../locales/ka/booking.json";
import categoriesKA from "../locales/ka/categories.json";
import commonKA from "../locales/ka/common.json";
import ecommerceKA from "../locales/ka/ecommerce.json";
import homeKA from "../locales/ka/home.json";
import modalGE from "../locales/ka/modal.json";
import profileKA from "../locales/ka/profile.json";
import swappingKA from "../locales/ka/swapping.json";
import verificationKA from "../locales/ka/verification.json";

i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // React bindings
  .init({
    resources: {
      en: {
        common: commonEN,
        home: homeEN,
        auth: authEN,
        booking: bookingEN,
        ecommerce: ecommerceEN,
        swapping: swappingEN,
        categories: categoriesEN,
        profile: profileEN,
        verification: verificationEN,
        modal: modalEN,
      },
      ka: {
        common: commonKA,
        home: homeKA,
        auth: authKA,
        booking: bookingKA,
        ecommerce: ecommerceKA,
        swapping: swappingKA,
        categories: categoriesKA,
        profile: profileKA,
        verification: verificationKA,
        modal: modalGE,
      },
    },
    fallbackLng: "en", // Fallback language
    defaultNS: "common", // Default namespace
    debug: false, // Set to true for development debugging

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ["cookie", "navigator"], // Check cookie first, then browser
      caches: ["cookie"], // Store in cookie
      cookieOptions: {
        path: "/",
        sameSite: "strict",
      },
    },
  });

export default i18n;

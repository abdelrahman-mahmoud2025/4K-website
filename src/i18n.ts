import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations from separate files
import arTranslation from './locales/ar/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
  ar: {
    translation: arTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
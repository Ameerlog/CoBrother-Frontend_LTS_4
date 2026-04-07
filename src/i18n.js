import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import enGB from './locales/en-GB.json';
import enUS from './locales/en-US.json';
import hi from './locales/hi.json';
import zh from './locales/zh.json';
import ur from './locales/ur.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  'en-GB': { translation: enGB },
  'en-US': { translation: enUS },
  hi: { translation: hi },
  zh: { translation: zh },
  ur: { translation: ur },
  fr: { translation: fr },
  pt: { translation: pt },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;


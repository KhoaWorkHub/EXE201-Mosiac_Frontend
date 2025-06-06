import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    defaultNS: 'common',
    ns: [
      'common', 
      'auth', 
      'product', 
      'cart', 
      'checkout', 
      'admin', 
      'destination', 
      'destinationdanang', 
      'destinationhanoi',
      'destinationhcm',  
      'profile', 
      'admin-orders'
    ],
  });

export default i18n;
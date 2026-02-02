import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import commonID from './locales/id/common.json';
import homeID from './locales/id/home.json';
import landingID from './locales/id/landing.json';

import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import landingEN from './locales/en/landing.json';

const resources = {
  id: {
    common: commonID,
    home: homeID,
    landing: landingID,
  },
  en: {
    common: commonEN,
    home: homeEN,
    landing: landingEN,
  },
};

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const i18nOptions = {
  resources,
  lng: isBrowser ? window.localStorage.getItem('i18nextLng') || 'id' : 'id',
  fallbackLng: 'id',
  ns: ['common', 'home', 'landing'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  detection: isBrowser ? {
    order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
    caches: ['localStorage'],
  } : {},
};

i18n.use(initReactI18next);

if (isBrowser) {
  import('i18next-browser-languagedetector').then((module) => {
    i18n.use(module.default).init(i18nOptions);
  });
} else {
  i18n.init(i18nOptions);
}

export default i18n;

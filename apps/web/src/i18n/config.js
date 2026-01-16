import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import commonID from './locales/id/common.json';
import homeID from './locales/id/home.json';
import authID from './locales/id/auth.json';
import dashboardID from './locales/id/dashboard.json';
import landingID from './locales/id/landing.json';

import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import authEN from './locales/en/auth.json';
import dashboardEN from './locales/en/dashboard.json';
import landingEN from './locales/en/landing.json';

const resources = {
  id: {
    common: commonID,
    home: homeID,
    auth: authID,
    dashboard: dashboardID,
    landing: landingID,
  },
  en: {
    common: commonEN,
    home: homeEN,
    auth: authEN,
    dashboard: dashboardEN,
    landing: landingEN,
  },
};

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const i18nOptions = {
  resources,
  lng: isBrowser ? window.localStorage.getItem('i18nextLng') || 'id' : 'id',
  fallbackLng: 'id',
  ns: ['common', 'home', 'auth', 'dashboard', 'landing'],
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

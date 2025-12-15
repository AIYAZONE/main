import { createI18n } from 'vue-i18n';
import zh from '../locales/zh.json';
import en from '../locales/en.json';
import type { Locale } from '../types/common';

// Get browser language or default to Chinese
const getBrowserLocale = (): Locale => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  return 'zh';
};

// Get stored language preference or use browser default
const getStoredLocale = (): Locale => {
  const stored = localStorage.getItem('preferred-language') as Locale;
  return stored || getBrowserLocale();
};

const i18n = createI18n({
  locale: getStoredLocale(),
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  },
  legacy: false, // Use Composition API mode
  globalInjection: true
});

// Language switching utility
export const switchLanguage = (locale: Locale) => {
  i18n.global.locale.value = locale;
  localStorage.setItem('preferred-language', locale);
  document.documentElement.lang = locale;
};

// Get current locale
export const getCurrentLocale = (): Locale => {
  return i18n.global.locale.value as Locale;
};

// Available locales configuration
export const localeConfig = [
  {
    code: 'zh' as Locale,
    name: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'en' as Locale,
    name: 'English',
    flag: '🇺🇸'
  }
];

export default i18n;
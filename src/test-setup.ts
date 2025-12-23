import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';

// Create a mock i18n instance for tests
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
});

// Configure Vue Test Utils to use the i18n instance
config.global.plugins = [i18n];
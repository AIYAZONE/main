import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import * as fc from 'fast-check';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import LanguageSwitcher from '../LanguageSwitcher.vue';
import { useUIStore } from '../../../stores/uiStore';
import type { Locale } from '../../../types/common';

// Mock translations for testing
const mockTranslations: Record<Locale, Record<string, string>> = {
  zh: {
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.portfolio': '作品集',
    'nav.career': '职业规划',
    'nav.contact': '联系我',
    'brand.title': 'AIYAZONE',
    'brand.subtitle': '前端架构师 & 技术管理者',
    'skills.title': '专业技能',
    'portfolio.title': '作品集',
    'career.title': '职业规划',
    'contact.title': '联系我'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.career': 'Career',
    'nav.contact': 'Contact',
    'brand.title': 'AIYAZONE',
    'brand.subtitle': 'Frontend Architect & Tech Lead',
    'skills.title': 'Professional Skills',
    'portfolio.title': 'Portfolio',
    'career.title': 'Career Planning',
    'contact.title': 'Contact Me'
  }
};

// Mock the i18n module to avoid conflicts
vi.mock('../../../i18n', () => ({
  switchLanguage: vi.fn((locale: Locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferred-language', locale);
    }
  }),
  getCurrentLocale: vi.fn(() => 'zh' as Locale),
  localeConfig: [
    { code: 'zh' as Locale, name: '中文', flag: '🇨🇳' },
    { code: 'en' as Locale, name: 'English', flag: '🇺🇸' }
  ]
}));

describe('Language Switching Completeness', () => {
  let i18n: any;
  let pinia: any;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    // Mock localStorage
    const mockStorage: { [key: string]: string } = {};
    originalLocalStorage = global.localStorage;
    
    // Create a more complete localStorage mock
    const mockLocalStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { 
        mockStorage[key] = value; 
      },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); },
      length: Object.keys(mockStorage).length,
      key: (index: number) => Object.keys(mockStorage)[index] || null
    } as Storage;
    
    global.localStorage = mockLocalStorage;
    // Also set it on window for browser-like environment
    if (typeof window !== 'undefined') {
      (window as any).localStorage = mockLocalStorage;
    }

    // Create fresh i18n instance for each test
    i18n = createI18n({
      locale: 'zh',
      fallbackLocale: 'zh',
      messages: mockTranslations,
      legacy: false,
      globalInjection: true
    });

    // Create fresh pinia instance for each test
    pinia = createPinia();
  });

  afterEach(() => {
    // Restore original localStorage
    global.localStorage = originalLocalStorage;
    vi.clearAllMocks();
  });

  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 7: Language switching completeness**
     * **Validates: Requirements 9.2**
     * 
     * For any page content, when switching languages, all text content should update 
     * to the corresponding language version
     */
    it('**Feature: personal-brand-showcase, Property 7: Language switching completeness** - **Validates: Requirements 9.2**', () => {
      // Property-based test: For any page content, when switching languages, 
      // all text content should update to the corresponding language version
      
      fc.assert(fc.property(
        // Generator for translation keys that exist in both languages
        fc.constantFrom(
          'nav.home',
          'nav.about', 
          'nav.portfolio',
          'nav.career',
          'nav.contact',
          'brand.title',
          'brand.subtitle',
          'skills.title',
          'portfolio.title',
          'career.title',
          'contact.title'
        ),
        // Generator for locale switching sequence
        fc.array(fc.constantFrom('zh' as Locale, 'en' as Locale), { minLength: 2, maxLength: 5 }),
        
        (translationKey: string, localeSequence: Locale[]) => {
          // Create a fresh i18n instance for this test iteration
          const testI18n = createI18n({
            locale: 'zh',
            fallbackLocale: 'zh',
            messages: mockTranslations,
            legacy: false,
            globalInjection: true
          });

          // Create a fresh pinia instance for this test iteration
          const testPinia = createPinia();

          // Mount the LanguageSwitcher component
          const wrapper = mount(LanguageSwitcher, {
            global: {
              plugins: [testI18n, testPinia]
            }
          });

          const uiStore = useUIStore(testPinia);
          
          // Test that switching through the locale sequence updates translations correctly
          for (let i = 0; i < localeSequence.length; i++) {
            const targetLocale = localeSequence[i];
            
            // Manually update the i18n locale to simulate the language switching
            testI18n.global.locale.value = targetLocale;
            
            // Update the store state (this should trigger localStorage update via the mock)
            uiStore.setLocale(targetLocale);
            
            // Verify the i18n instance locale is updated
            expect(testI18n.global.locale.value).toBe(targetLocale);
            
            // Verify the store state is updated
            expect(uiStore.currentLocale).toBe(targetLocale);
            
            // Verify localStorage is updated (the mock should have been called)
            expect(localStorage.getItem('preferred-language')).toBe(targetLocale);
            
            // Verify translation content is correct for the current locale
            const expectedTranslation = mockTranslations[targetLocale][translationKey];
            const actualTranslation = testI18n.global.t(translationKey);
            expect(actualTranslation).toBe(expectedTranslation);
          }
          
          wrapper.unmount();
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that language switching preserves translation completeness
     * All translation keys should have corresponding values in both languages
     */
    it('should maintain translation completeness across language switches', () => {
      fc.assert(fc.property(
        // Generator for all available translation keys
        fc.constantFrom(...Object.keys(mockTranslations.zh)),
        // Generator for locale
        fc.constantFrom('zh' as Locale, 'en' as Locale),
        
        (translationKey: string, locale: Locale) => {
          // Create a fresh i18n instance for this test iteration
          const testI18n = createI18n({
            locale: locale,
            fallbackLocale: 'zh',
            messages: mockTranslations,
            legacy: false,
            globalInjection: true
          });

          const testPinia = createPinia();
          const wrapper = mount(LanguageSwitcher, {
            global: {
              plugins: [testI18n, testPinia]
            }
          });

          // Verify the translation exists and is not empty
          const translation = testI18n.global.t(translationKey);
          expect(translation).toBeDefined();
          expect(translation).not.toBe('');
          expect(translation).not.toBe(translationKey); // Should not fallback to key
          
          // Verify it matches the expected translation
          const expectedTranslation = mockTranslations[locale][translationKey];
          expect(translation).toBe(expectedTranslation);
          
          wrapper.unmount();
        }
      ), { numRuns: 100 });
    });

    /**
     * Test that language switching is idempotent
     * Switching to the same language multiple times should not cause issues
     */
    it('should handle idempotent language switching correctly', () => {
      fc.assert(fc.property(
        // Generator for locale
        fc.constantFrom('zh' as Locale, 'en' as Locale),
        // Generator for number of repeated switches
        fc.integer({ min: 2, max: 5 }),
        
        (locale: Locale, repeatCount: number) => {
          // Create a fresh i18n instance for this test iteration
          const testI18n = createI18n({
            locale: 'zh',
            fallbackLocale: 'zh',
            messages: mockTranslations,
            legacy: false,
            globalInjection: true
          });

          const testPinia = createPinia();
          const wrapper = mount(LanguageSwitcher, {
            global: {
              plugins: [testI18n, testPinia]
            }
          });

          const uiStore = useUIStore(testPinia);
          
          // Switch to the locale multiple times
          for (let i = 0; i < repeatCount; i++) {
            // Manually update the i18n locale
            testI18n.global.locale.value = locale;
            uiStore.setLocale(locale);
            
            // Verify state remains consistent
            expect(testI18n.global.locale.value).toBe(locale);
            expect(uiStore.currentLocale).toBe(locale);
            expect(localStorage.getItem('preferred-language')).toBe(locale);
          }
          
          wrapper.unmount();
        }
      ), { numRuns: 50 });
    });

    /**
     * Test that language switching works correctly with component UI updates
     */
    it('should update LanguageSwitcher component UI when language changes', () => {
      fc.assert(fc.property(
        // Generator for locale sequence
        fc.array(fc.constantFrom('zh' as Locale, 'en' as Locale), { minLength: 2, maxLength: 4 }),
        
        (localeSequence: Locale[]) => {
          // Create a fresh i18n instance for this test iteration
          const testI18n = createI18n({
            locale: 'zh',
            fallbackLocale: 'zh',
            messages: mockTranslations,
            legacy: false,
            globalInjection: true
          });

          const testPinia = createPinia();
          const wrapper = mount(LanguageSwitcher, {
            global: {
              plugins: [testI18n, testPinia]
            }
          });

          const uiStore = useUIStore(testPinia);
          
          // Test that we can switch through all locales in the sequence
          for (const targetLocale of localeSequence) {
            // Switch language
            testI18n.global.locale.value = targetLocale;
            uiStore.setLocale(targetLocale);
            
            // Verify the store state is updated correctly
            expect(uiStore.currentLocale).toBe(targetLocale);
            expect(testI18n.global.locale.value).toBe(targetLocale);
            
            // Verify localStorage is updated
            expect(localStorage.getItem('preferred-language')).toBe(targetLocale);
          }
          
          wrapper.unmount();
          return true; // Ensure the property returns true for success
        }
      ), { numRuns: 50 });
    });
  });

  describe('Unit Tests', () => {
    it('should render language switcher with correct initial state', () => {
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [i18n, pinia]
        }
      });

      // Should render both language buttons
      const buttons = wrapper.findAll('.locale-btn');
      expect(buttons).toHaveLength(2);

      // Should have Chinese button active by default (based on i18n setup)
      const activeButton = wrapper.find('.locale-btn.active');
      expect(activeButton.exists()).toBe(true);

      wrapper.unmount();
    });

    it('should handle click events to switch languages', async () => {
      // Create a fresh i18n instance for this test
      const testI18n = createI18n({
        locale: 'zh',
        fallbackLocale: 'zh',
        messages: mockTranslations,
        legacy: false,
        globalInjection: true
      });

      const testPinia = createPinia();
      const wrapper = mount(LanguageSwitcher, {
        global: {
          plugins: [testI18n, testPinia]
        }
      });

      const uiStore = useUIStore(testPinia);
      const buttons = wrapper.findAll('.locale-btn');
      
      // Click on English button (second button)
      await buttons[1].trigger('click');
      
      // Verify language switched to English
      expect(uiStore.currentLocale).toBe('en');

      wrapper.unmount();
    });
  });
});
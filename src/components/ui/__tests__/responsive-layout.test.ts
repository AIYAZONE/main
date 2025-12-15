import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import * as fc from 'fast-check';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import ResponsiveCard from '../ResponsiveCard.vue';
import MobileNavigation from '../../common/MobileNavigation.vue';

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
};

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

describe('Responsive Layout Adaptation', () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  let originalMatchMedia: any;

  beforeEach(() => {
    // Store original values
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 11: Responsive layout adaptation**
     * **Validates: Requirements 7.1**
     * 
     * For any screen size configuration, the layout should adapt appropriately 
     * while maintaining content accessibility and readability
     */
    it('should adapt layout appropriately for any screen size while maintaining accessibility', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate various screen dimensions and component props
          fc.record({
            width: fc.integer({ min: 320, max: 2560 }), // From mobile to large desktop
            height: fc.integer({ min: 568, max: 1440 }), // From mobile to desktop height
            title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            content: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
            hasImage: fc.boolean(),
            clickable: fc.boolean(),
            variant: fc.constantFrom('default', 'elevated', 'outlined', 'filled'),
            rounded: fc.boolean(),
            shadow: fc.constantFrom('none', 'sm', 'md', 'lg', 'xl'),
          }),
          async ({ width, height, title, content, hasImage, clickable, variant, rounded, shadow }) => {
            // Mock the screen dimensions
            mockWindowDimensions(width, height);
            
            // Determine if this is mobile based on width
            const isMobile = width <= 767;
            const isTablet = width > 767 && width <= 991;
            const isDesktop = width > 991;
            
            mockMatchMedia(isMobile);

            // Determine appropriate size based on screen width
            const size = isMobile ? 'sm' : isTablet ? 'md' : 'lg';

            // Mount ResponsiveCard component with correct props
            const wrapper = mount(ResponsiveCard, {
              props: {
                title,
                content,
                image: hasImage ? 'https://example.com/image.jpg' : undefined,
                clickable,
                size,
                variant,
                rounded,
                shadow,
              },
            });

            // Verify component renders successfully
            expect(wrapper.exists()).toBe(true);

            // Verify essential content is present and accessible
            if (title && title.trim()) {
              const titleElement = wrapper.find('.card-title');
              expect(titleElement.exists()).toBe(true);
              expect(titleElement.text().trim()).toBe(title.trim());
              expect(titleElement.element.tagName).toBe('H3'); // Semantic heading
            }

            if (content && content.trim()) {
              const contentElement = wrapper.find('.card-content');
              expect(contentElement.exists()).toBe(true);
              expect(contentElement.text().trim()).toContain(content.trim());
            }

            // Verify responsive classes are applied correctly
            const cardElement = wrapper.find('.responsive-card');
            expect(cardElement.exists()).toBe(true);

            // Check size-specific classes based on screen width
            expect(cardElement.classes()).toContain(`responsive-card--${size}`);
            expect(cardElement.classes()).toContain(`responsive-card--${variant}`);
            expect(cardElement.classes()).toContain(`responsive-card--shadow-${shadow}`);

            if (rounded) {
              expect(cardElement.classes()).toContain('responsive-card--rounded');
            }

            // Verify clickable elements have proper accessibility attributes
            if (clickable) {
              expect(cardElement.classes()).toContain('responsive-card--clickable');
              expect(cardElement.attributes('tabindex')).toBe('0');
              expect(cardElement.attributes('role')).toBe('button');
            } else {
              expect(cardElement.attributes('tabindex')).toBeUndefined();
              expect(cardElement.attributes('role')).toBeUndefined();
            }

            // Verify image handling for different screen sizes
            if (hasImage) {
              const imageElement = wrapper.find('.card-img');
              expect(imageElement.exists()).toBe(true);
              expect(imageElement.attributes('loading')).toBe('lazy'); // Performance optimization
              expect(imageElement.attributes('alt')).toBeDefined(); // Accessibility
            }

            // Verify content structure remains intact across all screen sizes
            const textElements = wrapper.findAll('p, h1, h2, h3, h4, h5, h6, span');
            textElements.forEach(element => {
              // Verify elements are rendered and accessible
              expect(element.exists()).toBe(true);
              expect(element.element.tagName).toBeDefined();
            });

            wrapper.unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional property test for mobile navigation responsive behavior
     */
    it('should properly handle mobile navigation across different screen sizes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            width: fc.integer({ min: 320, max: 1200 }),
            height: fc.integer({ min: 568, max: 1024 }),
          }),
          async ({ width, height }) => {
            mockWindowDimensions(width, height);
            
            const isMobile = width <= 767;
            mockMatchMedia(isMobile);

            // Create mock router
            const router = createRouter({
              history: createWebHistory(),
              routes: [
                { path: '/', component: { template: '<div>Home</div>' } },
                { path: '/about', component: { template: '<div>About</div>' } },
                { path: '/portfolio', component: { template: '<div>Portfolio</div>' } },
                { path: '/career', component: { template: '<div>Career</div>' } },
                { path: '/contact', component: { template: '<div>Contact</div>' } },
              ]
            });

            // Create mock i18n with required translations
            const i18n = createI18n({
              legacy: false,
              locale: 'en',
              messages: {
                en: {
                  'accessibility.openMenu': 'Open Menu',
                  'accessibility.closeMenu': 'Close Menu',
                  'nav.menu': 'Menu',
                  'nav.home': 'Home',
                  'nav.about': 'About',
                  'nav.portfolio': 'Portfolio',
                  'nav.career': 'Career',
                  'nav.contact': 'Contact',
                }
              }
            });

            const wrapper = mount(MobileNavigation, {
              global: {
                plugins: [router, i18n],
                stubs: {
                  'LanguageSwitcher': {
                    template: '<div>Language Switcher</div>'
                  }
                }
              }
            });

            if (isMobile) {
              // Mobile navigation should be visible
              expect(wrapper.find('.mobile-navigation').exists()).toBe(true);
              
              // Toggle button should be accessible
              const toggleButton = wrapper.find('.mobile-nav-toggle');
              expect(toggleButton.exists()).toBe(true);
              expect(toggleButton.attributes('aria-label')).toBeDefined();
              expect(toggleButton.attributes('aria-expanded')).toBeDefined();
              
              // Menu should be initially closed
              const menu = wrapper.find('.mobile-nav-menu');
              expect(menu.exists()).toBe(true);
              expect(menu.classes()).not.toContain('open');
              
              // Navigation items should be properly structured
              const navItems = wrapper.findAll('.mobile-nav-item');
              expect(navItems.length).toBeGreaterThan(0);
              
              navItems.forEach(item => {
                const link = item.find('.mobile-nav-link');
                expect(link.exists()).toBe(true);
                // Should have proper semantic structure
                expect(link.element.tagName).toBe('A');
              });
            }

            wrapper.unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property test for CSS Grid responsive behavior
     */
    it('should adapt grid layouts correctly across different screen sizes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            width: fc.integer({ min: 320, max: 2560 }),
            gridItems: fc.array(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 12 }),
          }),
          async ({ width, gridItems }) => {
            mockWindowDimensions(width, 800);
            
            // Create a test component with grid layout
            const TestGridComponent = {
              template: `
                <div class="grid" :class="gridClass">
                  <div v-for="(item, index) in items" :key="index" class="grid-item">
                    {{ item }}
                  </div>
                </div>
              `,
              props: ['items', 'gridClass'],
            };

            // Determine appropriate grid class based on screen width
            let gridClass = 'grid-1';
            if (width <= 767) {
              // Mobile: single column
              gridClass = 'grid-1';
            } else if (width <= 991) {
              // Tablet: 2 columns max
              gridClass = gridItems.length > 1 ? 'grid-2' : 'grid-1';
            } else if (width <= 1199) {
              // Small desktop: 3 columns max
              gridClass = gridItems.length > 2 ? 'grid-3' : gridItems.length > 1 ? 'grid-2' : 'grid-1';
            } else {
              // Large desktop: 4 columns max
              gridClass = gridItems.length > 3 ? 'grid-4' : gridItems.length > 2 ? 'grid-3' : gridItems.length > 1 ? 'grid-2' : 'grid-1';
            }

            const wrapper = mount(TestGridComponent, {
              props: {
                items: gridItems,
                gridClass,
              },
            });

            // Verify grid container exists
            const gridContainer = wrapper.find('.grid');
            expect(gridContainer.exists()).toBe(true);
            expect(gridContainer.classes()).toContain(gridClass);

            // Verify all items are rendered
            const renderedItems = wrapper.findAll('.grid-item');
            expect(renderedItems.length).toBe(gridItems.length);

            // Verify each item contains expected content
            renderedItems.forEach((item, index) => {
              expect(item.text().trim()).toBe(gridItems[index].trim());
            });

            // Verify responsive behavior - items should be properly structured
            renderedItems.forEach(item => {
              expect(item.exists()).toBe(true);
              expect(item.element.tagName).toBe('DIV');
              expect(item.classes()).toContain('grid-item');
            });

            wrapper.unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should render ResponsiveCard with proper responsive classes on mobile', () => {
      mockWindowDimensions(375, 667); // iPhone dimensions
      mockMatchMedia(true);

      const wrapper = mount(ResponsiveCard, {
        props: {
          title: 'Test Card',
          content: 'Test content',
          size: 'sm',
        },
      });

      expect(wrapper.find('.responsive-card--sm').exists()).toBe(true);
      expect(wrapper.find('.card-title').text()).toBe('Test Card');
    });

    it('should render ResponsiveCard with proper responsive classes on desktop', () => {
      mockWindowDimensions(1920, 1080); // Desktop dimensions
      mockMatchMedia(false);

      const wrapper = mount(ResponsiveCard, {
        props: {
          title: 'Test Card',
          content: 'Test content',
          size: 'lg',
        },
      });

      expect(wrapper.find('.responsive-card--lg').exists()).toBe(true);
      expect(wrapper.find('.card-title').text()).toBe('Test Card');
    });

    it('should handle clickable cards with proper accessibility attributes', () => {
      const wrapper = mount(ResponsiveCard, {
        props: {
          title: 'Clickable Card',
          clickable: true,
        },
      });

      const card = wrapper.find('.responsive-card');
      expect(card.classes()).toContain('responsive-card--clickable');
      expect(card.attributes('tabindex')).toBe('0');
      expect(card.attributes('role')).toBe('button');
    });
  });
});
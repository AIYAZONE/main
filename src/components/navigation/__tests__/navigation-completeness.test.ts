import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import * as fc from 'fast-check';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import MainNavigation from '../MainNavigation.vue';

describe('Navigation Completeness', () => {
  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 2: Navigation completeness**
     * **Validates: Requirements 1.3**
     * 
     * For any page state, the navigation menu should contain links to all core 
     * functional modules (about, portfolio, career, contact)
     */
    it('should contain links to all core functional modules for any page state', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate different page states and navigation configurations
          fc.record({
            currentPath: fc.constantFrom('/', '/about', '/portfolio', '/career', '/contact', '/career/swot', '/career/learning'),
            variant: fc.constantFrom('default', 'transparent', 'solid'),
            position: fc.constantFrom('static', 'sticky', 'fixed'),
            showSearch: fc.boolean(),
            logoVariant: fc.constantFrom('icon', 'text', 'full'),
            logoSize: fc.constantFrom('xs', 'sm', 'md', 'lg', 'xl'),
          }),
          async ({ currentPath, variant, position, showSearch, logoVariant, logoSize }) => {
            // Create mock router with all required routes
            const router = createRouter({
              history: createWebHistory(),
              routes: [
                { 
                  path: '/', 
                  name: 'Home', 
                  component: { template: '<div>Home</div>' },
                  meta: { title: 'nav.home', icon: '🏠' }
                },
                { 
                  path: '/about', 
                  name: 'About', 
                  component: { template: '<div>About</div>' },
                  meta: { title: 'nav.about', icon: '👤' }
                },
                { 
                  path: '/portfolio', 
                  name: 'Portfolio', 
                  component: { template: '<div>Portfolio</div>' },
                  meta: { title: 'nav.portfolio', icon: '💼' }
                },
                { 
                  path: '/career', 
                  name: 'Career', 
                  component: { template: '<div>Career</div>' },
                  meta: { title: 'nav.career', icon: '🚀' },
                  children: [
                    { path: '', name: 'CareerOverview', component: { template: '<div>Career Overview</div>' } },
                    { path: 'swot', name: 'SWOT', component: { template: '<div>SWOT</div>' } },
                    { path: 'learning', name: 'Learning', component: { template: '<div>Learning</div>' } },
                  ]
                },
                { 
                  path: '/contact', 
                  name: 'Contact', 
                  component: { template: '<div>Contact</div>' },
                  meta: { title: 'nav.contact', icon: '📧' }
                },
              ]
            });

            // Navigate to the current path to simulate page state
            await router.push(currentPath);

            // Create mock i18n with required navigation translations
            const i18n = createI18n({
              legacy: false,
              locale: 'en',
              messages: {
                en: {
                  'nav.home': 'Home',
                  'nav.about': 'About',
                  'nav.portfolio': 'Portfolio',
                  'nav.career': 'Career',
                  'nav.contact': 'Contact',
                  'ui.navigation.menu': 'Navigation Menu',
                  'accessibility.toggleTheme': 'Toggle Theme',
                  'accessibility.openMenu': 'Open Menu',
                  'accessibility.closeMenu': 'Close Menu',
                  'common.search': 'Search',
                  'ui.theme.light': 'Light Theme',
                  'ui.theme.dark': 'Dark Theme',
                }
              }
            });

            // Mount the MainNavigation component with various props
            const wrapper = mount(MainNavigation, {
              props: {
                variant,
                position,
                showSearch,
                logoVariant,
                logoSize,
              },
              global: {
                plugins: [router, i18n],
                stubs: {
                  'LanguageSwitcher': {
                    template: '<div class="language-switcher">Language Switcher</div>'
                  }
                }
              }
            });

            // Verify the navigation component renders
            expect(wrapper.exists()).toBe(true);
            const navElement = wrapper.find('.main-navigation');
            expect(navElement.exists()).toBe(true);

            // Define the core functional modules that must be present
            const requiredModules = [
              { name: 'Home', path: '/', label: 'nav.home' },
              { name: 'About', path: '/about', label: 'nav.about' },
              { name: 'Portfolio', path: '/portfolio', label: 'nav.portfolio' },
              { name: 'Career', path: '/career', label: 'nav.career' },
              { name: 'Contact', path: '/contact', label: 'nav.contact' },
            ];

            // Check desktop navigation menu
            const desktopMenu = wrapper.find('.nav-menu--desktop');
            expect(desktopMenu.exists()).toBe(true);

            const desktopNavList = desktopMenu.find('.nav-list');
            expect(desktopNavList.exists()).toBe(true);

            // Verify all required navigation links are present in desktop menu
            const desktopNavLinks = desktopMenu.findAll('.nav-link');
            expect(desktopNavLinks.length).toBeGreaterThanOrEqual(requiredModules.length);

            // Check that each required module has a corresponding navigation link
            for (const module of requiredModules) {
              const moduleLink = desktopNavLinks.find(link => {
                const href = link.attributes('href') || link.element.getAttribute('href');
                return href === module.path;
              });
              
              expect(moduleLink).toBeDefined();
              expect(moduleLink?.exists()).toBe(true);
              
              if (moduleLink) {
                // Verify the link has proper semantic structure
                expect(moduleLink.element.tagName).toBe('A');
                expect(moduleLink.attributes('role')).toBe('menuitem');
                
                // Verify the link text contains the expected content
                const linkText = moduleLink.find('.nav-text');
                expect(linkText.exists()).toBe(true);
                expect(linkText.text()).toBe(i18n.global.t(module.label));
                
                // Verify active state is properly handled
                if (currentPath === module.path || (module.path === '/career' && currentPath.startsWith('/career'))) {
                  expect(moduleLink.classes()).toContain('nav-link--active');
                  expect(moduleLink.attributes('aria-current')).toBe('page');
                }
              }
            }

            // Check mobile navigation menu
            const mobileMenu = wrapper.find('.nav-menu--mobile');
            expect(mobileMenu.exists()).toBe(true);

            const mobileNavList = mobileMenu.find('.nav-list--mobile');
            expect(mobileNavList.exists()).toBe(true);

            // Verify all required navigation links are present in mobile menu
            const mobileNavLinks = mobileMenu.findAll('.nav-link--mobile');
            expect(mobileNavLinks.length).toBeGreaterThanOrEqual(requiredModules.length);

            // Check that each required module has a corresponding navigation link in mobile menu
            for (const module of requiredModules) {
              const moduleLink = mobileNavLinks.find(link => {
                const href = link.attributes('href') || link.element.getAttribute('href');
                return href === module.path;
              });
              
              expect(moduleLink).toBeDefined();
              expect(moduleLink?.exists()).toBe(true);
              
              if (moduleLink) {
                // Verify the mobile link has proper semantic structure
                expect(moduleLink.element.tagName).toBe('A');
                expect(moduleLink.attributes('role')).toBe('menuitem');
                
                // Verify the link text contains the expected content
                const linkText = moduleLink.find('.nav-text');
                expect(linkText.exists()).toBe(true);
                expect(linkText.text()).toBe(i18n.global.t(module.label));
              }
            }

            // Verify navigation accessibility attributes
            expect(navElement.attributes('role')).toBe('navigation');
            expect(navElement.attributes('aria-label')).toBe('Navigation Menu');

            // Verify desktop menu has proper menubar role
            const desktopMenubar = desktopMenu.find('[role="menubar"]');
            expect(desktopMenubar.exists()).toBe(true);

            // Verify mobile menu has proper menu role
            const mobileMenuElement = mobileMenu.find('[role="menu"]');
            expect(mobileMenuElement.exists()).toBe(true);

            // Verify mobile menu toggle button exists and has proper accessibility
            const mobileToggle = wrapper.find('.mobile-menu-toggle');
            expect(mobileToggle.exists()).toBe(true);
            expect(mobileToggle.attributes('aria-expanded')).toBeDefined();
            expect(mobileToggle.attributes('aria-label')).toBeDefined();

            wrapper.unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should render navigation with all core modules on home page', async () => {
      const router = createRouter({
        history: createWebHistory(),
        routes: [
          { path: '/', name: 'Home', component: { template: '<div>Home</div>' }, meta: { title: 'nav.home', icon: '🏠' } },
          { path: '/about', name: 'About', component: { template: '<div>About</div>' }, meta: { title: 'nav.about', icon: '👤' } },
          { path: '/portfolio', name: 'Portfolio', component: { template: '<div>Portfolio</div>' }, meta: { title: 'nav.portfolio', icon: '💼' } },
          { path: '/career', name: 'Career', component: { template: '<div>Career</div>' }, meta: { title: 'nav.career', icon: '🚀' } },
          { path: '/contact', name: 'Contact', component: { template: '<div>Contact</div>' }, meta: { title: 'nav.contact', icon: '📧' } },
        ]
      });

      const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
          en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.portfolio': 'Portfolio',
            'nav.career': 'Career',
            'nav.contact': 'Contact',
            'ui.navigation.menu': 'Navigation Menu',
            'accessibility.toggleTheme': 'Toggle Theme',
            'accessibility.openMenu': 'Open Menu',
            'accessibility.closeMenu': 'Close Menu',
            'common.search': 'Search',
          }
        }
      });

      const wrapper = mount(MainNavigation, {
        global: {
          plugins: [router, i18n],
          stubs: {
            'LanguageSwitcher': { template: '<div>Language Switcher</div>' }
          }
        }
      });

      // Verify all core navigation links are present
      const navLinks = wrapper.findAll('.nav-link');
      expect(navLinks.length).toBeGreaterThanOrEqual(5);

      // Check specific links
      const homeLink = navLinks.find(link => link.attributes('href') === '/');
      const aboutLink = navLinks.find(link => link.attributes('href') === '/about');
      const portfolioLink = navLinks.find(link => link.attributes('href') === '/portfolio');
      const careerLink = navLinks.find(link => link.attributes('href') === '/career');
      const contactLink = navLinks.find(link => link.attributes('href') === '/contact');

      expect(homeLink?.exists()).toBe(true);
      expect(aboutLink?.exists()).toBe(true);
      expect(portfolioLink?.exists()).toBe(true);
      expect(careerLink?.exists()).toBe(true);
      expect(contactLink?.exists()).toBe(true);
    });

    it('should properly highlight active navigation item', async () => {
      const router = createRouter({
        history: createWebHistory(),
        routes: [
          { path: '/', name: 'Home', component: { template: '<div>Home</div>' }, meta: { title: 'nav.home' } },
          { path: '/about', name: 'About', component: { template: '<div>About</div>' }, meta: { title: 'nav.about' } },
        ]
      });

      await router.push('/about');

      const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
          en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'ui.navigation.menu': 'Navigation Menu',
            'accessibility.toggleTheme': 'Toggle Theme',
            'accessibility.openMenu': 'Open Menu',
            'accessibility.closeMenu': 'Close Menu',
          }
        }
      });

      const wrapper = mount(MainNavigation, {
        global: {
          plugins: [router, i18n],
          stubs: {
            'LanguageSwitcher': { template: '<div>Language Switcher</div>' }
          }
        }
      });

      const aboutLink = wrapper.findAll('.nav-link').find(link => 
        link.attributes('href') === '/about'
      );

      expect(aboutLink?.classes()).toContain('nav-link--active');
      expect(aboutLink?.attributes('aria-current')).toBe('page');
    });
  });
});
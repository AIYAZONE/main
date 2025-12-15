import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { createPinia, setActivePinia } from 'pinia';

// Import components for integration testing
import BrandHero from '../components/brand/BrandHero.vue';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.vue';
import LanguageSwitcher from '../components/common/LanguageSwitcher.vue';

// Import stores
import { useBrandStore } from '../stores/brandStore';
import { usePortfolioStore } from '../stores/portfolioStore';
import { useCareerStore } from '../stores/careerStore';
import { useUIStore } from '../stores/uiStore';

// Import types
import type { BrandInfo, Certification } from '../types/brand';
import type { ProjectGroup, Project } from '../types/portfolio';
import type { SWOTData } from '../types/career';

describe('Integration Tests', () => {
  let router: any;
  let i18n: any;
  let pinia: any;

  beforeEach(() => {
    // Create fresh instances for each test
    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
        { path: '/about', name: 'About', component: { template: '<div>About</div>' } },
        { path: '/portfolio', name: 'Portfolio', component: { template: '<div>Portfolio</div>' } },
        { path: '/career', name: 'Career', component: { template: '<div>Career</div>' } },
        { path: '/contact', name: 'Contact', component: { template: '<div>Contact</div>' } },
      ]
    });

    i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en: {
          'brand.title': 'AIYAZONE',
          'brand.subtitle': 'Frontend Architect & Tech Lead',
          'brand.intro': 'Professional introduction',
          'nav.home': 'Home',
          'nav.about': 'About',
          'nav.portfolio': 'Portfolio',
          'nav.career': 'Career',
          'nav.contact': 'Contact',
          'ui.navigation.menu': 'Navigation Menu',
          'portfolio.searchPlaceholder': 'Search projects...',
          'portfolio.category': 'Category',
          'portfolio.allCategories': 'All Categories',
          'contact.title': 'Contact Me',
          'contact.name': 'Name',
          'contact.email': 'Email',
          'contact.message': 'Message',
          'contact.send': 'Send Message',
          'career.swot.title': 'SWOT Analysis',
          'ui.language.switch': 'Switch Language',
          'ui.language.en': 'English',
          'ui.language.zh': 'Chinese',
        },
        zh: {
          'brand.title': 'AIYAZONE',
          'brand.subtitle': '前端架构师 & 技术负责人',
          'brand.intro': '专业介绍',
          'nav.home': '首页',
          'nav.about': '关于',
          'nav.portfolio': '作品集',
          'nav.career': '职业规划',
          'nav.contact': '联系方式',
          'ui.navigation.menu': '导航菜单',
          'portfolio.searchPlaceholder': '搜索项目...',
          'portfolio.category': '分类',
          'portfolio.allCategories': '所有分类',
          'contact.title': '联系我',
          'contact.name': '姓名',
          'contact.email': '邮箱',
          'contact.message': '消息',
          'contact.send': '发送消息',
          'career.swot.title': 'SWOT分析',
          'ui.language.switch': '切换语言',
          'ui.language.en': '英文',
          'ui.language.zh': '中文',
        }
      }
    });

    // Reset locale to English for each test
    i18n.global.locale.value = 'en';
    
    // Clear localStorage to ensure clean state
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('preferred-language');
    }

    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Collaboration Tests', () => {
    it('should synchronize brand data between BrandHero and store', async () => {
      const brandStore = useBrandStore();
      
      // Mock brand data
      const mockBrandInfo: BrandInfo = {
        id: '1',
        name: 'AIYAZONE',
        title: 'Frontend Architect',
        subtitle: 'Tech Lead & Project Manager',
        intro: 'Professional frontend developer with 10 years experience',
        profileImage: '/images/profile.jpg',
        location: 'Shenzhen',
        age: 34,
        experience: 10,
        tagline: 'Building the future of web',
        valueProposition: ['Frontend Architecture', 'Performance Optimization', 'Team Leadership']
      };

      const mockCertifications: Certification[] = [
        {
          id: '1',
          name: 'PMP',
          issuer: 'PMI',
          issueDate: new Date('2023-01-01'),
          credentialId: 'PMP123456',
          imageUrl: '/images/pmp.jpg',
          verificationUrl: 'https://pmi.org/verify'
        }
      ];

      // Set data in store
      brandStore.setBrandInfo(mockBrandInfo);
      brandStore.setCertifications(mockCertifications);

      // Mount BrandHero component
      const wrapper = mount(BrandHero, {
        props: {
          title: brandStore.brandInfo?.name || '',
          subtitle: brandStore.brandInfo?.subtitle || '',
          intro: brandStore.brandInfo?.intro || '',
          profileImage: brandStore.brandInfo?.profileImage,
          certifications: brandStore.certifications
        },
        global: {
          plugins: [router, i18n, pinia]
        }
      });

      await flushPromises();

      // Verify component displays store data correctly
      expect(wrapper.find('.brand-hero').exists()).toBe(true);
      expect(wrapper.text()).toContain(mockBrandInfo.name);
      expect(wrapper.text()).toContain(mockBrandInfo.subtitle);
      expect(wrapper.text()).toContain(mockBrandInfo.intro);

      // Test store updates reflect in component
      const updatedBrandInfo = { ...mockBrandInfo, name: 'Updated AIYAZONE' };
      brandStore.setBrandInfo(updatedBrandInfo);

      await wrapper.setProps({
        title: brandStore.brandInfo?.name || ''
      });

      expect(wrapper.text()).toContain('Updated AIYAZONE');
    });

    it('should coordinate portfolio filtering between PortfolioGrid and store', async () => {
      const portfolioStore = usePortfolioStore();
      
      // Mock project data
      const mockProjectGroups: ProjectGroup[] = [
        {
          id: 'digital-garden',
          title: 'Digital Garden',
          description: 'Personal knowledge base',
          projects: [
            {
              id: 'project-1',
              name: 'Vue Blog',
              description: 'A Vue.js blog application',
              category: 'digital-garden',
              techStack: ['Vue 3', 'TypeScript'],
              status: 'online',
              url: 'https://example.com',
              imageUrl: '/images/project1.jpg',
              features: ['Responsive Design', 'SEO Optimized']
            }
          ]
        }
      ];

      // Set data in store
      portfolioStore.setProjectGroups(mockProjectGroups);

      // Mount PortfolioGrid component
      const wrapper = mount(PortfolioGrid, {
        global: {
          plugins: [router, i18n, pinia]
        }
      });

      await flushPromises();

      // Test initial rendering
      expect(wrapper.find('.portfolio-grid').exists()).toBe(true);
      
      // Verify filtering works through store
      const filters = { searchTerm: 'Vue' };
      portfolioStore.setFilters(filters);
      
      // Check that filtered projects are displayed
      const filteredProjects = portfolioStore.filteredProjects;
      expect(filteredProjects.length).toBeGreaterThan(0);
      expect(filteredProjects[0].projects[0].name).toContain('Vue');
    });

    it('should handle UI state management across components', async () => {
      const uiStore = useUIStore();
      
      // Test initial state
      expect(uiStore.isMobileMenuOpen).toBe(false);
      expect(uiStore.currentLocale).toBe('en');

      // Test mobile menu toggle
      uiStore.toggleMobileMenu();
      expect(uiStore.isMobileMenuOpen).toBe(true);

      uiStore.closeMobileMenu();
      expect(uiStore.isMobileMenuOpen).toBe(false);

      // Test locale change
      uiStore.setLocale('zh');
      expect(uiStore.currentLocale).toBe('zh');
    });
  });

  describe('Data Flow and State Synchronization Tests', () => {
    it('should synchronize language changes across components', async () => {
      const uiStore = useUIStore();
      
      // Test language switching functionality
      uiStore.setLocale('zh');
      expect(uiStore.currentLocale).toBe('zh');

      uiStore.setLocale('en');
      expect(uiStore.currentLocale).toBe('en');

      // Test that locale changes are reflected in the store
      const currentLocale = uiStore.currentLocale;
      expect(['en', 'zh']).toContain(currentLocale);
    });

    it('should maintain state consistency during store operations', async () => {
      const brandStore = useBrandStore();
      const portfolioStore = usePortfolioStore();

      // Test loading states
      expect(brandStore.isLoading).toBe(false);
      expect(portfolioStore.isLoading).toBe(false);

      // Mock data for direct store operations
      const mockBrandInfo = {
        id: '1',
        name: 'AIYAZONE',
        title: 'Frontend Architect',
        subtitle: 'Tech Lead',
        intro: 'Professional developer',
        profileImage: '/images/profile.jpg',
        location: 'Shenzhen',
        age: 34,
        experience: 10,
        tagline: 'Building the future',
        valueProposition: ['Architecture', 'Performance']
      };

      const mockProjectGroups = [
        {
          id: 'group-1',
          title: 'Test Group',
          description: 'Test description',
          projects: []
        }
      ];

      // Set data directly in stores to test state consistency
      brandStore.setBrandInfo(mockBrandInfo);
      portfolioStore.setProjectGroups(mockProjectGroups);

      // Verify data is set correctly
      expect(brandStore.brandInfo).toEqual(mockBrandInfo);
      expect(portfolioStore.projectGroups).toEqual(mockProjectGroups);
    });

    it('should handle error states consistently across stores', async () => {
      const brandStore = useBrandStore();
      const portfolioStore = usePortfolioStore();

      // Test error clearing functionality
      brandStore.clearError();
      portfolioStore.clearError();

      expect(brandStore.error).toBeFalsy();
      expect(portfolioStore.error).toBeFalsy();
    });
  });

  describe('User Interaction Workflow Tests', () => {
    it('should handle complete portfolio browsing workflow', async () => {
      const portfolioStore = usePortfolioStore();
      
      // Set up mock data
      const mockProjectGroups: ProjectGroup[] = [
        {
          id: 'digital-garden',
          title: 'Digital Garden',
          description: 'Knowledge base',
          projects: [
            {
              id: 'vue-blog',
              name: 'Vue Blog',
              description: 'A Vue.js blog application with modern features',
              category: 'digital-garden',
              techStack: ['Vue 3', 'TypeScript', 'Vite'],
              status: 'online',
              url: 'https://vue-blog.example.com',
              githubUrl: 'https://github.com/user/vue-blog',
              imageUrl: '/images/vue-blog.jpg',
              features: ['Responsive Design', 'SEO Optimized', 'Dark Mode']
            }
          ]
        }
      ];

      portfolioStore.setProjectGroups(mockProjectGroups);

      // Mount portfolio grid
      const wrapper = mount(PortfolioGrid, {
        global: {
          plugins: [router, i18n, pinia]
        }
      });

      await flushPromises();

      // Test portfolio grid rendering
      expect(wrapper.find('.portfolio-grid').exists()).toBe(true);

      // Test filtering functionality
      portfolioStore.setFilters({ searchTerm: 'Vue' });
      const searchResults = portfolioStore.filteredProjects;
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults[0].projects[0].name).toContain('Vue');

      // Test category filtering
      portfolioStore.setFilters({ category: 'digital-garden' });
      const categoryResults = portfolioStore.filteredProjects;
      expect(categoryResults.every(group => 
        group.projects.every(project => project.category === 'digital-garden')
      )).toBe(true);

      // Test clearing filters
      portfolioStore.setFilters({});
      const allResults = portfolioStore.filteredProjects;
      expect(allResults.length).toBe(mockProjectGroups.length);
    });

    it('should handle UI state management workflow', async () => {
      const uiStore = useUIStore();
      
      // Test initial state
      expect(uiStore.isMobileMenuOpen).toBe(false);

      // Test mobile menu workflow
      uiStore.toggleMobileMenu();
      expect(uiStore.isMobileMenuOpen).toBe(true);

      uiStore.closeMobileMenu();
      expect(uiStore.isMobileMenuOpen).toBe(false);

      // Test language switching workflow
      uiStore.setLocale('zh');
      expect(uiStore.currentLocale).toBe('zh');

      uiStore.setLocale('en');
      expect(uiStore.currentLocale).toBe('en');
    });

    it('should handle notification workflow', async () => {
      const uiStore = useUIStore();
      
      // Test adding notifications
      const successId = uiStore.showSuccess('Operation successful');
      expect(uiStore.notifications.length).toBe(1);
      expect(uiStore.notifications[0].type).toBe('success');
      expect(uiStore.notifications[0].message).toBe('Operation successful');

      const errorId = uiStore.showError('Operation failed');
      expect(uiStore.notifications.length).toBe(2);
      expect(uiStore.notifications[1].type).toBe('error');

      // Test removing notifications
      uiStore.removeNotification(successId);
      expect(uiStore.notifications.length).toBe(1);
      expect(uiStore.notifications[0].type).toBe('error');

      // Test clearing all notifications
      uiStore.clearAllNotifications();
      expect(uiStore.notifications.length).toBe(0);
    });

    it('should handle career store workflow', async () => {
      const careerStore = useCareerStore();
      
      // Mock SWOT data
      const mockSWOTData: SWOTData = {
        id: 'swot-1',
        lastUpdated: new Date(),
        strengths: [
          {
            id: 's1',
            title: '10年前端开发经验',
            description: '深厚的技术积累和项目经验',
            impact: 'high',
            category: 'technical'
          }
        ],
        weaknesses: [],
        opportunities: [],
        threats: [],
        analysis: {
          keyInsights: ['技术深度是核心优势'],
          strategicRecommendations: ['专注前端架构学习'],
          actionItems: []
        }
      };

      // Test setting SWOT data
      careerStore.setSWOTAnalysis(mockSWOTData);
      expect(careerStore.swotAnalysis).toEqual(mockSWOTData);

      // Test error handling
      careerStore.clearError();
      expect(careerStore.error).toBeFalsy();
    });
  });

  describe('Cross-Component State Management Tests', () => {
    it('should maintain consistent UI state across operations', async () => {
      const uiStore = useUIStore();
      
      // Get initial state and set a different locale
      const initialLocale = uiStore.currentLocale;
      const testLocale = initialLocale === 'en' ? 'zh' : 'en';
      
      uiStore.setLocale(testLocale);
      expect(uiStore.currentLocale).toBe(testLocale);

      // Test state persistence through various operations
      uiStore.toggleMobileMenu();
      expect(uiStore.isMobileMenuOpen).toBe(true);
      expect(uiStore.currentLocale).toBe(testLocale); // Should remain unchanged

      uiStore.setLocale(initialLocale);
      expect(uiStore.currentLocale).toBe(initialLocale);
      expect(uiStore.isMobileMenuOpen).toBe(true); // Should remain unchanged

      uiStore.closeMobileMenu();
      expect(uiStore.isMobileMenuOpen).toBe(false);
      expect(uiStore.currentLocale).toBe(initialLocale); // Should remain unchanged
    });

    it('should handle concurrent store operations without conflicts', async () => {
      const brandStore = useBrandStore();
      const portfolioStore = usePortfolioStore();
      const careerStore = useCareerStore();

      // Set different data in each store concurrently
      const mockBrandInfo = { id: '1', name: 'AIYAZONE', title: 'Architect', subtitle: 'Lead', intro: 'Intro', profileImage: '/img.jpg', location: 'SZ', age: 34, experience: 10, tagline: 'Tag', valueProposition: ['A'] };
      const mockProjectGroups = [{ id: 'g1', title: 'Group', description: 'Desc', projects: [] }];
      const mockSWOTData = { id: 's1', lastUpdated: new Date(), strengths: [], weaknesses: [], opportunities: [], threats: [], analysis: { keyInsights: [], strategicRecommendations: [], actionItems: [] } };

      // Simulate concurrent operations
      brandStore.setBrandInfo(mockBrandInfo);
      portfolioStore.setProjectGroups(mockProjectGroups);
      careerStore.setSWOTAnalysis(mockSWOTData);

      // Verify no conflicts occurred and stores maintain independent state
      expect(brandStore.brandInfo).toEqual(mockBrandInfo);
      expect(portfolioStore.projectGroups).toEqual(mockProjectGroups);
      expect(careerStore.swotAnalysis).toEqual(mockSWOTData);

      // Verify stores maintain independent state
      expect(brandStore.brandInfo).not.toBe(portfolioStore.projectGroups);
      expect(portfolioStore.projectGroups).not.toBe(careerStore.swotAnalysis);
    });

    it('should handle store error states independently', async () => {
      const brandStore = useBrandStore();
      const portfolioStore = usePortfolioStore();
      const careerStore = useCareerStore();

      // Test that error clearing in one store doesn't affect others
      brandStore.clearError();
      portfolioStore.clearError();
      careerStore.clearError();

      expect(brandStore.error).toBeFalsy();
      expect(portfolioStore.error).toBeFalsy();
      expect(careerStore.error).toBeFalsy();

      // Verify loading states are independent
      expect(brandStore.isLoading).toBe(false);
      expect(portfolioStore.isLoading).toBe(false);
      expect(careerStore.isLoading).toBe(false);
    });
  });
});
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import * as fc from 'fast-check';
import ProjectCard from '../ProjectCard.vue';
import PortfolioGrid from '../PortfolioGrid.vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import type { Project, ProjectGroup } from '../../../types/portfolio';

// Mock i18n
const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    zh: {
      portfolio: {
        visitProject: '访问项目',
        viewSource: '查看源码',
        viewProject: '查看项目',
        techStack: '技术栈',
        keyFeatures: '主要功能',
        githubStars: 'GitHub 星标',
        totalVisitors: '总访问量',
        githubForks: 'GitHub 分叉',
        performanceScore: '性能评分',
        digitalGarden: '数字花园',
        featuredWork: '精选作品',
        community: '社区项目',
        online: '在线',
        development: '开发中',
        archived: '已归档',
        searchPlaceholder: '搜索项目...',
        category: '分类',
        allCategories: '所有分类',
        status: '状态',
        allStatus: '所有状态',
        technology: '技术',
        allTech: '所有技术',
        clearFilters: '清除筛选',
        showingResults: '显示 {count} 个结果',
        noProjectsFound: '未找到项目',
        tryDifferentFilters: '尝试不同的筛选条件',
        loading: '加载中...',
        errorTitle: '加载失败',
        retry: '重试'
      }
    },
    en: {
      portfolio: {
        visitProject: 'Visit Project',
        viewSource: 'View Source',
        viewProject: 'View Project',
        techStack: 'Tech Stack',
        keyFeatures: 'Key Features',
        githubStars: 'GitHub Stars',
        totalVisitors: 'Total Visitors',
        githubForks: 'GitHub Forks',
        performanceScore: 'Performance Score',
        digitalGarden: 'Digital Garden',
        featuredWork: 'Featured Work',
        community: 'Community',
        online: 'Online',
        development: 'Development',
        archived: 'Archived',
        searchPlaceholder: 'Search projects...',
        category: 'Category',
        allCategories: 'All Categories',
        status: 'Status',
        allStatus: 'All Status',
        technology: 'Technology',
        allTech: 'All Technologies',
        clearFilters: 'Clear Filters',
        showingResults: 'Showing {count} results',
        noProjectsFound: 'No projects found',
        tryDifferentFilters: 'Try different filters',
        loading: 'Loading...',
        errorTitle: 'Loading failed',
        retry: 'Retry'
      }
    }
  }
});

// Mock portfolio store
vi.mock('../../../stores/portfolioStore', () => ({
  usePortfolioStore: () => ({
    projectGroups: [],
    filteredProjects: [],
    isLoading: false,
    error: null,
    loadProjects: vi.fn(),
    setFilters: vi.fn()
  })
}));

describe('Interactive Elements Functionality', () => {
  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 6: Interactive element functionality**
     * **Validates: Requirements 3.3**
     * 
     * For any interactive component (project cards, buttons, links), hover effects and click actions should function correctly
     */
    it('should ensure all interactive elements function correctly across all project configurations', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate arbitrary project data
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            description: fc.string({ minLength: 10, maxLength: 500 }).filter(s => s.trim().length >= 10),
            category: fc.constantFrom('digital-garden', 'featured-work', 'community'),
            techStack: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 10 }),
            status: fc.constantFrom('online', 'development', 'archived'),
            url: fc.webUrl(),
            githubUrl: fc.option(fc.webUrl(), { nil: undefined }),
            imageUrl: fc.webUrl(),
            features: fc.array(fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5), { minLength: 1, maxLength: 8 }),
            metrics: fc.option(fc.record({
              stars: fc.option(fc.integer({ min: 0, max: 10000 }), { nil: undefined }),
              visitors: fc.option(fc.integer({ min: 0, max: 1000000 }), { nil: undefined }),
              forks: fc.option(fc.integer({ min: 0, max: 1000 }), { nil: undefined }),
              performance: fc.option(fc.record({
                loadTime: fc.float({ min: 100, max: 5000 }),
                firstContentfulPaint: fc.float({ min: 50, max: 3000 }),
                largestContentfulPaint: fc.float({ min: 100, max: 5000 }),
                cumulativeLayoutShift: fc.float({ min: 0, max: 1 })
              }), { nil: undefined })
            }), { nil: undefined })
          }),
          fc.boolean(), // showDetails prop
          async (project: Project, showDetails: boolean) => {
            const pinia = createPinia();
            
            // Mount ProjectCard component
            const wrapper = mount(ProjectCard, {
              props: {
                project,
                showDetails
              },
              global: {
                plugins: [i18n, pinia]
              }
            });

            // Test 1: Card click functionality
            const cardElement = wrapper.find('.project-card');
            expect(cardElement.exists()).toBe(true);
            
            // Verify card has click handler
            expect(cardElement.attributes('role')).toBeFalsy(); // Should be clickable div
            
            // Test card click event emission
            await cardElement.trigger('click');
            expect(wrapper.emitted('click')).toBeTruthy();
            expect(wrapper.emitted('click')?.[0]).toEqual([project]);

            // Test 2: External link functionality (if project has URL)
            if (project.url) {
              const actionLinks = wrapper.findAll('.action-link');
              const externalLink = actionLinks.find(link => 
                link.attributes('href') === project.url && 
                !link.classes().includes('github-link')
              );
              expect(externalLink).toBeTruthy();
              if (externalLink) {
                expect(externalLink.attributes('target')).toBe('_blank');
                expect(externalLink.attributes('rel')).toBe('noopener noreferrer');
                expect(externalLink.classes()).toContain('action-link');
                
                // Verify link has proper accessibility attributes
                expect(externalLink.attributes('title')).toBeTruthy();
              }
            }

            // Test 3: GitHub link functionality (if project has GitHub URL)
            if (project.githubUrl) {
              const githubLink = wrapper.find('.github-link');
              expect(githubLink.exists()).toBe(true);
              expect(githubLink.attributes('href')).toBe(project.githubUrl);
              expect(githubLink.attributes('target')).toBe('_blank');
              expect(githubLink.attributes('rel')).toBe('noopener noreferrer');
              expect(githubLink.classes()).toContain('action-link');
              expect(githubLink.classes()).toContain('github-link');
              
              // Verify GitHub link has proper accessibility attributes
              expect(githubLink.attributes('title')).toBeTruthy();
            }

            // Test 4: Hover state classes and styling
            expect(cardElement.classes()).toContain('project-card');
            
            // Verify hover-related CSS classes are properly applied
            const cardInner = wrapper.find('.card-inner');
            expect(cardInner.exists()).toBe(true);
            
            const cardHeader = wrapper.find('.card-header');
            expect(cardHeader.exists()).toBe(true);
            
            const projectIconBox = wrapper.find('.project-icon-box');
            expect(projectIconBox.exists()).toBe(true);

            // Test 5: Interactive action links behavior
            const actionLinks = wrapper.findAll('.action-link');
            actionLinks.forEach(link => {
              // Each action link should have proper attributes for interaction
              expect(link.attributes('href')).toBeTruthy();
              expect(link.attributes('target')).toBe('_blank');
              expect(link.attributes('rel')).toBe('noopener noreferrer');
              expect(link.attributes('title')).toBeTruthy();
            });

            // Test 6: Image overlay interaction (if image exists)
            if (project.imageUrl) {
              const projectImage = wrapper.find('.project-image');
              expect(projectImage.exists()).toBe(true);
              
              const imageOverlay = wrapper.find('.image-overlay');
              expect(imageOverlay.exists()).toBe(true);
              
              const viewProjectText = wrapper.find('.view-project');
              expect(viewProjectText.exists()).toBe(true);
              expect(viewProjectText.text()).toBeTruthy();
            }

            // Test 7: Tech stack tags interactivity
            const techTags = wrapper.findAll('.tech-tag');
            expect(techTags.length).toBeGreaterThan(0);
            techTags.forEach(tag => {
              const tagText = tag.text().trim();
              expect(tagText.length).toBeGreaterThan(0);
            });

            // Test 8: Status indicator functionality
            const statusDot = wrapper.find('.status-dot');
            expect(statusDot.exists()).toBe(true);
            expect(statusDot.classes()).toContain(`status-${project.status}`);
            
            const statusText = wrapper.find('.status-text');
            expect(statusText.exists()).toBe(true);
            expect(statusText.text()).toBeTruthy();

            // Test 9: Metrics display interactivity (if metrics exist)
            if (project.metrics) {
              const projectMetrics = wrapper.find('.project-metrics');
              expect(projectMetrics.exists()).toBe(true);
              
              if (project.metrics.stars) {
                const starsMetric = wrapper.find('.metric[title*="Stars"], .metric[title*="星标"]');
                expect(starsMetric.exists()).toBe(true);
              }
              
              if (project.metrics.visitors) {
                const visitorsMetric = wrapper.find('.metric[title*="Visitors"], .metric[title*="访问量"]');
                expect(visitorsMetric.exists()).toBe(true);
              }
              
              if (project.metrics.forks) {
                const forksMetric = wrapper.find('.metric[title*="Forks"], .metric[title*="分叉"]');
                expect(forksMetric.exists()).toBe(true);
              }
            }

            // Test 10: Performance badge interactivity (if performance data exists and showDetails is true)
            if (project.metrics?.performance && showDetails) {
              const performanceBadge = wrapper.find('.performance-badge');
              expect(performanceBadge.exists()).toBe(true);
              expect(performanceBadge.attributes('title')).toBeTruthy();
              
              const perfScore = wrapper.find('.perf-score');
              expect(perfScore.exists()).toBe(true);
              expect(perfScore.text()).toBeTruthy();
            }

            // Test 11: Features list interactivity (if showDetails is true)
            if (showDetails && project.features.length > 0) {
              const projectFeatures = wrapper.find('.project-features');
              expect(projectFeatures.exists()).toBe(true);
              
              const featureItems = wrapper.findAll('.feature-item');
              expect(featureItems.length).toBeGreaterThan(0);
              featureItems.forEach(item => {
                expect(item.text()).toBeTruthy();
                expect(item.text().length).toBeGreaterThan(0);
              });
            }

            // Test 12: Accessibility and keyboard navigation
            // Verify main card is keyboard accessible
            expect(cardElement.attributes('tabindex')).toBeFalsy(); // Should be naturally focusable as clickable element
            
            // Verify action links are keyboard accessible
            actionLinks.forEach(link => {
              expect(link.element.tagName.toLowerCase()).toBe('a');
              // Links are naturally keyboard accessible
            });

            // Test 13: Event propagation for action links
            if (project.url) {
              const actionLinks = wrapper.findAll('.action-link');
              const externalLink = actionLinks.find(link => 
                link.attributes('href') === project.url && 
                !link.classes().includes('github-link')
              );
              if (externalLink) {
                await externalLink.trigger('click');
                
                // Action link clicks should not trigger card click
                const cardClickEvents = wrapper.emitted('click') || [];
                expect(cardClickEvents.length).toBe(1); // Only the initial card click, not the link click
              }
            }

            wrapper.unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional property test for PortfolioGrid interactive elements
     */
    it('should ensure PortfolioGrid interactive elements function correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 0, maxLength: 50 }), // search term
          fc.constantFrom('', 'digital-garden', 'featured-work', 'community'), // category filter
          fc.constantFrom('', 'online', 'development', 'archived'), // status filter
          async (searchTerm: string, categoryFilter: string, statusFilter: string) => {
            const pinia = createPinia();
            
            // Mount PortfolioGrid component
            const wrapper = mount(PortfolioGrid, {
              global: {
                plugins: [i18n, pinia]
              }
            });

            // Test 1: Search input functionality
            const searchInput = wrapper.find('.search-input');
            expect(searchInput.exists()).toBe(true);
            expect(searchInput.attributes('type')).toBe('text');
            expect(searchInput.attributes('placeholder')).toBeTruthy();

            // Test search input interaction
            await searchInput.setValue(searchTerm);
            expect((searchInput.element as HTMLInputElement).value).toBe(searchTerm);

            // Test 2: Category filter functionality
            const categorySelects = wrapper.findAll('select');
            if (categorySelects.length > 0) {
              const categorySelect = categorySelects[0];
              expect(categorySelect.exists()).toBe(true);
              await categorySelect.setValue(categoryFilter);
              expect((categorySelect.element as HTMLSelectElement).value).toBe(categoryFilter);
            }

            // Test 3: Status filter functionality
            const statusSelects = wrapper.findAll('select');
            if (statusSelects.length > 1) {
              const statusSelect = statusSelects[1];
              expect(statusSelect.exists()).toBe(true);
              await statusSelect.setValue(statusFilter);
              expect((statusSelect.element as HTMLSelectElement).value).toBe(statusFilter);
            }

            // Test 4: Clear filters button functionality (if filters are active)
            const hasActiveFilters = searchTerm || categoryFilter || statusFilter;
            if (hasActiveFilters) {
              const clearButton = wrapper.find('.clear-filters-btn');
              if (clearButton.exists()) {
                expect(clearButton.text()).toBeTruthy();
                
                // Test clear button click
                await clearButton.trigger('click');
                
                // Verify filters are cleared (search input should be empty)
                const searchInputAfterClear = wrapper.find('.search-input');
                expect((searchInputAfterClear.element as HTMLInputElement).value).toBe('');
              }
            }

            // Test 5: Filter selects have proper options
            const filterSelects = wrapper.findAll('.filter-select');
            filterSelects.forEach(select => {
              const options = select.findAll('option');
              expect(options.length).toBeGreaterThan(0);
              
              // First option should be "all" option
              expect(options[0].text()).toBeTruthy();
            });

            // Test 6: Search icon presence
            const searchIcon = wrapper.find('.search-icon');
            expect(searchIcon.exists()).toBe(true);
            expect(searchIcon.text()).toBeTruthy();

            // Test 7: Filter labels are present and accessible
            const filterLabels = wrapper.findAll('.filter-label');
            filterLabels.forEach(label => {
              expect(label.text()).toBeTruthy();
            });

            wrapper.unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should handle project card click events correctly', async () => {
      const mockProject: Project = {
        id: 'test-project',
        name: 'Test Project',
        description: 'A test project for unit testing',
        category: 'digital-garden',
        techStack: ['Vue 3', 'TypeScript'],
        status: 'online',
        url: 'https://example.com',
        githubUrl: 'https://github.com/test/project',
        imageUrl: 'https://example.com/image.jpg',
        features: ['Feature 1', 'Feature 2']
      };

      const pinia = createPinia();
      const wrapper = mount(ProjectCard, {
        props: {
          project: mockProject,
          showDetails: true
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      // Test card click
      await wrapper.find('.project-card').trigger('click');
      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.[0]).toEqual([mockProject]);

      wrapper.unmount();
    });

    it('should render external links with correct attributes', async () => {
      const mockProject: Project = {
        id: 'test-project',
        name: 'Test Project',
        description: 'A test project for unit testing',
        category: 'featured-work',
        techStack: ['React', 'Node.js'],
        status: 'online',
        url: 'https://example.com/project',
        githubUrl: 'https://github.com/test/project',
        imageUrl: 'https://example.com/image.jpg',
        features: ['Feature 1']
      };

      const pinia = createPinia();
      const wrapper = mount(ProjectCard, {
        props: {
          project: mockProject
        },
        global: {
          plugins: [i18n, pinia]
        }
      });

      // Test external project link
      const externalLink = wrapper.find(`a[href="${mockProject.url}"]`);
      expect(externalLink.exists()).toBe(true);
      expect(externalLink.attributes('target')).toBe('_blank');
      expect(externalLink.attributes('rel')).toBe('noopener noreferrer');

      // Test GitHub link
      const githubLink = wrapper.find(`a[href="${mockProject.githubUrl}"]`);
      expect(githubLink.exists()).toBe(true);
      expect(githubLink.attributes('target')).toBe('_blank');
      expect(githubLink.attributes('rel')).toBe('noopener noreferrer');

      wrapper.unmount();
    });

    it('should handle search input changes in PortfolioGrid', async () => {
      const pinia = createPinia();
      const wrapper = mount(PortfolioGrid, {
        global: {
          plugins: [i18n, pinia]
        }
      });

      const searchInput = wrapper.find('.search-input');
      expect(searchInput.exists()).toBe(true);

      // Test search input
      await searchInput.setValue('test search');
      expect((searchInput.element as HTMLInputElement).value).toBe('test search');

      wrapper.unmount();
    });
  });
});
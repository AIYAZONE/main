import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useBrandStore } from '../brandStore';
import { usePortfolioStore } from '../portfolioStore';
import { useCareerStore } from '../careerStore';
import { useUIStore } from '../uiStore';
import { useSocialStore } from '../socialStore';
import { useSkillStore } from '../skillStore';

// Mock services
vi.mock('../../services/brandService', () => ({
  brandService: {
    getBrandInfo: vi.fn().mockResolvedValue({
      id: '1',
      name: 'AIYAZONE',
      title: 'Frontend Architect',
      subtitle: 'Tech Lead & Project Manager',
      intro: 'Professional frontend developer',
      profileImage: '/images/profile.jpg',
      location: 'Shenzhen',
      age: 34,
      experience: 10,
      tagline: 'Building the future',
      valueProposition: ['Architecture', 'Performance', 'Leadership']
    }),
    getCertifications: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'PMP',
        issuer: 'PMI',
        issueDate: new Date('2023-01-01'),
        credentialId: 'PMP123456',
        imageUrl: '/images/pmp.jpg',
        verificationUrl: 'https://pmi.org/verify'
      }
    ])
  }
}));

vi.mock('../../services/portfolioService', () => ({
  portfolioService: {
    getProjects: vi.fn().mockResolvedValue([
      {
        id: 'digital-garden',
        title: 'Digital Garden',
        description: 'Personal knowledge base',
        projects: [
          {
            id: '1',
            name: 'Blog',
            description: 'Technical blog',
            category: 'digital-garden',
            techStack: ['Vue 3', 'TypeScript'],
            status: 'online',
            url: 'https://blog.example.com',
            imageUrl: '/images/blog.jpg',
            features: ['Responsive', 'SEO']
          }
        ]
      }
    ]),
    filterProjects: vi.fn().mockResolvedValue([]),
    syncExternalProjects: vi.fn().mockResolvedValue(undefined),
    getProjectsByCategory: vi.fn().mockReturnValue([]),
    getProjectStatistics: vi.fn().mockReturnValue({
      totalProjects: 5,
      onlineProjects: 3,
      developmentProjects: 2,
      totalStars: 100,
      totalVisitors: 1000,
      topTechnologies: [{ name: 'Vue.js', count: 3 }]
    }),
    getFeaturedProjects: vi.fn().mockReturnValue([]),
    getProjectById: vi.fn().mockReturnValue(null),
    getRelatedProjects: vi.fn().mockReturnValue([])
  }
}));

vi.mock('../../i18n', () => ({
  switchLanguage: vi.fn(),
  getCurrentLocale: vi.fn().mockReturnValue('en')
}));

describe('Stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('BrandStore', () => {
    it('initializes with correct default state', () => {
      const store = useBrandStore();
      
      expect(store.brandInfo).toBeNull();
      expect(store.certifications).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('loads brand info successfully', async () => {
      const store = useBrandStore();
      
      await store.loadBrandInfo();
      
      expect(store.brandInfo).toBeDefined();
      expect(store.brandInfo?.name).toBe('AIYAZONE');
      expect(store.certifications).toHaveLength(1);
      expect(store.certifications[0].name).toBe('PMP');
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('handles loading errors correctly', async () => {
      const store = useBrandStore();
      const mockError = new Error('Network error');
      
      // Mock service to throw error
      const { brandService } = await import('../../services/brandService');
      vi.mocked(brandService.getBrandInfo).mockRejectedValueOnce(mockError);
      
      await store.loadBrandInfo();
      
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Network error');
      expect(store.brandInfo).toBeNull();
    });

    it('sets brand info correctly', () => {
      const store = useBrandStore();
      const mockBrandInfo = {
        id: '1',
        name: 'Test',
        title: 'Developer',
        subtitle: 'Subtitle',
        intro: 'Intro',
        profileImage: '/test.jpg',
        location: 'Test City',
        age: 30,
        experience: 5,
        tagline: 'Test tagline',
        valueProposition: ['Test']
      };
      
      store.setBrandInfo(mockBrandInfo);
      
      expect(store.brandInfo).toEqual(mockBrandInfo);
    });

    it('clears errors correctly', () => {
      const store = useBrandStore();
      
      // Set an error first
      store.setLoading(false, 'Test error');
      expect(store.error).toBe('Test error');
      
      // Clear the error
      store.clearError();
      expect(store.error).toBeUndefined();
    });
  });

  describe('PortfolioStore', () => {
    it('initializes with correct default state', () => {
      const store = usePortfolioStore();
      
      expect(store.projectGroups).toEqual([]);
      expect(store.activeFilters).toEqual({});
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('loads projects successfully', async () => {
      const store = usePortfolioStore();
      
      await store.loadProjects();
      
      expect(store.projectGroups).toHaveLength(1);
      expect(store.projectGroups[0].id).toBe('digital-garden');
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('filters projects correctly', async () => {
      const store = usePortfolioStore();
      const criteria = { category: 'digital-garden' };
      
      const result = await store.filterProjects(criteria);
      
      expect(store.activeFilters).toEqual(criteria);
      expect(result).toEqual([]);
    });

    it('computes filtered projects correctly', async () => {
      const store = usePortfolioStore();
      
      // Load projects first
      await store.loadProjects();
      
      // Set filters
      store.setFilters({ category: 'digital-garden' });
      
      // Check filtered projects
      const filtered = store.filteredProjects;
      expect(filtered).toBeDefined();
    });

    it('computes all projects correctly', async () => {
      const store = usePortfolioStore();
      
      await store.loadProjects();
      
      const allProjects = store.allProjects;
      expect(allProjects).toHaveLength(1);
      expect(allProjects[0].name).toBe('Blog');
    });

    it('gets project statistics correctly', async () => {
      const store = usePortfolioStore();
      
      await store.loadProjects();
      
      const stats = store.projectStatistics;
      expect(stats).toBeDefined();
      expect(stats?.totalProjects).toBe(5);
      expect(stats?.topTechnologies).toHaveLength(1);
    });
  });

  describe('CareerStore', () => {
    it('initializes with correct default state', () => {
      const store = useCareerStore();
      
      expect(store.swotAnalysis).toBeNull();
      expect(store.roadmapData).toBeNull();
      expect(store.learningPath).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('loads career data successfully', async () => {
      const store = useCareerStore();
      
      await store.loadCareerData();
      
      expect(store.swotAnalysis).toBeDefined();
      expect(store.roadmapData).toBeDefined();
      expect(store.learningPath).toBeDefined();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('sets SWOT analysis correctly', () => {
      const store = useCareerStore();
      const mockSWOT = {
        id: '1',
        lastUpdated: new Date(),
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        analysis: {
          keyInsights: [],
          strategicRecommendations: [],
          actionItems: []
        }
      };
      
      store.setSWOTAnalysis(mockSWOT);
      
      expect(store.swotAnalysis).toEqual(mockSWOT);
    });

    it('sets roadmap data correctly', () => {
      const store = useCareerStore();
      const mockRoadmap = {
        id: '1',
        title: 'Test Roadmap',
        description: 'Test Description',
        phases: [],
        currentPhase: 0,
        targetRole: 'Architect',
        targetSalaryRange: '40-60K'
      };
      
      store.setRoadmapData(mockRoadmap);
      
      expect(store.roadmapData).toEqual(mockRoadmap);
    });
  });

  describe('UIStore', () => {
    it('initializes with correct default state', () => {
      const store = useUIStore();
      
      expect(store.currentLocale).toBe('en');
      expect(store.isMobileMenuOpen).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.notifications).toEqual([]);
    });

    it('sets locale correctly', () => {
      const store = useUIStore();
      
      store.setLocale('zh');
      
      expect(store.currentLocale).toBe('zh');
    });

    it('toggles mobile menu correctly', () => {
      const store = useUIStore();
      
      expect(store.isMobileMenuOpen).toBe(false);
      
      store.toggleMobileMenu();
      expect(store.isMobileMenuOpen).toBe(true);
      
      store.toggleMobileMenu();
      expect(store.isMobileMenuOpen).toBe(false);
    });

    it('closes mobile menu correctly', () => {
      const store = useUIStore();
      
      store.toggleMobileMenu(); // Open first
      expect(store.isMobileMenuOpen).toBe(true);
      
      store.closeMobileMenu();
      expect(store.isMobileMenuOpen).toBe(false);
    });

    it('manages global loading state correctly', () => {
      const store = useUIStore();
      
      store.setGlobalLoading(true);
      expect(store.isLoading).toBe(true);
      
      store.setGlobalLoading(false);
      expect(store.isLoading).toBe(false);
    });

    it('adds notifications correctly', () => {
      const store = useUIStore();
      
      const id = store.addNotification('success', 'Test message', 0);
      
      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].type).toBe('success');
      expect(store.notifications[0].message).toBe('Test message');
      expect(store.notifications[0].id).toBe(id);
    });

    it('removes notifications correctly', () => {
      const store = useUIStore();
      
      const id = store.addNotification('info', 'Test message', 0);
      expect(store.notifications).toHaveLength(1);
      
      store.removeNotification(id);
      expect(store.notifications).toHaveLength(0);
    });

    it('provides convenience methods for different notification types', () => {
      const store = useUIStore();
      
      store.showSuccess('Success message', 0);
      store.showError('Error message', 0);
      store.showWarning('Warning message', 0);
      store.showInfo('Info message', 0);
      
      expect(store.notifications).toHaveLength(4);
      expect(store.notifications[0].type).toBe('success');
      expect(store.notifications[1].type).toBe('error');
      expect(store.notifications[2].type).toBe('warning');
      expect(store.notifications[3].type).toBe('info');
    });

    it('clears all notifications correctly', () => {
      const store = useUIStore();
      
      store.showSuccess('Message 1', 0);
      store.showError('Message 2', 0);
      expect(store.notifications).toHaveLength(2);
      
      store.clearAllNotifications();
      expect(store.notifications).toHaveLength(0);
    });
  });

  describe('SocialStore', () => {
    it('initializes with correct default state', () => {
      const store = useSocialStore();
      
      expect(store.socialLinks).toEqual([]);
      expect(store.blogPosts).toEqual([]);
      expect(store.githubActivity).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('loads social data successfully', async () => {
      const store = useSocialStore();
      
      await store.loadSocialData();
      
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('syncs external content correctly', async () => {
      const store = useSocialStore();
      
      await store.syncExternalContent();
      
      expect(store.isLoading).toBe(false);
    });
  });

  describe('SkillStore', () => {
    it('initializes with correct default state', () => {
      const store = useSkillStore();
      
      expect(store.skillCategories).toEqual([]);
      expect(store.experienceItems).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('loads skill data successfully', async () => {
      const store = useSkillStore();
      
      await store.loadSkillData();
      
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('filters skills by category correctly', () => {
      const store = useSkillStore();
      
      const frontendSkills = store.getSkillsByCategory('frontend');
      expect(frontendSkills).toEqual([]);
    });
  });
});
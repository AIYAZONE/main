import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { portfolioService } from '../portfolioService';

describe('PortfolioService', () => {
  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 5: Portfolio categorization consistency**
     * **Validates: Requirements 3.1**
     * 
     * For any project dataset, when displaying portfolio, projects should be correctly grouped 
     * into digital garden, featured works, and community categories
     */
    it('should always return projects correctly categorized into the three required groups', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const projectGroups = await portfolioService.getProjects();
          
          // Verify we have exactly the three required project groups
          expect(projectGroups).toBeDefined();
          expect(Array.isArray(projectGroups)).toBe(true);
          expect(projectGroups.length).toBe(3);
          
          // Verify all three required group types are present
          const groupIds = projectGroups.map(group => group.id);
          expect(groupIds).toContain('digital-garden');
          expect(groupIds).toContain('featured-work');
          expect(groupIds).toContain('community');
          
          // Verify each group has the correct structure and non-empty projects
          projectGroups.forEach(group => {
            expect(group.id).toBeDefined();
            expect(typeof group.id).toBe('string');
            expect(group.id.length).toBeGreaterThan(0);
            expect(['digital-garden', 'featured-work', 'community']).toContain(group.id);
            
            expect(group.title).toBeDefined();
            expect(typeof group.title).toBe('string');
            expect(group.title.length).toBeGreaterThan(0);
            
            expect(group.description).toBeDefined();
            expect(typeof group.description).toBe('string');
            expect(group.description.length).toBeGreaterThan(0);
            
            expect(group.projects).toBeDefined();
            expect(Array.isArray(group.projects)).toBe(true);
            expect(group.projects.length).toBeGreaterThan(0);
            
            // Verify each project in the group has proper structure and matches group category
            group.projects.forEach(project => {
              expect(project.id).toBeDefined();
              expect(typeof project.id).toBe('string');
              expect(project.id.length).toBeGreaterThan(0);
              
              expect(project.name).toBeDefined();
              expect(typeof project.name).toBe('string');
              expect(project.name.length).toBeGreaterThan(0);
              
              expect(project.description).toBeDefined();
              expect(typeof project.description).toBe('string');
              expect(project.description.length).toBeGreaterThan(0);
              
              expect(project.category).toBeDefined();
              expect(['digital-garden', 'featured-work', 'community']).toContain(project.category);
              
              // Verify project category matches its group
              if (group.id === 'digital-garden') {
                expect(project.category).toBe('digital-garden');
              } else if (group.id === 'featured-work') {
                expect(project.category).toBe('featured-work');
              } else if (group.id === 'community') {
                expect(project.category).toBe('community');
              }
              
              expect(project.techStack).toBeDefined();
              expect(Array.isArray(project.techStack)).toBe(true);
              expect(project.techStack.length).toBeGreaterThan(0);
              
              expect(project.status).toBeDefined();
              expect(['online', 'development', 'archived']).toContain(project.status);
              
              expect(project.url).toBeDefined();
              expect(typeof project.url).toBe('string');
              expect(project.url.length).toBeGreaterThan(0);
              
              expect(project.imageUrl).toBeDefined();
              expect(typeof project.imageUrl).toBe('string');
              expect(project.imageUrl.length).toBeGreaterThan(0);
              
              expect(project.features).toBeDefined();
              expect(Array.isArray(project.features)).toBe(true);
              expect(project.features.length).toBeGreaterThan(0);
            });
          });
          
          // Verify categorization logic works correctly
          const categorizedProjects = portfolioService.categorizeProjectsForDisplay(projectGroups);
          expect(categorizedProjects.digitalGarden).toBeDefined();
          expect(categorizedProjects.featuredWork).toBeDefined();
          expect(categorizedProjects.community).toBeDefined();
          
          expect(categorizedProjects.digitalGarden.id).toBe('digital-garden');
          expect(categorizedProjects.featuredWork.id).toBe('featured-work');
          expect(categorizedProjects.community.id).toBe('community');
          
          // Verify projects by category helper method
          const digitalGardenProjects = portfolioService.getProjectsByCategory(projectGroups, 'digital-garden');
          const featuredWorkProjects = portfolioService.getProjectsByCategory(projectGroups, 'featured-work');
          const communityProjects = portfolioService.getProjectsByCategory(projectGroups, 'community');
          
          expect(digitalGardenProjects.length).toBeGreaterThan(0);
          expect(featuredWorkProjects.length).toBeGreaterThan(0);
          expect(communityProjects.length).toBeGreaterThan(0);
          
          digitalGardenProjects.forEach(project => {
            expect(project.category).toBe('digital-garden');
          });
          
          featuredWorkProjects.forEach(project => {
            expect(project.category).toBe('featured-work');
          });
          
          communityProjects.forEach(project => {
            expect(project.category).toBe('community');
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should return project groups with expected structure', async () => {
      const projectGroups = await portfolioService.getProjects();
      
      expect(projectGroups).toBeInstanceOf(Array);
      expect(projectGroups.length).toBe(3);
      
      // Verify we have the three required categories
      const groupIds = projectGroups.map(group => group.id);
      expect(groupIds).toContain('digital-garden');
      expect(groupIds).toContain('featured-work');
      expect(groupIds).toContain('community');
      
      projectGroups.forEach(group => {
        expect(group).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
          projects: expect.any(Array)
        });
        
        expect(group.projects.length).toBeGreaterThan(0);
        
        group.projects.forEach(project => {
          expect(project).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            category: expect.stringMatching(/^(digital-garden|featured-work|community)$/),
            techStack: expect.any(Array),
            status: expect.stringMatching(/^(online|development|archived)$/),
            url: expect.any(String),
            imageUrl: expect.any(String),
            features: expect.any(Array)
          });
          
          expect(project.techStack.length).toBeGreaterThan(0);
          expect(project.features.length).toBeGreaterThan(0);
        });
      });
    });

    it('should categorize projects correctly', async () => {
      const projectGroups = await portfolioService.getProjects();
      const categorized = portfolioService.categorizeProjectsForDisplay(projectGroups);
      
      expect(categorized).toMatchObject({
        digitalGarden: expect.objectContaining({
          id: 'digital-garden',
          projects: expect.any(Array)
        }),
        featuredWork: expect.objectContaining({
          id: 'featured-work',
          projects: expect.any(Array)
        }),
        community: expect.objectContaining({
          id: 'community',
          projects: expect.any(Array)
        })
      });
    });

    it('should return projects by category', async () => {
      const projectGroups = await portfolioService.getProjects();
      
      const digitalGardenProjects = portfolioService.getProjectsByCategory(projectGroups, 'digital-garden');
      const featuredWorkProjects = portfolioService.getProjectsByCategory(projectGroups, 'featured-work');
      const communityProjects = portfolioService.getProjectsByCategory(projectGroups, 'community');
      
      expect(digitalGardenProjects.length).toBeGreaterThan(0);
      expect(featuredWorkProjects.length).toBeGreaterThan(0);
      expect(communityProjects.length).toBeGreaterThan(0);
      
      digitalGardenProjects.forEach(project => {
        expect(project.category).toBe('digital-garden');
      });
      
      featuredWorkProjects.forEach(project => {
        expect(project.category).toBe('featured-work');
      });
      
      communityProjects.forEach(project => {
        expect(project.category).toBe('community');
      });
    });

    it('should return project statistics', async () => {
      const projectGroups = await portfolioService.getProjects();
      const stats = portfolioService.getProjectStatistics(projectGroups);
      
      expect(stats).toMatchObject({
        totalProjects: expect.any(Number),
        onlineProjects: expect.any(Number),
        developmentProjects: expect.any(Number),
        totalStars: expect.any(Number),
        totalVisitors: expect.any(Number),
        topTechnologies: expect.any(Array)
      });
      
      expect(stats.totalProjects).toBeGreaterThan(0);
      expect(stats.topTechnologies.length).toBeGreaterThan(0);
      
      stats.topTechnologies.forEach(tech => {
        expect(tech).toMatchObject({
          name: expect.any(String),
          count: expect.any(Number)
        });
        expect(tech.count).toBeGreaterThan(0);
      });
    });

    it('should filter projects correctly', async () => {
      const filteredByCategory = await portfolioService.filterProjects({ 
        category: 'digital-garden' 
      });
      
      expect(filteredByCategory.length).toBeGreaterThan(0);
      filteredByCategory.forEach(project => {
        expect(project.category).toBe('digital-garden');
      });
      
      const filteredByStatus = await portfolioService.filterProjects({ 
        status: 'online' 
      });
      
      expect(filteredByStatus.length).toBeGreaterThan(0);
      filteredByStatus.forEach(project => {
        expect(project.status).toBe('online');
      });
      
      const filteredByTech = await portfolioService.filterProjects({ 
        techStack: ['Vue 3'] 
      });
      
      expect(filteredByTech.length).toBeGreaterThan(0);
      filteredByTech.forEach(project => {
        expect(project.techStack).toContain('Vue 3');
      });
    });
  });
});
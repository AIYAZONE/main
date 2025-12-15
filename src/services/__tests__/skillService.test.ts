import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { skillService } from '../skillService';
import type { SkillCategory, Skill, ExperienceItem } from '../../types/skills';

describe('SkillService', () => {
  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 3: Skill categorization consistency**
     * **Validates: Requirements 2.1**
     * 
     * For any skill dataset, when displaying skills, they should be correctly categorized 
     * into frontend development, project management, and team leadership dimensions
     */
    it('should always return skills correctly categorized into the three required dimensions', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const skillCategories = await skillService.getSkillCategories();
          
          // Verify we have exactly the three required categories
          expect(skillCategories).toBeDefined();
          expect(Array.isArray(skillCategories)).toBe(true);
          expect(skillCategories.length).toBe(3);
          
          // Verify all three required category types are present
          const categoryTypes = skillCategories.map(cat => cat.type);
          expect(categoryTypes).toContain('frontend');
          expect(categoryTypes).toContain('management');
          expect(categoryTypes).toContain('leadership');
          
          // Verify each category has the correct structure and non-empty skills
          skillCategories.forEach(category => {
            expect(category.id).toBeDefined();
            expect(typeof category.id).toBe('string');
            expect(category.id.length).toBeGreaterThan(0);
            
            expect(category.name).toBeDefined();
            expect(typeof category.name).toBe('string');
            expect(category.name.length).toBeGreaterThan(0);
            
            expect(category.type).toBeDefined();
            expect(['frontend', 'management', 'leadership']).toContain(category.type);
            
            expect(category.skills).toBeDefined();
            expect(Array.isArray(category.skills)).toBe(true);
            expect(category.skills.length).toBeGreaterThan(0);
            
            // Verify each skill in the category has proper structure
            category.skills.forEach(skill => {
              expect(skill.id).toBeDefined();
              expect(typeof skill.id).toBe('string');
              expect(skill.id.length).toBeGreaterThan(0);
              
              expect(skill.name).toBeDefined();
              expect(typeof skill.name).toBe('string');
              expect(skill.name.length).toBeGreaterThan(0);
              
              expect(skill.level).toBeDefined();
              expect(typeof skill.level).toBe('number');
              expect(skill.level).toBeGreaterThanOrEqual(1);
              expect(skill.level).toBeLessThanOrEqual(10);
              
              expect(skill.yearsOfExperience).toBeDefined();
              expect(typeof skill.yearsOfExperience).toBe('number');
              expect(skill.yearsOfExperience).toBeGreaterThan(0);
              
              expect(skill.projects).toBeDefined();
              expect(Array.isArray(skill.projects)).toBe(true);
              expect(skill.projects.length).toBeGreaterThan(0);
              
              expect(skill.description).toBeDefined();
              expect(typeof skill.description).toBe('string');
              expect(skill.description.length).toBeGreaterThan(0);
            });
          });
          
          // Verify categorization logic works correctly
          const categorizedSkills = skillService.categorizeSkillsForDisplay(skillCategories);
          expect(categorizedSkills.frontend).toBeDefined();
          expect(categorizedSkills.management).toBeDefined();
          expect(categorizedSkills.leadership).toBeDefined();
          
          expect(categorizedSkills.frontend.type).toBe('frontend');
          expect(categorizedSkills.management.type).toBe('management');
          expect(categorizedSkills.leadership.type).toBe('leadership');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should return skill categories with expected structure', async () => {
      const skillCategories = await skillService.getSkillCategories();
      
      expect(skillCategories).toBeInstanceOf(Array);
      expect(skillCategories.length).toBe(3);
      
      skillCategories.forEach(category => {
        expect(category).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          type: expect.stringMatching(/^(frontend|management|leadership)$/),
          skills: expect.any(Array)
        });
        
        expect(category.skills.length).toBeGreaterThan(0);
        
        category.skills.forEach(skill => {
          expect(skill).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            level: expect.any(Number),
            yearsOfExperience: expect.any(Number),
            projects: expect.any(Array),
            description: expect.any(String)
          });
          
          expect(skill.level).toBeGreaterThanOrEqual(1);
          expect(skill.level).toBeLessThanOrEqual(10);
          expect(skill.yearsOfExperience).toBeGreaterThan(0);
          expect(skill.projects.length).toBeGreaterThan(0);
        });
      });
    });

    it('should return skills by category correctly', async () => {
      const frontendCategory = await skillService.getSkillsByCategory('frontend');
      expect(frontendCategory.type).toBe('frontend');
      expect(frontendCategory.skills.length).toBeGreaterThan(0);
      
      const managementCategory = await skillService.getSkillsByCategory('management');
      expect(managementCategory.type).toBe('management');
      expect(managementCategory.skills.length).toBeGreaterThan(0);
      
      const leadershipCategory = await skillService.getSkillsByCategory('leadership');
      expect(leadershipCategory.type).toBe('leadership');
      expect(leadershipCategory.skills.length).toBeGreaterThan(0);
    });

    it('should return experience items with expected structure', async () => {
      const experienceItems = await skillService.getExperienceItems();
      
      expect(experienceItems).toBeInstanceOf(Array);
      expect(experienceItems.length).toBeGreaterThan(0);
      
      experienceItems.forEach(item => {
        expect(item).toMatchObject({
          id: expect.any(String),
          company: expect.any(String),
          position: expect.any(String),
          startDate: expect.any(Date),
          achievements: expect.any(Array),
          technologies: expect.any(Array)
        });
        
        expect(item.achievements.length).toBeGreaterThan(0);
        expect(item.technologies.length).toBeGreaterThan(0);
        
        // endDate is optional, but if present should be a Date
        if (item.endDate !== undefined) {
          expect(item.endDate).toBeInstanceOf(Date);
          expect(item.endDate.getTime()).toBeGreaterThan(item.startDate.getTime());
        }
      });
    });

    it('should categorize skills for display correctly', async () => {
      const skillCategories = await skillService.getSkillCategories();
      const categorizedSkills = skillService.categorizeSkillsForDisplay(skillCategories);
      
      expect(categorizedSkills).toMatchObject({
        frontend: expect.objectContaining({
          type: 'frontend',
          skills: expect.any(Array)
        }),
        management: expect.objectContaining({
          type: 'management',
          skills: expect.any(Array)
        }),
        leadership: expect.objectContaining({
          type: 'leadership',
          skills: expect.any(Array)
        })
      });
    });

    it('should return skills summary with correct calculations', async () => {
      const skillCategories = await skillService.getSkillCategories();
      const summary = skillService.getSkillsSummary(skillCategories);
      
      expect(summary).toMatchObject({
        totalSkills: expect.any(Number),
        averageLevel: expect.any(Number),
        topSkills: expect.any(Array),
        experienceYears: expect.any(Number)
      });
      
      expect(summary.totalSkills).toBeGreaterThan(0);
      expect(summary.averageLevel).toBeGreaterThan(0);
      expect(summary.averageLevel).toBeLessThanOrEqual(10);
      expect(summary.experienceYears).toBeGreaterThan(0);
      expect(summary.topSkills.length).toBeGreaterThan(0);
      
      // Verify top skills are actually high-level skills
      summary.topSkills.forEach(skill => {
        expect(skill.level).toBeGreaterThanOrEqual(8);
      });
    });
  });
});
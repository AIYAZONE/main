import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { careerService } from '../careerService';
import type { RoadmapData, RoadmapPhase } from '../../types/career';

describe('CareerService', () => {
  describe('Property-Based Tests', () => {
    /**
     * **Feature: personal-brand-showcase, Property 9: Career roadmap phase completeness**
     * **Validates: Requirements 11.1**
     * 
     * For any career roadmap data, it should display the correct number of phases spanning 24 months with proper timeline structure
     */
    it('should always return career roadmap with phases spanning 24 months and proper structure', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(undefined), async () => {
          const roadmapData = await careerService.getRoadmapData();
          
          // Verify roadmap data is defined and has required structure
          expect(roadmapData).toBeDefined();
          expect(roadmapData.id).toBeDefined();
          expect(typeof roadmapData.id).toBe('string');
          expect(roadmapData.id.length).toBeGreaterThan(0);
          
          expect(roadmapData.title).toBeDefined();
          expect(typeof roadmapData.title).toBe('string');
          expect(roadmapData.title.length).toBeGreaterThan(0);
          
          expect(roadmapData.description).toBeDefined();
          expect(typeof roadmapData.description).toBe('string');
          expect(roadmapData.description.length).toBeGreaterThan(0);
          
          // Verify phases array exists and has proper structure
          expect(roadmapData.phases).toBeDefined();
          expect(Array.isArray(roadmapData.phases)).toBe(true);
          expect(roadmapData.phases.length).toBeGreaterThan(0);
          
          // Calculate total duration from phases to verify 24-month span
          let totalMonths = 0;
          const monthsPattern = /(\d+)个月/;
          
          roadmapData.phases.forEach((phase: RoadmapPhase, index: number) => {
            // Verify each phase has required structure
            expect(phase.id).toBeDefined();
            expect(typeof phase.id).toBe('string');
            expect(phase.id.length).toBeGreaterThan(0);
            
            expect(phase.name).toBeDefined();
            expect(typeof phase.name).toBe('string');
            expect(phase.name.length).toBeGreaterThan(0);
            
            expect(phase.duration).toBeDefined();
            expect(typeof phase.duration).toBe('string');
            expect(phase.duration.length).toBeGreaterThan(0);
            
            // Extract months from duration string (e.g., "6个月" -> 6)
            const durationMatch = phase.duration.match(monthsPattern);
            if (durationMatch) {
              const months = parseInt(durationMatch[1], 10);
              expect(months).toBeGreaterThan(0);
              totalMonths += months;
            }
            
            // Verify objectives array
            expect(phase.objectives).toBeDefined();
            expect(Array.isArray(phase.objectives)).toBe(true);
            expect(phase.objectives.length).toBeGreaterThan(0);
            
            phase.objectives.forEach(objective => {
              expect(typeof objective).toBe('string');
              expect(objective.length).toBeGreaterThan(0);
            });
            
            // Verify key milestones array
            expect(phase.keyMilestones).toBeDefined();
            expect(Array.isArray(phase.keyMilestones)).toBe(true);
            
            phase.keyMilestones.forEach(milestone => {
              expect(milestone.id).toBeDefined();
              expect(typeof milestone.id).toBe('string');
              expect(milestone.id.length).toBeGreaterThan(0);
              
              expect(milestone.title).toBeDefined();
              expect(typeof milestone.title).toBe('string');
              expect(milestone.title.length).toBeGreaterThan(0);
              
              expect(milestone.description).toBeDefined();
              expect(typeof milestone.description).toBe('string');
              expect(milestone.description.length).toBeGreaterThan(0);
              
              expect(milestone.targetDate).toBeDefined();
              expect(milestone.targetDate instanceof Date).toBe(true);
              
              expect(typeof milestone.completed).toBe('boolean');
            });
            
            // Verify learning goals array
            expect(phase.learningGoals).toBeDefined();
            expect(Array.isArray(phase.learningGoals)).toBe(true);
            
            phase.learningGoals.forEach(goal => {
              expect(goal.id).toBeDefined();
              expect(typeof goal.id).toBe('string');
              expect(goal.id.length).toBeGreaterThan(0);
              
              expect(goal.category).toBeDefined();
              expect(['architecture', 'performance', 'engineering']).toContain(goal.category);
              
              expect(goal.title).toBeDefined();
              expect(typeof goal.title).toBe('string');
              expect(goal.title.length).toBeGreaterThan(0);
              
              expect(goal.description).toBeDefined();
              expect(typeof goal.description).toBe('string');
              expect(goal.description.length).toBeGreaterThan(0);
              
              expect(Array.isArray(goal.resources)).toBe(true);
              expect(Array.isArray(goal.practicalProjects)).toBe(true);
              expect(Array.isArray(goal.successCriteria)).toBe(true);
            });
            
            // Verify deliverables array
            expect(phase.deliverables).toBeDefined();
            expect(Array.isArray(phase.deliverables)).toBe(true);
            
            phase.deliverables.forEach(deliverable => {
              expect(deliverable.id).toBeDefined();
              expect(typeof deliverable.id).toBe('string');
              expect(deliverable.id.length).toBeGreaterThan(0);
              
              expect(deliverable.title).toBeDefined();
              expect(typeof deliverable.title).toBe('string');
              expect(deliverable.title.length).toBeGreaterThan(0);
              
              expect(deliverable.description).toBeDefined();
              expect(typeof deliverable.description).toBe('string');
              expect(deliverable.description.length).toBeGreaterThan(0);
              
              expect(['code', 'document', 'presentation', 'analysis']).toContain(deliverable.type);
              
              expect(deliverable.dueDate).toBeDefined();
              expect(deliverable.dueDate instanceof Date).toBe(true);
              
              expect(['pending', 'in-progress', 'completed']).toContain(deliverable.status);
            });
          });
          
          // Verify the total duration spans 24 months
          expect(totalMonths).toBe(24);
          
          // Verify current phase is within valid range
          expect(roadmapData.currentPhase).toBeDefined();
          expect(typeof roadmapData.currentPhase).toBe('number');
          expect(roadmapData.currentPhase).toBeGreaterThanOrEqual(0);
          expect(roadmapData.currentPhase).toBeLessThan(roadmapData.phases.length);
          
          // Verify target role and salary range
          expect(roadmapData.targetRole).toBeDefined();
          expect(typeof roadmapData.targetRole).toBe('string');
          expect(roadmapData.targetRole.length).toBeGreaterThan(0);
          
          expect(roadmapData.targetSalaryRange).toBeDefined();
          expect(typeof roadmapData.targetSalaryRange).toBe('string');
          expect(roadmapData.targetSalaryRange.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should return roadmap data with expected structure', async () => {
      const roadmapData = await careerService.getRoadmapData();
      
      expect(roadmapData).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        phases: expect.any(Array),
        currentPhase: expect.any(Number),
        targetRole: expect.any(String),
        targetSalaryRange: expect.any(String)
      });
      
      expect(roadmapData.phases.length).toBeGreaterThan(0);
      
      roadmapData.phases.forEach(phase => {
        expect(phase).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          duration: expect.any(String),
          objectives: expect.any(Array),
          keyMilestones: expect.any(Array),
          learningGoals: expect.any(Array),
          deliverables: expect.any(Array)
        });
      });
    });

    it('should return SWOT analysis with expected structure', async () => {
      const swotData = await careerService.getSWOTAnalysis();
      
      expect(swotData).toMatchObject({
        id: expect.any(String),
        lastUpdated: expect.any(Date),
        strengths: expect.any(Array),
        weaknesses: expect.any(Array),
        opportunities: expect.any(Array),
        threats: expect.any(Array),
        analysis: expect.any(Object)
      });
    });

    it('should return learning path with expected structure', async () => {
      const learningPath = await careerService.getLearningPath();
      
      expect(learningPath).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        phases: expect.any(Array),
        totalDuration: expect.any(String)
      });
    });
  });
});
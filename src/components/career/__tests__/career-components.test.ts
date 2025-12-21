import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import * as fc from 'fast-check';
import { createPinia, setActivePinia } from 'pinia';
import SWOTAnalysis from '../SWOTAnalysis.vue';
import CareerRoadmap from '../CareerRoadmap.vue';
import LearningPath from '../LearningPath.vue';
import type { SWOTData, RoadmapData, LearningPath as LearningPathType, SWOTItem, ActionItem } from '../../../types/career';

describe('Career Components', () => {
  let mockSWOTData: SWOTData;
  let mockRoadmapData: RoadmapData;
  let mockLearningPath: LearningPathType;

  beforeEach(() => {
    setActivePinia(createPinia());

    mockSWOTData = {
      id: '1',
      lastUpdated: new Date(),
      strengths: [
        {
          id: '1',
          title: '10年前端开发经验',
          description: '深厚的前端技术积累',
          impact: 'high',
          category: 'technical'
        }
      ],
      weaknesses: [
        {
          id: '1',
          title: '架构经验不足',
          description: '需要更多架构设计经验',
          impact: 'medium',
          category: 'technical'
        }
      ],
      opportunities: [
        {
          id: '1',
          title: '前端架构师需求增长',
          description: '市场需求旺盛',
          impact: 'high',
          category: 'market'
        }
      ],
      threats: [
        {
          id: '1',
          title: '技术更新快',
          description: '需要持续学习',
          impact: 'medium',
          category: 'technical'
        }
      ],
      analysis: {
        keyInsights: ['技术深度与管理广度结合是核心优势'],
        strategicRecommendations: ['重点发展前端架构设计能力'],
        actionItems: [
          {
            id: '1',
            title: '完成前端架构学习路径',
            description: '系统学习前端架构设计',
            priority: 'high',
            deadline: new Date('2025-06-30'),
            status: 'pending'
          }
        ]
      }
    };

    mockRoadmapData = {
      id: '1',
      title: '前端架构师发展路线图',
      description: '24个月分阶段学习+实战路线',
      phases: [
        {
          id: '1',
          name: '架构基础阶段',
          duration: '6个月',
          objectives: ['建立前端架构理论基础'],
          keyMilestones: [
            {
              id: '1',
              title: '架构理论学习完成',
              description: '完成前端架构相关学习',
              targetDate: new Date('2025-03-31'),
              completed: false
            }
          ],
          learningGoals: [
            {
              id: '1',
              category: 'architecture',
              title: '前端架构设计',
              description: '学习前端架构设计原理',
              resources: [],
              practicalProjects: [],
              successCriteria: ['完成架构设计文档']
            }
          ],
          deliverables: [
            {
              id: '1',
              title: '架构设计方案',
              description: '完整的前端架构设计文档',
              type: 'document',
              dueDate: new Date('2025-03-31'),
              status: 'pending'
            }
          ]
        }
      ],
      currentPhase: 0,
      targetRole: '前端架构师',
      targetSalaryRange: '40-60K'
    };

    mockLearningPath = {
      id: '1',
      title: '前端架构师学习路径',
      description: '前端架构、性能、工程化三线并行',
      phases: [
        {
          id: '1',
          name: '基础建设阶段',
          duration: '6个月',
          focus: 'architecture',
          goals: [
            {
              id: '1',
              category: 'architecture',
              title: '前端架构设计基础',
              description: '学习前端架构设计的基本原理',
              resources: [],
              practicalProjects: [],
              successCriteria: ['能够独立设计中型项目的前端架构']
            }
          ],
          projects: [
            {
              id: '1',
              name: '个人品牌网站架构重构',
              description: '重新设计当前个人网站的架构',
              estimatedTime: '80小时',
              difficulty: 'intermediate',
              outputs: ['架构设计文档']
            }
          ]
        }
      ],
      totalDuration: '24个月'
    };
  });

  describe('SWOTAnalysis', () => {
    it('renders SWOT analysis with provided data', () => {
      const wrapper = mount(SWOTAnalysis, {
        props: {
          analysis: mockSWOTData,
          visualMode: 'quadrant'
        }
      });

      expect(wrapper.find('.swot-analysis').exists()).toBe(true);
      expect(wrapper.find('.swot-title').exists()).toBe(true);
      expect(wrapper.find('.quadrant.strengths').exists()).toBe(true);
      expect(wrapper.find('.quadrant.weaknesses').exists()).toBe(true);
      expect(wrapper.find('.quadrant.opportunities').exists()).toBe(true);
      expect(wrapper.find('.quadrant.threats').exists()).toBe(true);
    });

    it('displays SWOT items correctly', () => {
      const wrapper = mount(SWOTAnalysis, {
        props: {
          analysis: mockSWOTData,
          visualMode: 'quadrant'
        }
      });

      expect(wrapper.text()).toContain('10年前端开发经验');
      expect(wrapper.text()).toContain('架构经验不足');
      expect(wrapper.text()).toContain('前端架构师需求增长');
      expect(wrapper.text()).toContain('技术更新快');
    });

    it('shows analysis results', () => {
      const wrapper = mount(SWOTAnalysis, {
        props: {
          analysis: mockSWOTData,
          visualMode: 'quadrant'
        }
      });

      expect(wrapper.text()).toContain('技术深度与管理广度结合是核心优势');
      expect(wrapper.text()).toContain('重点发展前端架构设计能力');
      expect(wrapper.text()).toContain('完成前端架构学习路径');
    });

    it('**Feature: personal-brand-showcase, Property 8: SWOT analysis structure completeness** - **Validates: Requirements 10.1**', () => {
      // Property-based test: For any SWOT analysis display, it should contain all four quadrants with proper structure
      fc.assert(fc.property(
        // Generator for SWOT data
        fc.record({
          id: fc.string({ minLength: 1 }),
          lastUpdated: fc.date(),
          strengths: fc.array(fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            impact: fc.constantFrom('high', 'medium', 'low'),
            category: fc.string({ minLength: 1 })
          }), { minLength: 0, maxLength: 10 }),
          weaknesses: fc.array(fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            impact: fc.constantFrom('high', 'medium', 'low'),
            category: fc.string({ minLength: 1 })
          }), { minLength: 0, maxLength: 10 }),
          opportunities: fc.array(fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            impact: fc.constantFrom('high', 'medium', 'low'),
            category: fc.string({ minLength: 1 })
          }), { minLength: 0, maxLength: 10 }),
          threats: fc.array(fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            impact: fc.constantFrom('high', 'medium', 'low'),
            category: fc.string({ minLength: 1 })
          }), { minLength: 0, maxLength: 10 }),
          analysis: fc.record({
            keyInsights: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
            strategicRecommendations: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
            actionItems: fc.array(fc.record({
              id: fc.string({ minLength: 1 }),
              title: fc.string({ minLength: 1 }),
              description: fc.string({ minLength: 1 }),
              priority: fc.constantFrom('high', 'medium', 'low'),
              deadline: fc.option(fc.date()),
              status: fc.constantFrom('pending', 'in-progress', 'completed')
            }), { minLength: 0, maxLength: 5 })
          })
        }),
        fc.constantFrom('quadrant', 'radar', 'matrix'),
        (swotData: SWOTData, visualMode: 'quadrant' | 'radar' | 'matrix') => {
          // Mount the component with generated data
          const wrapper = mount(SWOTAnalysis, {
            props: {
              analysis: swotData,
              visualMode: visualMode
            },
            global: {
              mocks: {
                $t: (key: string) => key // Mock i18n
              }
            }
          });

          // Verify that all four quadrants are present in the DOM structure
          const swotAnalysisElement = wrapper.find('.swot-analysis');
          expect(swotAnalysisElement.exists()).toBe(true);

          if (visualMode === 'quadrant') {
            // In quadrant mode, verify all four quadrant sections exist
            const strengthsQuadrant = wrapper.find('.quadrant.strengths');
            const weaknessesQuadrant = wrapper.find('.quadrant.weaknesses');
            const opportunitiesQuadrant = wrapper.find('.quadrant.opportunities');
            const threatsQuadrant = wrapper.find('.quadrant.threats');

            expect(strengthsQuadrant.exists()).toBe(true);
            expect(weaknessesQuadrant.exists()).toBe(true);
            expect(opportunitiesQuadrant.exists()).toBe(true);
            expect(threatsQuadrant.exists()).toBe(true);

            // Verify each quadrant has proper structure
            expect(strengthsQuadrant.find('.quadrant-title').exists()).toBe(true);
            expect(weaknessesQuadrant.find('.quadrant-title').exists()).toBe(true);
            expect(opportunitiesQuadrant.find('.quadrant-title').exists()).toBe(true);
            expect(threatsQuadrant.find('.quadrant-title').exists()).toBe(true);

            expect(strengthsQuadrant.find('.quadrant-items').exists()).toBe(true);
            expect(weaknessesQuadrant.find('.quadrant-items').exists()).toBe(true);
            expect(opportunitiesQuadrant.find('.quadrant-items').exists()).toBe(true);
            expect(threatsQuadrant.find('.quadrant-items').exists()).toBe(true);
          } else if (visualMode === 'matrix') {
            // In matrix mode, verify all four matrix cells exist
            const positiveInternal = wrapper.find('.matrix-cell.positive.internal');
            const positiveExternal = wrapper.find('.matrix-cell.positive.external');
            const negativeInternal = wrapper.find('.matrix-cell.negative.internal');
            const negativeExternal = wrapper.find('.matrix-cell.negative.external');

            expect(positiveInternal.exists()).toBe(true);
            expect(positiveExternal.exists()).toBe(true);
            expect(negativeInternal.exists()).toBe(true);
            expect(negativeExternal.exists()).toBe(true);
          } else if (visualMode === 'radar') {
            // In radar mode, verify radar container exists
            const radarContainer = wrapper.find('.radar-container');
            expect(radarContainer.exists()).toBe(true);
          }

          // Verify analysis results section exists when analysis data is provided
          if (swotData.analysis) {
            const analysisResults = wrapper.find('.swot-analysis-results');
            expect(analysisResults.exists()).toBe(true);
          }
        }
      ), { numRuns: 100 });
    });
  });

  describe('CareerRoadmap', () => {
    it('renders roadmap with provided data', () => {
      const wrapper = mount(CareerRoadmap, {
        props: {
          roadmapData: mockRoadmapData,
          phases: mockRoadmapData.phases,
          currentPhase: 0
        },
        global: {
          plugins: [createPinia()]
        }
      });

      expect(wrapper.find('.career-roadmap').exists()).toBe(true);
      expect(wrapper.find('.roadmap-title').exists()).toBe(true);
      expect(wrapper.find('.timeline-phase').exists()).toBe(true);
    });

    it('displays roadmap phases correctly', () => {
      const wrapper = mount(CareerRoadmap, {
        props: {
          roadmapData: mockRoadmapData,
          phases: mockRoadmapData.phases,
          currentPhase: 0
        },
        global: {
          plugins: [createPinia()]
        }
      });

      expect(wrapper.text()).toContain('架构基础阶段');
      expect(wrapper.text()).toContain('6个月');
      expect(wrapper.text()).toContain('建立前端架构理论基础');
    });

    it('shows progress information', () => {
      const wrapper = mount(CareerRoadmap, {
        props: {
          roadmapData: mockRoadmapData,
          phases: mockRoadmapData.phases,
          currentPhase: 0
        },
        global: {
          plugins: [createPinia()]
        }
      });

      expect(wrapper.find('.roadmap-progress').exists()).toBe(true);
      expect(wrapper.find('.progress-bar').exists()).toBe(true);
    });
  });

  describe('LearningPath', () => {
    it('renders learning path with provided data', () => {
      const wrapper = mount(LearningPath, {
        props: {
          learningPath: mockLearningPath
        }
      });

      expect(wrapper.find('.learning-path').exists()).toBe(true);
      expect(wrapper.find('.learning-title').exists()).toBe(true);
    });

    it('displays three parallel tracks', () => {
      const wrapper = mount(LearningPath, {
        props: {
          learningPath: mockLearningPath
        }
      });

      expect(wrapper.find('.learning-tracks').exists()).toBe(true);
      expect(wrapper.find('.architecture-track').exists()).toBe(true);
      expect(wrapper.find('.performance-track').exists()).toBe(true);
      expect(wrapper.find('.engineering-track').exists()).toBe(true);
    });

    it('shows learning timeline', () => {
      const wrapper = mount(LearningPath, {
        props: {
          learningPath: mockLearningPath
        }
      });

      expect(wrapper.find('.learning-timeline').exists()).toBe(true);
      expect(wrapper.text()).toContain('基础建设阶段');
      expect(wrapper.text()).toContain('前端架构设计基础');
    });

    it('displays success metrics', () => {
      const wrapper = mount(LearningPath, {
        props: {
          learningPath: mockLearningPath
        }
      });

      expect(wrapper.find('.success-metrics').exists()).toBe(true);
      expect(wrapper.find('.metrics-grid').exists()).toBe(true);
    });
  });
});

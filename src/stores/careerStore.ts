import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';
import type { SWOTData, RoadmapData, LearningPath } from '../types/career';
import type { LoadingState } from '../types/common';

export const useCareerStore = defineStore('career', () => {
  // State
  const swotAnalysis = ref<SWOTData | null>(null);
  const roadmapData = ref<RoadmapData | null>(null);
  const learningPath = ref<LearningPath | null>(null);
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: undefined
  });

  // Actions
  const setSWOTAnalysis = (analysis: SWOTData) => {
    swotAnalysis.value = analysis;
  };

  const setRoadmapData = (roadmap: RoadmapData) => {
    roadmapData.value = roadmap;
  };

  const setLearningPath = (path: LearningPath) => {
    learningPath.value = path;
  };

  const setLoading = (loading: boolean, error?: string) => {
    loadingState.value = {
      isLoading: loading,
      error
    };
  };

  const loadCareerData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls when careerService is implemented
      const mockSWOTData: SWOTData = {
        id: '1',
        lastUpdated: new Date(),
        strengths: [
          {
            id: '1',
            title: '10年前端开发经验',
            description: '深厚的前端技术积累和项目实战经验',
            impact: 'high',
            category: 'technical'
          },
          {
            id: '2',
            title: 'PMP/ACP双认证',
            description: '项目管理和敏捷开发的专业认证',
            impact: 'high',
            category: 'management'
          }
        ],
        weaknesses: [
          {
            id: '1',
            title: '架构经验相对不足',
            description: '需要更多大型系统架构设计经验',
            impact: 'medium',
            category: 'technical'
          }
        ],
        opportunities: [
          {
            id: '1',
            title: '前端架构师需求增长',
            description: '市场对高级前端架构师需求旺盛',
            impact: 'high',
            category: 'market'
          }
        ],
        threats: [
          {
            id: '1',
            title: '技术更新迭代快',
            description: '前端技术栈更新频繁，需要持续学习',
            impact: 'medium',
            category: 'technical'
          }
        ],
        analysis: {
          keyInsights: [
            '技术深度与管理广度结合是核心优势',
            '需要加强架构设计能力',
            '市场机会与个人能力匹配度高'
          ],
          strategicRecommendations: [
            '重点发展前端架构设计能力',
            '深化性能优化专业技能',
            '建立工程化体系经验'
          ],
          actionItems: [
            {
              id: '1',
              title: '完成前端架构学习路径',
              description: '系统学习前端架构设计理论和实践',
              priority: 'high',
              deadline: new Date('2025-06-30'),
              status: 'pending'
            }
          ]
        }
      };

      const mockRoadmapData: RoadmapData = {
        id: '1',
        title: '前端架构师发展路线图',
        description: '24个月分阶段学习+实战路线',
        phases: [
          {
            id: '1',
            name: '架构基础阶段',
            duration: '6个月',
            objectives: [
              '建立前端架构理论基础',
              '掌握系统设计方法论',
              '完成架构分析实战项目'
            ],
            keyMilestones: [
              {
                id: '1',
                title: '架构理论学习完成',
                description: '完成前端架构相关书籍和课程学习',
                targetDate: new Date('2025-03-31'),
                completed: false
              }
            ],
            learningGoals: [
              {
                id: '1',
                category: 'architecture',
                title: '前端架构设计',
                description: '学习前端架构设计原理和最佳实践',
                resources: [],
                practicalProjects: [],
                successCriteria: ['完成架构设计文档', '通过技术评审']
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

      const mockLearningPath: LearningPath = {
        id: '1',
        title: '前端架构师学习路径',
        description: '前端架构、性能、工程化三线并行的系统学习路径',
        phases: [
          {
            id: '1',
            name: '基础建设阶段 (0-6个月)',
            duration: '6个月',
            focus: 'architecture',
            goals: [
              {
                id: '1',
                category: 'architecture',
                title: '前端架构设计基础',
                description: '学习前端架构设计的基本原理、模式和最佳实践',
                resources: [],
                practicalProjects: [
                  {
                    id: '1',
                    name: '个人品牌网站架构重构',
                    description: '重新设计当前个人网站的架构',
                    estimatedTime: '80小时',
                    difficulty: 'intermediate',
                    outputs: ['架构设计文档', '重构后的代码', '性能对比报告']
                  }
                ],
                successCriteria: [
                  '能够独立设计中型项目的前端架构',
                  '掌握微前端、模块联邦等现代架构模式',
                  '具备架构决策的理论依据'
                ]
              }
            ],
            projects: [
              {
                id: '1',
                name: '个人品牌网站架构重构',
                description: '重新设计当前个人网站的架构',
                estimatedTime: '80小时',
                difficulty: 'intermediate',
                outputs: ['架构设计文档', '重构后的代码', '性能对比报告']
              }
            ]
          }
        ],
        totalDuration: '24个月'
      };

      setSWOTAnalysis(mockSWOTData);
      setRoadmapData(mockRoadmapData);
      setLearningPath(mockLearningPath);
      setLoading(false);
    } catch (error) {
      setLoading(false, error instanceof Error ? error.message : 'Failed to load career data');
    }
  };

  const clearError = () => {
    loadingState.value.error = undefined;
  };

  const isLoading = readonly(loadingState).value.isLoading;
  const error = readonly(loadingState).value.error;

  return {
    // State (readonly)
    swotAnalysis: readonly(swotAnalysis),
    roadmapData: readonly(roadmapData),
    learningPath: readonly(learningPath),
    isLoading,
    error,
    
    // Actions
    setSWOTAnalysis,
    setRoadmapData,
    setLearningPath,
    loadCareerData,
    clearError
  };
});
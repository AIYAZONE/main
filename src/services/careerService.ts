import type { SWOTData, RoadmapData, LearningPath } from '../types/career';
import type { ApiResponse } from '../types/common';
import i18n from '../i18n';

export interface CareerService {
  getSWOTAnalysis(): Promise<SWOTData>;
  getRoadmapData(): Promise<RoadmapData>;
  getLearningPath(): Promise<LearningPath>;
  updateCareerGoals(goals: any[]): Promise<void>;
}

class CareerServiceImpl implements CareerService {
  private baseUrl = '/api/career';

  async getSWOTAnalysis(): Promise<SWOTData> {
    try {
      // Mock data replaced with i18n
      return {
        id: '1',
        lastUpdated: new Date(),
        strengths: [
          {
            id: '1',
            title: i18n.global.t('careerData.swot.strengths.1.title'),
            description: i18n.global.t('careerData.swot.strengths.1.description'),
            impact: 'high',
            category: 'technical'
          },
          {
            id: '2',
            title: i18n.global.t('careerData.swot.strengths.2.title'),
            description: i18n.global.t('careerData.swot.strengths.2.description'),
            impact: 'high',
            category: 'management'
          },
          {
            id: '3',
            title: i18n.global.t('careerData.swot.strengths.3.title'),
            description: i18n.global.t('careerData.swot.strengths.3.description'),
            impact: 'high',
            category: 'hybrid'
          }
        ],
        weaknesses: [
          {
            id: '1',
            title: i18n.global.t('careerData.swot.weaknesses.1.title'),
            description: i18n.global.t('careerData.swot.weaknesses.1.description'),
            impact: 'medium',
            category: 'technical'
          },
          {
            id: '2',
            title: i18n.global.t('careerData.swot.weaknesses.2.title'),
            description: i18n.global.t('careerData.swot.weaknesses.2.description'),
            impact: 'medium',
            category: 'management'
          }
        ],
        opportunities: [
          {
            id: '1',
            title: i18n.global.t('careerData.swot.opportunities.1.title'),
            description: i18n.global.t('careerData.swot.opportunities.1.description'),
            impact: 'high',
            category: 'market'
          },
          {
            id: '2',
            title: i18n.global.t('careerData.swot.opportunities.2.title'),
            description: i18n.global.t('careerData.swot.opportunities.2.description'),
            impact: 'high',
            category: 'industry'
          },
          {
            id: '3',
            title: i18n.global.t('careerData.swot.opportunities.3.title'),
            description: i18n.global.t('careerData.swot.opportunities.3.description'),
            impact: 'high',
            category: 'location'
          }
        ],
        threats: [
          {
            id: '1',
            title: i18n.global.t('careerData.swot.threats.1.title'),
            description: i18n.global.t('careerData.swot.threats.1.description'),
            impact: 'medium',
            category: 'technical'
          },
          {
            id: '2',
            title: i18n.global.t('careerData.swot.threats.2.title'),
            description: i18n.global.t('careerData.swot.threats.2.description'),
            impact: 'medium',
            category: 'personal'
          },
          {
            id: '3',
            title: i18n.global.t('careerData.swot.threats.3.title'),
            description: i18n.global.t('careerData.swot.threats.3.description'),
            impact: 'medium',
            category: 'market'
          }
        ],
        analysis: {
          keyInsights: i18n.global.tm('careerData.swot.analysis.keyInsights') as string[],
          strategicRecommendations: i18n.global.tm('careerData.swot.analysis.strategicRecommendations') as string[],
          actionItems: [
            {
              id: '1',
              title: i18n.global.t('careerData.swot.analysis.actionItems.1.title'),
              description: i18n.global.t('careerData.swot.analysis.actionItems.1.description'),
              priority: 'high',
              deadline: new Date('2025-06-30'),
              status: 'pending'
            },
            {
              id: '2',
              title: i18n.global.t('careerData.swot.analysis.actionItems.2.title'),
              description: i18n.global.t('careerData.swot.analysis.actionItems.2.description'),
              priority: 'high',
              deadline: new Date('2025-09-30'),
              status: 'pending'
            },
            {
              id: '3',
              title: i18n.global.t('careerData.swot.analysis.actionItems.3.title'),
              description: i18n.global.t('careerData.swot.analysis.actionItems.3.description'),
              priority: 'medium',
              deadline: new Date('2025-12-31'),
              status: 'in-progress'
            }
          ]
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch SWOT analysis: ${error}`);
    }
  }

  async getRoadmapData(): Promise<RoadmapData> {
    try {
      return {
        id: '1',
        title: i18n.global.t('careerData.roadmap.title'),
        description: i18n.global.t('careerData.roadmap.description'),
        phases: [
          {
            id: '1',
            name: i18n.global.t('careerData.roadmap.phases.1.name'),
            duration: '6个月',
            objectives: i18n.global.tm('careerData.roadmap.phases.1.objectives') as string[],
            keyMilestones: [
              {
                id: '1',
                title: i18n.global.t('careerData.roadmap.phases.1.milestones.1.title'),
                description: i18n.global.t('careerData.roadmap.phases.1.milestones.1.description'),
                targetDate: new Date('2025-03-31'),
                completed: false,
                metrics: i18n.global.tm('careerData.roadmap.phases.1.milestones.1.metrics') as string[]
              },
              {
                id: '2',
                title: i18n.global.t('careerData.roadmap.phases.1.milestones.2.title'),
                description: i18n.global.t('careerData.roadmap.phases.1.milestones.2.description'),
                targetDate: new Date('2025-06-30'),
                completed: false,
                metrics: i18n.global.tm('careerData.roadmap.phases.1.milestones.2.metrics') as string[]
              }
            ],
            learningGoals: [
              {
                id: '1',
                category: 'architecture',
                title: i18n.global.t('careerData.roadmap.phases.1.learningGoals.1.title'),
                description: i18n.global.t('careerData.roadmap.phases.1.learningGoals.1.description'),
                resources: [
                  {
                    id: '1',
                    title: i18n.global.t('careerData.roadmap.phases.1.learningGoals.1.resources.1.title'),
                    type: 'book',
                    url: 'https://book.example.com',
                    estimatedTime: '40小时',
                    priority: 'high'
                  }
                ],
                practicalProjects: [
                  {
                    id: '1',
                    name: i18n.global.t('careerData.roadmap.phases.1.learningGoals.1.projects.1.name'),
                    description: i18n.global.t('careerData.roadmap.phases.1.learningGoals.1.projects.1.description'),
                    estimatedTime: '80小时',
                    difficulty: 'intermediate',
                    outputs: i18n.global.tm('careerData.roadmap.phases.1.learningGoals.1.projects.1.outputs') as string[]
                  }
                ],
                successCriteria: i18n.global.tm('careerData.roadmap.phases.1.learningGoals.1.successCriteria') as string[]
              }
            ],
            deliverables: [
              {
                id: '1',
                title: i18n.global.t('careerData.roadmap.phases.1.deliverables.1.title'),
                description: i18n.global.t('careerData.roadmap.phases.1.deliverables.1.description'),
                type: 'document',
                dueDate: new Date('2025-06-30'),
                status: 'pending'
              }
            ]
          },
          {
            id: '2',
            name: i18n.global.t('careerData.roadmap.phases.2.name'),
            duration: '6个月',
            objectives: i18n.global.tm('careerData.roadmap.phases.2.objectives') as string[],
            keyMilestones: [
              {
                id: '3',
                title: i18n.global.t('careerData.roadmap.phases.2.milestones.3.title'),
                description: i18n.global.t('careerData.roadmap.phases.2.milestones.3.description'),
                targetDate: new Date('2025-09-30'),
                completed: false,
                metrics: i18n.global.tm('careerData.roadmap.phases.2.milestones.3.metrics') as string[]
              }
            ],
            learningGoals: [],
            deliverables: []
          },
          {
            id: '3',
            name: i18n.global.t('careerData.roadmap.phases.3.name'),
            duration: '6个月',
            objectives: i18n.global.tm('careerData.roadmap.phases.3.objectives') as string[],
            keyMilestones: [],
            learningGoals: [],
            deliverables: []
          },
          {
            id: '4',
            name: i18n.global.t('careerData.roadmap.phases.4.name'),
            duration: '6个月',
            objectives: i18n.global.tm('careerData.roadmap.phases.4.objectives') as string[],
            keyMilestones: [],
            learningGoals: [],
            deliverables: []
          }
        ],
        currentPhase: 0,
        targetRole: '前端架构师',
        targetSalaryRange: '40-60K'
      };
    } catch (error) {
      throw new Error(`Failed to fetch roadmap data: ${error}`);
    }
  }

  async getLearningPath(): Promise<LearningPath> {
    try {
      return {
        id: '1',
        title: i18n.global.t('careerData.learningPath.title'),
        description: i18n.global.t('careerData.learningPath.description'),
        phases: [
          {
            id: '1',
            name: i18n.global.t('careerData.learningPath.phases.1.name'),
            duration: '6个月',
            focus: 'architecture',
            goals: [],
            projects: []
          }
        ],
        totalDuration: '24个月'
      };
    } catch (error) {
      throw new Error(`Failed to fetch learning path: ${error}`);
    }
  }

  async updateCareerGoals(goals: any[]): Promise<void> {
    try {
      // TODO: Replace with actual API call
      console.log('Career goals updated:', goals);
    } catch (error) {
      throw new Error(`Failed to update career goals: ${error}`);
    }
  }
}

export const careerService = new CareerServiceImpl();

<template>
  <div class="learning-path">
    <div class="learning-header">
      <h2 class="learning-title">{{ learningPath?.title || $t('career.learning.title') }}</h2>
      <p class="learning-description">{{ learningPath?.description || $t('career.learning.description') }}</p>
      
      <div class="learning-overview">
        <div class="overview-item">
          <span class="overview-label">{{ $t('career.learning.totalDuration') }}</span>
          <span class="overview-value">{{ learningPath?.totalDuration || '24个月' }}</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">{{ $t('career.learning.focusAreas') }}</span>
          <span class="overview-value">{{ $t('career.learning.threeFocus') }}</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">{{ $t('career.learning.approach') }}</span>
          <span class="overview-value">{{ $t('career.learning.parallelLearning') }}</span>
        </div>
      </div>
    </div>

    <!-- Three-Track Parallel Learning -->
    <div class="learning-tracks">
      <h3 class="tracks-title">{{ $t('career.learning.parallelTracks') }}</h3>
      <div class="tracks-container">
        <div class="track architecture-track">
          <div class="track-header">
            <div class="track-icon">🏗️</div>
            <h4 class="track-title">{{ $t('career.learning.tracks.architecture') }}</h4>
            <p class="track-subtitle">{{ $t('career.learning.tracks.architectureDesc') }}</p>
          </div>
          <div class="track-content">
            <div class="track-phases">
              <div class="track-phase" v-for="phase in architecturePhases" :key="phase.id">
                <h5 class="phase-title">{{ phase.title }}</h5>
                <p class="phase-duration">{{ phase.duration }}</p>
                <ul class="phase-goals">
                  <li v-for="goal in phase.goals" :key="goal">{{ goal }}</li>
                </ul>
                <div class="phase-projects" v-if="phase.projects.length > 0">
                  <h6>{{ $t('career.learning.practicalProjects') }}</h6>
                  <div class="project-list">
                    <div v-for="project in phase.projects" :key="project.name" class="project-item">
                      <span class="project-name">{{ project.name }}</span>
                      <span class="project-time">{{ project.estimatedTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="track performance-track">
          <div class="track-header">
            <div class="track-icon">⚡</div>
            <h4 class="track-title">{{ $t('career.learning.tracks.performance') }}</h4>
            <p class="track-subtitle">{{ $t('career.learning.tracks.performanceDesc') }}</p>
          </div>
          <div class="track-content">
            <div class="track-phases">
              <div class="track-phase" v-for="phase in performancePhases" :key="phase.id">
                <h5 class="phase-title">{{ phase.title }}</h5>
                <p class="phase-duration">{{ phase.duration }}</p>
                <ul class="phase-goals">
                  <li v-for="goal in phase.goals" :key="goal">{{ goal }}</li>
                </ul>
                <div class="phase-projects" v-if="phase.projects.length > 0">
                  <h6>{{ $t('career.learning.practicalProjects') }}</h6>
                  <div class="project-list">
                    <div v-for="project in phase.projects" :key="project.name" class="project-item">
                      <span class="project-name">{{ project.name }}</span>
                      <span class="project-time">{{ project.estimatedTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="track engineering-track">
          <div class="track-header">
            <div class="track-icon">🔧</div>
            <h4 class="track-title">{{ $t('career.learning.tracks.engineering') }}</h4>
            <p class="track-subtitle">{{ $t('career.learning.tracks.engineeringDesc') }}</p>
          </div>
          <div class="track-content">
            <div class="track-phases">
              <div class="track-phase" v-for="phase in engineeringPhases" :key="phase.id">
                <h5 class="phase-title">{{ phase.title }}</h5>
                <p class="phase-duration">{{ phase.duration }}</p>
                <ul class="phase-goals">
                  <li v-for="goal in phase.goals" :key="goal">{{ goal }}</li>
                </ul>
                <div class="phase-projects" v-if="phase.projects.length > 0">
                  <h6>{{ $t('career.learning.practicalProjects') }}</h6>
                  <div class="project-list">
                    <div v-for="project in phase.projects" :key="project.name" class="project-item">
                      <span class="project-name">{{ project.name }}</span>
                      <span class="project-time">{{ project.estimatedTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Phases Timeline -->
    <div class="learning-timeline" v-if="learningPath?.phases">
      <h3 class="timeline-title">{{ $t('career.learning.phaseTimeline') }}</h3>
      <div class="timeline-container">
        <div class="timeline-line"></div>
        <div 
          v-for="(phase, index) in learningPath.phases" 
          :key="phase.id"
          class="timeline-phase"
        >
          <div class="phase-marker">
            <div class="marker-circle">
              <span class="phase-number">{{ index + 1 }}</span>
            </div>
          </div>
          <div class="phase-content">
            <div class="phase-header">
              <h4 class="phase-name">{{ phase.name }}</h4>
              <span class="phase-duration">{{ phase.duration }}</span>
              <span :class="['phase-focus', `focus-${phase.focus}`]">
                {{ $t(`career.learning.focus.${phase.focus}`) }}
              </span>
            </div>
            <div class="phase-goals" v-if="phase.goals.length > 0">
              <h5>{{ $t('career.learning.learningGoals') }}</h5>
              <div class="goals-grid">
                <div v-for="goal in phase.goals" :key="goal.id" class="goal-card">
                  <h6 class="goal-title">{{ goal.title }}</h6>
                  <p class="goal-description">{{ goal.description }}</p>
                  <div class="goal-success-criteria" v-if="goal.successCriteria.length > 0">
                    <span class="criteria-label">{{ $t('career.learning.successCriteria') }}:</span>
                    <ul class="criteria-list">
                      <li v-for="criteria in goal.successCriteria" :key="criteria">{{ criteria }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="phase-projects" v-if="phase.projects.length > 0">
              <h5>{{ $t('career.learning.practicalProjects') }}</h5>
              <div class="projects-grid">
                <div v-for="project in phase.projects" :key="project.id" class="project-card">
                  <div class="project-header">
                    <h6 class="project-name">{{ project.name }}</h6>
                    <span :class="['project-difficulty', project.difficulty]">
                      {{ $t(`career.learning.difficulty.${project.difficulty}`) }}
                    </span>
                  </div>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-meta">
                    <span class="project-time">{{ project.estimatedTime }}</span>
                  </div>
                  <div class="project-outputs" v-if="project.outputs.length > 0">
                    <span class="outputs-label">{{ $t('career.learning.expectedOutputs') }}:</span>
                    <ul class="outputs-list">
                      <li v-for="output in project.outputs" :key="output">{{ output }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Resources -->
    <div class="learning-resources">
      <h3 class="resources-title">{{ $t('career.learning.recommendedResources') }}</h3>
      <div class="resources-categories">
        <div class="resource-category">
          <h4 class="category-title">{{ $t('career.learning.resources.books') }}</h4>
          <div class="resource-list">
            <div v-for="book in recommendedBooks" :key="book.id" class="resource-item">
              <div class="resource-info">
                <h5 class="resource-title">{{ book.title }}</h5>
                <p class="resource-description">{{ book.description }}</p>
                <div class="resource-meta">
                  <span class="resource-time">{{ book.estimatedTime }}</span>
                  <span :class="['resource-priority', book.priority]">
                    {{ $t(`career.learning.priority.${book.priority}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="resource-category">
          <h4 class="category-title">{{ $t('career.learning.resources.courses') }}</h4>
          <div class="resource-list">
            <div v-for="course in recommendedCourses" :key="course.id" class="resource-item">
              <div class="resource-info">
                <h5 class="resource-title">{{ course.title }}</h5>
                <p class="resource-description">{{ course.description }}</p>
                <div class="resource-meta">
                  <span class="resource-time">{{ course.estimatedTime }}</span>
                  <span :class="['resource-priority', course.priority]">
                    {{ $t(`career.learning.priority.${course.priority}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="resource-category">
          <h4 class="category-title">{{ $t('career.learning.resources.practices') }}</h4>
          <div class="resource-list">
            <div v-for="practice in recommendedPractices" :key="practice.id" class="resource-item">
              <div class="resource-info">
                <h5 class="resource-title">{{ practice.title }}</h5>
                <p class="resource-description">{{ practice.description }}</p>
                <div class="resource-meta">
                  <span class="resource-time">{{ practice.estimatedTime }}</span>
                  <span :class="['resource-priority', practice.priority]">
                    {{ $t(`career.learning.priority.${practice.priority}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Metrics -->
    <div class="success-metrics">
      <h3 class="metrics-title">{{ $t('career.learning.successMetrics') }}</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">📊</div>
          <h4 class="metric-title">{{ $t('career.learning.metrics.technical') }}</h4>
          <ul class="metric-list">
            <li>{{ $t('career.learning.metrics.technicalItems.architecture') }}</li>
            <li>{{ $t('career.learning.metrics.technicalItems.performance') }}</li>
            <li>{{ $t('career.learning.metrics.technicalItems.engineering') }}</li>
          </ul>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <h4 class="metric-title">{{ $t('career.learning.metrics.career') }}</h4>
          <ul class="metric-list">
            <li>{{ $t('career.learning.metrics.careerItems.position') }}</li>
            <li>{{ $t('career.learning.metrics.careerItems.salary') }}</li>
            <li>{{ $t('career.learning.metrics.careerItems.recognition') }}</li>
          </ul>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🌟</div>
          <h4 class="metric-title">{{ $t('career.learning.metrics.impact') }}</h4>
          <ul class="metric-list">
            <li>{{ $t('career.learning.metrics.impactItems.team') }}</li>
            <li>{{ $t('career.learning.metrics.impactItems.projects') }}</li>
            <li>{{ $t('career.learning.metrics.impactItems.industry') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { LearningPath } from '../../types/career';

interface Props {
  learningPath?: LearningPath | null;
}

const props = defineProps<Props>();
const { t } = useI18n();

// Mock data for three-track parallel learning
const architecturePhases = ref([
  {
    id: '1',
    title: '架构基础理论 (0-3个月)',
    duration: '3个月',
    goals: [
      '掌握前端架构设计原理',
      '理解微前端架构模式',
      '学习系统设计方法论',
      '建立架构思维框架'
    ],
    projects: [
      { name: '个人网站架构重构', estimatedTime: '40小时' },
      { name: '微前端Demo项目', estimatedTime: '60小时' }
    ]
  },
  {
    id: '2',
    title: '架构实践应用 (3-9个月)',
    duration: '6个月',
    goals: [
      '参与中大型项目架构设计',
      '实践模块化架构方案',
      '掌握架构决策方法',
      '建立架构评估体系'
    ],
    projects: [
      { name: '企业级前端架构设计', estimatedTime: '120小时' },
      { name: '架构迁移项目', estimatedTime: '80小时' }
    ]
  },
  {
    id: '3',
    title: '架构专家定位 (9-18个月)',
    duration: '9个月',
    goals: [
      '具备大型系统架构能力',
      '形成个人架构方法论',
      '建立架构技术影响力',
      '指导团队架构实践'
    ],
    projects: [
      { name: '架构白皮书编写', estimatedTime: '100小时' },
      { name: '开源架构工具开发', estimatedTime: '150小时' }
    ]
  }
]);

const performancePhases = ref([
  {
    id: '1',
    title: '性能基础建设 (0-4个月)',
    duration: '4个月',
    goals: [
      '掌握性能监控体系',
      '理解性能优化原理',
      '建立性能测试方法',
      '学习性能分析工具'
    ],
    projects: [
      { name: '性能监控平台搭建', estimatedTime: '50小时' },
      { name: '性能优化案例分析', estimatedTime: '30小时' }
    ]
  },
  {
    id: '2',
    title: '性能优化实战 (4-12个月)',
    duration: '8个月',
    goals: [
      '实施全链路性能优化',
      '建立性能优化流程',
      '掌握高级优化技术',
      '形成性能优化方案'
    ],
    projects: [
      { name: '大型应用性能优化', estimatedTime: '100小时' },
      { name: '性能优化工具开发', estimatedTime: '80小时' }
    ]
  },
  {
    id: '3',
    title: '性能专家能力 (12-20个月)',
    duration: '8个月',
    goals: [
      '建立性能优化体系',
      '指导团队性能实践',
      '形成性能技术影响力',
      '推动行业性能标准'
    ],
    projects: [
      { name: '性能优化最佳实践', estimatedTime: '120小时' },
      { name: '性能优化培训体系', estimatedTime: '60小时' }
    ]
  }
]);

const engineeringPhases = ref([
  {
    id: '1',
    title: '工程化基础 (0-3个月)',
    duration: '3个月',
    goals: [
      '掌握现代构建工具',
      '理解CI/CD流程',
      '学习代码质量管理',
      '建立工程化思维'
    ],
    projects: [
      { name: '工程化脚手架开发', estimatedTime: '40小时' },
      { name: 'CI/CD流程搭建', estimatedTime: '30小时' }
    ]
  },
  {
    id: '2',
    title: '工程化实践 (3-12个月)',
    duration: '9个月',
    goals: [
      '建设前端工程化体系',
      '实施自动化测试',
      '推进代码规范化',
      '优化开发效率工具'
    ],
    projects: [
      { name: '前端工程化平台', estimatedTime: '150小时' },
      { name: '自动化测试体系', estimatedTime: '100小时' }
    ]
  },
  {
    id: '3',
    title: '工程化专家 (12-24个月)',
    duration: '12个月',
    goals: [
      '设计企业级工程化方案',
      '建立工程化标准',
      '推广工程化最佳实践',
      '培养工程化团队'
    ],
    projects: [
      { name: '企业工程化标准制定', estimatedTime: '80小时' },
      { name: '工程化开源项目', estimatedTime: '200小时' }
    ]
  }
]);

// Mock recommended resources
const recommendedBooks = ref([
  {
    id: '1',
    title: '前端架构：从入门到微前端',
    description: '全面介绍前端架构设计理念和实践方法',
    estimatedTime: '40小时',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Web性能权威指南',
    description: '深入讲解Web性能优化的理论和实践',
    estimatedTime: '35小时',
    priority: 'high'
  },
  {
    id: '3',
    title: '前端工程化体系设计与实践',
    description: '系统性介绍前端工程化建设方法',
    estimatedTime: '30小时',
    priority: 'medium'
  }
]);

const recommendedCourses = ref([
  {
    id: '1',
    title: '前端架构师成长训练营',
    description: '系统性的前端架构师能力培养课程',
    estimatedTime: '80小时',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Web性能优化实战',
    description: '基于真实项目的性能优化实战课程',
    estimatedTime: '60小时',
    priority: 'high'
  },
  {
    id: '3',
    title: '现代前端工程化实践',
    description: '涵盖构建、测试、部署的工程化实践',
    estimatedTime: '50小时',
    priority: 'medium'
  }
]);

const recommendedPractices = ref([
  {
    id: '1',
    title: '开源项目贡献',
    description: '参与知名开源项目，提升技术影响力',
    estimatedTime: '持续进行',
    priority: 'high'
  },
  {
    id: '2',
    title: '技术博客写作',
    description: '定期输出技术文章，建立个人品牌',
    estimatedTime: '每周4小时',
    priority: 'high'
  },
  {
    id: '3',
    title: '技术分享演讲',
    description: '在技术会议和团队内部进行技术分享',
    estimatedTime: '每月8小时',
    priority: 'medium'
  }
]);
</script>

<style scoped lang="less">
.learning-path {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .learning-header {
    text-align: center;
    margin-bottom: 3rem;

    .learning-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 1rem;
    }

    .learning-description {
      font-size: 1.1rem;
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .learning-overview {
      display: flex;
      justify-content: center;
      gap: 3rem;
      flex-wrap: wrap;

      .overview-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        .overview-label {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .overview-value {
          font-size: 1.1rem;
          color: var(--color-text-primary);
          font-weight: 600;
        }
      }
    }
  }

  .learning-tracks {
    margin-bottom: 4rem;

    .tracks-title {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 2rem;
      color: var(--color-text-primary);
    }

    .tracks-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;

      .track {
        background: var(--color-bg-secondary);
        border-radius: 12px;
        padding: 2rem;
        border: 2px solid var(--color-border);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        &.architecture-track {
          border-left-color: #007bff;
        }

        &.performance-track {
          border-left-color: #28a745;
        }

        &.engineering-track {
          border-left-color: #ffc107;
        }

        .track-header {
          text-align: center;
          margin-bottom: 2rem;

          .track-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .track-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-text-primary);
            margin-bottom: 0.5rem;
          }

          .track-subtitle {
            font-size: 1rem;
            color: var(--color-text-secondary);
            line-height: 1.5;
          }
        }

        .track-content {
          .track-phases {
            .track-phase {
              margin-bottom: 2rem;
              padding: 1.5rem;
              background: var(--color-bg-primary);
              border-radius: 8px;

              &:last-child {
                margin-bottom: 0;
              }

              .phase-title {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--color-text-primary);
                margin-bottom: 0.5rem;
              }

              .phase-duration {
                font-size: 0.9rem;
                color: var(--color-text-secondary);
                margin-bottom: 1rem;
                font-weight: 500;
              }

              .phase-goals {
                list-style: none;
                padding: 0;
                margin-bottom: 1.5rem;

                li {
                  padding: 0.5rem 0;
                  border-bottom: 1px solid var(--color-border);
                  font-size: 0.9rem;
                  line-height: 1.4;

                  &:last-child {
                    border-bottom: none;
                  }
                }
              }

              .phase-projects {
                h6 {
                  font-size: 1rem;
                  font-weight: 600;
                  margin-bottom: 1rem;
                  color: var(--color-text-primary);
                }

                .project-list {
                  .project-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    margin-bottom: 0.5rem;
                    background: var(--color-bg-secondary);
                    border-radius: 6px;
                    gap: 1rem;

                    .project-name {
                      font-size: 0.9rem;
                      color: var(--color-text-primary);
                      font-weight: 500;
                      flex: 1;
                    }

                    .project-time {
                      font-size: 0.8rem;
                      color: var(--color-text-secondary);
                      white-space: nowrap;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .learning-timeline {
    margin-bottom: 4rem;

    .timeline-title {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 2rem;
      color: var(--color-text-primary);
    }

    .timeline-container {
      position: relative;

      .timeline-line {
        position: absolute;
        left: 2rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--color-border);
        z-index: 1;
      }

      .timeline-phase {
        position: relative;
        margin-bottom: 3rem;
        padding-left: 6rem;

        &:last-child {
          margin-bottom: 0;
        }

        .phase-marker {
          position: absolute;
          left: 0;
          top: 0;

          .marker-circle {
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            background: var(--color-primary);
            border: 3px solid var(--color-bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            position: relative;

            .phase-number {
              font-size: 1.2rem;
              font-weight: 700;
              color: white;
            }
          }
        }

        .phase-content {
          background: var(--color-bg-secondary);
          border-radius: 12px;
          padding: 2rem;
          border: 2px solid var(--color-border);

          .phase-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;

            .phase-name {
              font-size: 1.5rem;
              font-weight: 600;
              color: var(--color-text-primary);
              margin: 0;
              flex: 1;
            }

            .phase-duration {
              padding: 0.5rem 1rem;
              background: var(--color-primary-light);
              color: var(--color-primary);
              border-radius: 20px;
              font-weight: 500;
              font-size: 0.9rem;
            }

            .phase-focus {
              padding: 0.5rem 1rem;
              border-radius: 20px;
              font-weight: 500;
              font-size: 0.9rem;

              &.focus-architecture {
                background: rgba(0, 123, 255, 0.1);
                color: #007bff;
              }

              &.focus-performance {
                background: rgba(40, 167, 69, 0.1);
                color: #28a745;
              }

              &.focus-engineering {
                background: rgba(255, 193, 7, 0.1);
                color: #ffc107;
              }
            }
          }

          .phase-goals,
          .phase-projects {
            margin-bottom: 2rem;

            &:last-child {
              margin-bottom: 0;
            }

            h5 {
              font-size: 1.2rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: var(--color-text-primary);
            }
          }

          .goals-grid,
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }

          .goal-card,
          .project-card {
            background: var(--color-bg-primary);
            border-radius: 8px;
            padding: 1.5rem;
            border: 2px solid var(--color-border);

            .goal-title,
            .project-name {
              font-size: 1.1rem;
              font-weight: 600;
              color: var(--color-text-primary);
              margin-bottom: 0.5rem;
            }

            .goal-description,
            .project-description {
              font-size: 0.9rem;
              color: var(--color-text-secondary);
              margin-bottom: 1rem;
              line-height: 1.5;
            }
          }

          .project-card {
            .project-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 1rem;
              gap: 1rem;

              .project-difficulty {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 500;
                white-space: nowrap;

                &.beginner {
                  background: var(--color-success-light);
                  color: var(--color-success);
                }

                &.intermediate {
                  background: var(--color-warning-light);
                  color: var(--color-warning);
                }

                &.advanced {
                  background: var(--color-danger-light);
                  color: var(--color-danger);
                }
              }
            }

            .project-meta {
              margin-bottom: 1rem;

              .project-time {
                padding: 0.25rem 0.5rem;
                background: var(--color-bg-tertiary);
                color: var(--color-text-secondary);
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 500;
              }
            }
          }

          .goal-success-criteria,
          .project-outputs {
            .criteria-label,
            .outputs-label {
              font-size: 0.85rem;
              font-weight: 600;
              color: var(--color-text-primary);
            }

            .criteria-list,
            .outputs-list {
              list-style: none;
              padding: 0;
              margin-top: 0.5rem;

              li {
                font-size: 0.8rem;
                color: var(--color-text-secondary);
                padding: 0.25rem 0;
                border-bottom: 1px solid var(--color-border);

                &:last-child {
                  border-bottom: none;
                }
              }
            }
          }
        }
      }
    }
  }

  .learning-resources {
    margin-bottom: 4rem;

    .resources-title {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 2rem;
      color: var(--color-text-primary);
    }

    .resources-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;

      .resource-category {
        background: var(--color-bg-secondary);
        border-radius: 12px;
        padding: 2rem;
        border: 2px solid var(--color-border);

        .category-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .resource-list {
          .resource-item {
            background: var(--color-bg-primary);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 2px solid var(--color-border);
            transition: all 0.3s ease;

            &:hover {
              border-color: var(--color-primary);
              transform: translateY(-2px);
            }

            &:last-child {
              margin-bottom: 0;
            }

            .resource-info {
              .resource-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--color-text-primary);
                margin-bottom: 0.5rem;
              }

              .resource-description {
                font-size: 0.9rem;
                color: var(--color-text-secondary);
                margin-bottom: 1rem;
                line-height: 1.5;
              }

              .resource-meta {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;

                .resource-time,
                .resource-priority {
                  padding: 0.25rem 0.5rem;
                  border-radius: 4px;
                  font-size: 0.8rem;
                  font-weight: 500;
                }

                .resource-time {
                  background: var(--color-bg-tertiary);
                  color: var(--color-text-secondary);
                }

                .resource-priority {
                  &.high {
                    background: var(--color-danger-light);
                    color: var(--color-danger);
                  }

                  &.medium {
                    background: var(--color-warning-light);
                    color: var(--color-warning);
                  }

                  &.low {
                    background: var(--color-success-light);
                    color: var(--color-success);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .success-metrics {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    border: 2px solid var(--color-border);

    .metrics-title {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 2rem;
      color: var(--color-text-primary);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;

      .metric-card {
        background: var(--color-bg-primary);
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        border: 2px solid var(--color-border);
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--color-primary);
          transform: translateY(-4px);
        }

        .metric-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .metric-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 1rem;
        }

        .metric-list {
          list-style: none;
          padding: 0;
          text-align: left;

          li {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: var(--color-bg-secondary);
            border-radius: 6px;
            border-left: 4px solid var(--color-primary);
            font-size: 0.9rem;
            line-height: 1.4;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }

  // Responsive Design
  @media (max-width: 768px) {
    padding: 1rem;

    .learning-header {
      .learning-title {
        font-size: 2rem;
      }

      .learning-overview {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .learning-tracks .tracks-container {
      grid-template-columns: 1fr;
    }

    .learning-timeline .timeline-container .timeline-phase {
      padding-left: 5rem;

      .phase-marker .marker-circle {
        width: 3rem;
        height: 3rem;

        .phase-number {
          font-size: 1rem;
        }
      }

      .phase-content {
        padding: 1.5rem;

        .phase-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .goals-grid,
        .projects-grid {
          grid-template-columns: 1fr;
        }
      }
    }

    .learning-resources .resources-categories {
      grid-template-columns: 1fr;
    }

    .success-metrics .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
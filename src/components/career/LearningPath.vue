<template>
  <div class="learning-path">
    <div class="learning-header">
      <h2 class="learning-title">{{ learningPath?.title || t('career.learning.title') }}</h2>
      <p class="learning-description">{{ learningPath?.description || t('career.learning.description') }}</p>
      
      <div class="learning-overview">
        <div class="overview-item">
          <span class="overview-label">{{ t('career.learning.totalDuration') }}</span>
          <span class="overview-value">{{ learningPath?.totalDuration || t('career.learning.defaultDuration') }}</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">{{ t('career.learning.focusAreas') }}</span>
          <span class="overview-value">{{ t('career.learning.threeFocus') }}</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">{{ t('career.learning.approach') }}</span>
          <span class="overview-value">{{ t('career.learning.parallelLearning') }}</span>
        </div>
      </div>
    </div>

    <!-- Three-Track Parallel Learning -->
    <div class="learning-tracks">
      <h3 class="tracks-title">{{ t('career.learning.parallelTracks') }}</h3>
      <div class="tracks-container">
        <div class="track architecture-track">
          <div class="track-header">
            <div class="track-icon">🏗️</div>
            <h4 class="track-title">{{ t('career.learning.tracks.architecture') }}</h4>
            <p class="track-subtitle">{{ t('career.learning.tracks.architectureDesc') }}</p>
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
                  <h6>{{ t('career.learning.practicalProjects') }}</h6>
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
            <h4 class="track-title">{{ t('career.learning.tracks.performance') }}</h4>
            <p class="track-subtitle">{{ t('career.learning.tracks.performanceDesc') }}</p>
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
                  <h6>{{ t('career.learning.practicalProjects') }}</h6>
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
            <h4 class="track-title">{{ t('career.learning.tracks.engineering') }}</h4>
            <p class="track-subtitle">{{ t('career.learning.tracks.engineeringDesc') }}</p>
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
                  <h6>{{ t('career.learning.practicalProjects') }}</h6>
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
      <h3 class="resources-title">{{ t('career.learning.recommendedResources') }}</h3>
      <div class="resources-categories">
        <div class="resource-category">
          <h4 class="category-title">{{ t('career.learning.resources.books') }}</h4>
          <div class="resource-list">
            <div v-for="book in recommendedBooks" :key="book.id" class="resource-item">
              <div class="resource-info">
                <h5 class="resource-title">{{ book.title }}</h5>
                <p class="resource-description">{{ book.description }}</p>
                <div class="resource-meta">
                  <span class="resource-time">{{ book.estimatedTime }}</span>
                  <span :class="['resource-priority', book.priority]">
                    {{ t(`career.learning.priority.${book.priority}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="resource-category">
          <h4 class="category-title">{{ t('career.learning.resources.courses') }}</h4>
          <div class="resource-list">
            <div v-for="course in recommendedCourses" :key="course.id" class="resource-item">
              <div class="resource-info">
                <h5 class="resource-title">{{ course.title }}</h5>
                <p class="resource-description">{{ course.description }}</p>
                <div class="resource-meta">
                  <span class="resource-time">{{ course.estimatedTime }}</span>
                  <span :class="['resource-priority', course.priority]">
                    {{ t(`career.learning.priority.${course.priority}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="resource-category">
          <h4 class="category-title">{{ t('career.learning.resources.practices') }}</h4>
          <div class="resource-list">
            <div v-for="practice in recommendedPractices" :key="practice.id" class="resource-item">
              <div class="resource-info">
                <h5 class="resource-title">{{ practice.title }}</h5>
                <p class="resource-description">{{ practice.description }}</p>
                <div class="resource-meta">
                  <span class="resource-time">{{ practice.estimatedTime }}</span>
                  <span :class="['resource-priority', practice.priority]">
                    {{ t(`career.learning.priority.${practice.priority}`) }}
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
      <h3 class="metrics-title">{{ t('career.learning.successMetrics') }}</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">📊</div>
          <h4 class="metric-title">{{ t('career.learning.metrics.technical') }}</h4>
          <ul class="metric-list">
            <li>{{ t('career.learning.metrics.technicalItems.architecture') }}</li>
            <li>{{ t('career.learning.metrics.technicalItems.performance') }}</li>
            <li>{{ t('career.learning.metrics.technicalItems.engineering') }}</li>
          </ul>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <h4 class="metric-title">{{ t('career.learning.metrics.career') }}</h4>
          <ul class="metric-list">
            <li>{{ t('career.learning.metrics.careerItems.position') }}</li>
            <li>{{ t('career.learning.metrics.careerItems.salary') }}</li>
            <li>{{ t('career.learning.metrics.careerItems.recognition') }}</li>
          </ul>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🌟</div>
          <h4 class="metric-title">{{ t('career.learning.metrics.impact') }}</h4>
          <ul class="metric-list">
            <li>{{ t('career.learning.metrics.impactItems.team') }}</li>
            <li>{{ t('career.learning.metrics.impactItems.projects') }}</li>
            <li>{{ t('career.learning.metrics.impactItems.industry') }}</li>
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
const { t, tm } = useI18n();

// Helper to transform i18n object to array
const getListFromI18n = (key: string) => {
  const items = tm(key) as Record<string, any>;
  if (!items) return [];
  return Object.keys(items).map(k => ({
    id: k,
    ...items[k]
  }));
};

// Computed properties for three-track parallel learning
const architecturePhases = computed(() => getListFromI18n('career.learning.trackPhases.architecture'));
const performancePhases = computed(() => getListFromI18n('career.learning.trackPhases.performance'));
const engineeringPhases = computed(() => getListFromI18n('career.learning.trackPhases.engineering'));

// Computed properties for recommended resources
const recommendedBooks = computed(() => getListFromI18n('career.learning.resourceItems.books'));
const recommendedCourses = computed(() => getListFromI18n('career.learning.resourceItems.courses'));
const recommendedPractices = computed(() => getListFromI18n('career.learning.resourceItems.practices'));

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
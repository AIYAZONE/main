<template>
  <div class="career-roadmap">
    <div class="roadmap-header">
      <h2 class="roadmap-title">{{ displayRoadmapData?.title || $t('career.roadmap.title') }}</h2>
      <p class="roadmap-description">{{ displayRoadmapData?.description || $t('career.roadmap.description') }}</p>
      
      <div class="roadmap-overview">
        <div class="overview-item">
          <span class="overview-label">{{ $t('career.roadmap.targetRole') }}</span>
          <span class="overview-value">{{ displayRoadmapData?.targetRole }}</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">{{ $t('career.roadmap.targetSalary') }}</span>
          <span class="overview-value">{{ displayRoadmapData?.targetSalaryRange }}</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">{{ $t('career.roadmap.currentPhase') }}</span>
          <span class="overview-value">{{ currentPhaseName }}</span>
        </div>
      </div>
    </div>

    <div class="roadmap-timeline" v-if="displayPhases && displayPhases.length > 0">
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        <div 
          v-for="(phase, index) in displayPhases" 
          :key="phase.id"
          :class="[
            'timeline-phase',
            { 
              'active': index === displayCurrentPhase,
              'completed': index < displayCurrentPhase,
              'upcoming': index > displayCurrentPhase
            }
          ]"
        >
          <div class="phase-marker">
            <div class="marker-circle">
              <span class="phase-number" v-if="index >= displayCurrentPhase">{{ index + 1 }}</span>
              <svg v-else class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="marker-line"></div>
          </div>

          <div class="phase-content">
            <div class="phase-header">
              <h3 class="phase-name">{{ phase.name }}</h3>
              <span class="phase-duration">{{ phase.duration }}</span>
            </div>

            <div class="phase-objectives">
              <h4>{{ $t('career.roadmap.objectives') }}</h4>
              <ul class="objectives-list">
                <li v-for="objective in phase.objectives" :key="objective">
                  {{ objective }}
                </li>
              </ul>
            </div>

            <div class="phase-milestones" v-if="phase.keyMilestones.length > 0">
              <h4>{{ $t('career.roadmap.keyMilestones') }}</h4>
              <div class="milestones-grid">
                <div 
                  v-for="milestone in phase.keyMilestones" 
                  :key="milestone.id"
                  :class="['milestone-card', { completed: milestone.completed }]"
                >
                  <div class="milestone-header">
                    <h5 class="milestone-title">{{ milestone.title }}</h5>
                    <span class="milestone-date">{{ formatDate(milestone.targetDate) }}</span>
                  </div>
                  <p class="milestone-description">{{ milestone.description }}</p>
                  <div class="milestone-metrics" v-if="milestone.metrics">
                    <span class="metrics-label">{{ $t('career.roadmap.metrics') }}:</span>
                    <ul class="metrics-list">
                      <li v-for="metric in milestone.metrics" :key="metric">{{ metric }}</li>
                    </ul>
                  </div>
                  <div class="milestone-status">
                    <span :class="['status-badge', milestone.completed ? 'completed' : 'pending']">
                      {{ milestone.completed ? $t('career.roadmap.completed') : $t('career.roadmap.pending') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="phase-learning-goals" v-if="phase.learningGoals.length > 0">
              <h4>{{ $t('career.roadmap.learningGoals') }}</h4>
              <div class="learning-goals-grid">
                <div 
                  v-for="goal in phase.learningGoals" 
                  :key="goal.id"
                  :class="['learning-goal-card', `category-${goal.category}`]"
                >
                  <div class="goal-header">
                    <h5 class="goal-title">{{ goal.title }}</h5>
                    <span class="goal-category">{{ $t(`career.roadmap.categories.${goal.category}`) }}</span>
                  </div>
                  <p class="goal-description">{{ goal.description }}</p>
                  
                  <div class="goal-resources" v-if="goal.resources.length > 0">
                    <h6>{{ $t('career.roadmap.resources') }}</h6>
                    <ul class="resources-list">
                      <li v-for="resource in goal.resources" :key="resource.id" class="resource-item">
                        <a :href="resource.url" target="_blank" class="resource-link">
                          <span class="resource-title">{{ resource.title }}</span>
                          <span class="resource-type">{{ $t(`career.roadmap.resourceTypes.${resource.type}`) }}</span>
                          <span class="resource-time">{{ resource.estimatedTime }}</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div class="goal-projects" v-if="goal.practicalProjects.length > 0">
                    <h6>{{ $t('career.roadmap.practicalProjects') }}</h6>
                    <div class="projects-list">
                      <div v-for="project in goal.practicalProjects" :key="project.id" class="project-item">
                        <h6 class="project-name">{{ project.name }}</h6>
                        <p class="project-description">{{ project.description }}</p>
                        <div class="project-meta">
                          <span class="project-time">{{ project.estimatedTime }}</span>
                          <span :class="['project-difficulty', project.difficulty]">
                            {{ $t(`career.roadmap.difficulty.${project.difficulty}`) }}
                          </span>
                        </div>
                        <div class="project-outputs" v-if="project.outputs.length > 0">
                          <span class="outputs-label">{{ $t('career.roadmap.outputs') }}:</span>
                          <ul class="outputs-list">
                            <li v-for="output in project.outputs" :key="output">{{ output }}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="goal-success-criteria" v-if="goal.successCriteria.length > 0">
                    <h6>{{ $t('career.roadmap.successCriteria') }}</h6>
                    <ul class="criteria-list">
                      <li v-for="criteria in goal.successCriteria" :key="criteria">{{ criteria }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="phase-deliverables" v-if="phase.deliverables.length > 0">
              <h4>{{ $t('career.roadmap.deliverables') }}</h4>
              <div class="deliverables-grid">
                <div 
                  v-for="deliverable in phase.deliverables" 
                  :key="deliverable.id"
                  :class="['deliverable-card', `status-${deliverable.status}`, `type-${deliverable.type}`]"
                >
                  <div class="deliverable-header">
                    <h5 class="deliverable-title">{{ deliverable.title }}</h5>
                    <span class="deliverable-type">{{ $t(`career.roadmap.deliverableTypes.${deliverable.type}`) }}</span>
                  </div>
                  <p class="deliverable-description">{{ deliverable.description }}</p>
                  <div class="deliverable-meta">
                    <span class="deliverable-due-date">{{ $t('career.roadmap.dueDate') }}: {{ formatDate(deliverable.dueDate) }}</span>
                    <span :class="['deliverable-status', deliverable.status]">
                      {{ $t(`career.roadmap.deliverableStatus.${deliverable.status}`) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="roadmap-progress" v-if="displayPhases && displayPhases.length > 0">
      <h3>{{ $t('career.roadmap.progress') }}</h3>
      <div class="progress-overview">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${getOverallProgress()}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ getOverallProgress() }}% {{ $t('career.roadmap.completed') }}</span>
      </div>
      
      <div class="progress-phases">
        <div 
          v-for="(phase, index) in displayPhases" 
          :key="phase.id"
          class="progress-phase"
        >
          <span class="progress-phase-name">{{ phase.name }}</span>
          <div class="progress-phase-bar">
            <div 
              class="progress-phase-fill" 
              :style="{ width: `${getPhaseProgress(index)}%` }"
            ></div>
          </div>
          <span class="progress-phase-text">{{ getPhaseProgress(index) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCareerStore } from '../../stores/careerStore';
import type { RoadmapData, RoadmapPhase } from '../../types/career';

interface Props {
  roadmapData?: RoadmapData | null;
  phases?: RoadmapPhase[];
  currentPhase?: number;
}

const props = withDefaults(defineProps<Props>(), {
  phases: () => [],
  currentPhase: 0
});

const { t } = useI18n();
const careerStore = useCareerStore();

onMounted(() => {
  if (!careerStore.roadmapData) {
    careerStore.loadCareerData();
  }
});

// Computed properties to handle data source (Props priority > Store fallback)
const displayRoadmapData = computed(() => props.roadmapData || careerStore.roadmapData);

const displayPhases = computed(() => {
  if (props.phases && props.phases.length > 0) return props.phases;
  return displayRoadmapData.value?.phases || [];
});

const displayCurrentPhase = computed(() => {
  // If roadmapData is provided via props, trust the currentPhase prop (even if 0)
  if (props.roadmapData) return props.currentPhase;
  // Otherwise use the store's currentPhase
  return displayRoadmapData.value?.currentPhase || 0;
});

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const currentPhaseName = computed(() => {
  const phases = displayPhases.value;
  const current = displayCurrentPhase.value;
  if (phases && phases[current]) {
    return phases[current].name;
  }
  return t('career.roadmap.notStarted');
});

const getPhaseProgress = (phaseIndex: number): number => {
  const current = displayCurrentPhase.value;
  
  if (phaseIndex < current) {
    return 100;
  } else if (phaseIndex === current) {
    const phase = displayPhases.value[phaseIndex];
    if (!phase || !phase.keyMilestones.length) return 0;
    
    const completedMilestones = phase.keyMilestones.filter(m => m.completed).length;
    return Math.round((completedMilestones / phase.keyMilestones.length) * 100);
  } else {
    return 0;
  }
};

const getOverallProgress = (): number => {
  const phases = displayPhases.value;
  if (!phases.length) return 0;
  
  const totalPhases = phases.length;
  const completedPhases = displayCurrentPhase.value;
  const currentPhaseProgress = getPhaseProgress(completedPhases) / 100;
  
  return Math.round(((completedPhases + currentPhaseProgress) / totalPhases) * 100);
};
</script>

<style scoped lang="less">
  .career-roadmap {
    width: 100%;
    margin: 0 auto;
    padding: 2rem 0;

  .roadmap-header {
    text-align: center;
    margin-bottom: 3rem;

    .roadmap-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 1rem;
    }

    .roadmap-description {
      font-size: 1.1rem;
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .roadmap-overview {
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

  .roadmap-timeline {
    margin-bottom: 3rem;

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
        margin-bottom: 4rem;
        padding-left: 6rem;

        &:last-child {
          margin-bottom: 0;
        }

        .phase-marker {
          position: absolute;
          left: 0;
          top: 0;

          .marker-circle {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 50%;
            background: var(--brand-bg-primary);
            border: 2px solid var(--brand-border);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            position: relative;
            transition: all 0.3s var(--brand-ease-premium);

            .phase-number {
              font-family: var(--brand-font-display);
              font-size: 1.2rem;
              font-weight: 700;
              color: var(--brand-text-tertiary);
            }
            
            .check-icon {
              color: white;
            }
          }
        }

        &.completed .marker-circle {
          background: var(--brand-success);
          border-color: var(--brand-success);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

          .phase-number {
            color: white;
          }
        }

        &.active .marker-circle {
          background: var(--brand-gold-start);
          border-color: var(--brand-gold-start);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.15), 0 8px 20px rgba(212, 175, 55, 0.25);
          transform: scale(1.1);

          .phase-number {
            color: white;
          }
        }

        &.upcoming .marker-circle {
          background: var(--brand-bg-secondary);
          border-color: var(--brand-border);
        }

        .phase-content {
          background: var(--color-bg-secondary);
          border-radius: 12px;
          padding: 2rem;
          border: 2px solid var(--color-border);
          margin-top: -1rem;

          .phase-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;

            .phase-name {
              font-size: 1.5rem;
              font-weight: 600;
              color: var(--color-text-primary);
              margin: 0;
            }

            .phase-duration {
              padding: 0.5rem 1rem;
              background: var(--color-primary-light);
              color: var(--color-primary);
              border-radius: 20px;
              font-weight: 500;
              font-size: 0.9rem;
            }
          }

          .phase-objectives {
            margin-bottom: 2rem;

            h4 {
              font-size: 1.2rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: var(--color-text-primary);
            }

            .objectives-list {
              list-style: none;
              padding: 0;

              li {
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                background: var(--color-bg-primary);
                border-radius: 6px;
                border-left: 4px solid var(--color-primary);
                font-size: 0.95rem;
                line-height: 1.5;

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }

          .phase-milestones {
            margin-bottom: 2rem;

            h4 {
              font-size: 1.2rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: var(--color-text-primary);
            }

            .milestones-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1rem;

              .milestone-card {
                background: var(--color-bg-primary);
                border-radius: 8px;
                padding: 1.5rem;
                border: 2px solid var(--color-border);
                transition: all 0.3s ease;

                &:hover {
                  border-color: var(--color-primary);
                  transform: translateY(-2px);
                }

                &.completed {
                  border-color: var(--color-success);
                  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
                }

                .milestone-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 1rem;
                  gap: 1rem;

                  .milestone-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin: 0;
                    flex: 1;
                  }

                  .milestone-date {
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                    white-space: nowrap;
                  }
                }

                .milestone-description {
                  font-size: 0.9rem;
                  color: var(--color-text-secondary);
                  margin-bottom: 1rem;
                  line-height: 1.5;
                }

                .milestone-metrics {
                  margin-bottom: 1rem;

                  .metrics-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                  }

                  .metrics-list {
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

                .milestone-status {
                  .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;

                    &.completed {
                      background: var(--color-success-light);
                      color: var(--color-success);
                    }

                    &.pending {
                      background: var(--color-warning-light);
                      color: var(--color-warning);
                    }
                  }
                }
              }
            }
          }

          .phase-learning-goals {
            margin-bottom: 2rem;

            h4 {
              font-size: 1.2rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: var(--color-text-primary);
            }

            .learning-goals-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
              gap: 1.5rem;

              .learning-goal-card {
                background: var(--color-bg-primary);
                border-radius: 8px;
                padding: 1.5rem;
                border: 2px solid var(--color-border);

                &.category-architecture {
                  border-left-color: #007bff;
                }

                &.category-performance {
                  border-left-color: #28a745;
                }

                &.category-engineering {
                  border-left-color: #ffc107;
                }

                .goal-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 1rem;
                  gap: 1rem;

                  .goal-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin: 0;
                    flex: 1;
                  }

                  .goal-category {
                    padding: 0.25rem 0.5rem;
                    background: var(--color-bg-tertiary);
                    color: var(--color-text-secondary);
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    white-space: nowrap;
                  }
                }

                .goal-description {
                  font-size: 0.9rem;
                  color: var(--color-text-secondary);
                  margin-bottom: 1.5rem;
                  line-height: 1.5;
                }

                .goal-resources,
                .goal-projects,
                .goal-success-criteria {
                  margin-bottom: 1.5rem;

                  &:last-child {
                    margin-bottom: 0;
                  }

                  h6 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    color: var(--color-text-primary);
                  }
                }

                .resources-list {
                  list-style: none;
                  padding: 0;

                  .resource-item {
                    margin-bottom: 0.5rem;

                    .resource-link {
                      display: flex;
                      flex-direction: column;
                      gap: 0.25rem;
                      padding: 0.75rem;
                      background: var(--color-bg-secondary);
                      border-radius: 6px;
                      text-decoration: none;
                      color: inherit;
                      transition: all 0.3s ease;

                      &:hover {
                        background: var(--color-primary-light);
                        transform: translateX(4px);
                      }

                      .resource-title {
                        font-weight: 500;
                        color: var(--color-text-primary);
                      }

                      .resource-type,
                      .resource-time {
                        font-size: 0.8rem;
                        color: var(--color-text-secondary);
                      }
                    }
                  }
                }

                .projects-list {
                  .project-item {
                    background: var(--color-bg-secondary);
                    border-radius: 6px;
                    padding: 1rem;
                    margin-bottom: 1rem;

                    &:last-child {
                      margin-bottom: 0;
                    }

                    .project-name {
                      font-size: 1rem;
                      font-weight: 600;
                      margin-bottom: 0.5rem;
                      color: var(--color-text-primary);
                    }

                    .project-description {
                      font-size: 0.85rem;
                      color: var(--color-text-secondary);
                      margin-bottom: 0.75rem;
                      line-height: 1.4;
                    }

                    .project-meta {
                      display: flex;
                      gap: 1rem;
                      margin-bottom: 0.75rem;
                      flex-wrap: wrap;

                      .project-time,
                      .project-difficulty {
                        padding: 0.25rem 0.5rem;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        font-weight: 500;
                      }

                      .project-time {
                        background: var(--color-bg-tertiary);
                        color: var(--color-text-secondary);
                      }

                      .project-difficulty {
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

                    .project-outputs {
                      .outputs-label {
                        font-size: 0.8rem;
                        font-weight: 600;
                        color: var(--color-text-primary);
                      }

                      .outputs-list {
                        list-style: none;
                        padding: 0;
                        margin-top: 0.5rem;

                        li {
                          font-size: 0.75rem;
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

                .criteria-list {
                  list-style: none;
                  padding: 0;

                  li {
                    padding: 0.5rem;
                    margin-bottom: 0.5rem;
                    background: var(--color-bg-secondary);
                    border-radius: 4px;
                    font-size: 0.85rem;
                    line-height: 1.4;

                    &:last-child {
                      margin-bottom: 0;
                    }
                  }
                }
              }
            }
          }

          .phase-deliverables {
            h4 {
              font-size: 1.2rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: var(--color-text-primary);
            }

            .deliverables-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1rem;

              .deliverable-card {
                background: var(--color-bg-primary);
                border-radius: 8px;
                padding: 1.5rem;
                border: 2px solid var(--color-border);

                &.type-code {
                  border-left-color: #007bff;
                }

                &.type-document {
                  border-left-color: #28a745;
                }

                &.type-presentation {
                  border-left-color: #ffc107;
                }

                &.type-analysis {
                  border-left-color: #dc3545;
                }

                .deliverable-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 1rem;
                  gap: 1rem;

                  .deliverable-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin: 0;
                    flex: 1;
                  }

                  .deliverable-type {
                    padding: 0.25rem 0.5rem;
                    background: var(--color-bg-tertiary);
                    color: var(--color-text-secondary);
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    white-space: nowrap;
                  }
                }

                .deliverable-description {
                  font-size: 0.9rem;
                  color: var(--color-text-secondary);
                  margin-bottom: 1rem;
                  line-height: 1.5;
                }

                .deliverable-meta {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap: 1rem;
                  flex-wrap: wrap;

                  .deliverable-due-date {
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                  }

                  .deliverable-status {
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;

                    &.pending {
                      background: var(--color-warning-light);
                      color: var(--color-warning);
                    }

                    &.in-progress {
                      background: var(--color-primary-light);
                      color: var(--color-primary);
                    }

                    &.completed {
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
  }

  .roadmap-progress {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    border: 2px solid var(--color-border);

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--color-text-primary);
      text-align: center;
    }

    .progress-overview {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      .progress-bar {
        flex: 1;
        height: 12px;
        background: var(--color-bg-tertiary);
        border-radius: 6px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-success));
          border-radius: 6px;
          transition: width 0.3s ease;
        }
      }

      .progress-text {
        font-weight: 600;
        color: var(--color-text-primary);
        white-space: nowrap;
      }
    }

    .progress-phases {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .progress-phase {
        display: flex;
        align-items: center;
        gap: 1rem;

        .progress-phase-name {
          min-width: 200px;
          font-size: 0.9rem;
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .progress-phase-bar {
          flex: 1;
          height: 8px;
          background: var(--color-bg-tertiary);
          border-radius: 4px;
          overflow: hidden;

          .progress-phase-fill {
            height: 100%;
            background: var(--color-primary);
            border-radius: 4px;
            transition: width 0.3s ease;
          }
        }

        .progress-phase-text {
          min-width: 40px;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          text-align: right;
        }
      }
    }
  }

  // Responsive Design
  @media (max-width: 768px) {
    padding: 1rem;

    .roadmap-header {
      .roadmap-title {
        font-size: 2rem;
      }

      .roadmap-overview {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .roadmap-timeline {
      .timeline-container {
        .timeline-phase {
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

            .milestones-grid,
            .learning-goals-grid,
            .deliverables-grid {
              grid-template-columns: 1fr;
            }
          }
        }
      }
    }

    .roadmap-progress {
      padding: 1.5rem;

      .progress-phases .progress-phase {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;

        .progress-phase-name {
          min-width: auto;
        }

        .progress-phase-text {
          text-align: left;
        }
      }
    }
  }
}
</style>
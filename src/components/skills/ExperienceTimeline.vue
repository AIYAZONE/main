<template>
  <div class="experience-timeline">
    <div class="experience-timeline__header">
      <h3 class="experience-timeline__title">{{ title || $t('career.timeline.title') }}</h3>
      <div class="experience-timeline__summary">
        <div class="timeline-summary">
          <div class="timeline-summary__item">
            <span class="timeline-summary__value">{{ totalYears }}</span>
            <span class="timeline-summary__label">{{ $t('career.timeline.summary.yearsExp') }}</span>
          </div>
          <div class="timeline-summary__item">
            <span class="timeline-summary__value">{{ experienceItems.length }}</span>
            <span class="timeline-summary__label">{{ $t('career.timeline.summary.companies') }}</span>
          </div>
          <div class="timeline-summary__item">
            <span class="timeline-summary__value">{{ totalAchievements }}</span>
            <span class="timeline-summary__label">{{ $t('career.timeline.summary.achievements') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="experience-timeline__content">
      <div class="timeline">
        <div class="timeline__line"></div>
        
        <div
          v-for="(item, index) in sortedExperience"
          :key="item.id"
          class="timeline__item"
          :class="{
            'timeline__item--current': !item.endDate,
            'timeline__item--highlight': isHighlightItem(item)
          }"
        >
          <div class="timeline__marker">
            <div class="timeline__marker-dot"></div>
            <div v-if="!item.endDate" class="timeline__marker-pulse"></div>
          </div>

          <div class="timeline__content">
            <div class="experience-card">
              <div class="experience-card__header">
                <div class="experience-card__title-section">
                  <h4 class="experience-card__position">{{ item.position }}</h4>
                  <h5 class="experience-card__company">{{ item.company }}</h5>
                </div>
                <div class="experience-card__duration">
                  <span class="experience-card__dates">
                    {{ formatDate(item.startDate) }} - 
                    {{ item.endDate ? formatDate(item.endDate) : $t('career.timeline.present') }}
                  </span>
                  <span class="experience-card__period">
                    {{ calculateDuration(item.startDate, item.endDate) }}
                  </span>
                </div>
              </div>

              <div class="experience-card__body">
                <div class="experience-card__achievements">
                  <h6 class="experience-card__section-title">{{ $t('career.timeline.sections.achievements') }}</h6>
                  <ul class="achievement-list">
                    <li
                      v-for="(achievement, achIndex) in item.achievements"
                      :key="achIndex"
                      class="achievement-list__item"
                    >
                      {{ achievement }}
                    </li>
                  </ul>
                </div>

                <div class="experience-card__technologies">
                  <h6 class="experience-card__section-title">{{ $t('career.timeline.sections.technologies') }}</h6>
                  <div class="tech-tags">
                    <span
                      v-for="tech in item.technologies"
                      :key="tech"
                      class="tech-tag"
                      :class="getTechTagClass(tech)"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="experience-card__footer">
                <div class="experience-card__metrics">
                  <div class="metric-item">
                    <span class="metric-item__value">{{ item.achievements.length }}</span>
                    <span class="metric-item__label">{{ $t('career.timeline.metrics.achievements') }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-item__value">{{ item.technologies.length }}</span>
                    <span class="metric-item__label">{{ $t('career.timeline.metrics.technologies') }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-item__value">{{ getExperienceLevel(index) }}</span>
                    <span class="metric-item__label">{{ $t('career.timeline.metrics.level') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Career Milestones -->
    <div class="experience-timeline__milestones">
      <h4 class="milestones__title">{{ $t('career.timeline.milestones.title') }}</h4>
      <div class="milestones__grid">
        <div
          v-for="milestone in careerMilestones"
          :key="milestone.id"
          class="milestone-card"
        >
          <div class="milestone-card__icon">
            <span class="milestone-icon" :class="milestone.iconClass">{{ milestone.icon }}</span>
          </div>
          <div class="milestone-card__content">
            <h5 class="milestone-card__title">{{ milestone.title }}</h5>
            <p class="milestone-card__description">{{ milestone.description }}</p>
            <span class="milestone-card__year">{{ milestone.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExperienceItem } from '../../types/skills';

// Props
interface Props {
  experienceItems: readonly ExperienceItem[];
  title?: string;
  highlightCurrent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  highlightCurrent: true
});

const { t } = useI18n();

// Computed properties
const sortedExperience = computed(() => {
  return [...props.experienceItems].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA; // Most recent first
  });
});

const totalYears = computed(() => {
  if (props.experienceItems.length === 0) return 0;
  
  const earliest = props.experienceItems.reduce((earliest, item) => {
    const itemStart = new Date(item.startDate);
    return itemStart < earliest ? itemStart : earliest;
  }, new Date(props.experienceItems[0].startDate));

  const latest = props.experienceItems.reduce((latest, item) => {
    const itemEnd = item.endDate ? new Date(item.endDate) : new Date();
    return itemEnd > latest ? itemEnd : latest;
  }, new Date(props.experienceItems[0].endDate || new Date()));

  const diffTime = Math.abs(latest.getTime() - earliest.getTime());
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  return diffYears;
});

const totalAchievements = computed(() => {
  return props.experienceItems.reduce((total, item) => total + item.achievements.length, 0);
});

const careerMilestones = computed(() => [
  {
    id: 'pmp-cert',
    title: t('career.timeline.milestones.items.pmp-cert.title'),
    description: t('career.timeline.milestones.items.pmp-cert.description'),
    year: '2022',
    icon: '🏆',
    iconClass: 'milestone-icon--achievement'
  },
  {
    id: 'acp-cert',
    title: t('career.timeline.milestones.items.acp-cert.title'),
    description: t('career.timeline.milestones.items.acp-cert.description'),
    year: '2021',
    icon: '⚡',
    iconClass: 'milestone-icon--skill'
  },
  {
    id: 'tech-lead',
    title: t('career.timeline.milestones.items.tech-lead.title'),
    description: t('career.timeline.milestones.items.tech-lead.description'),
    year: '2021',
    icon: '👥',
    iconClass: 'milestone-icon--leadership'
  },
  {
    id: 'senior-dev',
    title: t('career.timeline.milestones.items.senior-dev.title'),
    description: t('career.timeline.milestones.items.senior-dev.description'),
    year: '2018',
    icon: '💻',
    iconClass: 'milestone-icon--technical'
  },
  {
    id: 'first-job',
    title: t('career.timeline.milestones.items.first-job.title'),
    description: t('career.timeline.milestones.items.first-job.description'),
    year: '2014',
    icon: '🚀',
    iconClass: 'milestone-icon--start'
  }
]);

// Methods
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const calculateDuration = (startDate: Date | string, endDate?: Date | string): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  if (diffMonths < 12) {
    return `${diffMonths}${t('career.timeline.duration.months')}`;
  } else {
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    return months > 0 
      ? `${years}${t('career.timeline.duration.years')}${months}${t('career.timeline.duration.months')}` 
      : `${years}${t('career.timeline.duration.years')}`;
  }
};

const isHighlightItem = (item: ExperienceItem): boolean => {
  return props.highlightCurrent && !item.endDate;
};

const getTechTagClass = (tech: string): string => {
  const techCategories: Record<string, string> = {
    'Vue': 'tech-tag--frontend',
    'Vue 2': 'tech-tag--frontend',
    'Vue 3': 'tech-tag--frontend',
    'React': 'tech-tag--frontend',
    'TypeScript': 'tech-tag--frontend',
    'JavaScript': 'tech-tag--frontend',
    'Webpack': 'tech-tag--build',
    'Vite': 'tech-tag--build',
    'Less': 'tech-tag--style',
    'Sass': 'tech-tag--style',
    'Element Plus': 'tech-tag--ui',
    'Ant Design': 'tech-tag--ui',
    'Node.js': 'tech-tag--backend',
    'PHP': 'tech-tag--backend',
    'MySQL': 'tech-tag--database'
  };
  
  return techCategories[tech] || 'tech-tag--default';
};

const getExperienceLevel = (index: number): string => {
  const levels = [
    t('career.timeline.levels.techLead'),
    t('career.timeline.levels.senior'),
    t('career.timeline.levels.frontend'),
    t('career.timeline.levels.junior')
  ];
  return levels[index] || t('career.timeline.levels.engineer');
};
</script>

<style scoped lang="less">
.experience-timeline {
  padding: 2rem 0;

  &__header {
    margin-bottom: 2rem;
    text-align: center;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  &__summary {
    display: flex;
    justify-content: center;
  }

  &__content {
    margin-bottom: 3rem;
  }

  &__milestones {
    margin-top: 3rem;
  }
}

.timeline-summary {
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
  background: var(--color-bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--color-border);

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  &__value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__label {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }
}

.timeline {
  position: relative;
  padding-left: 2rem;

  &__line {
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--color-primary), var(--color-border));
  }

  &__item {
    position: relative;
    margin-bottom: 2rem;

    &--current {
      .timeline__marker-dot {
        background: var(--color-success);
        box-shadow: 0 0 0 4px rgba(var(--color-success-rgb), 0.2);
      }

      .experience-card {
        border-color: var(--color-success);
        box-shadow: 0 4px 20px rgba(var(--color-success-rgb), 0.1);
      }
    }

    &--highlight {
      .experience-card {
        background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-primary));
      }
    }
  }

  &__marker {
    position: absolute;
    left: -1.5rem;
    top: 1.5rem;
    z-index: 2;
  }

  &__marker-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 2px solid var(--color-bg-primary);
    transition: all 0.3s ease;
  }

  &__marker-pulse {
    position: absolute;
    top: -4px;
    left: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-success);
    opacity: 0.3;
    animation: pulse 2s infinite;
  }

  &__content {
    margin-left: 1rem;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

.experience-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
    gap: 1rem;
  }

  &__title-section {
    flex: 1;
  }

  &__position {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 0.25rem 0;
  }

  &__company {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__duration {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  &__dates {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }

  &__period {
    font-size: 0.8rem;
    color: var(--color-primary);
    font-weight: 600;
    background: rgba(var(--color-primary-rgb), 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  &__body {
    margin-bottom: 1.25rem;
  }

  &__section-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 0.75rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__achievements {
    margin-bottom: 1.25rem;
  }

  &__technologies {
    margin-bottom: 1rem;
  }

  &__footer {
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
  }

  &__metrics {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
  }
}

.achievement-list {
  list-style: none;
  padding: 0;
  margin: 0;

  &__item {
    position: relative;
    padding-left: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-secondary);
    line-height: 1.5;

    &:before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--color-primary);
      font-weight: bold;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &--frontend {
    background: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
  }

  &--build {
    background: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
  }

  &--style {
    background: rgba(236, 72, 153, 0.1);
    color: #EC4899;
  }

  &--ui {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
  }

  &--backend {
    background: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
  }

  &--database {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }

  &--default {
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  &__value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__label {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }
}

.milestones {
  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
}

.milestone-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &__icon {
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 0.5rem 0;
  }

  &__description {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0 0 0.5rem 0;
  }

  &__year {
    font-size: 0.8rem;
    color: var(--color-primary);
    font-weight: 600;
    background: rgba(var(--color-primary-rgb), 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
}

.milestone-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  font-size: 1.25rem;

  &--achievement {
    background: rgba(245, 158, 11, 0.1);
  }

  &--skill {
    background: rgba(59, 130, 246, 0.1);
  }

  &--leadership {
    background: rgba(16, 185, 129, 0.1);
  }

  &--technical {
    background: rgba(139, 92, 246, 0.1);
  }

  &--start {
    background: rgba(239, 68, 68, 0.1);
  }
}

// Responsive design
@media (max-width: 768px) {
  .experience-timeline {
    &__title {
      font-size: 1.5rem;
    }
  }

  .timeline-summary {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;

    &__item {
      flex-direction: row;
      gap: 0.5rem;
    }

    &__value {
      font-size: 1.25rem;
    }
  }

  .timeline {
    padding-left: 1.5rem;

    &__marker {
      left: -1.25rem;
    }

    &__content {
      margin-left: 0.5rem;
    }
  }

  .experience-card {
    padding: 1rem;

    &__header {
      flex-direction: column;
      gap: 0.75rem;
    }

    &__duration {
      align-items: flex-start;
    }

    &__metrics {
      gap: 1rem;
    }
  }

  .tech-tags {
    gap: 0.25rem;
  }

  .tech-tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }

  .milestones {
    &__grid {
      grid-template-columns: 1fr;
    }
  }

  .milestone-card {
    padding: 1rem;
    gap: 0.75rem;

    &__icon .milestone-icon {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1rem;
    }
  }
}
</style>
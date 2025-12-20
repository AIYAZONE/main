<template>
  <div 
    class="project-card" 
    :class="[`status-${project.status}`, { 'show-details': showDetails }]"
    @click="handleCardClick"
  >
    <div class="card-inner">
      <!-- Card Header (Icons & Actions) -->
      <div class="card-header">
        <div class="project-icon-box">
          <span class="project-icon">{{ getProjectIcon(project.category) }}</span>
        </div>
        
        <div class="card-actions">
          <a 
            v-if="project.url" 
            :href="project.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="action-link"
            @click.stop
            :title="$t('portfolio.visitProject')"
          >
            <span class="external-link-icon">↗</span>
          </a>
          
          <a 
            v-if="project.githubUrl" 
            :href="project.githubUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="action-link github-link"
            @click.stop
            :title="$t('portfolio.viewSource')"
          >
            <span class="github-icon">⚡</span>
          </a>
        </div>
      </div>

      <!-- Project Image -->
      <div class="project-image" v-if="project.imageUrl">
        <img 
          :src="project.imageUrl" 
          :alt="project.name"
          class="project-img"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <span class="view-btn">VIEW</span>
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <div class="project-header">
          <h3 class="project-title">{{ project.name }}</h3>
          <div class="project-category">
            <span class="category-tag">{{ getCategoryLabel(project.category) }}</span>
          </div>
        </div>

        <p class="project-description">{{ project.description }}</p>

        <!-- Tech Stack -->
        <div class="tech-stack" v-if="project.techStack.length > 0">
          <div class="tech-tags">
            <span 
              v-for="tech in displayedTechStack" 
              :key="tech" 
              class="tech-tag"
            >
              {{ tech }}
            </span>
            <span 
              v-if="project.techStack.length > maxDisplayedTech" 
              class="tech-more"
            >
              +{{ project.techStack.length - maxDisplayedTech }}
            </span>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer">
        <div class="project-status">
          <span class="status-dot" :class="`status-${project.status}`"></span>
          <span class="status-text">{{ getStatusLabel(project.status) }}</span>
        </div>

        <!-- Project Metrics -->
        <div class="project-metrics" v-if="project.metrics">
          <div class="metric" v-if="project.metrics.stars">
            <span class="metric-icon">⭐</span>
            <span class="metric-value">{{ formatNumber(project.metrics.stars) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'ProjectCard' });
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Project, PerformanceMetrics } from '../../types/portfolio';

// Props
interface Props {
  project: Project;
  showDetails?: boolean;
  maxDisplayedTech?: number;
  maxDisplayedFeatures?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
  maxDisplayedTech: 4,
  maxDisplayedFeatures: 3
});

// Emits
const emit = defineEmits<{
  click: [project: Project];
  visit: [project: Project];
  viewSource: [project: Project];
}>();

// Composables
const { t } = useI18n();

// Computed properties
const displayedTechStack = computed(() => {
  return props.project.techStack.slice(0, props.maxDisplayedTech);
});

// Methods
const handleCardClick = () => {
  emit('click', props.project);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};

const getProjectIcon = (category: string): string => {
  const icons = {
    'digital-garden': '🌱',
    'featured-work': '⭐',
    'community': '🤝'
  };
  return icons[category as keyof typeof icons] || '📁';
};

const getCategoryLabel = (category: string): string => {
  const labels = {
    'digital-garden': t('portfolio.digitalGarden'),
    'featured-work': t('portfolio.featuredWork'),
    'community': t('portfolio.community')
  };
  return labels[category as keyof typeof labels] || category;
};

const getStatusLabel = (status: string): string => {
  const labels = {
    'online': t('portfolio.online'),
    'development': t('portfolio.development'),
    'archived': t('portfolio.archived')
  };
  return labels[status as keyof typeof labels] || status;
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};
</script>

<style lang="less" scoped>
.project-card {
  display: block;
  background: var(--brand-canvas-day);
  border: 1px solid var(--brand-border);
  border-radius: 12px;
  transition: all 0.4s var(--brand-ease-premium);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  box-shadow: var(--brand-shadow-card);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--brand-shadow-float);
    border-color: var(--brand-border-hover);

    .project-image {
      .project-img {
        transform: scale(1.03);
      }
      
      .image-overlay {
        opacity: 1;
        .view-btn {
          transform: scale(1);
        }
      }
    }

    .project-title {
      color: var(--brand-electric);
    }
  }

  .card-inner {
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;

    .project-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: rgba(0,0,0,0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      
      .project-icon {
        font-size: 1.25rem;
      }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;

      .action-link {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: transparent;
        border: 1px solid var(--brand-border);
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var(--brand-text-tertiary);
        transition: all 0.3s ease;

        &:hover {
          background-color: var(--brand-midnight);
          color: white;
          border-color: var(--brand-midnight);
        }
      }
    }
  }

  .project-image {
    position: relative;
    margin-bottom: 1.5rem;
    border-radius: 6px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: var(--brand-border);

    .project-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s var(--brand-ease-premium);
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      .view-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: white;
        color: var(--brand-midnight);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--brand-font-mono);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        transform: scale(0.8);
        transition: transform 0.4s var(--brand-ease-bouncy);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
    }
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .project-header {
      margin-bottom: 0.75rem;

      .project-title {
        font-family: var(--brand-font-display);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--brand-midnight);
        margin-bottom: 0.5rem;
        line-height: 1.2;
        transition: color 0.3s ease;
      }

      .project-category {
        .category-tag {
          font-family: var(--brand-font-mono);
          font-size: 0.7rem;
          color: var(--brand-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }

    .project-description {
      font-family: var(--brand-font-body);
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--brand-text-secondary);
      margin-bottom: 1.5rem;
      flex: 1;
    }

    .tech-stack {
      margin-bottom: 1.5rem;

      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .tech-tag {
          font-family: var(--brand-font-mono);
          font-size: 0.7rem;
          color: var(--brand-text-secondary);
          background-color: transparent;
          border: 1px solid var(--brand-border);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .tech-more {
          font-family: var(--brand-font-mono);
          font-size: 0.7rem;
          color: var(--brand-text-tertiary);
          padding: 0.25rem 0.5rem;
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--brand-border);

    .project-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;

        &.status-online { background-color: #10B981; }
        &.status-development { background-color: #F59E0B; }
        &.status-archived { background-color: #9CA3AF; }
      }

      .status-text {
        font-family: var(--brand-font-mono);
        font-size: 0.7rem;
        color: var(--brand-text-tertiary);
        text-transform: uppercase;
      }
    }

    .project-metrics {
      .metric {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-family: var(--brand-font-mono);
        font-size: 0.75rem;
        color: var(--brand-text-secondary);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .project-card {
    .card-inner {
      padding: 1.25rem;
    }
    
    .project-image {
      aspect-ratio: 16/10;
    }
  }
}
</style>

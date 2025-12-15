<template>
  <div 
    class="project-card" 
    :class="[`status-${project.status}`, { 'show-details': showDetails }]"
    @click="handleCardClick"
  >
    <div class="card-inner">
      <!-- Card Header -->
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
          <span class="view-project">{{ $t('portfolio.viewProject') }}</span>
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
          <div class="tech-stack-header">
            <span class="tech-label">{{ $t('portfolio.techStack') }}</span>
          </div>
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

        <!-- Features (shown when showDetails is true) -->
        <div class="project-features" v-if="showDetails && project.features.length > 0">
          <div class="features-header">
            <span class="features-label">{{ $t('portfolio.keyFeatures') }}</span>
          </div>
          <ul class="features-list">
            <li 
              v-for="feature in displayedFeatures" 
              :key="feature" 
              class="feature-item"
            >
              {{ feature }}
            </li>
          </ul>
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
          <div class="metric" v-if="project.metrics.stars" :title="$t('portfolio.githubStars')">
            <span class="metric-icon">⭐</span>
            <span class="metric-value">{{ formatNumber(project.metrics.stars) }}</span>
          </div>
          
          <div class="metric" v-if="project.metrics.visitors" :title="$t('portfolio.totalVisitors')">
            <span class="metric-icon">👁️</span>
            <span class="metric-value">{{ formatNumber(project.metrics.visitors) }}</span>
          </div>
          
          <div class="metric" v-if="project.metrics.forks" :title="$t('portfolio.githubForks')">
            <span class="metric-icon">🔀</span>
            <span class="metric-value">{{ formatNumber(project.metrics.forks) }}</span>
          </div>
        </div>
      </div>

      <!-- Performance Badge (if available) -->
      <div 
        class="performance-badge" 
        v-if="project.metrics?.performance && showDetails"
        :title="$t('portfolio.performanceScore')"
      >
        <span class="perf-icon">⚡</span>
        <span class="perf-score">{{ getPerformanceScore(project.metrics.performance) }}</span>
      </div>
    </div>
  </div>
</template>

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

const displayedFeatures = computed(() => {
  return props.project.features.slice(0, props.maxDisplayedFeatures);
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

const getPerformanceScore = (performance: PerformanceMetrics): number => {
  // Calculate a simple performance score based on load time and other metrics
  const loadTimeScore = Math.max(0, 100 - (performance.loadTime / 50));
  const fcpScore = Math.max(0, 100 - (performance.firstContentfulPaint / 30));
  const lcpScore = Math.max(0, 100 - (performance.largestContentfulPaint / 50));
  const clsScore = Math.max(0, 100 - (performance.cumulativeLayoutShift * 100));
  
  return Math.round((loadTimeScore + fcpScore + lcpScore + clsScore) / 4);
};
</script>

<style lang="less" scoped>
.project-card {
  display: block;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.25);
    border-color: #3B82F6;

    .card-header .project-icon-box {
      background-color: #EFF6FF;
      color: #3B82F6;
      transform: scale(1.05);
    }

    .card-actions .action-link {
      opacity: 1;
      transform: translate(2px, -2px) scale(1.1);
    }

    .project-image {
      .project-img {
        transform: scale(1.05);
      }
      
      .image-overlay {
        opacity: 1;
      }
    }

    .project-title {
      color: #3B82F6;
    }

    .tech-tags .tech-tag {
      background-color: #EFF6FF;
      color: #3B82F6;
    }
  }

  &.status-online {
    border-left: 4px solid #10B981;
  }

  &.status-development {
    border-left: 4px solid #F59E0B;
  }

  &.status-archived {
    border-left: 4px solid #6B7280;
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
    margin-bottom: 1rem;

    .project-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background-color: #F3F4F6;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      .project-icon {
        font-size: 1.5rem;
      }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;

      .action-link {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        background-color: #F9FAFB;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #6B7280;
        opacity: 0.7;
        transition: all 0.3s ease;

        &:hover {
          background-color: #3B82F6;
          color: white;
        }

        &.github-link:hover {
          background-color: #1F2937;
        }

        .external-link-icon,
        .github-icon {
          font-size: 1rem;
        }
      }
    }
  }

  .project-image {
    position: relative;
    margin-bottom: 1rem;
    border-radius: 8px;
    overflow: hidden;
    height: 160px;

    .project-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(59, 130, 246, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      .view-project {
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
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
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.5rem;
        line-height: 1.3;
      }

      .project-category {
        .category-tag {
          display: inline-block;
          font-size: 0.75rem;
          color: #3B82F6;
          background-color: rgba(59, 130, 246, 0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-weight: 600;
        }
      }
    }

    .project-description {
      font-size: 0.95rem;
      line-height: 1.6;
      color: #4B5563;
      margin-bottom: 1rem;
      flex: 1;
    }

    .tech-stack {
      margin-bottom: 1rem;

      .tech-stack-header {
        margin-bottom: 0.5rem;

        .tech-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .tech-tag {
          font-size: 0.75rem;
          color: #374151;
          background-color: #F3F4F6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .tech-more {
          font-size: 0.75rem;
          color: #6B7280;
          background-color: #F9FAFB;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }
      }
    }

    .project-features {
      margin-bottom: 1rem;

      .features-header {
        margin-bottom: 0.5rem;

        .features-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .features-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .feature-item {
          font-size: 0.875rem;
          color: #4B5563;
          padding: 0.25rem 0;
          position: relative;
          padding-left: 1rem;

          &::before {
            content: '•';
            color: #3B82F6;
            position: absolute;
            left: 0;
          }
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #F3F4F6;

    .project-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &.status-online {
          background-color: #10B981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        &.status-development {
          background-color: #F59E0B;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        &.status-archived {
          background-color: #6B7280;
          box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
        }
      }

      .status-text {
        font-size: 0.75rem;
        color: #6B7280;
        font-weight: 500;
      }
    }

    .project-metrics {
      display: flex;
      gap: 1rem;

      .metric {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        .metric-icon {
          font-size: 0.75rem;
        }

        .metric-value {
          font-size: 0.75rem;
          color: #6B7280;
          font-weight: 500;
        }
      }
    }
  }

  .performance-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .perf-icon {
      font-size: 0.75rem;
    }
  }
}

@media screen and (max-width: 768px) {
  .project-card {
    .card-inner {
      padding: 1.25rem;
    }

    .project-image {
      height: 140px;
    }

    .card-footer {
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }
  }
}
</style>
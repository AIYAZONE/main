<template>
  <div
    class="project-card"
    :class="[
      `status-${project.status}`,
      `size-${size || project.size || 'standard'}`,
      { 'show-details': showDetails },
    ]"
    @click="handleCardClick"
  >
    <div class="card-inner">
      <!-- Card Header (Icons & Actions) -->
      <div class="card-header">
        <div class="project-icon-box">
          <span class="project-icon-svg" v-html="getProjectIcon(project.category)"></span>
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              ></path>
            </svg>
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
            <span v-for="tech in displayedTechStack" :key="tech" class="tech-tag">
              {{ tech }}
            </span>
            <span v-if="project.techStack.length > maxDisplayedTech" class="tech-more">
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
            <svg
              class="metric-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
              />
            </svg>
            <span class="metric-value">{{ formatNumber(project.metrics.stars) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({ name: "ProjectCard" });
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { Project, PerformanceMetrics } from "../../types/portfolio";

// Props
interface Props {
  project: Project;
  showDetails?: boolean;
  maxDisplayedTech?: number;
  maxDisplayedFeatures?: number;
  size?: "standard" | "feature" | "info";
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
  maxDisplayedTech: 4,
  maxDisplayedFeatures: 3,
  size: "standard",
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
  emit("click", props.project);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
};

const getProjectIcon = (category: string): string => {
  const icons = {
    "digital-garden":
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>', // Feather (Intellectual)
    "featured-work":
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>', // Sparkle (Premium)
    community:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>', // Globe (World/Community)
  };
  return (
    icons[category as keyof typeof icons] ||
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
  ); // Folder
};

const getCategoryLabel = (category: string): string => {
  const labels = {
    "digital-garden": t("portfolio.digitalGarden"),
    "featured-work": t("portfolio.featuredWork"),
    community: t("portfolio.community"),
  };
  return labels[category as keyof typeof labels] || category;
};

const getStatusLabel = (status: string): string => {
  const labels = {
    online: t("portfolio.online"),
    development: t("portfolio.development"),
    archived: t("portfolio.archived"),
  };
  return labels[status as keyof typeof labels] || status;
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};
</script>

<style lang="less" scoped>
.project-card {
  display: block;
  background: var(--brand-canvas-day);
  border: 1px solid var(--brand-border);
  border-radius: 0;
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
      border-radius: 0;
      background-color: transparent;
      border: 1px solid var(--brand-border);
      display: flex;
      align-items: center;
      justify-content: center;

      :deep(.project-icon-svg) {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 0;

        svg {
          display: block;
        }
      }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;

      .action-link {
        width: 32px;
        height: 32px;
        border-radius: 0;
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
    border-radius: 0;
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
        border-radius: 0;
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
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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
          border-radius: 0;
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

        &.status-online {
          background-color: #10b981;
        }
        &.status-development {
          background-color: #f59e0b;
        }
        &.status-archived {
          background-color: #9ca3af;
        }
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
  /* Size Variants */
  &.size-feature {
    grid-column: span 2;
    grid-row: span 2;

    .project-image {
      height: 60%;
      margin-bottom: 0;
      border-radius: 0;
      aspect-ratio: auto;
    }

    .card-inner {
      padding: 0;
      position: relative;
    }

    .card-header {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      right: 1.5rem;
      z-index: 2;
    }

    .card-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: linear-gradient(
        to top,
        rgba(255, 255, 255, 0.95) 20%,
        rgba(255, 255, 255, 0)
      );
      backdrop-filter: blur(8px);
    }

    .card-footer {
      display: none;
    }
  }

  &.size-info {
    background: var(--brand-midnight);
    color: white;
    border: none;

    .project-title {
      color: white;
      font-size: 2rem;
    }

    .project-description {
      color: rgba(255, 255, 255, 0.7);
    }

    .tech-tag {
      border-color: rgba(255, 255, 255, 0.2) !important;
      color: rgba(255, 255, 255, 0.8) !important;
    }

    .project-image {
      display: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .project-card {
    &.size-feature {
      grid-column: span 1;
      grid-row: span 1;

      .project-image {
        height: auto;
        aspect-ratio: 16/9;
      }

      .card-content {
        position: relative;
        background: none;
        backdrop-filter: none;
        padding: 1.25rem;
      }
    }

    .card-inner {
      padding: 1.25rem;
    }

    .project-image {
      aspect-ratio: 16/10;
    }
  }
}
</style>

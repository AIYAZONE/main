<template>
  <div class="portfolio-grid">
    <!-- Filter and Search Section -->
    <div class="portfolio-controls">
      <div class="search-section">
        <div class="search-input-wrapper">
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="$t('portfolio.searchPlaceholder')"
            class="search-input"
            @input="handleSearch"
          />
          <span class="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-group">
          <label class="filter-label">{{ $t("portfolio.category") }}</label>
          <select
            v-model="selectedCategory"
            @change="handleCategoryFilter"
            class="filter-select"
          >
            <option value="">{{ $t("portfolio.allCategories") }}</option>
            <option value="digital-garden">{{ $t("portfolio.digitalGarden") }}</option>
            <option value="featured-work">{{ $t("portfolio.featuredWork") }}</option>
            <option value="community">{{ $t("portfolio.community") }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ $t("portfolio.status") }}</label>
          <select
            v-model="selectedStatus"
            @change="handleStatusFilter"
            class="filter-select"
          >
            <option value="">{{ $t("portfolio.allStatus") }}</option>
            <option value="online">{{ $t("portfolio.online") }}</option>
            <option value="development">{{ $t("portfolio.development") }}</option>
            <option value="archived">{{ $t("portfolio.archived") }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ $t("portfolio.technology") }}</label>
          <select v-model="selectedTech" @change="handleTechFilter" class="filter-select">
            <option value="">{{ $t("portfolio.allTech") }}</option>
            <option v-for="tech in availableTechnologies" :key="tech" :value="tech">
              {{ tech }}
            </option>
          </select>
        </div>

        <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">
          {{ $t("portfolio.clearFilters") }}
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" v-if="filteredProjectGroups.length > 0">
      <span class="results-count">
        {{ $t("portfolio.showingResults", { count: totalFilteredProjects }) }}
      </span>
    </div>

    <!-- Project Groups -->
    <div class="project-groups" v-if="!isLoading && filteredProjectGroups.length > 0">
      <div 
        v-for="group in filteredProjectGroups" 
        :key="group.id" 
        class="project-group"
      >
        <div class="group-header">
          <h2 class="group-title">
            <span class="group-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
            </span>
            {{ group.title }}
          </h2>
          <p class="group-description">{{ group.description }}</p>
        </div>

        <div class="projects-grid">
          <ProjectCard
            v-for="project in group.projects"
            :key="project.id"
            :project="project"
            :show-details="true"
            @click="handleProjectClick(project)"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && filteredProjectGroups.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
      </div>
      <h3 class="empty-title">{{ $t('portfolio.noProjectsFound') }}</h3>
      <p class="empty-description">{{ $t("portfolio.tryDifferentFilters") }}</p>
      <button @click="clearFilters" class="clear-filters-btn">
        {{ $t("portfolio.clearFilters") }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ $t("portfolio.loading") }}</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      </div>
      <h3 class="error-title">{{ $t('portfolio.errorTitle') }}</h3>
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">
        {{ $t("portfolio.retry") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({ name: "PortfolioGrid" });
</script>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { usePortfolioStore } from "../../stores/portfolioStore";
import ProjectCard from "./ProjectCard.vue";
import type { Project, FilterCriteria } from "../../types/portfolio";

// Props
interface Props {
  initialFilters?: FilterCriteria;
  showControls?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showControls: true,
});

// Emits
const emit = defineEmits<{
  projectClick: [project: Project];
  filtersChange: [filters: FilterCriteria];
}>();

// Composables
const { t } = useI18n();
const portfolioStore = usePortfolioStore();

// Reactive state
const searchTerm = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("");
const selectedTech = ref("");

// Computed properties
const filteredProjectGroups = computed(() => portfolioStore.filteredProjects);
const isLoading = computed(() => portfolioStore.isLoading);
const error = computed(() => portfolioStore.error);

const totalFilteredProjects = computed(() => {
  return filteredProjectGroups.value.reduce(
    (total, group) => total + group.projects.length,
    0
  );
});

const availableTechnologies = computed(() => {
  const allTech = new Set<string>();
  portfolioStore.projectGroups.forEach((group) => {
    group.projects.forEach((project) => {
      project.techStack.forEach((tech) => allTech.add(tech));
    });
  });
  return Array.from(allTech).sort();
});

const hasActiveFilters = computed(() => {
  return (
    searchTerm.value ||
    selectedCategory.value ||
    selectedStatus.value ||
    selectedTech.value
  );
});

const currentFilters = computed(
  (): FilterCriteria => ({
    searchTerm: searchTerm.value || undefined,
    category: selectedCategory.value || undefined,
    status: selectedStatus.value || undefined,
    techStack: selectedTech.value ? [selectedTech.value] : undefined,
  })
);

// Methods
const handleSearch = () => {
  applyFilters();
};

const handleCategoryFilter = () => {
  applyFilters();
};

const handleStatusFilter = () => {
  applyFilters();
};

const handleTechFilter = () => {
  applyFilters();
};

const applyFilters = () => {
  portfolioStore.setFilters(currentFilters.value);
  emit("filtersChange", currentFilters.value);
};

const clearFilters = () => {
  searchTerm.value = "";
  selectedCategory.value = "";
  selectedStatus.value = "";
  selectedTech.value = "";
  portfolioStore.setFilters({});
  emit("filtersChange", {});
};

const handleProjectClick = (project: Project) => {
  emit("projectClick", project);
};

const retryLoad = () => {
  portfolioStore.loadProjects();
};

// Initialize filters from props
const initializeFilters = () => {
  if (props.initialFilters) {
    searchTerm.value = props.initialFilters.searchTerm || "";
    selectedCategory.value = props.initialFilters.category || "";
    selectedStatus.value = props.initialFilters.status || "";
    selectedTech.value = props.initialFilters.techStack?.[0] || "";
    portfolioStore.setFilters(props.initialFilters);
  }
};

// Lifecycle
onMounted(async () => {
  if (portfolioStore.projectGroups.length === 0) {
    await portfolioStore.loadProjects();
  }
  initializeFilters();
});

// Watch for external filter changes
watch(
  () => props.initialFilters,
  (newFilters) => {
    if (newFilters) {
      searchTerm.value = newFilters.searchTerm || "";
      selectedCategory.value = newFilters.category || "";
      selectedStatus.value = newFilters.status || "";
      selectedTech.value = newFilters.techStack?.[0] || "";
      portfolioStore.setFilters(newFilters);
    }
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
.portfolio-grid {
  width: 100%;
  max-width: var(--brand-max-width);
  margin: 0 auto;
  padding: 2rem 0;
}

.portfolio-controls {
  margin-bottom: var(--brand-space-xl);
  padding: 2rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 0;
  border: 1px solid var(--brand-border);
  box-shadow: var(--brand-shadow-card);
}

.search-section {
  margin-bottom: 2rem;

  .search-input-wrapper {
    position: relative;
    max-width: 400px;

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid var(--brand-border);
      background: rgba(255, 255, 255, 0.5);
      border-radius: 0;
      font-size: 1rem;
      font-family: var(--brand-font-body);
      color: var(--brand-text-primary);
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: var(--brand-electric);
        background: white;
        box-shadow: none;
      }

      &::placeholder {
        color: var(--brand-text-tertiary);
      }
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--brand-text-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;

  .filter-label {
    font-family: var(--brand-font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--brand-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--brand-border);
    border-radius: 0;
    font-size: 0.9rem;
    font-family: var(--brand-font-body);
    background: rgba(255, 255, 255, 0.5);
    color: var(--brand-text-primary);
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--brand-electric);
      background: white;
      box-shadow: none;
    }
    
    &:hover {
      border-color: var(--brand-border-hover);
    }
  }
}

.clear-filters-btn {
  padding: 0.5rem 1.5rem;
  background: transparent;
  color: var(--brand-text-secondary);
  border: 1px solid var(--brand-border);
  border-radius: 0;
  font-family: var(--brand-font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: var(--brand-midnight);
    border-color: var(--brand-text-secondary);
  }
}

.results-summary {
  margin-bottom: 2rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--brand-border);
  background: transparent;

  .results-count {
    font-family: var(--brand-font-mono);
    font-size: 0.8rem;
    color: var(--brand-text-tertiary);
    font-weight: 500;
  }
}

.project-groups {
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-xl);
}

.project-group {
  .group-header {
    margin-bottom: var(--brand-space-md);
    padding-left: 1rem;
    border-left: 2px solid var(--brand-gold-start);

    .group-title {
      font-family: var(--brand-font-display);
      font-size: 2rem;
      font-weight: 700;
      color: var(--brand-midnight);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      line-height: 1.2;

      .group-icon {
        color: var(--brand-gold-start);
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 0;

        svg {
          display: block;
        }
      }
    }

    .group-description {
      font-family: var(--brand-font-body);
      font-size: 1.1rem;
      color: var(--brand-text-secondary);
      line-height: 1.6;
      font-weight: 300;
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-flow: dense;
    gap: 2rem;
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .empty-description {
    color: #6b7280;
    margin-bottom: 2rem;
  }
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ef4444;
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .retry-btn {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: #2563eb;
    }
  }
}

@media screen and (max-width: 768px) {
  .portfolio-grid {
    padding: 1rem;
  }

  .portfolio-controls {
    padding: 1.5rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: auto;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>

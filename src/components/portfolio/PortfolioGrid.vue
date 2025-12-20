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
          <span class="search-icon">🔍</span>
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
      <div v-for="group in filteredProjectGroups" :key="group.id" class="project-group">
        <div class="group-header">
          <h2 class="group-title">
            <span class="group-icon">#</span>
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
      <div class="empty-icon">📂</div>
      <h3 class="empty-title">{{ $t("portfolio.noProjectsFound") }}</h3>
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
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">{{ $t("portfolio.errorTitle") }}</h3>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.portfolio-controls {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 2rem;

  .search-input-wrapper {
    position: relative;
    max-width: 400px;

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-size: 1rem;
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
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .filter-select {
    padding: 0.5rem 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #dc2626;
  }
}

.results-summary {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;

  .results-count {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
}

.project-groups {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.project-group {
  .group-header {
    margin-bottom: 2rem;

    .group-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;

      .group-icon {
        color: #3b82f6;
        font-weight: 900;
      }
    }

    .group-description {
      font-size: 1rem;
      color: #6b7280;
      line-height: 1.6;
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
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

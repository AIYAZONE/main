import { defineStore } from 'pinia';
import { ref, readonly, computed } from 'vue';
import type { ProjectGroup, Project, FilterCriteria } from '../types/portfolio';
import type { LoadingState } from '../types/common';
import { portfolioService } from '../services/portfolioService';

export const usePortfolioStore = defineStore('portfolio', () => {
  // State
  const projectGroups = ref<ProjectGroup[]>([]);
  const activeFilters = ref<FilterCriteria>({});
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: undefined
  });

  // Actions
  const setProjectGroups = (groups: ProjectGroup[]) => {
    projectGroups.value = groups;
  };

  const setFilters = (filters: FilterCriteria) => {
    activeFilters.value = filters;
  };

  const setLoading = (loading: boolean, error?: string) => {
    loadingState.value = {
      isLoading: loading,
      error
    };
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectGroupsData = await portfolioService.getProjects();
      setProjectGroups(projectGroupsData);
      setLoading(false);
    } catch (error) {
      setLoading(false, error instanceof Error ? error.message : 'Failed to load projects');
    }
  };

  const filterProjects = async (criteria: FilterCriteria) => {
    setLoading(true);
    try {
      const filteredProjectsData = await portfolioService.filterProjects(criteria);
      setFilters(criteria);
      setLoading(false);
      return filteredProjectsData;
    } catch (error) {
      setLoading(false, error instanceof Error ? error.message : 'Failed to filter projects');
      return [];
    }
  };

  const syncExternalProjects = async () => {
    setLoading(true);
    try {
      await portfolioService.syncExternalProjects();
      // Reload projects after sync
      await loadProjects();
    } catch (error) {
      setLoading(false, error instanceof Error ? error.message : 'Failed to sync external projects');
    }
  };

  const clearError = () => {
    loadingState.value.error = undefined;
  };

  // Getters (computed properties)
  const filteredProjects = computed(() => {
    if (!activeFilters.value || Object.keys(activeFilters.value).length === 0) {
      return projectGroups.value;
    }

    return projectGroups.value.map(group => ({
      ...group,
      projects: group.projects.filter(project => {
        const filters = activeFilters.value;
        
        if (filters.category && project.category !== filters.category) {
          return false;
        }
        
        if (filters.status && project.status !== filters.status) {
          return false;
        }
        
        if (filters.techStack && filters.techStack.length > 0) {
          const hasMatchingTech = filters.techStack.some(tech => 
            project.techStack.includes(tech)
          );
          if (!hasMatchingTech) {
            return false;
          }
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          const matchesSearch = 
            project.name.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.techStack.some(tech => tech.toLowerCase().includes(searchLower));
          if (!matchesSearch) {
            return false;
          }
        }
        
        return true;
      })
    })).filter(group => group.projects.length > 0);
  });

  const allProjects = computed(() => {
    return projectGroups.value.flatMap(group => group.projects);
  });

  const digitalGardenProjects = computed(() => {
    return portfolioService.getProjectsByCategory(projectGroups.value, 'digital-garden');
  });

  const featuredWorkProjects = computed(() => {
    return portfolioService.getProjectsByCategory(projectGroups.value, 'featured-work');
  });

  const communityProjects = computed(() => {
    return portfolioService.getProjectsByCategory(projectGroups.value, 'community');
  });

  const projectStatistics = computed(() => {
    if (projectGroups.value.length === 0) return null;
    return portfolioService.getProjectStatistics(projectGroups.value);
  });

  const featuredProjects = computed(() => {
    return portfolioService.getFeaturedProjects(projectGroups.value);
  });

  const getProjectById = (projectId: string) => {
    return portfolioService.getProjectById(projectGroups.value, projectId);
  };

  const getRelatedProjects = (currentProject: Project, limit: number = 3) => {
    return portfolioService.getRelatedProjects(projectGroups.value, currentProject, limit);
  };

  const isLoading = readonly(loadingState).value.isLoading;
  const error = readonly(loadingState).value.error;

  return {
    // State (readonly)
    projectGroups: readonly(projectGroups),
    activeFilters: readonly(activeFilters),
    isLoading,
    error,
    
    // Computed
    filteredProjects,
    allProjects,
    digitalGardenProjects,
    featuredWorkProjects,
    communityProjects,
    projectStatistics,
    featuredProjects,
    
    // Actions
    setProjectGroups,
    setFilters,
    loadProjects,
    filterProjects,
    syncExternalProjects,
    clearError,
    getProjectById,
    getRelatedProjects
  };
});
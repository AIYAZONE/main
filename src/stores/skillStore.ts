import { defineStore } from 'pinia';
import { ref, readonly, computed } from 'vue';
import type { SkillCategory, Skill, ExperienceItem } from '../types/skills';
import type { LoadingState } from '../types/common';
import { skillService } from '../services/skillService';

export const useSkillStore = defineStore('skill', () => {
  // State
  const skillCategories = ref<SkillCategory[]>([]);
  const experienceItems = ref<ExperienceItem[]>([]);
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: undefined
  });

  // Computed properties (getters)
  const frontendSkills = computed(() => 
    skillCategories.value.find(cat => cat.type === 'frontend')
  );

  const managementSkills = computed(() => 
    skillCategories.value.find(cat => cat.type === 'management')
  );

  const leadershipSkills = computed(() => 
    skillCategories.value.find(cat => cat.type === 'leadership')
  );

  const allSkills = computed(() => 
    skillCategories.value.flatMap(category => category.skills)
  );

  const topSkills = computed(() => 
    allSkills.value
      .filter(skill => skill.level >= 8)
      .sort((a, b) => b.level - a.level)
      .slice(0, 5)
  );

  const skillsSummary = computed(() => {
    const skills = allSkills.value;
    if (skills.length === 0) return null;

    const totalSkills = skills.length;
    const averageLevel = skills.reduce((sum, skill) => sum + skill.level, 0) / totalSkills;
    const experienceYears = Math.max(...skills.map(skill => skill.yearsOfExperience));

    return {
      totalSkills,
      averageLevel: Math.round(averageLevel * 10) / 10,
      experienceYears,
      topSkills: topSkills.value
    };
  });

  const currentExperience = computed(() => 
    experienceItems.value.find(item => !item.endDate)
  );

  const pastExperiences = computed(() => 
    experienceItems.value
      .filter(item => item.endDate)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  );

  // Actions
  const setSkillCategories = (categories: readonly SkillCategory[]) => {
    skillCategories.value = categories as SkillCategory[];
  };

  const setExperienceItems = (items: ExperienceItem[]) => {
    experienceItems.value = items;
  };

  const setLoading = (loading: boolean, error?: string) => {
    loadingState.value = {
      isLoading: loading,
      error
    };
  };

  const loadSkillsData = async () => {
    setLoading(true);
    try {
      const [categoriesData, experienceData] = await Promise.all([
        skillService.getSkillCategories(),
        skillService.getExperienceItems()
      ]);

      setSkillCategories(categoriesData);
      setExperienceItems(experienceData);
      setLoading(false);
    } catch (error) {
      setLoading(false, error instanceof Error ? error.message : 'Failed to load skills data');
    }
  };

  const loadSkillsByCategory = async (categoryType: 'frontend' | 'management' | 'leadership') => {
    setLoading(true);
    try {
      const category = await skillService.getSkillsByCategory(categoryType);
      
      // Update the specific category in the existing categories
      const updatedCategories = skillCategories.value.map(cat => 
        cat.type === categoryType ? category : cat
      );
      
      // If category doesn't exist, add it
      if (!skillCategories.value.find(cat => cat.type === categoryType)) {
        updatedCategories.push(category);
      }
      
      setSkillCategories(updatedCategories);
      setLoading(false);
    } catch (error) {
      setLoading(false, error instanceof Error ? error.message : 'Failed to load category skills');
    }
  };

  const searchSkills = async (query: string): Promise<Skill[]> => {
    try {
      return await skillService.searchSkills(query);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search skills');
    }
  };

  const getSkillsByLevel = async (minLevel: number): Promise<Skill[]> => {
    try {
      return await skillService.getSkillsByLevel(minLevel);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get skills by level');
    }
  };

  const clearError = () => {
    loadingState.value.error = undefined;
  };

  // Helper methods for skill categorization logic
  const categorizeSkillsForDisplay = () => {
    const frontend = frontendSkills.value;
    const management = managementSkills.value;
    const leadership = leadershipSkills.value;

    if (!frontend || !management || !leadership) {
      throw new Error('Missing required skill categories for display');
    }

    return { frontend, management, leadership };
  };

  const getSkillsForRadarChart = () => {
    return skillCategories.value.map(category => ({
      category: category.name,
      type: category.type,
      averageLevel: category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length,
      skillCount: category.skills.length,
      topSkills: [...category.skills]
        .sort((a: any, b: any) => b.level - a.level)
        .slice(0, 3)
    }));
  };

  // Helper method for getting skills by category
  const getSkillsByCategory = (categoryType: string) => {
    const category = skillCategories.value.find(cat => cat.type === categoryType);
    return category ? category.skills : [];
  };

  // Alias for loadSkillsData to match test expectations
  const loadSkillData = async () => {
    await loadSkillsData();
  };

  return {
    // State (readonly)
    skillCategories: readonly(skillCategories),
    experienceItems: readonly(experienceItems),
    get isLoading() {
      return loadingState.value.isLoading;
    },
    get error() {
      return loadingState.value.error;
    },
    
    // Computed properties
    frontendSkills,
    managementSkills,
    leadershipSkills,
    allSkills,
    topSkills,
    skillsSummary,
    currentExperience,
    pastExperiences,
    
    // Actions
    setSkillCategories,
    setExperienceItems,
    loadSkillsData,
    loadSkillData,
    loadSkillsByCategory,
    getSkillsByCategory,
    searchSkills,
    getSkillsByLevel,
    clearError,
    categorizeSkillsForDisplay,
    getSkillsForRadarChart
  };
});
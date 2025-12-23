import { defineStore } from "pinia";
import { ref, readonly, computed } from "vue";
import type { SWOTData, RoadmapData, LearningPath } from "../types/career";
import type { LoadingState } from "../types/common";
import { careerService } from "../services/careerService";

export const useCareerStore = defineStore("career", () => {
  // State
  const swotAnalysis = ref<SWOTData | null>(null);
  const roadmapData = ref<RoadmapData | null>(null);
  const learningPath = ref<LearningPath | null>(null);
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: undefined,
  });

  // Actions
  const setSWOTAnalysis = (analysis: SWOTData) => {
    swotAnalysis.value = analysis;
  };

  const setRoadmapData = (roadmap: RoadmapData) => {
    roadmapData.value = roadmap;
  };

  const setLearningPath = (path: LearningPath) => {
    learningPath.value = path;
  };

  const setLoading = (loading: boolean, error?: string) => {
    loadingState.value = {
      isLoading: loading,
      error,
    };
  };

  const loadCareerData = async () => {
    setLoading(true);
    try {
      const swot = await careerService.getSWOTAnalysis();
      const roadmap = await careerService.getRoadmapData();
      const path = await careerService.getLearningPath();

      setSWOTAnalysis(swot);
      setRoadmapData(roadmap);
      setLearningPath(path);
      setLoading(false);
    } catch (error) {
      setLoading(
        false,
        error instanceof Error ? error.message : "Failed to load career data"
      );
    }
  };

  const clearError = () => {
    loadingState.value.error = undefined;
  };

  const isLoading = computed(() => loadingState.value.isLoading);
  const error = computed(() => loadingState.value.error);

  return {
    // State (readonly)
    swotAnalysis: readonly(swotAnalysis),
    roadmapData: readonly(roadmapData),
    learningPath: readonly(learningPath),
    isLoading,
    error,

    // Actions
    setSWOTAnalysis,
    setRoadmapData,
    setLearningPath,
    loadCareerData,
    clearError,
  };
});

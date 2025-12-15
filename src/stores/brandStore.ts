import { defineStore } from 'pinia';
import { ref, readonly, computed } from 'vue';
import type { BrandInfo, Certification } from '../types/brand';
import type { LoadingState } from '../types/common';
import { brandService } from '../services/brandService';

export const useBrandStore = defineStore('brand', () => {
  // State
  const brandInfo = ref<BrandInfo | null>(null);
  const certifications = ref<Certification[]>([]);
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: undefined
  });

  // Actions
  const setBrandInfo = (info: BrandInfo) => {
    brandInfo.value = info;
  };

  const setCertifications = (certs: Certification[]) => {
    certifications.value = certs;
  };

  const setLoading = (loading: boolean, error?: string) => {
    loadingState.value.isLoading = loading;
    loadingState.value.error = error;
  };

  const loadBrandInfo = async () => {
    setLoading(true);
    try {
      const [brandInfoData, certificationsData] = await Promise.all([
        brandService.getBrandInfo(),
        brandService.getCertifications()
      ]);

      setBrandInfo(brandInfoData);
      setCertifications(certificationsData);
      setLoading(false);
    } catch (error) {
      setLoading(false, error instanceof Error ? error.message : 'Failed to load brand info');
    }
  };

  const clearError = () => {
    loadingState.value.error = undefined;
  };

  // Computed properties
  const isLoading = computed(() => loadingState.value.isLoading);
  const error = computed(() => loadingState.value.error);

  return {
    // State (readonly)
    brandInfo: readonly(brandInfo),
    certifications: readonly(certifications),
    isLoading,
    error,
    
    // Actions
    setBrandInfo,
    setCertifications,
    setLoading,
    loadBrandInfo,
    clearError
  };
});
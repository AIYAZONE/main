import { defineStore } from 'pinia';
import { ref, readonly, computed } from 'vue';
import { socialService } from '../services/socialService';
import type { SocialLink, SocialPost, SocialStats } from '../services/socialService';
import type { LoadingState } from '../types/common';

export const useSocialStore = defineStore('social', () => {
  // State
  const socialLinks = ref<SocialLink[]>([]);
  const socialFeed = ref<SocialPost[]>([]);
  const blogPosts = ref<SocialPost[]>([]);
  const githubActivity = ref<any[]>([]);
  const socialStats = ref<SocialStats | null>(null);
  const loadingState = ref<LoadingState>({
    isLoading: false,
    error: undefined
  });

  // Loading states for different operations
  const isLoadingLinks = ref(false);
  const isLoadingFeed = ref(false);
  const isLoadingStats = ref(false);
  const isSyncing = ref(false);

  // Actions
  const setSocialLinks = (links: SocialLink[]) => {
    socialLinks.value = links;
  };

  const setSocialFeed = (feed: SocialPost[]) => {
    socialFeed.value = feed;
  };

  const setSocialStats = (stats: SocialStats) => {
    socialStats.value = stats;
  };

  const setLoading = (loading: boolean, error?: string) => {
    loadingState.value = {
      isLoading: loading,
      error
    };
  };

  const loadSocialLinks = async () => {
    isLoadingLinks.value = true;
    try {
      const links = await socialService.getSocialLinks();
      setSocialLinks(links);
    } catch (error) {
      console.error('Failed to load social links:', error);
      setLoading(false, error instanceof Error ? error.message : 'Failed to load social links');
    } finally {
      isLoadingLinks.value = false;
    }
  };

  const loadSocialFeed = async (limit?: number) => {
    isLoadingFeed.value = true;
    try {
      const feed = await socialService.getSocialFeed(limit);
      setSocialFeed(feed);
    } catch (error) {
      console.error('Failed to load social feed:', error);
      setLoading(false, error instanceof Error ? error.message : 'Failed to load social feed');
    } finally {
      isLoadingFeed.value = false;
    }
  };

  const loadSocialStats = async () => {
    isLoadingStats.value = true;
    try {
      const stats = await socialService.getSocialStats();
      setSocialStats(stats);
    } catch (error) {
      console.error('Failed to load social stats:', error);
      setLoading(false, error instanceof Error ? error.message : 'Failed to load social stats');
    } finally {
      isLoadingStats.value = false;
    }
  };

  const syncExternalContent = async () => {
    isSyncing.value = true;
    try {
      await socialService.syncExternalContent();
      // Reload feed after sync
      await loadSocialFeed();
    } catch (error) {
      console.error('Failed to sync external content:', error);
      setLoading(false, error instanceof Error ? error.message : 'Failed to sync external content');
    } finally {
      isSyncing.value = false;
    }
  };

  const loadSocialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSocialLinks(),
        loadSocialFeed(),
        loadSocialStats()
      ]);
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllSocialData = async () => {
    await loadSocialData();
  };

  const clearError = () => {
    loadingState.value.error = undefined;
  };

  // Getters
  const activeSocialLinks = readonly(
    socialLinks.value.filter(link => link.isActive)
  );

  const socialLinksByType = readonly(
    socialLinks.value.reduce((acc, link) => {
      if (!acc[link.type]) {
        acc[link.type] = [];
      }
      acc[link.type].push(link);
      return acc;
    }, {} as Record<string, SocialLink[]>)
  );

  const recentPosts = readonly(
    socialFeed.value
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 5)
  );

  const totalFollowers = computed(() => 
    socialStats.value?.totalFollowers || 0
  );

  const totalEngagement = computed(() => 
    socialStats.value?.totalEngagement || 0
  );

  return {
    // State (readonly)
    socialLinks: readonly(socialLinks),
    socialFeed: readonly(socialFeed),
    blogPosts: readonly(blogPosts),
    githubActivity: readonly(githubActivity),
    socialStats: readonly(socialStats),
    get isLoading() {
      return loadingState.value.isLoading;
    },
    get error() {
      return loadingState.value.error;
    },
    isLoadingLinks: readonly(isLoadingLinks),
    isLoadingFeed: readonly(isLoadingFeed),
    isLoadingStats: readonly(isLoadingStats),
    isSyncing: readonly(isSyncing),
    
    // Getters
    activeSocialLinks,
    socialLinksByType,
    recentPosts,
    totalFollowers,
    totalEngagement,
    
    // Actions
    setSocialLinks,
    setSocialFeed,
    setSocialStats,
    loadSocialLinks,
    loadSocialFeed,
    loadSocialStats,
    syncExternalContent,
    loadSocialData,
    loadAllSocialData,
    clearError
  };
});
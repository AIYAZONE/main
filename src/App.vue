<template>
  <div id="app">
    <ErrorBoundary>
      <DefaultLayout 
        :navigation-variant="navigationVariant"
        :navigation-position="navigationPosition"
        :show-search="showSearch"
        :show-breadcrumb="showBreadcrumb"
        :show-footer="showFooter"
        :transition-name="transitionName"
      />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './layout/DefaultLayout.vue';
import ErrorBoundary from './components/common/ErrorBoundary.vue';

const route = useRoute();

// 根据路由动态调整导航样式
const navigationVariant = computed(() => {
  if (route.path === '/') {
    return 'transparent';
  }
  return 'default';
});

const navigationPosition = computed((): 'static' | 'sticky' | 'fixed' => {
  return 'sticky';
});

const showSearch = computed(() => {
  // 在作品集页面显示搜索功能
  return route.path.startsWith('/portfolio');
});

const showBreadcrumb = computed(() => {
  // 首页不显示面包屑
  return route.path !== '/';
});

const showFooter = computed(() => {
  return true;
});

const transitionName = computed(() => {
  return 'page';
});
</script>

<template>
  <div id="app">
    <ErrorBoundary>
      <DefaultLayout 
        :navigation-variant="navigationVariant"
        :navigation-position="navigationPosition"
        :show-search="showSearch"
        :show-footer="showFooter"
        :transition-name="transitionName"
      />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './layout/DefaultLayout.vue';
import ErrorBoundary from './components/common/ErrorBoundary.vue';
import Lenis from 'lenis';

const route = useRoute();
let lenis: Lenis | null = null;

onMounted(() => {
  // Initialize Smooth Scrolling
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});

onUnmounted(() => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
});

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

const showFooter = computed(() => {
  return true;
});

const transitionName = computed(() => {
  return 'page';
});
</script>

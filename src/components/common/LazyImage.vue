<template>
  <div class="lazy-image-container" :class="{ loading: isLoading, error: hasError }">
    <img
      ref="imageRef"
      :src="placeholder"
      :alt="alt"
      :class="imageClass"
      @load="handleLoad"
      @error="handleError"
    />
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
      </div>
    </div>
    
    <!-- 错误状态 -->
    <div v-if="hasError" class="error-overlay">
      <div class="error-content">
        <span class="error-icon">🖼️</span>
        <span class="error-text">{{ $t('common.imageLoadFailed', 'Image failed to load') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

interface Props {
  src: string;
  alt: string;
  placeholder?: string;
  class?: string;
  loading?: 'lazy' | 'eager';
  rootMargin?: string;
  threshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  loading: 'lazy',
  rootMargin: '50px',
  threshold: 0.1
});

const imageRef = ref<HTMLImageElement>();
const isLoading = ref(true);
const hasError = ref(false);
const observer = ref<IntersectionObserver>();

const imageClass = computed(() => {
  const classes = ['lazy-image'];
  if (props.class) {
    classes.push(props.class);
  }
  if (isLoading.value) {
    classes.push('loading');
  }
  if (hasError.value) {
    classes.push('error');
  }
  return classes.join(' ');
});

const handleLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

const handleError = () => {
  isLoading.value = false;
  hasError.value = true;
};

const loadImage = () => {
  if (imageRef.value && props.src !== props.placeholder) {
    isLoading.value = true;
    hasError.value = false;
    imageRef.value.src = props.src;
  }
};

onMounted(() => {
  if (props.loading === 'eager') {
    loadImage();
    return;
  }

  // 使用 Intersection Observer 实现懒加载
  if ('IntersectionObserver' in window && imageRef.value) {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.value?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: props.rootMargin,
        threshold: props.threshold
      }
    );

    observer.value.observe(imageRef.value);
  } else {
    // 降级处理：直接加载图片
    loadImage();
  }
});

onUnmounted(() => {
  if (observer.value && imageRef.value) {
    observer.value.unobserve(imageRef.value);
  }
});
</script>

<style scoped lang="less">
.lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: #f3f4f6;
  border-radius: 4px;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;

  &.loading {
    opacity: 0.7;
  }

  &.error {
    opacity: 0.5;
  }
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
}

.loading-spinner {
  .spinner-ring {
    width: 24px;
    height: 24px;
    border: 2px solid transparent;
    border-top-color: var(--brand-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;

  .error-icon {
    font-size: 1.5rem;
    opacity: 0.6;
  }

  .error-text {
    font-size: 0.75rem;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .lazy-image {
    transition: none;
  }
  
  .spinner-ring {
    animation: none;
    border-top-color: var(--brand-primary);
  }
}
</style>
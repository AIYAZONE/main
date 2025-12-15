<template>
  <div class="loading-spinner" :class="{ [`size-${size}`]: true }">
    <div class="spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  message: ''
});
</script>

<style scoped lang="less">
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  &.size-small {
    padding: 1rem;
    
    .spinner {
      width: 24px;
      height: 24px;
    }
    
    .loading-message {
      font-size: 0.875rem;
    }
  }

  &.size-medium {
    .spinner {
      width: 40px;
      height: 40px;
    }
  }

  &.size-large {
    padding: 3rem;
    
    .spinner {
      width: 60px;
      height: 60px;
    }
    
    .loading-message {
      font-size: 1.125rem;
    }
  }
}

.spinner {
  position: relative;
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;

  &:nth-child(2) {
    border-top-color: var(--brand-secondary);
    animation-delay: -0.4s;
    animation-duration: 1.8s;
  }

  &:nth-child(3) {
    border-top-color: rgba(59, 130, 246, 0.3);
    animation-delay: -0.8s;
    animation-duration: 2.4s;
  }
}

.loading-message {
  color: var(--text-secondary);
  font-size: 1rem;
  text-align: center;
  margin: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .spinner-ring {
    animation: none;
    border-top-color: var(--brand-primary);
    
    &:nth-child(2),
    &:nth-child(3) {
      display: none;
    }
  }
  
  .loading-message {
    animation: none;
    opacity: 1;
  }
}
</style>
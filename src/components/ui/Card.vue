<template>
  <div 
    :class="cardClasses"
    @click="handleClick"
    @keydown="handleKeydown"
    :tabindex="clickable ? 0 : undefined"
    :role="clickable ? 'button' : undefined"
  >
    <!-- 卡片头部 -->
    <header v-if="$slots.header || title || subtitle" class="card-header">
      <slot name="header">
        <div class="card-header-content">
          <h3 v-if="title" class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </header>

    <!-- 卡片媒体 -->
    <div v-if="$slots.media || image" class="card-media">
      <slot name="media">
        <img 
          v-if="image"
          :src="image"
          :alt="imageAlt || title || ''"
          class="card-image"
          :loading="lazyLoad ? 'lazy' : 'eager'"
        />
      </slot>
      <div v-if="$slots.overlay" class="card-overlay">
        <slot name="overlay" />
      </div>
    </div>

    <!-- 卡片内容 -->
    <div v-if="$slots.default || content" class="card-content">
      <slot>
        <p v-if="content">{{ content }}</p>
      </slot>
    </div>

    <!-- 卡片底部 -->
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>

    <!-- 加载状态 -->
    <div v-if="loading" class="card-loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  hoverable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  lazyLoad?: boolean;
  rounded?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  clickable: false,
  hoverable: false,
  loading: false,
  disabled: false,
  lazyLoad: true,
  rounded: false,
  shadow: 'sm'
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const cardClasses = computed(() => [
  'card',
  `card--${props.variant}`,
  `card--${props.size}`,
  `card--shadow-${props.shadow}`,
  {
    'card--clickable': props.clickable,
    'card--hoverable': props.hoverable,
    'card--loading': props.loading,
    'card--disabled': props.disabled,
    'card--rounded': props.rounded
  }
]);

const handleClick = (event: Event) => {
  if (props.disabled || props.loading || !props.clickable) return;
  emit('click', event);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading || !props.clickable) return;
  
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('click', event);
  }
};
</script>

<style scoped lang="less">
.card {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  // 尺寸变体
  &--sm {
    .card-header,
    .card-content,
    .card-footer {
      padding: 1rem;
    }

    .card-title {
      font-size: 1rem;
    }

    .card-subtitle {
      font-size: 0.875rem;
    }
  }

  &--md {
    .card-header,
    .card-content,
    .card-footer {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
    }

    .card-subtitle {
      font-size: 1rem;
    }
  }

  &--lg {
    .card-header,
    .card-content,
    .card-footer {
      padding: 2rem;
    }

    .card-title {
      font-size: 1.5rem;
    }

    .card-subtitle {
      font-size: 1.125rem;
    }
  }

  // 变体样式
  &--elevated {
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &--outlined {
    border: 2px solid var(--border-color);
    background: transparent;
  }

  &--filled {
    background: var(--bg-color);
    border: none;
  }

  // 阴影变体
  &--shadow-none {
    box-shadow: none;
  }

  &--shadow-sm {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &--shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &--shadow-lg {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  // 交互状态
  &--clickable {
    cursor: pointer;

    &:hover:not(.ui-card--disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:focus {
      outline: 2px solid var(--accent-gold);
      outline-offset: 2px;
    }

    &:active {
      transform: translateY(-1px);
      transition-duration: 0.1s;
    }
  }

  &--hoverable:hover:not(.ui-card--disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    pointer-events: none;
  }

  &--rounded {
    border-radius: 16px;
  }

  // 卡片组件
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);

    .card-header-content {
      flex: 1;
    }

    .card-title {
      font-family: var(--font-serif);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
    }

    .card-subtitle {
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    .card-actions {
      flex-shrink: 0;
    }
  }

  .card-media {
    position: relative;
    overflow: hidden;

    .card-image {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.3s ease;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover .card-overlay {
      opacity: 1;
    }

    &:hover .card-image {
      transform: scale(1.05);
    }
  }

  .card-content {
    flex: 1;
    color: var(--text-secondary);
    line-height: 1.6;

    p {
      margin: 0;
    }

    p + p {
      margin-top: 1rem;
    }
  }

  .card-footer {
    border-top: 1px solid var(--border-color);
    background: var(--bg-color);
    margin-top: auto;
  }

  .card-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border-color);
      border-top-color: var(--accent-gold);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 移动端优化
@media screen and (max-width: 767px) {
  .ui-card {
    border-radius: 6px;

    &--clickable:hover,
    &--hoverable:hover {
      transform: translateY(-1px);
    }

    .card-header {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;

      .card-actions {
        align-self: flex-end;
      }
    }

    .card-media {
      .card-image:hover {
        transform: none;
      }

      .card-overlay {
        opacity: 1;
      }
    }
  }
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  .ui-card {
    &--clickable:hover,
    &--hoverable:hover {
      transform: none;
      box-shadow: none;
    }

    &--clickable:active {
      transform: scale(0.98);
      transition-duration: 0.1s;
    }

    .card-media {
      .card-image:hover {
        transform: none;
      }

      .card-overlay {
        opacity: 1;
      }
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .ui-card {
    border-width: 2px;

    &--outlined {
      border-width: 3px;
    }

    .card-header,
    .card-footer {
      border-width: 2px;
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .ui-card {
    transition: none;

    &:hover {
      transform: none;
    }

    .card-image,
    .card-overlay {
      transition: none;
    }

    .loading-spinner {
      animation: none;
    }
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .ui-card {
    .card-loading-overlay {
      background: rgba(0, 0, 0, 0.9);
    }

    .card-overlay {
      background: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
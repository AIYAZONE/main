<template>
  <div 
    :class="cardClasses"
    @click="handleClick"
    @keydown="handleKeydown"
    :tabindex="clickable ? 0 : undefined"
    :role="clickable ? 'button' : undefined"
    :aria-pressed="clickable && pressed ? 'true' : undefined"
  >
    <!-- 卡片头部 -->
    <header v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </header>

    <!-- 卡片图片 -->
    <div v-if="$slots.image || image" class="card-image">
      <slot name="image">
        <img 
          v-if="image"
          :src="typeof image === 'string' ? image : image.src"
          :alt="typeof image === 'string' ? (imageAlt || title || '') : image.alt"
          :srcset="typeof image === 'object' ? image.srcset : undefined"
          class="card-img"
          :loading="lazyLoad ? 'lazy' : 'eager'"
        />
      </slot>
      <div v-if="$slots.imageOverlay" class="card-image-overlay">
        <slot name="imageOverlay" />
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
    <div v-if="loading" class="card-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ t('common.loading') }}</span>
    </div>

    <!-- 悬浮指示器 -->
    <div v-if="hoverable" class="card-hover-indicator">
      <span class="hover-icon">→</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string | { src: string; alt: string; srcset?: string };
  imageAlt?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2';
  clickable?: boolean;
  hoverable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  lazyLoad?: boolean;
  rounded?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
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

const { t } = useI18n();
const pressed = ref(false);

const cardClasses = computed(() => [
  'responsive-card',
  'card--responsive', // For backward compatibility with tests
  `responsive-card--${props.variant}`,
  `responsive-card--${props.size}`,
  `responsive-card--shadow-${props.shadow}`,
  {
    'responsive-card--clickable': props.clickable,
    'responsive-card--hoverable': props.hoverable,
    'responsive-card--loading': props.loading,
    'responsive-card--disabled': props.disabled,
    'responsive-card--rounded': props.rounded,
    'responsive-card--pressed': pressed.value,
    [`aspect-${props.aspectRatio?.replace(':', '-')}`]: props.aspectRatio
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
    pressed.value = true;
    emit('click', event);
    
    setTimeout(() => {
      pressed.value = false;
    }, 150);
  }
};
</script>

<style scoped lang="less">
.responsive-card {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  // 尺寸变体
  &--sm {
    .card-header {
      padding: 1rem;
    }

    .card-content {
      padding: 0 1rem 1rem;
    }

    .card-footer {
      padding: 0 1rem 1rem;
    }

    .card-title {
      font-size: 1rem;
    }

    .card-subtitle {
      font-size: 0.875rem;
    }
  }

  &--md {
    .card-header {
      padding: 1.5rem;
    }

    .card-content {
      padding: 0 1.5rem 1.5rem;
    }

    .card-footer {
      padding: 0 1.5rem 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
    }

    .card-subtitle {
      font-size: 1rem;
    }
  }

  &--lg {
    .card-header {
      padding: 2rem;
    }

    .card-content {
      padding: 0 2rem 2rem;
    }

    .card-footer {
      padding: 0 2rem 2rem;
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

  &--shadow-xl {
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  }

  // 交互状态
  &--clickable {
    cursor: pointer;

    &:hover:not(.responsive-card--disabled) {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    &:focus {
      outline: 2px solid var(--accent-gold);
      outline-offset: 2px;
    }

    &:active,
    &--pressed {
      transform: translateY(-2px);
      transition-duration: 0.1s;
    }
  }

  &--hoverable:hover:not(.responsive-card--disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);

    .card-hover-indicator {
      opacity: 1;
      transform: translateX(0);
    }
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
    border-radius: 20px;
  }

  // 卡片组件
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;

    .card-title {
      font-family: var(--font-serif);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .card-subtitle {
      color: var(--text-secondary);
      margin: 0.5rem 0 0;
      line-height: 1.4;
    }

    .card-actions {
      flex-shrink: 0;
    }
  }

  .card-image {
    position: relative;
    overflow: hidden;

    .card-img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.3s ease;
    }

    .card-image-overlay {
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

    &:hover .card-image-overlay {
      opacity: 1;
    }

    &:hover .card-img {
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

  .card-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border-color);
      border-top-color: var(--accent-gold);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
  }

  .card-hover-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    background: var(--accent-gold);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;

    .hover-icon {
      font-size: 1rem;
      font-weight: bold;
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
  .responsive-card {
    border-radius: 8px;

    &--clickable:hover {
      transform: translateY(-2px);
    }

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

    .card-image .card-img {
      &:hover {
        transform: none;
      }
    }

    .card-hover-indicator {
      display: none;
    }
  }
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  .responsive-card {
    &--clickable:hover,
    &--hoverable:hover {
      transform: none;
      box-shadow: none;
    }

    &--clickable:active {
      transform: scale(0.98);
      transition-duration: 0.1s;
    }

    .card-image {
      .card-img:hover {
        transform: none;
      }

      .card-image-overlay {
        opacity: 1;
      }
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .responsive-card {
    border-width: 2px;

    &--outlined {
      border-width: 3px;
    }

    .card-footer {
      border-top-width: 2px;
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .responsive-card {
    transition: none;

    &:hover {
      transform: none;
    }

    .card-img,
    .card-image-overlay,
    .card-hover-indicator {
      transition: none;
    }

    .loading-spinner {
      animation: none;
    }
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .responsive-card {
    .card-loading {
      background: rgba(0, 0, 0, 0.9);
    }

    .card-image-overlay {
      background: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
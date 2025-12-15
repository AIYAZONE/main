<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    :href="href"
    :target="target"
    :rel="rel"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    v-bind="$attrs"
  >
    <span v-if="loading" class="button-spinner">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    </span>
    
    <span v-if="icon && iconPosition === 'left'" class="button-icon button-icon-left">
      {{ icon }}
    </span>
    
    <span class="button-content">
      <slot />
    </span>
    
    <span v-if="icon && iconPosition === 'right'" class="button-icon button-icon-right">
      {{ icon }}
    </span>
    
    <span v-if="badge" class="button-badge">
      {{ badge }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  rounded?: boolean;
  outlined?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  badge?: string | number;
  hapticFeedback?: boolean;
  touchOptimized?: boolean;
  tag?: string;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  rounded: false,
  outlined: false,
  iconPosition: 'left',
  hapticFeedback: false,
  touchOptimized: false,
  tag: 'button',
  type: 'button'
});

const emit = defineEmits<{
  click: [event: Event];
  touchStart: [event: TouchEvent];
  touchEnd: [event: TouchEvent];
}>();

const isPressed = ref(false);

const buttonClasses = computed(() => [
  'touch-button',
  'btn--touch', // For backward compatibility with tests
  `touch-button--${props.variant}`,
  `touch-button--${props.size}`,
  {
    'touch-button--disabled': props.disabled,
    'touch-button--loading': props.loading,
    'touch-button--block': props.block,
    'touch-button--rounded': props.rounded,
    'touch-button--outlined': props.outlined,
    'touch-button--pressed': isPressed.value,
    'touch-button--with-icon': props.icon,
    'touch-button--with-badge': props.badge,
    'btn--active': isPressed.value, // For test compatibility
    'btn--touch-large': props.touchOptimized,
    'btn--touch-padding': props.touchOptimized
  }
]);

const handleClick = (event: Event) => {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit('click', event);
};

const handleTouchStart = (event: TouchEvent) => {
  if (props.disabled || props.loading) return;
  isPressed.value = true;
  
  // Haptic feedback
  if (props.hapticFeedback && 'vibrate' in navigator) {
    navigator.vibrate(50);
  }
  
  emit('touchStart', event);
};

const handleTouchEnd = (event: TouchEvent) => {
  if (props.disabled || props.loading) return;
  isPressed.value = false;
  emit('touchEnd', event);
};
</script>

<style scoped lang="less">
.touch-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:focus {
    outline: 2px solid var(--accent-gold);
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(1px);
  }

  // 尺寸变体
  &--xs {
    min-height: 32px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 4px;
  }

  &--sm {
    min-height: 36px;
    padding: 0.375rem 1rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }

  &--md {
    min-height: 44px;
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    border-radius: 8px;
  }

  &--lg {
    min-height: 48px;
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    border-radius: 10px;
  }

  &--xl {
    min-height: 56px;
    padding: 1rem 2rem;
    font-size: 1.25rem;
    border-radius: 12px;
  }

  // 颜色变体
  &--primary {
    background: var(--accent-gold);
    color: white;
    border-color: var(--accent-gold);

    &:hover:not(.touch-button--disabled) {
      background: #2563eb;
      border-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    &.touch-button--outlined {
      background: transparent;
      color: var(--accent-gold);

      &:hover:not(.touch-button--disabled) {
        background: var(--accent-gold);
        color: white;
      }
    }
  }

  &--secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-color);

    &:hover:not(.touch-button--disabled) {
      background: var(--bg-color);
      border-color: var(--accent-gold);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  &--success {
    background: #10b981;
    color: white;
    border-color: #10b981;

    &:hover:not(.touch-button--disabled) {
      background: #059669;
      border-color: #059669;
    }

    &.touch-button--outlined {
      background: transparent;
      color: #10b981;

      &:hover:not(.touch-button--disabled) {
        background: #10b981;
        color: white;
      }
    }
  }

  &--warning {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;

    &:hover:not(.touch-button--disabled) {
      background: #d97706;
      border-color: #d97706;
    }

    &.touch-button--outlined {
      background: transparent;
      color: #f59e0b;

      &:hover:not(.touch-button--disabled) {
        background: #f59e0b;
        color: white;
      }
    }
  }

  &--danger {
    background: #ef4444;
    color: white;
    border-color: #ef4444;

    &:hover:not(.touch-button--disabled) {
      background: #dc2626;
      border-color: #dc2626;
    }

    &.touch-button--outlined {
      background: transparent;
      color: #ef4444;

      &:hover:not(.touch-button--disabled) {
        background: #ef4444;
        color: white;
      }
    }
  }

  &--info {
    background: #06b6d4;
    color: white;
    border-color: #06b6d4;

    &:hover:not(.touch-button--disabled) {
      background: #0891b2;
      border-color: #0891b2;
    }

    &.touch-button--outlined {
      background: transparent;
      color: #06b6d4;

      &:hover:not(.touch-button--disabled) {
        background: #06b6d4;
        color: white;
      }
    }
  }

  &--ghost {
    background: transparent;
    color: var(--text-primary);
    border-color: transparent;

    &:hover:not(.touch-button--disabled) {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  // 状态变体
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    cursor: wait;
    pointer-events: none;

    .button-content {
      opacity: 0.7;
    }
  }

  &--block {
    width: 100%;
  }

  &--rounded {
    border-radius: 9999px;
  }

  &--pressed {
    transform: scale(0.98);
  }

  // 图标和徽章
  .button-icon {
    display: flex;
    align-items: center;
    font-size: 1.2em;

    &-left {
      margin-right: -0.25rem;
    }

    &-right {
      margin-left: -0.25rem;
    }
  }

  .button-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .spinner {
      width: 20px;
      height: 20px;
      color: currentColor;
    }
  }
}

// 移动端优化
@media screen and (max-width: 767px) {
  .touch-button {
    &--md {
      min-height: 48px;
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
    }

    &--lg {
      min-height: 52px;
      padding: 1rem 2rem;
      font-size: 1.25rem;
    }
  }
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  .touch-button {
    &:hover {
      transform: none;
      box-shadow: none;
    }

    &:active {
      transform: scale(0.95);
      transition-duration: 0.1s;
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .touch-button {
    border-width: 2px;

    &--primary {
      background: #0000ff;
      border-color: #0000ff;
    }

    &--secondary {
      border-color: #000000;
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .touch-button {
    transition: none;

    &:active {
      transform: none;
    }

    .button-spinner .spinner {
      animation: none;
    }
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .touch-button {
    &--secondary {
      &:hover:not(.touch-button--disabled) {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    &--ghost {
      &:hover:not(.touch-button--disabled) {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
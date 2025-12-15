<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    :href="href"
    :target="target"
    :rel="rel"
    @click="handleClick"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner">
      <svg class="loading-spinner" viewBox="0 0 24 24">
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          stroke-width="2" 
          fill="none" 
          stroke-dasharray="31.416" 
          stroke-dashoffset="31.416"
        >
          <animate 
            attributeName="stroke-dasharray" 
            dur="2s" 
            values="0 31.416;15.708 15.708;0 31.416" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="stroke-dashoffset" 
            dur="2s" 
            values="0;-15.708;-31.416" 
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
    
    <span v-if="(iconLeft || icon) && !loading" class="btn-icon btn-icon--left">
      {{ iconLeft || icon }}
    </span>
    
    <span class="btn-content" :class="{ 'btn-content--hidden': loading }">
      <slot />
    </span>
    
    <span v-if="iconRight && !loading" class="btn-icon btn-icon--right">
      {{ iconRight }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  rounded?: boolean;
  outlined?: boolean;
  icon?: string; // For backward compatibility with tests
  iconLeft?: string;
  iconRight?: string;
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
  tag: 'button',
  type: 'button'
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const buttonClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--disabled': props.disabled,
    'btn--loading': props.loading,
    'btn--block': props.block,
    'btn--rounded': props.rounded,
    'btn--outlined': props.outlined,
    'btn--with-icon-left': props.iconLeft || props.icon,
    'btn--with-icon-right': props.iconRight
  }
]);

const handleClick = (event: Event) => {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit('click', event);
};
</script>

<style scoped lang="less">
.btn {
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
  white-space: nowrap;

  &:focus {
    outline: 2px solid var(--accent-gold);
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(1px);
  }

  // 尺寸变体
  &--xs {
    min-height: 28px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 4px;
  }

  &--sm {
    min-height: 32px;
    padding: 0.375rem 1rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }

  &--md {
    min-height: 40px;
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    border-radius: 8px;
  }

  &--lg {
    min-height: 44px;
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    border-radius: 10px;
  }

  &--xl {
    min-height: 48px;
    padding: 1rem 2rem;
    font-size: 1.25rem;
    border-radius: 12px;
  }

  // Legacy size classes for backward compatibility
  &--small {
    min-height: 32px;
    padding: 0.375rem 1rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }

  &--medium {
    min-height: 40px;
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    border-radius: 8px;
  }

  &--large {
    min-height: 44px;
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    border-radius: 10px;
  }

  // 颜色变体
  &--primary {
    background: var(--accent-gold);
    color: white;
    border-color: var(--accent-gold);

    &:hover:not(.btn--disabled) {
      background: #2563eb;
      border-color: #2563eb;
    }

    &.btn--outlined {
      background: transparent;
      color: var(--accent-gold);

      &:hover:not(.btn--disabled) {
        background: var(--accent-gold);
        color: white;
      }
    }
  }

  &--secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-color);

    &:hover:not(.btn--disabled) {
      background: var(--bg-color);
      border-color: var(--accent-gold);
    }

    &.btn--outlined {
      background: transparent;

      &:hover:not(.btn--disabled) {
        background: var(--bg-secondary);
      }
    }
  }

  &--success {
    background: #10b981;
    color: white;
    border-color: #10b981;

    &:hover:not(.ui-button--disabled) {
      background: #059669;
      border-color: #059669;
    }

    &.ui-button--outlined {
      background: transparent;
      color: #10b981;

      &:hover:not(.ui-button--disabled) {
        background: #10b981;
        color: white;
      }
    }
  }

  &--warning {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;

    &:hover:not(.ui-button--disabled) {
      background: #d97706;
      border-color: #d97706;
    }

    &.ui-button--outlined {
      background: transparent;
      color: #f59e0b;

      &:hover:not(.ui-button--disabled) {
        background: #f59e0b;
        color: white;
      }
    }
  }

  &--danger {
    background: #ef4444;
    color: white;
    border-color: #ef4444;

    &:hover:not(.ui-button--disabled) {
      background: #dc2626;
      border-color: #dc2626;
    }

    &.ui-button--outlined {
      background: transparent;
      color: #ef4444;

      &:hover:not(.ui-button--disabled) {
        background: #ef4444;
        color: white;
      }
    }
  }

  &--info {
    background: #06b6d4;
    color: white;
    border-color: #06b6d4;

    &:hover:not(.ui-button--disabled) {
      background: #0891b2;
      border-color: #0891b2;
    }

    &.ui-button--outlined {
      background: transparent;
      color: #06b6d4;

      &:hover:not(.ui-button--disabled) {
        background: #06b6d4;
        color: white;
      }
    }
  }

  &--light {
    background: #f8fafc;
    color: var(--text-primary);
    border-color: #e2e8f0;

    &:hover:not(.ui-button--disabled) {
      background: #e2e8f0;
      border-color: #cbd5e1;
    }

    &.ui-button--outlined {
      background: transparent;

      &:hover:not(.ui-button--disabled) {
        background: #f8fafc;
      }
    }
  }

  &--dark {
    background: #1e293b;
    color: white;
    border-color: #1e293b;

    &:hover:not(.ui-button--disabled) {
      background: #0f172a;
      border-color: #0f172a;
    }

    &.ui-button--outlined {
      background: transparent;
      color: #1e293b;

      &:hover:not(.ui-button--disabled) {
        background: #1e293b;
        color: white;
      }
    }
  }

  &--ghost {
    background: transparent;
    color: var(--text-primary);
    border-color: transparent;

    &:hover:not(.ui-button--disabled) {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  &--link {
    background: transparent;
    color: var(--accent-gold);
    border-color: transparent;
    text-decoration: underline;
    padding: 0;
    min-height: auto;

    &:hover:not(.ui-button--disabled) {
      color: #2563eb;
      text-decoration: none;
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
  }

  &--block {
    width: 100%;
  }

  &--rounded {
    border-radius: 9999px;
  }

  // 图标和内容
  .btn-icon {
    display: flex;
    align-items: center;
    font-size: 1.2em;

    &--left {
      margin-right: -0.25rem;
    }

    &--right {
      margin-left: -0.25rem;
    }
  }

  .btn-content {
    transition: opacity 0.2s ease;

    &--hidden {
      opacity: 0;
    }
  }

  .btn-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .loading-spinner {
      width: 20px;
      height: 20px;
      color: currentColor;
    }
  }
}

// 移动端优化
@media screen and (max-width: 767px) {
  .ui-button {
    &--md {
      min-height: 44px;
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
    }

    &--lg {
      min-height: 48px;
      padding: 1rem 2rem;
      font-size: 1.25rem;
    }
  }
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  .ui-button {
    &:hover {
      transform: none;
    }

    &:active {
      transform: scale(0.95);
      transition-duration: 0.1s;
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .ui-button {
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
  .ui-button {
    transition: none;

    &:active {
      transform: none;
    }

    .button-content,
    .loading-spinner {
      transition: none;
      animation: none;
    }
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .ui-button {
    &--secondary {
      &:hover:not(.ui-button--disabled) {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    &--ghost {
      &:hover:not(.ui-button--disabled) {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    &--light {
      background: #374151;
      color: white;
      border-color: #4b5563;

      &:hover:not(.ui-button--disabled) {
        background: #4b5563;
        border-color: #6b7280;
      }
    }
  }
}
</style>
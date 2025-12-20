<template>
  <component
    :is="tag"
    :class="logoClasses"
    :href="href"
    :to="to"
    @click="handleClick"
  >
    <div class="logo-content">
      <!-- 图标部分 -->
      <div v-if="showIcon" class="logo-icon">
        <img 
          v-if="variant === 'icon' || variant === 'full'"
          src="/logo.jpg"
          alt="AIYAZONE Logo"
          class="logo-image"
        />
      </div>

      <!-- 文字部分 -->
      <div v-if="showText" class="logo-text">
        <span class="logo-primary">{{ primaryText }}</span>
        <span v-if="secondaryText && showSecondary" class="logo-secondary">{{ secondaryText }}</span>
      </div>
    </div>

    <!-- 标语 -->
    <div v-if="tagline && showTagline" class="logo-tagline">
      {{ tagline }}
    </div>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'BrandLogo' });
</script>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'icon' | 'text' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'primary' | 'secondary' | 'white' | 'dark' | 'inherit';
  orientation?: 'horizontal' | 'vertical';
  primaryText?: string;
  secondaryText?: string;
  tagline?: string;
  showSecondary?: boolean;
  showTagline?: boolean;
  clickable?: boolean;
  tag?: string;
  href?: string;
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'full',
  size: 'md',
  color: 'primary',
  orientation: 'horizontal',
  primaryText: 'AIYAZONE',
  secondaryText: '',
  tagline: '',
  showSecondary: true,
  showTagline: false,
  clickable: false,
  tag: 'div'
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const logoClasses = computed(() => [
  'brand-logo',
  `logo--${props.variant}`,
  `logo--${props.size}`,
  `logo--${props.color}`,
  `logo--${props.orientation}`,
  {
    'logo--clickable': props.clickable || props.href || props.to
  }
]);

const showIcon = computed(() => {
  return props.variant === 'icon' || props.variant === 'full';
});

const showText = computed(() => {
  return props.variant === 'text' || props.variant === 'full';
});

const handleClick = (event: Event) => {
  if (props.clickable || props.href || props.to) {
    emit('click', event);
  }
};
</script>

<style scoped lang="less">
.brand-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
  user-select: none;

  // 方向变体
  &--horizontal {
    flex-direction: row;
    gap: 0.75rem;

    .logo-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-tagline {
      margin-left: 0.5rem;
      padding-left: 0.5rem;
      border-left: 1px solid currentColor;
      opacity: 0.7;
    }
  }

  &--vertical {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;

    .logo-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-tagline {
      margin-top: 0.25rem;
      padding-top: 0.25rem;
      border-top: 1px solid currentColor;
      opacity: 0.7;
    }
  }

  // 尺寸变体
  &--xs {
    .logo-icon {
      width: 20px;
      height: 20px;
    }

    .logo-text {
      .logo-primary {
        font-size: 0.875rem;
        font-weight: 600;
      }

      .logo-secondary {
        font-size: 0.75rem;
      }
    }

    .logo-tagline {
      font-size: 0.625rem;
    }
  }

  &--sm {
    .logo-icon {
      width: 24px;
      height: 24px;
    }

    .logo-text {
      .logo-primary {
        font-size: 1rem;
        font-weight: 600;
      }

      .logo-secondary {
        font-size: 0.875rem;
      }
    }

    .logo-tagline {
      font-size: 0.75rem;
    }
  }

  &--md {
    .logo-icon {
      width: 32px;
      height: 32px;
    }

    .logo-text {
      .logo-primary {
        font-size: 1.25rem;
        font-weight: 700;
      }

      .logo-secondary {
        font-size: 1rem;
      }
    }

    .logo-tagline {
      font-size: 0.875rem;
    }
  }

  &--lg {
    .logo-icon {
      width: 40px;
      height: 40px;
    }

    .logo-text {
      .logo-primary {
        font-size: 1.5rem;
        font-weight: 700;
      }

      .logo-secondary {
        font-size: 1.125rem;
      }
    }

    .logo-tagline {
      font-size: 1rem;
    }
  }

  &--xl {
    .logo-icon {
      width: 48px;
      height: 48px;
    }

    .logo-text {
      .logo-primary {
        font-size: 1.875rem;
        font-weight: 700;
      }

      .logo-secondary {
        font-size: 1.25rem;
      }
    }

    .logo-tagline {
      font-size: 1.125rem;
    }
  }

  &--2xl {
    .logo-icon {
      width: 64px;
      height: 64px;
    }

    .logo-text {
      .logo-primary {
        font-size: 2.25rem;
        font-weight: 800;
      }

      .logo-secondary {
        font-size: 1.5rem;
      }
    }

    .logo-tagline {
      font-size: 1.25rem;
    }
  }

  // 颜色变体
  &--primary {
    color: #1a1a1a;

    .logo-secondary {
      color: #64748b;
    }
  }

  &--secondary {
    color: var(--brand-secondary);

    .logo-primary {
      color: var(--brand-gray-700);
    }
  }

  &--white {
    color: white;

    .logo-secondary {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  &--dark {
    color: var(--brand-gray-900);

    .logo-secondary {
      color: var(--brand-gray-600);
    }
  }

  &--inherit {
    color: inherit;

    .logo-secondary {
      opacity: 0.7;
    }
  }

  // 交互状态
  &--clickable {
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    &:active {
      transform: scale(0.98);
    }

    &:focus {
      outline: 2px solid var(--brand-primary);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  // 组件部分
  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .logo-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .logo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;

    .logo-primary {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .logo-secondary {
      font-family: var(--brand-font-primary);
      font-weight: 400;
      opacity: 0.8;
      margin-top: -0.125em;
    }
  }

  .logo-tagline {
    font-family: var(--brand-font-primary);
    font-weight: 400;
    font-style: italic;
    line-height: 1.3;
  }

  // 只有图标的变体
  &--icon {
    .logo-content {
      gap: 0;
    }
  }

  // 只有文字的变体
  &--text {
    .logo-content {
      gap: 0;
    }
  }
}

// 移动端优化
@media screen and (max-width: 767px) {
  .brand-logo-component {
    &--horizontal {
      gap: 0.5rem;

      .logo-content {
        gap: 0.5rem;
      }
    }

    &--lg,
    &--xl,
    &--2xl {
      .logo-icon {
        width: 32px;
        height: 32px;
      }

      .logo-text {
        .logo-primary {
          font-size: 1.25rem;
        }

        .logo-secondary {
          font-size: 1rem;
        }
      }
    }
  }
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  .brand-logo-component--clickable {
    &:hover {
      transform: none;
      filter: none;
    }

    &:active {
      transform: scale(0.95);
      transition-duration: 0.1s;
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .brand-logo-component {
    &--primary {
      color: #0000ff;
    }

    &--secondary {
      color: #000000;
    }

    .logo-tagline,
    .logo-secondary {
      opacity: 1;
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .brand-logo-component {
    transition: none;

    &--clickable:hover {
      transform: none;
    }

    &--clickable:active {
      transform: none;
    }
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .brand-logo-component {
    &--primary {
      color: var(--brand-primary-light);
    }

    &--secondary {
      color: var(--brand-gray-300);

      .logo-primary {
        color: var(--brand-gray-200);
      }
    }

    &--dark {
      color: var(--brand-gray-100);

      .logo-secondary {
        color: var(--brand-gray-400);
      }
    }
  }
}
</style>

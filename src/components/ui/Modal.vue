<template>
  <Teleport v-if="useTeleport" to="body">
    <Transition name="modal" appear>
      <div 
        v-if="modelValue || visible"
        class="modal-overlay"
        @click="handleOverlayClick"
        @keydown="handleKeydown"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
      >
        <div 
          :class="modalClasses"
          @click.stop
          ref="modalRef"
        >
          <header v-if="$slots.header || title || closable" class="modal-header">
            <slot name="header">
              <h2 v-if="title" :id="titleId" class="modal-title">{{ title }}</h2>
            </slot>
            <button
              v-if="closable"
              class="modal-close"
              @click="handleClose"
              :aria-label="$t('ui.modal.close')"
              type="button"
            >
              <span class="close-icon">✕</span>
            </button>
          </header>

          <div :id="contentId" class="modal-content">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
  <Transition v-else name="modal" appear>
    <div 
      v-if="modelValue || visible"
      class="modal-overlay"
      @click="handleOverlayClick"
      @keydown="handleKeydown"
      role="dialog"
      :aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="contentId"
    >
      <div 
        :class="modalClasses"
        @click.stop
        ref="modalRef"
      >
        <header v-if="$slots.header || title || closable" class="modal-header">
          <slot name="header">
            <h2 v-if="title" :id="titleId" class="modal-title">{{ title }}</h2>
          </slot>
          <button
            v-if="closable"
            class="modal-close"
            @click="handleClose"
            :aria-label="$t('ui.modal.close')"
            type="button"
          >
            <span class="close-icon">✕</span>
          </button>
        </header>

        <div :id="contentId" class="modal-content">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  modelValue?: boolean;
  visible?: boolean; // For backward compatibility with tests
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'small' | 'medium' | 'large' | 'fullscreen';
  closable?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  persistent?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  fullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  visible: false,
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  persistent: false,
  centered: true,
  scrollable: false,
  fullscreen: false
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  open: [];
  close: [];
  beforeClose: [event: Event];
}>();

const { t } = useI18n();

const modalRef = ref<HTMLElement>();
const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`);
const contentId = computed(() => `modal-content-${Math.random().toString(36).substr(2, 9)}`);

const useTeleport = computed(() => !props.visible);

const normalizedSize = computed(() => {
  if (props.size === 'small') return 'sm';
  if (props.size === 'medium') return 'md';
  if (props.size === 'large') return 'lg';
  if (props.size === 'fullscreen') return 'fullscreen';
  return props.size;
});

const legacySizeClass = computed(() => {
  if (props.size === 'small' || props.size === 'medium' || props.size === 'large' || props.size === 'fullscreen') {
    return props.size;
  }
  return '';
});

const modalClasses = computed(() => [
  'modal-container',
  `modal--${normalizedSize.value}`,
  legacySizeClass.value ? `modal--${legacySizeClass.value}` : '',
  {
    'modal-container--centered': props.centered,
    'modal-container--scrollable': props.scrollable,
    'modal-container--fullscreen': props.fullscreen || props.size === 'fullscreen'
  }
]);

const handleClose = (event?: Event) => {
  if (props.persistent) return;
  
  if (event) {
    emit('beforeClose', event);
  }
  
  emit('update:modelValue', false);
  emit('close');
};

const handleOverlayClick = (event: Event) => {
  if (props.closeOnOverlay && !props.persistent) {
    handleClose(event);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    handleClose(event);
  }
};

// 焦点管理
let previousActiveElement: HTMLElement | null = null;

const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

let cleanupFocusTrap: (() => void) | null = null;

const isModalOpen = computed(() => props.modelValue || props.visible);

watch(() => isModalOpen.value, async (isOpen) => {
  if (isOpen) {
    // 保存当前焦点元素
    previousActiveElement = document.activeElement as HTMLElement;
    
    // 禁用背景滚动
    document.body.style.overflow = 'hidden';
    
    await nextTick();
    
    // 设置焦点到模态框
    if (modalRef.value) {
      modalRef.value.focus();
      cleanupFocusTrap = trapFocus(modalRef.value);
    }
    
    emit('open');
  } else {
    // 恢复背景滚动
    document.body.style.overflow = '';
    
    // 清理焦点陷阱
    if (cleanupFocusTrap) {
      cleanupFocusTrap();
      cleanupFocusTrap = null;
    }
    
    // 恢复之前的焦点
    if (previousActiveElement) {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  }
});

onMounted(() => {
  if (isModalOpen.value) {
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
  if (cleanupFocusTrap) {
    cleanupFocusTrap();
  }
});
</script>

<style scoped lang="less">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  outline: none;

  // 尺寸变体
  &.modal--xs {
    max-width: 300px;
  }

  &.modal--sm,
  &.modal--small {
    max-width: 400px;
  }

  &.modal--md,
  &.modal--medium {
    max-width: 500px;
  }

  &.modal--lg,
  &.modal--large {
    max-width: 700px;
  }

  &.modal--xl {
    max-width: 900px;
  }

  &.modal--full {
    max-width: 95vw;
    max-height: 95vh;
  }

  &--centered {
    margin: auto;
  }

  &--scrollable {
    .modal-content {
      overflow-y: auto;
      max-height: 60vh;
    }
  }

  &--fullscreen,
  &.modal--fullscreen {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    border-radius: 0;
    margin: 0;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;

    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .modal-close {
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: var(--text-primary);
      }

      &:focus {
        outline: 2px solid var(--accent-gold);
        outline-offset: 2px;
      }

      .close-icon {
        font-size: 1.25rem;
        line-height: 1;
      }
    }
  }

  .modal-content {
    padding: 2rem;
    flex: 1;
    overflow-y: auto;
    color: var(--text-secondary);
    line-height: 1.6;

    &:first-child {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    &:last-child {
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }

  .modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-color);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    flex-shrink: 0;
  }
}

// 动画
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

// 移动端优化
@media screen and (max-width: 767px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-dialog {
    max-height: 95vh;
    border-radius: 8px;

    &--xs,
    &--sm,
    &--md,
    &--lg,
    &--xl {
      max-width: none;
      width: 100%;
    }

    &--fullscreen {
      border-radius: 0;
      width: 100vw;
      height: 100vh;
    }

    .modal-header {
      padding: 1rem 1.5rem;

      .modal-title {
        font-size: 1.25rem;
      }

      .modal-close {
        width: 28px;
        height: 28px;

        .close-icon {
          font-size: 1rem;
        }
      }
    }

    .modal-content {
      padding: 1.5rem;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
    }

    &--scrollable .modal-content {
      max-height: 70vh;
    }
  }
}

// 横屏优化
@media screen and (max-height: 500px) and (orientation: landscape) {
  .modal-dialog {
    max-height: 90vh;

    &--scrollable .modal-content {
      max-height: 50vh;
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .modal-dialog {
    border: 2px solid var(--text-primary);

    .modal-header,
    .modal-footer {
      border-width: 2px;
    }

    .modal-close {
      border: 1px solid var(--text-secondary);
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active {
    transition: none;
  }

  .modal-enter-from .modal-dialog,
  .modal-leave-to .modal-dialog {
    transform: none;
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .modal-overlay {
    background: rgba(0, 0, 0, 0.7);
  }

  .modal-dialog {
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>

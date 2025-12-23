<template>
  <div class="error-fallback">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">{{ title || t('errors.componentLoadFailed', 'Component failed to load') }}</h3>
      <p class="error-message">{{ message || t('errors.componentLoadFailedDesc', 'There was an error loading this component. Please try refreshing the page.') }}</p>
      <div class="error-actions">
        <button 
          class="retry-button" 
          @click="handleRetry"
          :disabled="retrying"
        >
          {{ retrying ? t('common.retrying', 'Retrying...') : t('common.retry', 'Retry') }}
        </button>
        <button 
          class="refresh-button" 
          @click="handleRefresh"
        >
          {{ t('common.refresh', 'Refresh Page') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  message: ''
});

const { t } = useI18n();
const retrying = ref(false);

const handleRetry = async () => {
  if (props.onRetry) {
    retrying.value = true;
    try {
      await props.onRetry();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      retrying.value = false;
    }
  } else {
    // 默认重试行为：重新加载页面
    window.location.reload();
  }
};

const handleRefresh = () => {
  window.location.reload();
};
</script>

<style scoped lang="less">
.error-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.error-content {
  text-align: center;
  max-width: 400px;

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }

  .error-message {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 2rem 0;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;

    button {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-size: 0.9rem;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .retry-button {
      background: var(--brand-primary);
      color: white;

      &:hover:not(:disabled) {
        background: var(--brand-primary-dark);
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    .refresh-button {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);

      &:hover {
        background: var(--bg-tertiary);
        border-color: var(--brand-primary);
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .error-fallback {
    padding: 1rem;
    min-height: 150px;
  }

  .error-content {
    .error-icon {
      font-size: 2rem;
    }

    .error-title {
      font-size: 1.125rem;
    }

    .error-actions {
      flex-direction: column;
      align-items: center;

      button {
        width: 100%;
        max-width: 200px;
      }
    }
  }
}
</style>
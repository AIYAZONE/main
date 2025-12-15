<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />
    
    <!-- 错误状态 -->
    <div v-else class="error-state">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">{{ errorTitle }}</h2>
        <p class="error-message">{{ errorMessage }}</p>
        
        <!-- 错误详情（开发环境） -->
        <details v-if="showDetails" class="error-details">
          <summary>错误详情</summary>
          <pre class="error-stack">{{ errorStack }}</pre>
        </details>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <button 
            class="retry-button" 
            @click="handleRetry"
            :disabled="retrying"
          >
            {{ retrying ? $t('common.retrying', 'Retrying...') : $t('common.retry', 'Retry') }}
          </button>
          
          <button 
            class="reload-button" 
            @click="handleReload"
          >
            {{ $t('common.reload', 'Reload Page') }}
          </button>
          
          <button 
            v-if="showReportButton"
            class="report-button" 
            @click="handleReport"
            :disabled="reported"
          >
            {{ reported ? $t('common.reported', 'Reported') : $t('common.report', 'Report Issue') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { errorHandler } from '../../services/errorHandlingService';

interface Props {
  fallbackComponent?: string;
  showDetails?: boolean;
  showReportButton?: boolean;
  onError?: (error: Error, instance: any, info: string) => void;
  onRetry?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackComponent: '',
  showDetails: process.env.NODE_ENV === 'development',
  showReportButton: true
});

const emit = defineEmits<{
  error: [error: Error, info: string];
  retry: [];
}>();

const { t } = useI18n();

// 状态
const hasError = ref(false);
const errorInfo = ref<{
  error: Error;
  info: string;
} | null>(null);
const retrying = ref(false);
const reported = ref(false);

// 计算属性
const errorTitle = computed(() => {
  if (!errorInfo.value) return '';
  
  const error = errorInfo.value.error;
  if (error.name === 'ChunkLoadError') {
    return t('errors.chunkLoadError', 'Loading Error');
  }
  if (error.name === 'NetworkError') {
    return t('errors.networkError', 'Network Error');
  }
  return t('errors.componentError', 'Component Error');
});

const errorMessage = computed(() => {
  if (!errorInfo.value) return '';
  
  const error = errorInfo.value.error;
  if (error.name === 'ChunkLoadError') {
    return t('errors.chunkLoadErrorDesc', 'Failed to load application resources. Please refresh the page.');
  }
  if (error.name === 'NetworkError') {
    return t('errors.networkErrorDesc', 'Network connection issue. Please check your connection and try again.');
  }
  return t('errors.componentErrorDesc', 'An unexpected error occurred. Please try refreshing the page.');
});

const errorStack = computed(() => {
  return errorInfo.value?.error.stack || '';
});

// 错误捕获
onErrorCaptured((error: Error, instance: any, info: string) => {
  hasError.value = true;
  errorInfo.value = { error, info };
  
  // 记录错误
  errorHandler.component(error, instance?.$options.name || 'Unknown', {
    info,
    componentStack: info
  });
  
  // 触发回调
  if (props.onError) {
    props.onError(error, instance, info);
  }
  
  // 触发事件
  emit('error', error, info);
  
  // 阻止错误继续传播
  return false;
});

// 方法
const handleRetry = async () => {
  if (retrying.value) return;
  
  retrying.value = true;
  
  try {
    // 等待一小段时间
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 重置错误状态
    hasError.value = false;
    errorInfo.value = null;
    reported.value = false;
    
    // 触发重试回调
    if (props.onRetry) {
      props.onRetry();
    }
    
    // 触发重试事件
    emit('retry');
  } catch (error) {
    console.error('Retry failed:', error);
  } finally {
    retrying.value = false;
  }
};

const handleReload = () => {
  window.location.reload();
};

const handleReport = async () => {
  if (reported.value || !errorInfo.value) return;
  
  try {
    // 发送错误报告
    await errorHandler.handle({
      message: `User reported error: ${errorInfo.value.error.message}`,
      stack: errorInfo.value.error.stack,
      context: {
        userReported: true,
        componentInfo: errorInfo.value.info,
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      category: 'user',
      severity: 'medium'
    });
    
    reported.value = true;
    
    // 显示感谢消息
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(t('common.thankYou', 'Thank you'), {
          body: t('common.reportReceived', 'Your report has been received.'),
          icon: '/favicon.ico'
        });
      }
    }
  } catch (error) {
    console.error('Failed to report error:', error);
  }
};

// 生命周期
onMounted(() => {
  // 监听全局错误
  const handleGlobalError = (event: ErrorEvent) => {
    if (!hasError.value) {
      hasError.value = true;
      errorInfo.value = {
        error: event.error || new Error(event.message),
        info: 'Global error'
      };
    }
  };
  
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (!hasError.value) {
      hasError.value = true;
      errorInfo.value = {
        error: new Error(`Unhandled Promise Rejection: ${event.reason}`),
        info: 'Unhandled promise rejection'
      };
    }
  };
  
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  // 清理
  return () => {
    window.removeEventListener('error', handleGlobalError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
});
</script>

<style scoped lang="less">
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.error-content {
  text-align: center;
  max-width: 500px;

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .error-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
  }

  .error-message {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 2rem 0;
    font-size: 1rem;
  }

  .error-details {
    text-align: left;
    margin: 2rem 0;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: 4px;
    border: 1px solid var(--border-color);

    summary {
      cursor: pointer;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 0.5rem;

      &:hover {
        color: var(--brand-primary);
      }
    }

    .error-stack {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.875rem;
      color: var(--text-secondary);
      white-space: pre-wrap;
      word-break: break-all;
      margin: 0.5rem 0 0 0;
      max-height: 200px;
      overflow-y: auto;
    }
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
      min-width: 120px;

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
    }

    .reload-button {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);

      &:hover {
        background: var(--bg-tertiary);
        border-color: var(--brand-primary);
      }
    }

    .report-button {
      background: #f59e0b;
      color: white;

      &:hover:not(:disabled) {
        background: #d97706;
        transform: translateY(-1px);
      }

      &:disabled {
        background: #10b981;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .error-state {
    padding: 1rem;
    min-height: 300px;
  }

  .error-content {
    .error-icon {
      font-size: 3rem;
    }

    .error-title {
      font-size: 1.25rem;
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

// 高对比度模式
@media (prefers-contrast: high) {
  .error-state {
    border-width: 2px;
  }

  .error-details {
    border-width: 2px;
  }

  .reload-button {
    border-width: 2px;
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .error-actions button:hover {
    transform: none;
  }
}
</style>
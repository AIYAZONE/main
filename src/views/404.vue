<template>
  <div class="error-page-container">
    <div class="error-page">
      <!-- 错误图标区域 -->
      <div class="error-visual">
        <div class="error-code">404</div>
        <div class="error-icon">🔍</div>
      </div>
      
      <!-- 错误信息区域 -->
      <div class="error-content">
        <h1 class="error-title">{{ $t('errors.pageNotFound', 'Page Not Found') }}</h1>
        <p class="error-description">
          {{ $t('errors.pageNotFoundDesc', 'Sorry, the page you are looking for does not exist. It might have been moved, deleted, or you entered the wrong URL.') }}
        </p>
        
        <!-- 当前路径信息 -->
        <div class="error-path">
          <span class="path-label">{{ $t('errors.requestedPath', 'Requested path:') }}</span>
          <code class="path-value">{{ currentPath }}</code>
        </div>
        
        <!-- 建议操作 -->
        <div class="error-suggestions">
          <h3 class="suggestions-title">{{ $t('errors.suggestions', 'What you can do:') }}</h3>
          <ul class="suggestions-list">
            <li>{{ $t('errors.checkUrl', 'Check the URL for typos') }}</li>
            <li>{{ $t('errors.useNavigation', 'Use the navigation menu to find what you need') }}</li>
            <li>{{ $t('errors.goHome', 'Go back to the homepage') }}</li>
            <li>{{ $t('errors.contactSupport', 'Contact support if you believe this is an error') }}</li>
          </ul>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <router-link to="/" class="action-button primary">
            <span class="button-icon">🏠</span>
            {{ $t('nav.home', 'Home') }}
          </router-link>
          
          <button @click="goBack" class="action-button secondary">
            <span class="button-icon">↩️</span>
            {{ $t('common.goBack', 'Go Back') }}
          </button>
          
          <router-link to="/contact" class="action-button tertiary">
            <span class="button-icon">📧</span>
            {{ $t('nav.contact', 'Contact') }}
          </router-link>
        </div>
        
        <!-- 快速导航 -->
        <div class="quick-nav">
          <h3 class="quick-nav-title">{{ $t('errors.quickNavigation', 'Quick Navigation:') }}</h3>
          <div class="quick-nav-links">
            <router-link to="/about" class="quick-link">
              {{ $t('nav.about', 'About') }}
            </router-link>
            <router-link to="/portfolio" class="quick-link">
              {{ $t('nav.portfolio', 'Portfolio') }}
            </router-link>
            <router-link to="/career" class="quick-link">
              {{ $t('nav.career', 'Career') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { errorHandler } from '../services/errorHandlingService';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// 当前路径
const currentPath = computed(() => route.fullPath);

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};

// 记录404错误
onMounted(() => {
  errorHandler.handle({
    message: `404 Page Not Found: ${currentPath.value}`,
    context: {
      path: currentPath.value,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    },
    category: 'user',
    severity: 'low'
  });
  
  // 设置页面标题
  document.title = `${t('errors.pageNotFound')} - AIYAZONE`;
});
</script>

<style scoped lang="less">
.error-page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.error-page {
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.error-visual {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
  color: white;
  text-align: center;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }

  .error-code {
    font-size: 6rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 1;
  }

  .error-icon {
    font-size: 3rem;
    opacity: 0.8;
    position: relative;
    z-index: 1;
  }
}

.error-content {
  padding: 3rem 2rem;

  .error-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .error-description {
    font-size: 1.125rem;
    color: var(--text-secondary);
    line-height: 1.6;
    text-align: center;
    margin: 0 0 2rem 0;
  }

  .error-path {
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 1rem;
    margin: 2rem 0;
    border-left: 4px solid var(--brand-primary);

    .path-label {
      font-weight: 500;
      color: var(--text-primary);
      display: block;
      margin-bottom: 0.5rem;
    }

    .path-value {
      background: var(--bg-tertiary);
      padding: 0.5rem;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.875rem;
      color: var(--brand-primary);
      word-break: break-all;
    }
  }

  .error-suggestions {
    margin: 2rem 0;

    .suggestions-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .suggestions-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.5rem 0;
        color: var(--text-secondary);
        position: relative;
        padding-left: 1.5rem;

        &::before {
          content: '•';
          color: var(--brand-primary);
          font-weight: bold;
          position: absolute;
          left: 0;
        }
      }
    }
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 2rem 0;

    .action-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;

      .button-icon {
        font-size: 1rem;
      }

      &.primary {
        background: var(--brand-primary);
        color: white;

        &:hover {
          background: var(--brand-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
      }

      &.secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);

        &:hover {
          background: var(--bg-tertiary);
          border-color: var(--brand-primary);
          transform: translateY(-2px);
        }
      }

      &.tertiary {
        background: transparent;
        color: var(--brand-primary);
        border: 1px solid var(--brand-primary);

        &:hover {
          background: var(--brand-primary);
          color: white;
          transform: translateY(-2px);
        }
      }
    }
  }

  .quick-nav {
    border-top: 1px solid var(--border-color);
    padding-top: 2rem;
    text-align: center;

    .quick-nav-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .quick-nav-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;

      .quick-link {
        color: var(--brand-primary);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        background: rgba(59, 130, 246, 0.1);
        font-size: 0.875rem;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(59, 130, 246, 0.2);
          transform: translateY(-1px);
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .error-page-container {
    padding: 1rem;
  }

  .error-visual {
    padding: 2rem 1rem;

    .error-code {
      font-size: 4rem;
    }

    .error-icon {
      font-size: 2rem;
    }
  }

  .error-content {
    padding: 2rem 1rem;

    .error-title {
      font-size: 1.5rem;
    }

    .error-description {
      font-size: 1rem;
    }

    .error-actions {
      flex-direction: column;
      align-items: center;

      .action-button {
        width: 100%;
        max-width: 200px;
        justify-content: center;
      }
    }

    .quick-nav-links {
      flex-direction: column;
      align-items: center;

      .quick-link {
        width: 100%;
        max-width: 150px;
        text-align: center;
      }
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .error-page {
    animation: none;
  }

  .action-button:hover {
    transform: none;
  }

  .quick-link:hover {
    transform: none;
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .error-path {
    border-left-width: 6px;
  }

  .action-button.secondary,
  .action-button.tertiary {
    border-width: 2px;
  }
}
</style>

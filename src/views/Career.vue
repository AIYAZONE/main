<template>
  <div class="career-view">
    <!-- 页面头部 -->
    <section class="career-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">{{ $t('career.title') }}</h1>
          <p class="page-subtitle">{{ $t('career.roadmap.description') }}</p>
        </div>
        
        <!-- 导航标签 -->
        <nav class="career-nav" role="tablist">
          <router-link
            to="/career"
            class="nav-tab"
            :class="{ active: $route.name === 'CareerOverview' || $route.name === 'Career' }"
            role="tab"
            :aria-selected="$route.name === 'CareerOverview' || $route.name === 'Career'"
          >
            <span class="tab-icon">🗺️</span>
            <span class="tab-text">{{ $t('career.roadmap.title') }}</span>
          </router-link>
          
          <router-link
            to="/career/swot"
            class="nav-tab"
            :class="{ active: $route.name === 'SWOT' }"
            role="tab"
            :aria-selected="$route.name === 'SWOT'"
          >
            <span class="tab-icon">📊</span>
            <span class="tab-text">{{ $t('career.swot.title') }}</span>
          </router-link>
          
          <router-link
            to="/career/learning"
            class="nav-tab"
            :class="{ active: $route.name === 'Learning' }"
            role="tab"
            :aria-selected="$route.name === 'Learning'"
          >
            <span class="tab-icon">📚</span>
            <span class="tab-text">{{ $t('career.learning.title') }}</span>
          </router-link>
        </nav>
      </div>
    </section>

    <!-- 内容区域 -->
    <section class="career-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

onMounted(() => {
  updatePageTitle();
});

watch(() => route.name, () => {
  updatePageTitle();
});

const updatePageTitle = () => {
  let title = t('career.title');
  
  switch (route.name) {
    case 'SWOT':
      title = `${t('career.swot.title')} - ${title}`;
      break;
    case 'Learning':
      title = `${t('career.learning.title')} - ${title}`;
      break;
    case 'Roadmap':
    case 'CareerOverview':
    default:
      title = `${t('career.roadmap.title')} - ${title}`;
      break;
  }
  
  document.title = `${title} - AIYAZONE`;
};
</script>

<style scoped lang="less">
.career-view {
  min-height: 100vh;
  background: var(--bg-primary);
}

.career-header {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
  color: white;
  padding: 3rem 0 2rem;
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

  .container {
    position: relative;
    z-index: 1;
  }

  .header-content {
    text-align: center;
    margin-bottom: 2rem;

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .page-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }

  .career-nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;

    .nav-tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }

      &:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
      }

      &.active {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .tab-icon {
        font-size: 1.25rem;
      }

      .tab-text {
        font-size: 0.95rem;
      }
    }
  }
}

.career-content {
  padding: 3rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 移动端适配
@media screen and (max-width: 767px) {
  .career-header {
    padding: 2rem 0 1.5rem;

    .header-content {
      .page-title {
        font-size: 2rem;
      }

      .page-subtitle {
        font-size: 1rem;
      }
    }

    .career-nav {
      gap: 0.5rem;

      .nav-tab {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;

        .tab-icon {
          font-size: 1.1rem;
        }

        .tab-text {
          font-size: 0.85rem;
        }
      }
    }
  }

  .career-content {
    padding: 2rem 0;
  }
}

// 平板端适配
@media screen and (min-width: 768px) and (max-width: 991px) {
  .career-header {
    .header-content {
      .page-title {
        font-size: 2.25rem;
      }
    }
  }
}

// 页面加载动画
.career-view {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .career-view {
    animation: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }

  .nav-tab:hover {
    transform: none;
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .career-header {
    .nav-tab {
      border-width: 2px;
      
      &.active {
        border-width: 3px;
      }
    }
  }
}
</style>
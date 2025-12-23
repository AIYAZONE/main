<template>
  <nav 
    class="breadcrumb-navigation" 
    :aria-label="t('ui.navigation.breadcrumb')"
    v-if="breadcrumbs.length > 1"
  >
    <div class="container">
      <ol class="breadcrumb-list">
        <li 
          v-for="(crumb, index) in breadcrumbs" 
          :key="crumb.path"
          class="breadcrumb-item"
          :class="{ 'breadcrumb-item--current': index === breadcrumbs.length - 1 }"
        >
          <router-link
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="breadcrumb-link"
          >
            <span v-if="crumb.icon" class="breadcrumb-icon">{{ crumb.icon }}</span>
            <span class="breadcrumb-text">{{ t(crumb.title) }}</span>
          </router-link>
          
          <span v-else class="breadcrumb-current">
            <span v-if="crumb.icon" class="breadcrumb-icon">{{ crumb.icon }}</span>
            <span class="breadcrumb-text">{{ t(crumb.title) }}</span>
          </span>
          
          <span 
            v-if="index < breadcrumbs.length - 1" 
            class="breadcrumb-separator"
            aria-hidden="true"
          >
            /
          </span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface BreadcrumbItem {
  title: string;
  path: string;
  icon?: string;
}

const route = useRoute();

const breadcrumbs = computed((): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = [];
  
  // 总是包含首页
  crumbs.push({
    title: 'nav.home',
    path: '/',
    icon: '🏠'
  });
  
  // 根据当前路由添加面包屑
  const pathSegments = route.path.split('/').filter(segment => segment);
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // 根据路径段确定标题和图标
    let title = '';
    let icon = '';
    
    switch (segment) {
      case 'about':
        title = 'nav.about';
        icon = '👤';
        break;
      case 'portfolio':
        title = 'nav.portfolio';
        icon = '💼';
        break;
      case 'career':
        title = 'nav.career';
        icon = '🚀';
        break;
      case 'contact':
        title = 'nav.contact';
        icon = '📧';
        break;
      case 'swot':
        title = 'career.swot.title';
        icon = '📊';
        break;
      case 'roadmap':
        title = 'career.roadmap.title';
        icon = '🗺️';
        break;
      case 'learning':
        title = 'career.learning.title';
        icon = '📚';
        break;
      default:
        // 如果是未知路径，使用路由元信息或默认值
        title = route.meta?.title as string || segment;
        icon = route.meta?.icon as string || '';
    }
    
    if (title) {
      crumbs.push({
        title,
        path: currentPath,
        icon
      });
    }
  });
  
  return crumbs;
});
</script>

<style scoped lang="less">
.breadcrumb-navigation {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 0;
  font-size: 0.9rem;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .breadcrumb-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .breadcrumb-link {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-secondary);
        text-decoration: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s ease;

        &:hover {
          color: var(--brand-primary);
          background: rgba(59, 130, 246, 0.1);
        }

        &:focus {
          outline: 2px solid var(--brand-primary);
          outline-offset: 2px;
        }

        .breadcrumb-icon {
          font-size: 0.9rem;
        }

        .breadcrumb-text {
          font-weight: 500;
        }
      }

      .breadcrumb-current {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-primary);
        font-weight: 600;
        padding: 0.25rem 0.5rem;

        .breadcrumb-icon {
          font-size: 0.9rem;
        }
      }

      .breadcrumb-separator {
        color: var(--text-tertiary);
        font-weight: 300;
        margin: 0 0.25rem;
        user-select: none;
      }

      &--current {
        .breadcrumb-current {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 4px;
        }
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 767px) {
  .breadcrumb-navigation {
    padding: 0.5rem 0;
    font-size: 0.85rem;

    .breadcrumb-list {
      gap: 0.25rem;

      .breadcrumb-item {
        .breadcrumb-link,
        .breadcrumb-current {
          padding: 0.125rem 0.375rem;
          gap: 0.125rem;

          .breadcrumb-icon {
            font-size: 0.8rem;
          }

          .breadcrumb-text {
            font-size: 0.8rem;
          }
        }

        .breadcrumb-separator {
          margin: 0 0.125rem;
          font-size: 0.8rem;
        }
      }
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .breadcrumb-navigation {
    border-bottom-width: 2px;

    .breadcrumb-link:focus {
      outline-width: 3px;
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .breadcrumb-link {
    transition: none;
  }
}
</style>
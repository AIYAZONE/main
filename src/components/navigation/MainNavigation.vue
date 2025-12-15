<template>
  <nav class="main-navigation" :class="navigationClasses" role="navigation" :aria-label="$t('ui.navigation.menu')">
    <div class="nav-container">
      <!-- 品牌Logo -->
      <div class="nav-brand">
        <router-link to="/" class="simple-brand">
          <img src="/logo.jpg" alt="AIYAZONE" class="brand-logo-img" />
          <span class="brand-text">AIYAZONE</span>
        </router-link>
      </div>

      <!-- 桌面端导航菜单 -->
      <div class="nav-menu nav-menu--desktop">
        <ul class="nav-list" role="menubar">
          <li 
            v-for="item in navigationItems" 
            :key="item.id"
            class="nav-item"
            role="none"
          >
            <router-link
              :to="item.path"
              class="nav-link"
              :class="{ 'nav-link--active': isActiveRoute(item.path) }"
              role="menuitem"
              :aria-current="isActiveRoute(item.path) ? 'page' : undefined"
            >
              <span v-if="item.icon" class="nav-icon">{{ item.icon }}</span>
              <span class="nav-text">{{ $t(item.label) }}</span>
              <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 导航操作区 -->
      <div class="nav-actions">
        <!-- 语言切换 -->
        <LanguageSwitcher class="nav-action-item" />

        <!-- 主题切换 -->
        <button
          class="nav-action-button theme-toggle"
          @click="toggleTheme"
          :aria-label="$t('accessibility.toggleTheme')"
          :title="$t('accessibility.toggleTheme')"
        >
          <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
        </button>

        <!-- 搜索按钮 -->
        <button
          v-if="showSearch"
          class="nav-action-button search-toggle"
          @click="toggleSearch"
          :aria-label="$t('common.search')"
          :title="$t('common.search')"
        >
          <span class="search-icon">🔍</span>
        </button>

        <!-- 移动端菜单切换 -->
        <button
          class="nav-action-button mobile-menu-toggle"
          @click="toggleMobileMenu"
          :aria-label="isMobileMenuOpen ? $t('accessibility.closeMenu') : $t('accessibility.openMenu')"
          :aria-expanded="isMobileMenuOpen"
          :class="{ active: isMobileMenuOpen }"
        >
          <span class="hamburger">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <div 
      class="nav-menu nav-menu--mobile"
      :class="{ 'nav-menu--open': isMobileMenuOpen }"
      :aria-hidden="!isMobileMenuOpen"
    >
      <div class="mobile-menu-content">
        <ul class="nav-list nav-list--mobile" role="menu">
          <li 
            v-for="item in navigationItems" 
            :key="item.id"
            class="nav-item nav-item--mobile"
            role="none"
          >
            <router-link
              :to="item.path"
              class="nav-link nav-link--mobile"
              :class="{ 'nav-link--active': isActiveRoute(item.path) }"
              role="menuitem"
              :aria-current="isActiveRoute(item.path) ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              <span v-if="item.icon" class="nav-icon">{{ item.icon }}</span>
              <span class="nav-text">{{ $t(item.label) }}</span>
              <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>

        <!-- 移动端操作区 -->
        <div class="mobile-actions">
          <div class="mobile-action-group">
            <LanguageSwitcher />
          </div>
          <div class="mobile-action-group">
            <button
              class="mobile-action-button"
              @click="toggleTheme"
              :aria-label="$t('accessibility.toggleTheme')"
            >
              <span class="action-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
              <span class="action-text">{{ isDarkMode ? $t('ui.theme.light') : $t('ui.theme.dark') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
      @touchstart="closeMobileMenu"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BrandLogo from '../brand/BrandLogo.vue';
import LanguageSwitcher from '../common/LanguageSwitcher.vue';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
  external?: boolean;
}

interface Props {
  variant?: 'default' | 'transparent' | 'solid';
  position?: 'static' | 'sticky' | 'fixed';
  showSearch?: boolean;
  logoVariant?: 'icon' | 'text' | 'full';
  logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  position: 'sticky',
  showSearch: false,
  logoVariant: 'full',
  logoSize: 'md'
});

const emit = defineEmits<{
  searchToggle: [];
  themeToggle: [];
  logoClick: [];
}>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const isMobileMenuOpen = ref(false);
const isDarkMode = ref(false);

// 从路由配置中动态生成导航项
const navigationItems = computed((): NavigationItem[] => {
  const router = useRouter();
  const mainRoutes = router.getRoutes().filter(route => 
    route.meta?.title && 
    !route.path.includes(':') && 
    route.path !== '/:pathMatch(.*)*' &&
    !route.path.includes('/career/') // 排除子路由
  );

  return mainRoutes.map(route => ({
    id: route.name as string,
    label: route.meta?.title as string,
    path: route.path,
    icon: route.meta?.icon as string,
    external: route.meta?.external as boolean
  })).sort((a, b) => {
    // 自定义排序：首页 -> 关于 -> 作品集 -> 职业规划 -> 联系
    const order = ['Home', 'About', 'Portfolio', 'Career', 'Contact'];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });
});

const navigationClasses = computed(() => [
  `main-navigation--${props.variant}`,
  `main-navigation--${props.position}`,
  {
    'main-navigation--mobile-open': isMobileMenuOpen.value
  }
]);

const isHomePage = computed(() => {
  return route.path === '/';
});

const isActiveRoute = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  
  // 防止背景滚动
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  // TODO: 实现主题切换逻辑
  emit('themeToggle');
};

const toggleSearch = () => {
  emit('searchToggle');
};

const handleLogoClick = () => {
  emit('logoClick');
};

// 监听ESC键关闭移动端菜单
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// 监听路由变化，自动关闭移动端菜单
const handleRouteChange = () => {
  closeMobileMenu();
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  
  // 检查系统主题偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true;
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped lang="less">
.main-navigation {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  z-index: 100;
  transition: all 0.3s ease;

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .nav-brand {
    flex-shrink: 0;

    .simple-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #1a1a1a;

      .brand-logo-img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 8px;
      }

      .brand-text {
        font-family: var(--brand-font-secondary);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--brand-midnight);
      }

      &:hover {
        .brand-logo-img {
          transform: scale(1.05);
        }
      }
    }
  }

  .nav-menu--desktop {
    display: flex;
    flex: 1;
    justify-content: center;

    .nav-list {
      display: flex;
      align-items: center;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;

      .nav-item {
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: color 0.2s ease;

          &:hover {
            color: #3b82f6;
          }

          &--active {
            color: #3b82f6;
            font-weight: 600;
          }

          .nav-text {
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;

    .nav-action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: none;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: #6b7280;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .theme-icon,
      .search-icon {
        font-size: 1.1rem;
      }
    }

    .mobile-menu-toggle {
      display: none;
    }
  }

  .nav-menu--mobile {
    display: none;
  }

  .mobile-overlay {
    display: none;
  }
}

// 移动端样式
@media screen and (max-width: 767px) {
  .main-navigation {
    .nav-container {
      padding: 0 1rem;
    }

    .nav-menu--desktop .nav-list {
      gap: 1rem;

      .nav-item .nav-link {
        padding: 0.5rem;
        font-size: 0.8rem;
      }
    }

    .nav-brand .simple-brand {
      gap: 0.5rem;

      .brand-logo-img {
        width: 32px;
        height: 32px;
      }

      .brand-text {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
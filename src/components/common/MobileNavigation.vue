<template>
  <div class="mobile-navigation">
    <!-- 移动端导航切换按钮 -->
    <button 
      class="mobile-nav-toggle"
      :class="{ active: isMenuOpen }"
      @click="toggleMenu"
      :aria-label="isMenuOpen ? $t('accessibility.closeMenu') : $t('accessibility.openMenu')"
      :aria-expanded="isMenuOpen"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <!-- 移动端导航菜单 -->
    <nav 
      class="mobile-nav-menu"
      :class="{ open: isMenuOpen }"
      :aria-hidden="!isMenuOpen"
    >
      <div class="mobile-nav-header">
        <h2 class="nav-title">{{ $t('nav.menu') }}</h2>
        <button 
          class="nav-close-btn"
          @click="closeMenu"
          :aria-label="$t('accessibility.closeMenu')"
        >
          ✕
        </button>
      </div>

      <ul class="mobile-nav-list">
        <li class="mobile-nav-item">
          <router-link 
            to="/" 
            class="mobile-nav-link"
            @click="closeMenu"
            :class="{ active: $route.path === '/' }"
          >
            <span class="nav-icon">🏠</span>
            {{ $t('nav.home') }}
          </router-link>
        </li>
        <li class="mobile-nav-item">
          <router-link 
            to="/about" 
            class="mobile-nav-link"
            @click="closeMenu"
            :class="{ active: $route.path === '/about' }"
          >
            <span class="nav-icon">👤</span>
            {{ $t('nav.about') }}
          </router-link>
        </li>
        <li class="mobile-nav-item">
          <router-link 
            to="/portfolio" 
            class="mobile-nav-link"
            @click="closeMenu"
            :class="{ active: $route.path === '/portfolio' }"
          >
            <span class="nav-icon">💼</span>
            {{ $t('nav.portfolio') }}
          </router-link>
        </li>
        <li class="mobile-nav-item">
          <router-link 
            to="/career" 
            class="mobile-nav-link"
            @click="closeMenu"
            :class="{ active: $route.path === '/career' }"
          >
            <span class="nav-icon">🚀</span>
            {{ $t('nav.career') }}
          </router-link>
        </li>
        <li class="mobile-nav-item">
          <router-link 
            to="/contact" 
            class="mobile-nav-link"
            @click="closeMenu"
            :class="{ active: $route.path === '/contact' }"
          >
            <span class="nav-icon">📧</span>
            {{ $t('nav.contact') }}
          </router-link>
        </li>
      </ul>

      <div class="mobile-nav-footer">
        <LanguageSwitcher />
        <div class="social-links">
          <a 
            href="https://github.com/AIYAZONE" 
            target="_blank" 
            rel="noopener noreferrer"
            class="social-link"
            aria-label="GitHub"
          >
            <span class="social-icon">📱</span>
          </a>
          <a 
            href="https://blog.aiyazone.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="social-link"
            aria-label="Blog"
          >
            <span class="social-icon">📝</span>
          </a>
        </div>
      </div>
    </nav>

    <!-- 遮罩层 -->
    <div 
      v-if="isMenuOpen"
      class="mobile-nav-overlay"
      @click="closeMenu"
      @touchstart="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { t } = useI18n();
const route = useRoute();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  
  // 防止背景滚动
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

// 监听路由变化，自动关闭菜单
const handleRouteChange = () => {
  closeMenu();
};

// 监听ESC键关闭菜单
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped lang="less">
.mobile-navigation {
  display: none;
  
  @media screen and (max-width: 767px) {
    display: block;
  }
}

.mobile-nav-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 1001;
  position: relative;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: 2px solid var(--accent-gold);
    outline-offset: 2px;
  }

  .hamburger-line {
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 1px;
    transition: all 0.3s ease;
    transform-origin: center;

    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }

  &.active {
    .hamburger-line {
      &:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }

      &:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }

      &:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }
    }
  }
}

.mobile-nav-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &.open {
    transform: translateX(0);
  }

  .mobile-nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);

    .nav-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .nav-close-btn {
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: var(--text-secondary);
      font-size: 1.25rem;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: var(--text-primary);
      }

      &:focus {
        outline: 2px solid var(--accent-gold);
        outline-offset: 2px;
      }
    }
  }

  .mobile-nav-list {
    flex: 1;
    padding: 1rem 0;
    list-style: none;
    margin: 0;

    .mobile-nav-item {
      .mobile-nav-link {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        text-decoration: none;
        font-size: 1.1rem;
        font-weight: 500;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;

        .nav-icon {
          margin-right: 0.75rem;
          font-size: 1.25rem;
        }

        &:hover {
          background: rgba(59, 130, 246, 0.05);
          border-left-color: var(--accent-gold);
        }

        &:focus {
          outline: 2px solid var(--accent-gold);
          outline-offset: -2px;
        }

        &.active {
          background: rgba(59, 130, 246, 0.1);
          border-left-color: var(--accent-gold);
          color: var(--accent-gold);
        }
      }
    }
  }

  .mobile-nav-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;

      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--bg-color);
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.2s ease;

        .social-icon {
          font-size: 1.25rem;
        }

        &:hover {
          background: var(--accent-gold);
          transform: translateY(-2px);
        }

        &:focus {
          outline: 2px solid var(--accent-gold);
          outline-offset: 2px;
        }
      }
    }
  }
}

.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

/* 动画优化 */
@media (prefers-reduced-motion: reduce) {
  .mobile-nav-toggle .hamburger-line,
  .mobile-nav-menu {
    transition: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .mobile-nav-menu {
    border-right: 2px solid var(--text-primary);
  }

  .mobile-nav-link {
    border-left-width: 4px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .mobile-nav-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .mobile-nav-link:hover {
    background: rgba(59, 130, 246, 0.2);
  }

  .social-link:hover {
    background: var(--accent-gold);
  }
}
</style>
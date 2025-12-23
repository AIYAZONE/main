<template>
  <div class="default-layout">
    <!-- 主导航 -->
    <MainNavigation 
      :variant="navigationVariant"
      :position="navigationPosition"
      :show-search="showSearch"
      @search-toggle="handleSearchToggle"
      @theme-toggle="handleThemeToggle"
      @logo-click="handleLogoClick"
    />

    <!-- 主要内容区域 -->
    <main class="main-content" role="main">
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="site-footer" v-if="showFooter">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">AIYAZONE</h3>
            <p class="footer-description">{{ t('brand.subtitle') }}</p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">{{ t('nav.quickLinks') }}</h4>
            <ul class="footer-links">
              <li><router-link to="/about">{{ t('nav.about') }}</router-link></li>
              <li><router-link to="/portfolio">{{ t('nav.portfolio') }}</router-link></li>
              <li><router-link to="/career">{{ t('nav.career') }}</router-link></li>
              <li><router-link to="/contact">{{ t('nav.contact') }}</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">{{ t('contact.social.title') }}</h4>
            <div class="footer-social">
              <a href="https://github.com/AIYAZONE" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://blog.aiyazone.com" target="_blank" rel="noopener noreferrer">Blog</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="copyright">
            © {{ currentYear }} AIYAZONE. {{ t('footer.allRightsReserved') }}
          </p>
          <div class="footer-meta">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="build-info">粤ICP备2022083499号</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- 搜索模态框 -->
    <SearchModal v-if="showSearchModal" @close="handleSearchToggle" />

    <!-- 回到顶部按钮 -->
    <button
      v-if="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      :aria-label="t('accessibility.backToTop')"
      :title="t('accessibility.backToTop')"
    >
      ↑
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'DefaultLayout' });
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import MainNavigation from '../components/navigation/MainNavigation.vue';
import SearchModal from '../components/common/SearchModal.vue';

interface Props {
  navigationVariant?: 'default' | 'transparent' | 'solid';
  navigationPosition?: 'static' | 'sticky' | 'fixed';
  showSearch?: boolean;
  showFooter?: boolean;
  transitionName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  navigationVariant: 'default',
  navigationPosition: 'sticky',
  showSearch: false,
  showFooter: true,
  transitionName: 'page'
});

const { t } = useI18n();
const route = useRoute();

const showSearchModal = ref(false);
const showBackToTop = ref(false);
const scrollY = ref(0);

const currentYear = computed(() => new Date().getFullYear());

// 处理搜索切换
const handleSearchToggle = () => {
  showSearchModal.value = !showSearchModal.value;
};

// 处理主题切换
const handleThemeToggle = () => {
  // TODO: 实现主题切换逻辑
  console.log('Theme toggle');
};

// 处理Logo点击
const handleLogoClick = () => {
  if (route.path !== '/') {
    // 如果不在首页，导航到首页
    return;
  }
  // 如果在首页，滚动到顶部
  scrollToTop();
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 处理滚动事件
const handleScroll = () => {
  scrollY.value = window.scrollY;
  showBackToTop.value = scrollY.value > 300;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="less">
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  position: relative;
}

// 页面过渡动画
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 页脚样式
.site-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 1rem;
  margin-top: auto;

  .container {
    max-width: var(--brand-max-width);
    margin: 0 auto;
    padding: 0 2rem;
  }

  .footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;

    .footer-section {
      .footer-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--brand-primary);
        margin: 0 0 0.5rem 0;
      }

      .footer-subtitle {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
      }

      .footer-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
      }

      .footer-links {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          margin-bottom: 0.5rem;

          a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s ease;

            &:hover {
              color: var(--brand-primary);
            }
          }
        }
      }

      .footer-social {
        display: flex;
        gap: 1rem;

        a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;

          &:hover {
            color: var(--brand-primary);
          }
        }
      }
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
    font-size: 0.9rem;
    color: var(--text-secondary);

    .copyright {
      margin: 0;
    }

    .footer-meta {
      .build-info {
        font-size: 0.8rem;
        opacity: 0.8;
      }
    }
  }
}

// 回到顶部按钮
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: var(--brand-primary);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: var(--brand-shadow-lg);
  transition: all 0.3s ease;
  z-index: 50;

  &:hover {
    background: var(--brand-secondary);
    transform: translateY(-2px);
    box-shadow: var(--brand-shadow-xl);
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
}

// 移动端适配
@media screen and (max-width: 767px) {
  .site-footer {
    padding: 2rem 0 1rem;

    .container {
      padding: 0 1rem;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      text-align: center;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }

  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

// 平板端适配
@media screen and (min-width: 768px) and (max-width: 991px) {
  .site-footer {
    .footer-content {
      grid-template-columns: 1fr 1fr;
      
      .footer-section:first-child {
        grid-column: 1 / -1;
        text-align: center;
        margin-bottom: 1rem;
      }
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }

  .back-to-top:hover {
    transform: none;
  }
}

// 页面加载状态
:global(.page-loading) {
  .main-content {
    opacity: 0.7;
    pointer-events: none;
  }
}
</style>

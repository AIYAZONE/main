<template>
  <nav
    class="main-navigation"
    :class="[navigationClasses, { 'is-scrolled': isScrolled }]"
    role="navigation"
    :aria-label="$t('ui.navigation.menu')"
  >
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
          <li v-for="item in navigationItems" :key="item.id" class="nav-item" role="none">
            <router-link
              :to="item.path"
              class="nav-link"
              :class="{ 'nav-link--active': isActiveRoute(item.path) }"
              role="menuitem"
              :aria-current="isActiveRoute(item.path) ? 'page' : undefined"
            >
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
          <span
            class="theme-glyph"
            :class="{ 'theme-glyph--sun': isDarkMode, 'theme-glyph--moon': !isDarkMode }"
            aria-hidden="true"
          ></span>
        </button>

        <!-- 搜索按钮 -->
        <button
          v-if="showSearch"
          class="nav-action-button search-toggle"
          @click="toggleSearch"
          :aria-label="$t('common.search')"
          :title="$t('common.search')"
        >
          <span class="search-glyph" aria-hidden="true"></span>
        </button>

        <!-- 移动端菜单切换 -->
        <button
          class="nav-action-button mobile-menu-toggle"
          @click="toggleMobileMenu"
          :aria-label="
            isMobileMenuOpen
              ? $t('accessibility.closeMenu')
              : $t('accessibility.openMenu')
          "
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
              <span
                class="theme-glyph"
                :class="{ 'theme-glyph--sun': isDarkMode, 'theme-glyph--moon': !isDarkMode }"
                aria-hidden="true"
              ></span>
              <span class="action-text">{{
                isDarkMode ? $t("ui.theme.light") : $t("ui.theme.dark")
              }}</span>
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'MainNavigation' });
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import BrandLogo from "../brand/BrandLogo.vue";
import LanguageSwitcher from "../common/LanguageSwitcher.vue";

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
  external?: boolean;
}

interface Props {
  variant?: "default" | "transparent" | "solid";
  position?: "static" | "sticky" | "fixed";
  showSearch?: boolean;
  logoVariant?: "icon" | "text" | "full";
  logoSize?: "xs" | "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  position: "fixed",
  showSearch: false,
  logoVariant: "full",
  logoSize: "md",
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
const isScrolled = ref(false);

// 从路由配置中动态生成导航项
const navigationItems = computed((): NavigationItem[] => {
  const router = useRouter();
  const mainRoutes = router.getRoutes().filter(
    (route) =>
      route.meta?.title &&
      !route.path.includes(":") &&
      route.path !== "/:pathMatch(.*)*" &&
      !route.path.includes("/career/") // 排除子路由
  );

  return mainRoutes
    .map((route) => ({
      id: route.name as string,
      label: route.meta?.title as string,
      path: route.path,
      icon: route.meta?.icon as string,
      external: route.meta?.external as boolean,
    }))
    .sort((a, b) => {
      // 自定义排序：首页 -> 关于 -> 作品集 -> 职业规划 -> 联系
      const order = ["Home", "About", "Portfolio", "Career", "Contact"];
      return order.indexOf(a.id) - order.indexOf(b.id);
    });
});

const navigationClasses = computed(() => [
  `main-navigation--${props.variant}`,
  `main-navigation--${props.position}`,
  {
    "main-navigation--mobile-open": isMobileMenuOpen.value,
  },
]);

const isHomePage = computed(() => {
  return route.path === "/";
});

const isActiveRoute = (path: string): boolean => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;

  // 防止背景滚动
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = "";
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  // TODO: 实现主题切换逻辑
  emit("themeToggle");
};

const toggleSearch = () => {
  emit("searchToggle");
};

const handleLogoClick = () => {
  emit("logoClick");
};

// 监听ESC键关闭移动端菜单
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// 监听路由变化，自动关闭移动端菜单
const handleRouteChange = () => {
  closeMobileMenu();
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("scroll", handleScroll);

  // 检查系统主题偏好
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    isDarkMode.value = true;
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = "";
});
</script>

<style scoped lang="less">
.main-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: transparent;
  border-bottom: 1px solid transparent;
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  padding: 1rem 0;

  &.is-scrolled {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--brand-border);
    padding: 0.5rem 0;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
  }

  .nav-container {
    max-width: var(--brand-max-width);
    margin: 0 auto;
    padding: 0 2rem;
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
      color: var(--brand-midnight);

      .brand-logo-img {
        width: 42px;
        height: 42px;
        object-fit: cover;
        border-radius: 10px;
        box-shadow: var(--brand-shadow-card);
        transition: transform 0.3s ease;
      }

      .brand-text {
        font-family: var(--brand-font-display);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--brand-midnight);
        letter-spacing: -0.02em;
      }

      &:hover {
        .brand-logo-img {
          transform: scale(1.05) rotate(-2deg);
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
      gap: 3rem;
      list-style: none;
      margin: 0;
      padding: 0;

      .nav-item {
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          color: var(--brand-text-secondary);
          text-decoration: none;
          font-weight: 400;
          font-size: 0.95rem;
          transition: color 0.3s ease;
          position: relative;
          letter-spacing: 0.02em;

          // Golden Line Effect
          &::after {
            content: "";
            position: absolute;
            bottom: -4px;
            left: 50%;
            width: 0;
            height: 2px;
            background: var(--brand-gradient-gold);
            transition: all 0.3s var(--brand-ease-premium);
            transform: translateX(-50%);
            opacity: 0;
          }

          &:hover {
            color: var(--brand-midnight);

            &::after {
              width: 16px;
              opacity: 1;
            }
          }

          &--active {
            color: var(--brand-midnight);
            font-weight: 600;

            &::after {
              width: 24px;
              opacity: 1;
            }
          }
        }
      }
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    padding: 0.4rem;
    border: 1px solid var(--brand-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    .nav-action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 999px;
      cursor: pointer;
      color: var(--brand-text-secondary);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.04);
        border-color: rgba(0, 0, 0, 0.1);
        color: var(--brand-midnight);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
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

.theme-glyph {
  width: 18px;
  height: 18px;
  position: relative;
  display: inline-block;
}

.theme-glyph--moon {
  background: currentColor;
  border-radius: 999px;
}

.theme-glyph--moon::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  right: -2px;
  top: 2px;
  background: var(--brand-glass-bg);
}

.theme-glyph--sun {
  background: currentColor;
  border-radius: 999px;
}

.theme-glyph--sun::after {
  content: "";
  position: absolute;
  inset: -7px;
  border-radius: 999px;
  background:
    radial-gradient(circle at center, transparent 56%, currentColor 58%, transparent 61%),
    conic-gradient(from 0deg, currentColor 0 8deg, transparent 8deg 22deg, currentColor 22deg 30deg, transparent 30deg 45deg, currentColor 45deg 53deg, transparent 53deg 68deg, currentColor 68deg 76deg, transparent 76deg 90deg, currentColor 90deg 98deg, transparent 98deg 112deg, currentColor 112deg 120deg, transparent 120deg 135deg, currentColor 135deg 143deg, transparent 143deg 158deg, currentColor 158deg 166deg, transparent 166deg 180deg, currentColor 180deg 188deg, transparent 188deg 202deg, currentColor 202deg 210deg, transparent 210deg 225deg, currentColor 225deg 233deg, transparent 233deg 248deg, currentColor 248deg 256deg, transparent 256deg 270deg, currentColor 270deg 278deg, transparent 278deg 292deg, currentColor 292deg 300deg, transparent 300deg 315deg, currentColor 315deg 323deg, transparent 323deg 338deg, currentColor 338deg 346deg, transparent 346deg 360deg);
  opacity: 0.9;
  mask: radial-gradient(circle at center, transparent 0 52%, #000 54%);
}

.theme-toggle {
  color: var(--brand-midnight);
  background: rgba(212, 175, 55, 0.06);
  border-color: rgba(212, 175, 55, 0.18);
}

.theme-toggle:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
  color: var(--brand-midnight);
}

.search-glyph {
  width: 16px;
  height: 16px;
  position: relative;
  display: inline-block;
}

.search-glyph::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid currentColor;
  border-radius: 999px;
  top: 0;
  left: 0;
}

.search-glyph::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 2px;
  background: currentColor;
  border-radius: 999px;
  right: -1px;
  bottom: 1px;
  transform: rotate(45deg);
  transform-origin: left center;
}

// 移动端样式
@media screen and (max-width: 767px) {
  .main-navigation {
    padding: 0.5rem 0;

    .nav-container {
      padding: 0 1rem;
    }

    .nav-actions .mobile-menu-toggle {
      display: flex;
    }

    .nav-menu--desktop {
      display: none;
    }

    .nav-brand .simple-brand {
      gap: 0.5rem;

      .brand-logo-img {
        width: 36px;
        height: 36px;
      }

      .brand-text {
        font-size: 1.25rem;
      }
    }

    .nav-menu--mobile {
      display: block;
      position: fixed;
      top: 0;
      right: -100%;
      width: 80%;
      height: 100vh;
      background: var(--brand-canvas-day);
      z-index: 101;
      transition: right 0.4s var(--brand-ease-premium);
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
      padding-top: 5rem;

      &.nav-menu--open {
        right: 0;
      }

      .nav-list--mobile {
        list-style: none;
        padding: 0 2rem;

        .nav-item--mobile {
          margin-bottom: 1.5rem;

          .nav-link--mobile {
            font-family: var(--brand-font-display);
            font-size: 1.5rem;
            color: var(--brand-midnight);
            text-decoration: none;
            display: block;

            &.nav-link--active {
              color: var(--brand-electric);
            }
          }
        }
      }
    }

    .mobile-overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      z-index: 100;
    }
  }
}
</style>

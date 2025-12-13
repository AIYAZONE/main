<template>
  <header :class="{ scrolled: isScrolled }">
    <div class="middle-box">
      <div class="header-inner">
        <a href="/" class="brand-signature">
          AIYAZONE<span class="dot">.</span>
        </a>
        
        <div class="right-panel">
          <!-- Navigation removed as requested -->
          <!-- <nav class="desktop-nav">...</nav> -->

          <button class="lang-switch" @click="langStore.toggleLang">
            {{ langStore.language === 'zh' ? 'EN' : '中' }}
          </button>

          <!-- Mobile Menu Toggle -->
          <div class="mobile-menu-btn">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { useLangStore } from '../store/lang';

export default defineComponent({
  name: "Header",
  setup() {
    const langStore = useLangStore();
    const isScrolled = ref(false);
    
    const handleScroll = () => {
      // Add hysteresis (buffer zone) to prevent flickering at the threshold
      const scrollY = window.scrollY;
      if (scrollY > 60 && !isScrolled.value) {
        isScrolled.value = true;
      } else if (scrollY < 40 && isScrolled.value) {
        isScrolled.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    const nav = computed(() => {
      if (langStore.language === 'zh') {
        return [
          { href: "/brand", text: "个人品牌", target: "_self" },
          { href: "https://fe.aiyazone.com/", text: "前端之路" },
          { href: "https://pm.aiyazone.com/", text: "项目管理" },
          { href: "https://blog.aiyazone.com/brand/about.html", text: "关于我" },
        ];
      } else {
        return [
          { href: "/brand", text: "Brand", target: "_self" },
          { href: "https://fe.aiyazone.com/", text: "Frontend" },
          { href: "https://pm.aiyazone.com/", text: "Management" },
          { href: "https://blog.aiyazone.com/brand/about.html", text: "About" },
        ];
      }
    });

    return {
      isScrolled,
      nav,
      langStore,
    };
  },
});
</script>

<style lang="less" scoped>
header {
  position: fixed; /* Changed from sticky to fixed for stability */
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  padding: 1.5rem 0;
  background-color: transparent;
  /* Use specific transitions to avoid jitter */
  transition: background-color 0.4s ease, padding 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease;
  /* Default transparent border to occupy space */
  border-bottom: 1px solid transparent;
  
  &.scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem 0;
    border-bottom-color: var(--border-color); /* Only transition color */
  }

  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand-signature {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    
    .dot {
      color: var(--accent-gold);
    }
  }

  .right-panel {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .desktop-nav {
    ul {
      display: flex;
      gap: 3rem;
      
      li {
        .nav-link {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-primary);
          position: relative;
          padding: 0.5rem 0;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 1px;
            background-color: var(--accent-gold);
            transition: width 0.3s ease;
          }
          
          &:hover {
            color: var(--accent-gold);
            &::after {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .lang-switch {
    background: none;
    border: 1px solid var(--border-color);
    padding: 0.25rem 0.75rem;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.3s ease;
    border-radius: 4px;

    &:hover {
      color: var(--accent-gold);
      border-color: var(--accent-gold);
    }
  }

  .mobile-menu-btn {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  header {
    .desktop-nav {
      display: none;
    }
    
    .mobile-menu-btn {
      display: block;
    }
    
    .right-panel {
      gap: 1rem;
    }
  }
}
</style>

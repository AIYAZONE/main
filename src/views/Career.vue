<template>
  <div class="career-page">
    <!-- Hero Header -->
    <header class="career-header">
      <div class="middle-box">
        <h1 class="page-title">CAREER <span class="italic text-gradient-gold">PATH</span></h1>
        
        <!-- Navigation Tabs -->
        <nav class="career-nav">
          <router-link to="/career" class="nav-item" exact-active-class="active">
            <span>ROADMAP</span>
          </router-link>
          <router-link to="/career/swot" class="nav-item" active-class="active">
            <span>SWOT</span>
          </router-link>
          <router-link to="/career/learning" class="nav-item" active-class="active">
            <span>LEARNING</span>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Content Area -->
    <section class="career-content">
      <div class="middle-box">
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
// Logic is handled by sub-routes
</script>

<style scoped lang="less">
  .career-page {
    min-height: 100vh;
  }
  
  .career-header {
    padding: var(--brand-space-huge) 0 var(--brand-space-lg);
    border-bottom: 1px solid var(--brand-border);
    
    .middle-box {
      width: 90%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--spacing-md);
    }
    
    .page-title {
      font-size: clamp(3rem, 6vw, 6rem);
      margin-bottom: 3rem;
      
      .italic {
        font-family: var(--brand-font-display);
        font-style: italic;
      }
    }
    
    .career-nav {
      display: flex;
      gap: 2rem;
      
      .nav-item {
        font-family: var(--brand-font-mono);
        font-size: 0.9rem;
        color: var(--brand-text-tertiary);
        letter-spacing: 0.1em;
        padding-bottom: 0.5rem;
        position: relative;
        transition: color 0.3s ease;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--brand-gold-start);
          transition: width 0.3s ease;
        }
        
        &:hover, &.active {
          color: var(--brand-midnight);
          
          &::after {
            width: 100%;
          }
        }
      }
    }
  }
  
  .career-content {
    padding: var(--brand-space-xl) 0;
    
    .middle-box {
      width: 90%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--spacing-md);
    }
  }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s var(--brand-ease-premium);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

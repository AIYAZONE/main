<template>
  <div class="portfolio-page">
    <!-- Editorial Header -->
    <header class="portfolio-header">
      <div class="middle-box">
        <div class="header-content">
          <h1 class="page-title">
            <span class="block">SELECTED</span>
            <span class="block italic text-gradient-gold">WORKS</span>
          </h1>
          <p class="page-desc">{{ content.portfolioDescription }}</p>
          
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-num">{{ portfolioStatistics?.totalProjects || 0 }}</span>
              <span class="stat-label">PROJECTS</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ formatNumber(portfolioStatistics?.totalStars || 0) }}</span>
              <span class="stat-label">STARS</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Bento Grid Section -->
    <section class="portfolio-grid-section">
      <div class="middle-box">
        <PortfolioGrid 
          :show-controls="true"
          @project-click="handleProjectClick"
        />
      </div>
    </section>

    <!-- Tech Stack (Minimalist) -->
    <section class="tech-stack-section">
      <div class="middle-box">
        <div class="section-title-row">
          <h2 class="section-title">TECH STACK</h2>
          <div class="line"></div>
        </div>
        
        <div class="tech-grid">
          <div 
            v-for="tech in portfolioStatistics?.topTechnologies.slice(0, 8)" 
            :key="tech.name"
            class="tech-card"
          >
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-count">{{ tech.count }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortfolioStore } from '../stores/portfolioStore';
import { useLangStore } from '../store/lang';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.vue';
import type { Project } from '../types/portfolio';

const { t } = useI18n();
const portfolioStore = usePortfolioStore();
const langStore = useLangStore();

const contentData = {
  zh: {
    portfolioDescription: "这里展示了我过去十年在前端工程与项目管理领域的探索。每一个项目都是对极致体验的追求。",
  },
  en: {
    portfolioDescription: "A curation of my exploration in frontend engineering and project management over the last decade. Each project is a pursuit of excellence.",
  }
};

const content = computed(() => contentData[langStore.language as keyof typeof contentData]);
const portfolioStatistics = computed(() => portfolioStore.projectStatistics);

const handleProjectClick = (project: Project) => {
  if (project.url) {
    window.open(project.url, '_blank');
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

onMounted(() => {
  if (portfolioStore.projectGroups.length === 0) {
    portfolioStore.loadProjects();
  }
});
</script>

<style scoped lang="less">
.portfolio-page {
  min-height: 100vh;
}

.portfolio-header {
  padding: var(--brand-space-huge) 0 var(--brand-space-lg);
  
  .header-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: end;
    gap: 4rem;
    
    .page-title {
      font-size: clamp(4rem, 8vw, 8rem);
      line-height: 0.9;
      
      .block {
        display: block;
      }
      
      .italic {
        font-family: var(--brand-font-display);
        font-style: italic;
      }
    }
    
    .page-desc {
      font-size: 1.125rem;
      max-width: 400px;
      margin-bottom: 2rem;
      color: var(--brand-text-secondary);
    }
    
    .stats-row {
      display: flex;
      gap: 3rem;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        
        .stat-num {
          font-family: var(--brand-font-mono);
          font-size: 2rem;
          color: var(--brand-midnight);
        }
        
        .stat-label {
          font-family: var(--brand-font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--brand-text-tertiary);
        }
      }
    }
  }
}

.portfolio-grid-section {
  padding-bottom: var(--brand-space-huge);
}

.tech-stack-section {
  padding: var(--brand-space-xl) 0 var(--brand-space-huge);
  background: var(--brand-canvas-day);
  border-top: 1px solid var(--brand-border);
  
  .section-title-row {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 3rem;
    
    .section-title {
      font-size: 1.5rem;
      white-space: nowrap;
    }
    
    .line {
      width: 100%;
      height: 1px;
      background: var(--brand-border);
    }
  }
  
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    
    .tech-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border: 1px solid var(--brand-border);
      transition: all 0.3s ease;
      
      &:hover {
        border-color: var(--brand-midnight);
        background: var(--brand-midnight);
        
        .tech-name, .tech-count {
          color: white;
        }
      }
      
      .tech-name {
        font-family: var(--brand-font-mono);
        font-size: 0.9rem;
        color: var(--brand-text-secondary);
      }
      
      .tech-count {
        font-family: var(--brand-font-mono);
        font-size: 0.75rem;
        color: var(--brand-text-tertiary);
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .portfolio-header .header-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>

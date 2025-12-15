<template>
  <div class="portfolio-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">{{ $t('portfolio.title') }}</h1>
          <p class="page-subtitle">
            {{ $t('portfolio.subtitle', 'Showcasing 10 years of frontend development and project management expertise') }}
          </p>
          
          <!-- Portfolio Statistics -->
          <div class="portfolio-stats" v-if="portfolioStatistics">
            <div class="stat-item">
              <span class="stat-number">{{ portfolioStatistics.totalProjects }}</span>
              <span class="stat-label">{{ $t('portfolio.totalProjects', 'Total Projects') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ portfolioStatistics.onlineProjects }}</span>
              <span class="stat-label">{{ $t('portfolio.onlineProjects', 'Online Projects') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ formatNumber(portfolioStatistics.totalStars) }}</span>
              <span class="stat-label">{{ $t('portfolio.totalStars', 'GitHub Stars') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ formatNumber(portfolioStatistics.totalVisitors) }}</span>
              <span class="stat-label">{{ $t('portfolio.totalVisitors', 'Total Visitors') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio Grid -->
    <section class="portfolio-content">
      <div class="container">
        <PortfolioGrid 
          :show-controls="true"
          @project-click="handleProjectClick"
          @filters-change="handleFiltersChange"
        />
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="featured-projects" v-if="featuredProjects.length > 0">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('portfolio.featuredProjects', 'Featured Projects') }}</h2>
          <p class="section-subtitle">
            {{ $t('portfolio.featuredProjectsDesc', 'High-impact projects with significant community engagement') }}
          </p>
        </div>
        
        <div class="featured-grid">
          <ProjectCard
            v-for="project in featuredProjects"
            :key="project.id"
            :project="project"
            :show-details="true"
            @click="handleProjectClick"
          />
        </div>
      </div>
    </section>

    <!-- Technology Stack Overview -->
    <section class="tech-overview" v-if="portfolioStatistics">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('portfolio.techOverview', 'Technology Stack') }}</h2>
          <p class="section-subtitle">
            {{ $t('portfolio.techOverviewDesc', 'Most frequently used technologies across all projects') }}
          </p>
        </div>
        
        <div class="tech-cloud">
          <div 
            v-for="tech in portfolioStatistics.topTechnologies" 
            :key="tech.name"
            class="tech-item"
            :style="{ fontSize: getTechFontSize(tech.count) }"
          >
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-count">({{ tech.count }})</span>
          </div>
        </div>
      </div>
    </section>

    <!-- External Links Section -->
    <section class="external-links">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('portfolio.externalLinks', 'External Presence') }}</h2>
          <p class="section-subtitle">
            {{ $t('portfolio.externalLinksDesc', 'Find me across different platforms and communities') }}
          </p>
        </div>
        
        <div class="links-grid">
          <a 
            href="https://github.com/AIYAZONE" 
            target="_blank" 
            rel="noopener noreferrer"
            class="link-card github"
          >
            <div class="link-icon">⚡</div>
            <div class="link-content">
              <h3 class="link-title">GitHub</h3>
              <p class="link-desc">{{ $t('portfolio.githubDesc', 'Open source projects and contributions') }}</p>
            </div>
            <div class="link-arrow">→</div>
          </a>
          
          <a 
            href="https://blog.aiyazone.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="link-card blog"
          >
            <div class="link-icon">📝</div>
            <div class="link-content">
              <h3 class="link-title">{{ $t('portfolio.blog', 'Technical Blog') }}</h3>
              <p class="link-desc">{{ $t('portfolio.blogDesc', 'Insights on frontend development and project management') }}</p>
            </div>
            <div class="link-arrow">→</div>
          </a>
          
          <a 
            href="https://fe.aiyazone.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="link-card docs"
          >
            <div class="link-icon">📚</div>
            <div class="link-content">
              <h3 class="link-title">{{ $t('portfolio.feDocs', 'Frontend Docs') }}</h3>
              <p class="link-desc">{{ $t('portfolio.feDocsDesc', 'Comprehensive frontend technology documentation') }}</p>
            </div>
            <div class="link-arrow">→</div>
          </a>
          
          <a 
            href="https://pm.aiyazone.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="link-card pm"
          >
            <div class="link-icon">📊</div>
            <div class="link-content">
              <h3 class="link-title">{{ $t('portfolio.pmDocs', 'PM Knowledge') }}</h3>
              <p class="link-desc">{{ $t('portfolio.pmDocsDesc', 'Project management methodologies and best practices') }}</p>
            </div>
            <div class="link-arrow">→</div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortfolioStore } from '../stores/portfolioStore';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.vue';
import ProjectCard from '../components/portfolio/ProjectCard.vue';
import type { Project, FilterCriteria } from '../types/portfolio';

// Composables
const { t } = useI18n();
const portfolioStore = usePortfolioStore();

// Computed properties
const portfolioStatistics = computed(() => portfolioStore.projectStatistics);
const featuredProjects = computed(() => portfolioStore.featuredProjects);

// Methods
const handleProjectClick = (project: Project) => {
  // Handle project click - could navigate to project detail page or open external link
  if (project.url) {
    window.open(project.url, '_blank');
  }
};

const handleFiltersChange = (filters: FilterCriteria) => {
  console.log('Filters changed:', filters);
  // Could update URL params or analytics here
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const getTechFontSize = (count: number): string => {
  const maxCount = portfolioStatistics.value?.topTechnologies[0]?.count || 1;
  const minSize = 0.875; // 14px
  const maxSize = 2; // 32px
  const ratio = count / maxCount;
  const fontSize = minSize + (maxSize - minSize) * ratio;
  return `${fontSize}rem`;
};

// Lifecycle
onMounted(() => {
  if (portfolioStore.projectGroups.length === 0) {
    portfolioStore.loadProjects();
  }
});
</script>

<style lang="less" scoped>
.portfolio-page {
  min-height: 100vh;
  background-color: #F8F9FB;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  padding: 4rem 0 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  .header-content {
    text-align: center;
    
    .page-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .page-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }
  }
  
  .portfolio-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        display: block;
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        color: #ffffff;
      }
      
      .stat-label {
        font-size: 0.875rem;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }
}

.portfolio-content {
  padding: 2rem 0;
}

.featured-projects {
  padding: 4rem 0;
  background: white;
  
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
}

.tech-overview {
  padding: 4rem 0;
  background: #F8F9FB;
  
  .tech-cloud {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
    
    .tech-item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border-radius: 25px;
      border: 2px solid #E5E7EB;
      transition: all 0.3s ease;
      cursor: default;
      
      &:hover {
        border-color: #3B82F6;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      }
      
      .tech-name {
        font-weight: 600;
        color: #1F2937;
      }
      
      .tech-count {
        font-size: 0.875em;
        color: #6B7280;
      }
    }
  }
}

.external-links {
  padding: 4rem 0;
  background: white;
  
  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
    
    .link-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #F8F9FB;
      border-radius: 12px;
      border: 2px solid transparent;
      text-decoration: none;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        
        .link-arrow {
          transform: translateX(4px);
        }
      }
      
      &.github {
        &:hover {
          border-color: #1F2937;
          background: #F9FAFB;
        }
      }
      
      &.blog {
        &:hover {
          border-color: #3B82F6;
          background: #EFF6FF;
        }
      }
      
      &.docs {
        &:hover {
          border-color: #10B981;
          background: #ECFDF5;
        }
      }
      
      &.pm {
        &:hover {
          border-color: #F59E0B;
          background: #FFFBEB;
        }
      }
      
      .link-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      
      .link-content {
        flex: 1;
        
        .link-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.25rem;
        }
        
        .link-desc {
          font-size: 0.875rem;
          color: #6B7280;
          line-height: 1.5;
        }
      }
      
      .link-arrow {
        font-size: 1.25rem;
        color: #9CA3AF;
        transition: transform 0.3s ease;
        flex-shrink: 0;
      }
    }
  }
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
  
  .section-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 1rem;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
    color: #6B7280;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-header {
    padding: 3rem 0 2rem;
    
    .page-title {
      font-size: 2.25rem;
    }
    
    .page-subtitle {
      font-size: 1.125rem;
    }
    
    .portfolio-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      
      .stat-item .stat-number {
        font-size: 2rem;
      }
    }
  }
  
  .section-header .section-title {
    font-size: 1.875rem;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-cloud {
    gap: 1rem;
    
    .tech-item {
      font-size: 0.875rem;
    }
  }
}
</style>
<template>
  <div class="about-view">
    <!-- Brand Hero Section -->
    <section class="about-hero">
      <div class="middle-box">
        <div class="hero-content">
          <div class="hero-meta">
            <span class="meta-label">{{ t('nav.meta.label') }}</span>
            <div class="meta-line"></div>
          </div>
          <h1 class="hero-title">{{ brandInfo.title }}</h1>
          <p class="hero-subtitle">{{ brandInfo.subtitle }}</p>
          <div class="hero-intro">{{ brandInfo.intro }}</div>
        </div>
      </div>
    </section>

    <!-- Editorial Story Section -->
    <section class="story-section">
      <div class="middle-box">
        <div class="story-grid">
          <!-- Image Column -->
          <div class="story-image-col">
            <div class="image-wrapper">
              <img src="/assets/images/mind/bruce-brand.png" alt="My Journey" class="story-img" />
              <div class="image-caption">
                <span class="caption-num">01</span>
                <span class="caption-text">{{ t('about.story.journeyLabel') }}</span>
              </div>
            </div>
          </div>

          <!-- Text Column -->
          <div class="story-text-col">
            <h2 class="story-title">{{ t('brandStory.journey.title') }}</h2>
            <div class="story-body">
              <p>{{ t('brandStory.journey.content') }}</p>
              
              <div class="philosophy-list">
                <div 
                  v-for="(item, index) in storyData.philosophy" 
                  :key="index"
                  class="philosophy-item"
                >
                  <span class="item-marker"></span>
                  <span class="item-text">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications & Skills (Magazine Style) -->
    <section class="skills-section">
      <div class="middle-box">
        <div class="section-header">
          <h2 class="section-title">{{ t('about.skills.titlePart1') }} <br/><span class="text-gradient-gold">{{ t('about.skills.titlePart2') }}</span></h2>
        </div>

        <div class="skills-grid">
          <!-- Certifications Column -->
          <div class="certs-col">
            <div class="certs-list">
              <div 
                v-for="cert in certifications" 
                :key="cert.id"
                class="cert-item"
              >
                <div class="cert-icon">{{ getCertificationAbbr(cert.name) }}</div>
                <div class="cert-info">
                  <h3 class="cert-name">{{ cert.name }}</h3>
                  <p class="cert-org">{{ cert.issuer }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Column -->
          <div class="skills-col">
            <div class="skill-tags">
              <span 
                v-for="(value, index) in brandInfo.valueProposition" 
                :key="index"
                class="skill-tag"
              >
                {{ value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBrandStore } from '../stores/brandStore';

const { t, tm } = useI18n();
const brandStore = useBrandStore();

// 品牌信息
const brandInfo = computed(() => ({
  title: 'AIYAZONE',
  subtitle: t('brand.subtitle'),
  intro: t('brand.intro'),
  valueProposition: tm('brand.valueProposition') as string[]
}));

const certifications = computed(() => brandStore.certifications || []);

const storyData = computed(() => ({
  philosophy: [
    t('brandStory.philosophy.technical'),
    t('brandStory.philosophy.management'),
    t('brandStory.philosophy.growth')
  ]
}));

const getCertificationAbbr = (certName: string): string => {
  if (certName.includes('PMP')) return 'PMP';
  if (certName.includes('ACP')) return 'ACP';
  if (certName.includes('CSM')) return 'CSM';
  if (certName.includes('PSM')) return 'PSM';
  return 'CERT';
};

onMounted(() => {
  brandStore.loadBrandInfo();
});
</script>

<style scoped lang="less">
.about-view {
  min-height: 100vh;
}

/* Hero Section */
.about-hero {
  padding: var(--brand-space-huge) 0 var(--brand-space-xl);
  
  .hero-content {
    max-width: 800px;
    
    .hero-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      
      .meta-label {
        font-family: var(--brand-font-mono);
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        color: var(--brand-text-tertiary);
      }
      
      .meta-line {
        width: 60px;
        height: 1px;
        background: var(--brand-gold-start);
      }
    }
    
    .hero-title {
      font-size: clamp(3rem, 5vw, 5rem);
      margin-bottom: 1rem;
    }
    
    .hero-subtitle {
      font-family: var(--brand-font-display);
      font-size: 1.5rem;
      color: var(--brand-text-secondary);
      font-style: italic;
      margin-bottom: 2rem;
    }
    
    .hero-intro {
      font-size: 1.1rem;
      line-height: 1.8;
      max-width: 600px;
    }
  }
}

/* Story Section */
.story-section {
  padding: var(--brand-space-xl) 0;
  
  .story-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--brand-space-xl);
    align-items: center;
    
    .story-image-col {
      .image-wrapper {
        position: relative;
        
        .story-img {
          width: 100%;
          border-radius: 2px;
          filter: grayscale(100%);
          transition: filter 0.6s ease;
          
          &:hover {
            filter: grayscale(0%);
          }
        }
        
        .image-caption {
          position: absolute;
          bottom: -2rem;
          right: -2rem;
          background: var(--brand-canvas-day);
          padding: 1rem 2rem;
          border: 1px solid var(--brand-border);
          display: flex;
          flex-direction: column;
          
          .caption-num {
            font-family: var(--brand-font-display);
            font-size: 2rem;
            color: var(--brand-gold-start);
          }
          
          .caption-text {
            font-family: var(--brand-font-mono);
            font-size: 0.7rem;
            letter-spacing: 0.1em;
          }
        }
      }
    }
    
    .story-text-col {
      padding-left: 2rem;
      
      .story-title {
        font-size: 2.5rem;
        margin-bottom: 2rem;
      }
      
      .story-body {
        font-size: 1.05rem;
        color: var(--brand-text-secondary);
        
        .philosophy-list {
          margin-top: 2rem;
          
          .philosophy-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            
            .item-marker {
              width: 6px;
              height: 6px;
              background: var(--brand-gold-start);
              border-radius: 50%;
            }
            
            .item-text {
              font-family: var(--brand-font-display);
              font-style: italic;
              color: var(--brand-midnight);
            }
          }
        }
      }
    }
  }
}

/* Skills Section */
.skills-section {
  padding: var(--brand-space-huge) 0;
  
  .section-header {
    margin-bottom: var(--brand-space-xl);
    
    .section-title {
      font-size: 3rem;
      line-height: 1.1;
    }
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    
    .certs-list {
      display: grid;
      gap: 1.5rem;
      
      .cert-item {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem;
        border: 1px solid var(--brand-border);
        transition: all 0.3s ease;
        
        &:hover {
          border-color: var(--brand-gold-start);
          transform: translateX(10px);
        }
        
        .cert-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--brand-midnight);
          color: var(--brand-gold-start);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--brand-font-mono);
          font-size: 0.8rem;
        }
        
        .cert-info {
          .cert-name {
            font-size: 1.1rem;
            margin-bottom: 0.25rem;
          }
          
          .cert-org {
            font-size: 0.85rem;
            color: var(--brand-text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
        }
      }
    }
    
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-content: flex-start;
      
      .skill-tag {
        font-family: var(--brand-font-mono);
        font-size: 0.9rem;
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--brand-border);
        color: var(--brand-text-secondary);
        
        &:hover {
          background: var(--brand-midnight);
          color: white;
          border-color: var(--brand-midnight);
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .story-section .story-grid,
  .skills-section .skills-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .story-text-col {
    padding-left: 0 !important;
  }
  
  .image-caption {
    right: 0 !important;
  }
}
</style>

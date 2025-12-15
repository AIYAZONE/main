<template>
  <section class="brand-hero">
    <div class="middle-box">
      <div class="hero-content">
        <!-- Profile Image -->
        <div class="profile-image" v-if="profileImage">
          <img 
            :src="profileImage" 
            :alt="`${title} profile photo`"
            loading="eager"
          />
        </div>

        <!-- Main Title -->
        <h1 class="hero-title">{{ title }}</h1>
        
        <!-- Hero Divider -->
        <div class="hero-divider"></div>
        
        <!-- Subtitle -->
        <p class="hero-subtitle">{{ subtitle }}</p>
        
        <!-- Introduction -->
        <p class="hero-intro" v-html="intro"></p>

        <!-- Value Proposition -->
        <div class="value-proposition" v-if="valueProposition && valueProposition.length > 0">
          <ul class="value-list">
            <li 
              v-for="(value, index) in valueProposition" 
              :key="index"
              class="value-item"
            >
              {{ value }}
            </li>
          </ul>
        </div>

        <!-- Certifications Preview -->
        <div class="certifications-preview" v-if="certifications && certifications.length > 0">
          <div class="cert-badges">
            <span 
              v-for="cert in certifications" 
              :key="cert.id"
              class="cert-badge"
              :title="cert.name"
            >
              {{ getCertificationAbbr(cert.name) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Certification } from '../../types/brand';

interface Props {
  title: string;
  subtitle: string;
  intro: string;
  profileImage?: string;
  certifications?: readonly Certification[];
  valueProposition?: readonly string[];
}

const props = withDefaults(defineProps<Props>(), {
  profileImage: '',
  certifications: () => [],
  valueProposition: () => []
});

// Helper function to get certification abbreviation
const getCertificationAbbr = (certName: string): string => {
  if (certName.includes('PMP')) return 'PMP';
  if (certName.includes('ACP')) return 'ACP';
  if (certName.includes('CSM')) return 'CSM';
  if (certName.includes('PSM')) return 'PSM';
  
  // Default: take first letters of each word
  return certName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 3);
};
</script>

<style lang="less" scoped>
.brand-hero {
  padding: 8rem 0 6rem;
  text-align: center;
  background: linear-gradient(135deg, #F8F9FB 0%, #FFFFFF 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .hero-content {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
    
    .profile-image {
      margin-bottom: 2.5rem;
      
      img {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #FFFFFF;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
          box-shadow: 0 16px 50px rgba(59, 130, 246, 0.2);
        }
      }
    }
    
    .hero-title {
      font-family: var(--font-serif);
      font-size: 5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 2rem;
      line-height: 1.1;
      color: var(--text-primary);
      background: linear-gradient(135deg, #1F2937 0%, #3B82F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-divider {
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-gold) 0%, #3B82F6 100%);
      margin: 0 auto 2.5rem;
      border-radius: 2px;
    }
    
    .hero-subtitle {
      font-family: var(--font-sans);
      font-size: 1.25rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .hero-intro {
      font-family: var(--font-serif);
      font-size: 1.4rem;
      line-height: 1.8;
      color: var(--text-primary);
      opacity: 0.9;
      text-align: center;
      margin-bottom: 2.5rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .value-proposition {
      margin-bottom: 2.5rem;
      
      .value-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        max-width: 800px;
        margin: 0 auto;
        
        .value-item {
          background: rgba(59, 130, 246, 0.08);
          color: #1E40AF;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
          
          &:hover {
            background: rgba(59, 130, 246, 0.12);
            border-color: rgba(59, 130, 246, 0.3);
            transform: translateY(-2px);
          }
        }
      }
    }

    .certifications-preview {
      .cert-badges {
        display: flex;
        justify-content: center;
        gap: 1rem;
        
        .cert-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
          border-radius: 12px;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
          cursor: help;
          
          &:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .brand-hero {
    padding: 6rem 0 4rem;
    
    .hero-content {
      .profile-image img {
        width: 110px;
        height: 110px;
      }
      
      .hero-title {
        font-size: 3.5rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .hero-intro {
        font-size: 1.2rem;
      }
      
      .value-proposition .value-list {
        flex-direction: column;
        align-items: center;
        
        .value-item {
          max-width: 280px;
          text-align: center;
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .brand-hero {
    padding: 4rem 0 3rem;
    
    .hero-content {
      .hero-title {
        font-size: 2.8rem;
      }
      
      .hero-intro {
        font-size: 1.1rem;
      }
    }
  }
}
</style>
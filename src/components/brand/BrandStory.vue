<template>
  <section class="brand-story">
    <div class="middle-box">
      <!-- Section Header -->
      <div class="section-header">
        <h2 class="story-title">{{ t('brandStory.title', 'My Journey') }}</h2>
        <p class="section-subtitle">{{ t('brandStory.subtitle', 'From frontend developer to technical leader') }}</p>
      </div>

      <!-- Story Content -->
      <div class="story-content">
        <!-- Story Sections -->
        <div class="story-sections">
          <div 
            v-for="section in sortedStory" 
            :key="section.id"
            class="story-section"
          >
            <div class="section-content">
              <h3 class="section-title">{{ section.title }}</h3>
              <p class="section-text" v-html="section.content"></p>
            </div>
            
            <div v-if="section.imageUrl" class="section-image">
              <img 
                :src="section.imageUrl" 
                :alt="section.title"
                class="story-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="timeline-container">
          <h3 class="timeline-title">{{ t('brandStory.timeline.title', 'Career Timeline') }}</h3>
          
          <div class="timeline">
            <div 
              v-for="event in sortedTimeline" 
              :key="event.id"
              class="timeline-event"
              :class="getTimelineItemClass(event.type)"
            >
              <div class="timeline-marker">
                <span class="timeline-icon">{{ getTimelineIcon(event.type) }}</span>
              </div>
              
              <div class="timeline-content">
                <div class="timeline-date">{{ formatYear(event.date) }}</div>
                <h4 class="timeline-event-title">{{ event.title }}</h4>
                <p class="timeline-description">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Philosophy -->
        <div class="philosophy-container">
          <h3 class="philosophy-title">{{ t('brandStory.philosophy.title', 'Professional Philosophy') }}</h3>
          
          <div class="philosophy-grid">
            <div 
              v-for="(principle, index) in philosophy" 
              :key="index"
              class="philosophy-item"
            >
              <div class="philosophy-icon">💡</div>
              <p class="philosophy-text">{{ principle }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { StorySection, TimelineEvent } from '../../types/brand';

interface Props {
  story: readonly StorySection[];
  timeline: readonly TimelineEvent[];
  philosophy: readonly string[];
}

const props = withDefaults(defineProps<Props>(), {
  story: () => [],
  timeline: () => [],
  philosophy: () => []
});

const { t } = useI18n();

// Sort story sections by order
const sortedStory = computed(() => {
  return [...props.story].sort((a, b) => a.order - b.order);
});

// Sort timeline events by date (newest first)
const sortedTimeline = computed(() => {
  return [...props.timeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Format year from date
const formatYear = (date: Date): string => {
  return new Date(date).getFullYear().toString();
};

// Get timeline icon based on event type
const getTimelineIcon = (type: string): string => {
  switch (type) {
    case 'achievement':
      return '🏆';
    case 'milestone':
      return '🎯';
    case 'transition':
      return '🚀';
    default:
      return '📍';
  }
};

// Get timeline item CSS class based on event type
const getTimelineItemClass = (type: string): string => {
  return `timeline-${type}`;
};
</script>

<style lang="less" scoped>
.brand-story {
  padding: 5rem 0;
  background: linear-gradient(135deg, #F8F9FB 0%, #FFFFFF 100%);
  
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
    
    .story-title {
      font-family: var(--font-serif);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    
    .section-subtitle {
      font-family: var(--font-sans);
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }
  
  .story-content {
    max-width: 1000px;
    margin: 0 auto;
    
    .story-sections {
      margin-bottom: 5rem;
      
      .story-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
        margin-bottom: 4rem;
        padding: 2rem 0;
        
        &:nth-child(even) {
          .section-content {
            order: 2;
          }
          
          .section-image {
            order: 1;
          }
        }
        
        .section-content {
          .section-title {
            font-family: var(--font-serif);
            font-size: 1.75rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            line-height: 1.3;
          }
          
          .section-text {
            font-family: var(--font-sans);
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--text-primary);
            opacity: 0.9;
          }
        }
        
        .section-image {
          .story-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    
    .timeline-container {
      margin-bottom: 5rem;
      
      .timeline-title {
        font-family: var(--font-serif);
        font-size: 2rem;
        font-weight: 600;
        color: var(--text-primary);
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .timeline {
        position: relative;
        padding-left: 2rem;
        
        &::before {
          content: '';
          position: absolute;
          left: 1rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #3B82F6 0%, #10B981 100%);
        }
        
        .timeline-event {
          position: relative;
          margin-bottom: 3rem;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .timeline-marker {
            position: absolute;
            left: -1.5rem;
            top: 0;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            
            .timeline-icon {
              font-size: 1.2rem;
            }
          }
          
          .timeline-content {
            margin-left: 2rem;
            background: #FFFFFF;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            border-left: 4px solid transparent;
            
            .timeline-date {
              font-family: var(--font-sans);
              font-size: 0.9rem;
              font-weight: 600;
              color: var(--text-secondary);
              margin-bottom: 0.5rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            
            .timeline-event-title {
              font-family: var(--font-sans);
              font-size: 1.2rem;
              font-weight: 700;
              color: var(--text-primary);
              margin-bottom: 0.75rem;
              line-height: 1.3;
            }
            
            .timeline-description {
              font-family: var(--font-sans);
              font-size: 1rem;
              line-height: 1.6;
              color: var(--text-primary);
              opacity: 0.8;
            }
          }
          
          &.timeline-achievement {
            .timeline-marker {
              background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            }
            
            .timeline-content {
              border-left-color: #F59E0B;
            }
          }
          
          &.timeline-milestone {
            .timeline-marker {
              background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            }
            
            .timeline-content {
              border-left-color: #3B82F6;
            }
          }
          
          &.timeline-transition {
            .timeline-marker {
              background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            }
            
            .timeline-content {
              border-left-color: #10B981;
            }
          }
        }
      }
    }
    
    .philosophy-container {
      .philosophy-title {
        font-family: var(--font-serif);
        font-size: 2rem;
        font-weight: 600;
        color: var(--text-primary);
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .philosophy-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        
        .philosophy-item {
          background: #FFFFFF;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: transform 0.3s ease;
          
          &:hover {
            transform: translateY(-4px);
          }
          
          .philosophy-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .philosophy-text {
            font-family: var(--font-sans);
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--text-primary);
            font-weight: 500;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .brand-story {
    padding: 3rem 0;
    
    .section-header {
      margin-bottom: 3rem;
      
      .section-title {
        font-size: 2rem;
      }
      
      .section-subtitle {
        font-size: 1rem;
      }
    }
    
    .story-content {
      .story-sections {
        margin-bottom: 3rem;
        
        .story-section {
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
          
          &:nth-child(even) {
            .section-content,
            .section-image {
              order: unset;
            }
          }
          
          .section-content .section-title {
            font-size: 1.5rem;
          }
          
          .section-image .story-image {
            height: 250px;
          }
        }
      }
      
      .timeline-container {
        margin-bottom: 3rem;
        
        .timeline-title {
          font-size: 1.75rem;
          margin-bottom: 2rem;
        }
        
        .timeline {
          padding-left: 1.5rem;
          
          .timeline-item {
            .timeline-marker {
              left: -1.25rem;
              width: 2.5rem;
              height: 2.5rem;
              
              .timeline-icon {
                font-size: 1rem;
              }
            }
            
            .timeline-content {
              margin-left: 1.5rem;
              padding: 1.25rem 1.5rem;
            }
          }
        }
      }
      
      .philosophy-container {
        .philosophy-title {
          font-size: 1.75rem;
          margin-bottom: 2rem;
        }
        
        .philosophy-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
          
          .philosophy-item {
            padding: 1.5rem;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .brand-story {
    .story-content {
      .story-sections {
        .story-section {
          .section-content {
            .section-title {
              font-size: 1.3rem;
            }
            
            .section-text {
              font-size: 1rem;
            }
          }
        }
      }
      
      .timeline-container {
        .timeline {
          .timeline-item {
            .timeline-content {
              padding: 1rem 1.25rem;
              
              .timeline-event-title {
                font-size: 1.1rem;
              }
              
              .timeline-description {
                font-size: 0.95rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
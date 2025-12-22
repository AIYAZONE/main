<template>
  <div class="social-integration">
    <div class="social-header">
      <h2 class="social-title">{{ $t('social.title', '社交媒体') }}</h2>
      <p class="social-description">{{ $t('social.description', '关注我的最新动态和技术分享') }}</p>
    </div>

    <!-- 社交媒体链接 -->
    <div class="social-links">
      <a 
        v-for="link in socialLinks" 
        :key="link.id"
        :href="link.url"
        :target="link.external ? '_blank' : '_self'"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="social-link"
        :class="`social-link--${link.platform}`"
        :aria-label="`${link.name} - ${link.description}`"
      >
        <div class="link-icon">
          <span class="icon">{{ link.icon }}</span>
        </div>
        <div class="link-content">
          <h3 class="link-title">{{ link.name }}</h3>
          <p class="link-description">{{ link.description }}</p>
          <div class="link-meta">
            <span class="link-type">{{ $t(`social.types.${link.type}`) }}</span>
            <span v-if="link.followers" class="link-followers">
              {{ formatNumber(link.followers) }} {{ $t('social.followers', '关注者') }}
            </span>
          </div>
        </div>
        <div class="link-arrow">
          <span class="arrow-icon">→</span>
        </div>
      </a>
    </div>

    <!-- 最新动态 -->
    <div class="blog-posts" v-if="showFeed">
      <h3 class="feed-title">{{ $t('social.latestUpdates', '最新动态') }}</h3>
      
      <div v-if="isLoadingFeed" class="feed-loading">
        <div class="loading-spinner"></div>
        <span>{{ $t('common.loading') }}</span>
      </div>

      <div v-else-if="feedError" class="feed-error">
        <span class="error-icon">⚠️</span>
        <p>{{ feedError }}</p>
        <button @click="loadSocialFeed" class="retry-btn">
          {{ $t('common.retry') }}
        </button>
      </div>

      <div v-else class="feed-content">
        <div 
          v-for="post in socialFeed" 
          :key="post.id"
          class="feed-item"
          :class="`feed-item--${post.platform}`"
        >
          <div class="feed-header">
            <div class="feed-platform">
              <span class="platform-icon">{{ getPlatformIcon(post.platform) }}</span>
              <span class="platform-name">{{ post.platformName }}</span>
            </div>
            <time class="feed-date" :datetime="post.publishedAt.toISOString()">
              {{ formatRelativeTime(post.publishedAt) }}
            </time>
          </div>
          
          <div class="feed-body">
            <h4 v-if="post.title" class="feed-post-title">{{ post.title }}</h4>
            <p class="feed-content-text">{{ post.content }}</p>
            
            <div v-if="post.image" class="feed-image">
              <img :src="post.image" :alt="post.title || ''" loading="lazy" />
            </div>
            
            <div class="feed-tags" v-if="post.tags.length > 0">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="feed-tag"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
          
          <div class="feed-footer">
            <div class="feed-stats">
              <span v-if="post.likes" class="stat-item">
                <span class="stat-icon">❤️</span>
                {{ formatNumber(post.likes) }}
              </span>
              <span v-if="post.comments" class="stat-item">
                <span class="stat-icon">💬</span>
                {{ formatNumber(post.comments) }}
              </span>
              <span v-if="post.shares" class="stat-item">
                <span class="stat-icon">🔄</span>
                {{ formatNumber(post.shares) }}
              </span>
            </div>
            
            <a 
              :href="post.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="feed-link"
            >
              {{ $t('social.viewPost', '查看原文') }}
              <span class="external-icon">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- GitHub Activity -->
    <div class="github-activity" v-if="showFeed && socialFeed.some(post => post.platform === 'github')">
      <h3 class="activity-title">{{ $t('social.githubActivity', 'GitHub Activity') }}</h3>
      <div class="activity-content">
        <div 
          v-for="post in socialFeed.filter(p => p.platform === 'github')" 
          :key="post.id"
          class="activity-item"
        >
          <h4 class="activity-title">{{ post.title }}</h4>
          <p class="activity-description">{{ post.content }}</p>
          <a :href="post.url" target="_blank" rel="noopener noreferrer" class="activity-link">
            {{ $t('social.viewOnGitHub', 'View on GitHub') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
interface SocialLink {
  id: string;
  name: string;
  description: string;
  url: string;
  platform: string;
  type: 'blog' | 'code' | 'social' | 'professional';
  icon: string;
  external: boolean;
  followers?: number;
}

interface SocialPost {
  id: string;
  platform: string;
  platformName: string;
  title?: string;
  content: string;
  url: string;
  publishedAt: Date;
  image?: string;
  tags: string[];
  likes?: number;
  comments?: number;
  shares?: number;
}

interface Props {
  showFeed?: boolean;
  maxFeedItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showFeed: true,
  maxFeedItems: 6
});

const { t } = useI18n();

const isLoadingFeed = ref(false);
const feedError = ref<string | null>(null);
const socialFeed = ref<SocialPost[]>([]);

const socialLinks: SocialLink[] = [
  {
    id: 'blog',
    name: 'AIYA Blog',
    description: '技术博客和个人思考',
    url: 'https://blog.aiyazone.com',
    platform: 'blog',
    type: 'blog',
    icon: '📝',
    external: true,
    followers: 1200
  },
  {
    id: 'github',
    name: 'GitHub',
    description: '开源项目和代码贡献',
    url: 'https://github.com/AIYAZONE',
    platform: 'github',
    type: 'code',
    icon: '🐱',
    external: true,
    followers: 850
  },
  {
    id: 'frontend',
    name: '前端技术栈',
    description: '前端工程化和性能优化',
    url: 'https://fe.aiyazone.com',
    platform: 'website',
    type: 'blog',
    icon: '⚡',
    external: true
  },
  {
    id: 'pm',
    name: '项目管理',
    description: 'PMP知识体系和实践经验',
    url: 'https://pm.aiyazone.com',
    platform: 'website',
    type: 'professional',
    icon: '📊',
    external: true
  },
  {
    id: 'juejin',
    name: '掘金',
    description: '技术文章和社区交流',
    url: 'https://juejin.cn/user/aiyazone',
    platform: 'juejin',
    type: 'social',
    icon: '💎',
    external: true,
    followers: 2100
  }
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return t('social.timeAgo.seconds', '刚刚');
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return t('social.timeAgo.minutes', `${minutes}分钟前`);
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return t('social.timeAgo.hours', `${hours}小时前`);
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return t('social.timeAgo.days', `${days}天前`);
  } else {
    return date.toLocaleDateString();
  }
};

const getPlatformIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    blog: '📝',
    github: '🐱',
    linkedin: '💼',
    juejin: '💎',
    website: '🌐',
    twitter: '🐦'
  };
  return icons[platform] || '📱';
};

const loadSocialFeed = async () => {
  if (!props.showFeed) return;
  
  isLoadingFeed.value = true;
  feedError.value = null;
  
  try {
    // 模拟API调用获取社交媒体动态
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟数据
    const mockFeed: SocialPost[] = [
      {
        id: '1',
        platform: 'blog',
        platformName: 'AIYA Blog',
        title: '前端架构设计的思考与实践',
        content: '在大型前端项目中，架构设计的重要性不言而喻。本文分享了我在项目中的一些思考和实践经验...',
        url: 'https://blog.aiyazone.com/frontend-architecture',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['前端架构', '工程化', '最佳实践'],
        likes: 156,
        comments: 23
      },
      {
        id: '2',
        platform: 'github',
        platformName: 'GitHub',
        title: 'ZenParticles v2.0 发布',
        content: '新版本增加了手势识别功能，支持更多交互方式。欢迎体验和反馈！',
        url: 'https://github.com/AIYAZONE/ZenParticles',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['WebGL', '3D', '交互设计'],
        likes: 89,
        shares: 12
      },
      {
        id: '3',
        platform: 'juejin',
        platformName: '掘金',
        title: 'Vue 3 性能优化实战指南',
        content: '从组件设计到打包优化，全面提升Vue应用性能。包含实际案例和性能测试数据。',
        url: 'https://juejin.cn/post/vue3-performance',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: ['Vue3', '性能优化', '前端'],
        likes: 234,
        comments: 45,
        shares: 67
      }
    ];
    
    socialFeed.value = mockFeed.slice(0, props.maxFeedItems);
  } catch (error) {
    console.error('Failed to load social feed:', error);
    feedError.value = t('social.feedError', '加载动态失败，请稍后重试');
  } finally {
    isLoadingFeed.value = false;
  }
};

onMounted(() => {
  if (props.showFeed) {
    loadSocialFeed();
  }
});
</script>

<style scoped lang="less">
.social-integration {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .social-header {
    text-align: center;
    margin-bottom: 3rem;

    .social-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .social-description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }

  .social-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 4rem;

    .social-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--accent-gold);
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

        .link-arrow .arrow-icon {
          transform: translateX(4px);
        }
      }

      .link-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-color);
        border-radius: 12px;
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .link-content {
        flex: 1;

        .link-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .link-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .link-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;

          .link-type {
            padding: 0.25rem 0.5rem;
            background: var(--accent-gold);
            color: white;
            border-radius: 4px;
            font-weight: 500;
          }

          .link-followers {
            color: var(--text-secondary);
          }
        }
      }

      .link-arrow {
        .arrow-icon {
          font-size: 1.25rem;
          color: var(--text-secondary);
          transition: transform 0.3s ease;
        }
      }
    }
  }

  .social-feed {
    .feed-title {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 2rem;
      text-align: center;
    }

    .feed-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 3rem;
      color: var(--text-secondary);

      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid var(--border-color);
        border-top-color: var(--accent-gold);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }

    .feed-error {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);

      .error-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        display: block;
      }

      .retry-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: var(--accent-gold);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #2563eb;
        }
      }
    }

    .feed-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;

      .feed-item {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);

          .feed-platform {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .platform-icon {
              font-size: 1.1rem;
            }

            .platform-name {
              font-weight: 500;
              color: var(--text-primary);
            }
          }

          .feed-date {
            font-size: 0.85rem;
            color: var(--text-secondary);
          }
        }

        .feed-body {
          padding: 1.5rem;

          .feed-post-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
            line-height: 1.3;
          }

          .feed-content-text {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .feed-image {
            margin-bottom: 1rem;

            img {
              width: 100%;
              height: 200px;
              object-fit: cover;
              border-radius: 8px;
            }
          }

          .feed-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            .feed-tag {
              padding: 0.25rem 0.5rem;
              background: var(--bg-color);
              color: var(--accent-gold);
              border-radius: 4px;
              font-size: 0.8rem;
              font-weight: 500;
            }
          }
        }

        .feed-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-color);
          background: var(--bg-color);

          .feed-stats {
            display: flex;
            gap: 1rem;

            .stat-item {
              display: flex;
              align-items: center;
              gap: 0.25rem;
              font-size: 0.85rem;
              color: var(--text-secondary);

              .stat-icon {
                font-size: 0.9rem;
              }
            }
          }

          .feed-link {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: var(--accent-gold);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.3s ease;

            &:hover {
              color: #2563eb;

              .external-icon {
                transform: translate(2px, -2px);
              }
            }

            .external-icon {
              font-size: 0.8rem;
              transition: transform 0.3s ease;
            }
          }
        }
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 移动端优化
@media screen and (max-width: 767px) {
  .social-integration {
    padding: 1rem;

    .social-links {
      grid-template-columns: 1fr;
      gap: 1rem;

      .social-link {
        padding: 1rem;

        .link-icon {
          width: 40px;
          height: 40px;
          font-size: 1.25rem;
        }

        .link-content {
          .link-title {
            font-size: 1.1rem;
          }

          .link-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      }
    }

    .feed-content {
      grid-template-columns: 1fr;
      gap: 1rem;

      .feed-item {
        .feed-body {
          padding: 1rem;
        }

        .feed-footer {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;

          .feed-stats {
            justify-content: center;
          }

          .feed-link {
            justify-content: center;
          }
        }
      }
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .social-integration {
    .social-link {
      border-width: 3px;
    }

    .feed-item {
      border-width: 2px;
    }
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .social-integration {
    .social-link {
      &:hover {
        box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
      }
    }

    .feed-item {
      &:hover {
        box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
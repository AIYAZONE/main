<template>
  <div class="home-editorial">
    <!-- Hero Section -->
    <section class="hero">
      <div class="middle-box">
        <div class="hero-content">
          <h1 class="main-title">{{ content.hero.title }}</h1>
          <div class="hero-divider"></div>
          <p class="subtitle">{{ content.hero.subtitle }}</p>
          <p class="intro" v-html="content.hero.intro"></p>
        </div>
      </div>
    </section>

    <!-- Project List Section -->
    <section class="content-list">
      <div class="middle-box">
        <div
          v-for="(group, index) in content.projects"
          :key="index"
          class="group-section"
        >
          <div class="group-header">
            <h2 class="group-title">
              <span class="group-icon">#</span>
              {{ group.title }}
            </h2>
          </div>

          <div class="project-grid">
            <a
              v-for="item in group.list"
              :key="item.name"
              :href="item.href"
              :target="item.target || '_blank'"
              class="tech-card"
            >
              <div class="card-inner">
                <div class="card-top">
                  <div class="tech-icon-box">
                    <span class="tech-icon">/></span>
                  </div>
                  <span class="external-link-icon">↗</span>
                </div>

                <h3 class="card-title">{{ item.name }}</h3>

                <div class="card-body" v-if="item.info">
                  <span class="tech-tag">{{ item.info.title }}</span>
                  <p class="card-desc" v-html="item.info.description"></p>
                </div>

                <div class="card-footer">
                  <span class="status-dot"></span>
                  <span class="status-text">Online</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useLangStore } from "../store/lang";

interface ProjectItem {
  name: string;
  info: {
    title: string;
    description: string;
  };
  href: string;
  target?: string;
}

interface ProjectGroup {
  title: string;
  list: ProjectItem[];
}

interface HeroContent {
  title: string;
  subtitle: string;
  intro: string;
}

interface LangContent {
  hero: HeroContent;
  projects: ProjectGroup[];
}

const contentData: Record<string, LangContent> = {
  zh: {
    hero: {
      title: "AIYAZONE",
      subtitle: "前端开发工程师 & 项目管理探索者",
      intro: "打造个人品牌，追求工程卓越，探索产品思维。<br>在数字花园中沉淀价值。",
    },
    projects: [
      {
        title: "数字花园",
        list: [
          {
            name: "博客",
            info: { title: "Blog", description: "记录灵感、技术积累与个人成长。" },
            href: "https://blog.aiyazone.com/",
          },
          {
            name: "前端",
            info: {
              title: "Engineering",
              description: "前端技术栈全景图：性能优化、工程化与算法。",
            },
            href: "https://fe.aiyazone.com/",
          },
          {
            name: "项目管理",
            info: { title: "PM", description: "PM知识体系构建，思维导图与实战经验。" },
            href: "https://pm.aiyazone.com/",
          },
        ],
      },
      {
        title: "精选作品",
        list: [
          {
            name: "ZenParticles",
            info: {
              title: "Web AI",
              description: "使用 Gemini 生成的手势控制 3D 粒子系统。",
            },
            href: "https://zepa.aiyazone.com/",
          },
          {
            name: "Sun Travel",
            info: { title: "Web App", description: "沉浸式旅游体验平台。" },
            href: "https://travel.aiyazone.com/",
          },
        ],
      },
      {
        title: "社区",
        list: [
          {
            name: "GitHub",
            info: { title: "Open Source", description: "查看我的开源项目和代码贡献。" },
            href: "https://github.com/AIYAZONE/",
          },
        ],
      },
    ],
  },
  en: {
    hero: {
      title: "AIYAZONE",
      subtitle: "Frontend Developer & Project Manager",
      intro:
        "Crafting digital experiences with precision and purpose. <br>Focusing on personal branding, engineering excellence, and product thinking.",
    },
    projects: [
      {
        title: "Digital Garden",
        list: [
          {
            name: "Blog",
            info: {
              title: "Blog",
              description:
                "Recording inspiration, tech accumulation, and personal growth.",
            },
            href: "https://blog.aiyazone.com/",
          },
          {
            name: "Frontend",
            info: {
              title: "Engineering",
              description:
                "Frontend tech stack panorama: Performance, Engineering & Algorithms.",
            },
            href: "https://fe.aiyazone.com/",
          },
          {
            name: "Management",
            info: {
              title: "PM",
              description: "PM knowledge system, mind maps, and practical experience.",
            },
            href: "https://pm.aiyazone.com/",
          },
        ],
      },
      {
        title: "Selected Works",
        list: [
          {
            name: "ZenParticles",
            info: {
              title: "Web AI",
              description:
                "A real-time interactive 3D particle system controlled by hand gestures.",
            },
            href: "https://zepa.aiyazone.com/",
          },
          {
            name: "Sun Travel",
            info: {
              title: "Web App",
              description: "Immersive travel experience platform.",
            },
            href: "https://travel.aiyazone.com/",
          },
        ],
      },
      {
        title: "Community",
        list: [
          {
            name: "GitHub",
            info: {
              title: "Open Source",
              description: "Check out my open source projects and contributions.",
            },
            href: "https://github.com/AIYAZONE/",
          },
        ],
      },
    ],
  },
};

export default defineComponent({
  name: "Home",
  setup() {
    const langStore = useLangStore();
    const content = computed(() => contentData[langStore.language]);

    return {
      content,
    };
  },
});
</script>

<style lang="less" scoped>
.home-editorial {
  padding-bottom: 8rem;
  background-color: #f8f9fb; /* Cooler, lighter background */
}

/* Hero Section */
.hero {
  padding: 12rem 0 8rem;
  text-align: center;

  .hero-content {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;

    .main-title {
      font-family: var(--font-serif);
      font-size: 6rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 2rem;
      line-height: 1.1;
      color: var(--text-primary);
    }

    .hero-divider {
      width: 80px;
      height: 4px;
      background-color: var(--accent-gold);
      margin: 0 auto 2.5rem;
    }

    .subtitle {
      font-family: var(--font-sans);
      font-size: 1.25rem;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .intro {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      line-height: 1.8;
      color: var(--text-primary);
      opacity: 0.9;
      text-align: center;
    }
  }
}

/* Projects List - Tech/Engineer Style */
.group-section {
  margin-bottom: 6rem;

  .group-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;

    .group-title {
      font-family: var(--font-sans);
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .group-icon {
        color: #3b82f6; /* Tech Blue */
        font-weight: 900;
      }
    }
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 2rem;

    .tech-card {
      display: block;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      /* Hover Effect */
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px -8px rgba(59, 130, 246, 0.15); /* Blue-ish shadow */
        border-color: #3b82f6;

        .card-top .tech-icon-box {
          background-color: #eff6ff;
          color: #3b82f6;
        }

        .card-top .external-link-icon {
          opacity: 1;
          transform: translate(2px, -2px);
          color: #3b82f6;
        }
      }

      .card-inner {
        padding: 1.75rem;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.25rem;

        .tech-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          .tech-icon {
            font-family: monospace;
            font-weight: 700;
            color: #6b7280;
            font-size: 1.1rem;
          }
        }

        .external-link-icon {
          font-size: 1.2rem;
          color: #9ca3af;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
      }

      .card-title {
        font-family: var(--font-sans);
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.75rem;
      }

      .card-body {
        flex: 1;

        .tech-tag {
          display: inline-block;
          font-family: monospace;
          font-size: 0.75rem;
          color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .card-desc {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 1.5rem;
        }
      }

      .card-footer {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;

        .status-dot {
          width: 8px;
          height: 8px;
          background-color: #10b981; /* Green status */
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .status-text {
          font-family: monospace;
          font-size: 0.75rem;
          color: #6b7280;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .hero {
    padding: 8rem 0 5rem;

    .hero-content {
      .main-title {
        font-size: 3.5rem;
      }
      .subtitle {
        font-size: 1rem;
      }
    }
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>

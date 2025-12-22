<template>
  <div class="home-editorial">
    <BrandHero
      :title="brandInfo?.name || content?.hero?.title"
      :subtitle="brandInfo?.subtitle || content?.hero?.subtitle"
      :intro="brandInfo?.intro || content?.hero?.intro"
      :profile-image="brandInfo?.profileImage"
      :certifications="certifications"
      :value-proposition="brandInfo?.valueProposition || []"
    />

    <section class="home-section home-section--focus">
      <div class="middle-box">
        <div class="section-header">
          <h2 class="section-title">{{ content?.focus?.title }}</h2>
          <p class="section-description">{{ content?.focus?.subtitle }}</p>
        </div>

        <div class="focus-grid">
          <div v-for="item in content?.focus?.items" :key="item.title" class="focus-card">
            <div class="focus-card__top">
              <div class="focus-card__icon">{{ item.icon }}</div>
              <div class="focus-card__title">{{ item.title }}</div>
            </div>
            <div class="focus-card__desc">{{ item.description }}</div>
            <div class="focus-card__tags">
              <span v-for="tag in item.tags" :key="tag" class="focus-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section home-section--now">
      <div class="middle-box">
        <div class="section-header section-header--split">
          <div class="section-header__left">
            <h2 class="section-title">{{ content?.now?.title }}</h2>
            <p class="section-description">{{ content?.now?.subtitle }}</p>
          </div>
          <div class="section-header__right">
            <div class="now-chips">
              <span v-for="chip in content?.now?.chips" :key="chip" class="now-chip">{{ chip }}</span>
            </div>
          </div>
        </div>

        <div class="now-grid">
          <div v-for="item in content?.now?.items" :key="item.title" class="now-item">
            <div class="now-item__kicker">{{ item.kicker }}</div>
            <div class="now-item__title">{{ item.title }}</div>
            <div class="now-item__desc">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section home-section--cta">
      <div class="middle-box">
        <div class="cta-card">
          <div class="cta-card__content">
            <div class="cta-kicker">{{ content?.cta?.kicker }}</div>
            <div class="cta-title">{{ content?.cta?.title }}</div>
            <div class="cta-subtitle">{{ content?.cta?.subtitle }}</div>
          </div>
          <div class="cta-card__actions">
            <router-link to="/portfolio" class="cta-btn cta-btn--primary">{{ content?.cta?.actions?.portfolio }}</router-link>
            <router-link to="/career" class="cta-btn">{{ content?.cta?.actions?.career }}</router-link>
            <router-link to="/contact" class="cta-btn">{{ content?.cta?.actions?.contact }}</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useLangStore } from '../store/lang';
import { useBrandStore } from '../stores/brandStore';
import BrandHero from '../components/brand/BrandHero.vue';

const contentData = {
  zh: {
    hero: {
      title: "AIYAZONE",
      subtitle: "前端开发工程师 & 项目管理探索者",
      intro: "打造个人品牌，追求工程卓越，探索产品思维。<br>在数字花园中沉淀价值。",
    },
    focus: {
      title: "我擅长的",
      subtitle: "偏工程化与性能的前端体系建设，也能把复杂事情拆解成可交付的里程碑。",
      items: [
        {
          icon: "🏗️",
          title: "架构与工程化",
          description: "从模块边界到构建策略，确保系统可扩展、可维护、可演进。",
          tags: ["架构设计", "组件体系", "工程规范"]
        },
        {
          icon: "⚡️",
          title: "性能与体验",
          description: "以指标驱动优化，从加载到交互，把体验做到“快且稳”。",
          tags: ["性能分析", "渲染优化", "体验细节"]
        },
        {
          icon: "🧭",
          title: "交付与协作",
          description: "用清晰的节奏与共识推进协作，把风险前置，把结果交付。",
          tags: ["项目推进", "跨团队协作", "质量保障"]
        }
      ]
    },
    now: {
      title: "当前在做",
      subtitle: "持续打磨个人品牌系统，同时沉淀可复用的工程方法论。",
      chips: ["系统化", "高质量", "可复用"],
      items: [
        {
          kicker: "01",
          title: "个人品牌展示系统",
          description: "统一视觉与信息架构，形成稳定的展示模块与设计语言。"
        },
        {
          kicker: "02",
          title: "工程实践沉淀",
          description: "围绕性能、稳定性与可维护性整理方法，形成可迁移的模板。"
        },
        {
          kicker: "03",
          title: "长期学习路线",
          description: "以架构、性能、工程三条主线持续精进，并在项目中验证。"
        }
      ]
    },
    cta: {
      kicker: "NEXT",
      title: "想快速了解我？",
      subtitle: "从作品集看结果，从职业规划看方法，从联系页直接对话。",
      actions: {
        portfolio: "查看作品集",
        career: "职业规划",
        contact: "联系我"
      }
    }
  },
  en: {
    hero: {
      title: "AIYAZONE",
      subtitle: "Frontend Developer & Project Manager",
      intro: "Crafting digital experiences with precision and purpose. <br>Focusing on personal branding, engineering excellence, and product thinking.",
    },
    focus: {
      title: "What I do best",
      subtitle: "Engineering-first frontend systems with performance rigor and delivery discipline.",
      items: [
        {
          icon: "🏗️",
          title: "Architecture & Engineering",
          description: "Scalable boundaries, maintainable systems, and pragmatic build strategies.",
          tags: ["System design", "Component system", "DX"]
        },
        {
          icon: "⚡️",
          title: "Performance & UX",
          description: "Metrics-driven optimization from load to interaction—fast and reliable.",
          tags: ["Profiling", "Rendering", "UX details"]
        },
        {
          icon: "🧭",
          title: "Delivery & Collaboration",
          description: "Clear milestones, aligned teams, and quality-first execution.",
          tags: ["Planning", "Collaboration", "Quality"]
        }
      ]
    },
    now: {
      title: "What I'm building now",
      subtitle: "Refining the personal brand system while turning practices into reusable playbooks.",
      chips: ["Systematic", "High quality", "Reusable"],
      items: [
        {
          kicker: "01",
          title: "Personal brand showcase system",
          description: "Unifying visual identity and information architecture into stable modules."
        },
        {
          kicker: "02",
          title: "Engineering playbooks",
          description: "Codifying practices around performance, stability, and maintainability."
        },
        {
          kicker: "03",
          title: "Long-term learning tracks",
          description: "Deepening architecture, performance, and engineering through real projects."
        }
      ]
    },
    cta: {
      kicker: "NEXT",
      title: "Want the quick version?",
      subtitle: "See outcomes in Portfolio, methods in Career, and reach out directly in Contact.",
      actions: {
        portfolio: "View Portfolio",
        career: "Career Path",
        contact: "Contact"
      }
    }
  }
};

const langStore = useLangStore();
const brandStore = useBrandStore();

const content = computed(() => contentData[langStore.language as keyof typeof contentData]);
const brandInfo = computed(() => brandStore.brandInfo);
const certifications = computed(() => brandStore.certifications);

// Load brand data on component mount
onMounted(() => {
  brandStore.loadBrandInfo();
});
</script>

<style lang="less" scoped>
.home-editorial {
  padding-bottom: 8rem;
}

.home-section {
  padding: var(--brand-space-huge) 0;
  background: transparent;

  .section-header {
    text-align: center;
    margin-bottom: var(--brand-space-lg);
  }

  .section-title {
    font-family: var(--brand-font-display);
    font-size: clamp(2.2rem, 3.2vw, 3rem);
    font-weight: 700;
    color: var(--brand-midnight);
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .section-description {
    font-family: var(--brand-font-body);
    font-size: 1.125rem;
    color: var(--brand-text-secondary);
    max-width: 760px;
    margin: 0 auto;
    line-height: 1.65;
  }
}

.section-header--split {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2.5rem;
  text-align: left;

  .section-description {
    margin: 0;
  }
}

.focus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.focus-card {
  border: 1px solid var(--brand-border);
  background: var(--brand-canvas-day);
  padding: 1.75rem 1.75rem 1.5rem;
  transition: transform 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: var(--brand-gold-start);
  }
}

.focus-card__top {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.focus-card__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid var(--brand-border);
  background: white;
}

.focus-card__title {
  font-family: var(--brand-font-display);
  font-size: 1.25rem;
  color: var(--brand-midnight);
}

.focus-card__desc {
  color: var(--brand-text-secondary);
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.focus-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.focus-tag {
  font-family: var(--brand-font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--brand-border);
  color: var(--brand-text-secondary);
}

.home-section--now {
  padding-top: 0;
}

.now-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.6rem;
}

.now-chip {
  font-family: var(--brand-font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--brand-border);
  background: rgba(0, 0, 0, 0.02);
  color: var(--brand-midnight);
}

.now-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 2.25rem;
}

.now-item {
  padding: 1.75rem 1.75rem 1.5rem;
  border: 1px solid var(--brand-border);
  background: transparent;
}

.now-item__kicker {
  font-family: var(--brand-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  color: var(--brand-text-tertiary);
  margin-bottom: 0.75rem;
}

.now-item__title {
  font-family: var(--brand-font-display);
  font-size: 1.35rem;
  color: var(--brand-midnight);
  margin-bottom: 0.75rem;
}

.now-item__desc {
  color: var(--brand-text-secondary);
  line-height: 1.7;
}

.home-section--cta {
  padding-top: var(--brand-space-xl);
}

.cta-card {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: var(--brand-midnight);
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  color: rgba(255, 255, 255, 0.9);
  border-radius: 0;
  padding: 2.25rem 2.25rem 2rem;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  box-shadow: 0 14px 36px -28px rgba(0, 0, 0, 0.6);
  transition: border-color var(--brand-transition-base),
    box-shadow var(--brand-transition-base),
    background-position var(--brand-transition-base);
}

.cta-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--brand-gradient-gold);
  opacity: 0.85;
}

.cta-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 15% 10%,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 55%
  );
  pointer-events: none;
  opacity: 0.55;
}

.cta-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 18px 44px -30px rgba(0, 0, 0, 0.65);
}

.cta-kicker {
  font-family: var(--brand-font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
}

.cta-title {
  font-family: var(--brand-font-display);
  font-size: 2rem;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.96);
}

.cta-subtitle {
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
}

.cta-card__actions {
  display: grid;
  gap: 0.75rem;
  justify-items: stretch;
  position: relative;
  z-index: 1;
}

.cta-card__content {
  position: relative;
  z-index: 1;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 0.95rem 1.15rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.88);
  font-family: var(--brand-font-mono);
  letter-spacing: 0.08em;
  font-size: 0.82rem;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.04);
  transition: color var(--brand-transition-base),
    border-color var(--brand-transition-base),
    background var(--brand-transition-base),
    box-shadow var(--brand-transition-base);

  &:hover {
    border-color: rgba(255, 255, 255, 0.32);
    color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 -2px 0 rgba(212, 175, 55, 0.55);
  }

  &:focus-visible {
    outline: 2px solid rgba(212, 175, 55, 0.85);
    outline-offset: 3px;
  }
}

.cta-btn--primary {
  border-color: rgba(212, 175, 55, 0.9);
  background: var(--brand-gradient-gold);
  color: var(--brand-midnight);
  font-weight: 700;

  &:hover {
    border-color: rgba(255, 255, 255, 0.55);
    filter: brightness(1.02);
    box-shadow: inset 0 -2px 0 rgba(30, 41, 59, 0.25);
  }
}

@media screen and (max-width: 960px) {
  .focus-grid,
  .now-grid {
    grid-template-columns: 1fr;
  }

  .section-header--split {
    flex-direction: column;
    align-items: flex-start;

    .now-chips {
      justify-content: flex-start;
    }
  }

  .cta-card {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 2.25rem 2rem 2rem;
  }
}

@media screen and (max-width: 540px) {
  .cta-card {
    padding: 2rem 1.5rem 1.5rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }
}

@media (hover: none) and (pointer: coarse) {
  .cta-card:hover {
    box-shadow: 0 14px 36px -28px rgba(0, 0, 0, 0.6);
  }

  .cta-btn:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-card,
  .cta-btn {
    transition: none;
  }

  .cta-card:hover,
  .cta-btn:hover {
    transform: none;
  }
}
</style>

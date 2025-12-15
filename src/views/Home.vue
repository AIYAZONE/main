<template>
  <div class="home-editorial">
    <!-- Brand Hero Section -->
    <BrandHero
      :title="brandInfo?.name || content.hero.title"
      :subtitle="brandInfo?.subtitle || content.hero.subtitle"
      :intro="brandInfo?.intro || content.hero.intro"
      :profile-image="brandInfo?.profileImage"
      :certifications="certifications"
      :value-proposition="brandInfo?.valueProposition || []"
    />

    <!-- Portfolio Section -->
    <section class="portfolio-section">
      <div class="middle-box">
        <div class="section-header">
          <h2 class="section-title">{{ $t('portfolio.title') }}</h2>
          <p class="section-description">{{ content.portfolioDescription }}</p>
        </div>
        <PortfolioGrid 
          :show-controls="false"
          @project-click="handleProjectClick"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useLangStore } from '../store/lang';
import { useBrandStore } from '../stores/brandStore';
import BrandHero from '../components/brand/BrandHero.vue';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.vue';
import type { Project } from '../types/portfolio';

const contentData = {
  zh: {
    hero: {
      title: "AIYAZONE",
      subtitle: "前端开发工程师 & 项目管理探索者",
      intro: "打造个人品牌，追求工程卓越，探索产品思维。<br>在数字花园中沉淀价值。",
    },
    portfolioDescription: "展示我的技术项目和开源贡献，涵盖数字花园、精选作品和社区项目三大类别。",
    projects: [
      {
        title: "数字花园",
        list: [
          {
            name: "博客",
            info: { title: "Blog", description: "记录灵感、技术积累与个人成长。" },
            href: "https://blog.aiyazone.com/",
            target: "_blank"
          },
          {
            name: "前端",
            info: { title: "Engineering", description: "前端技术栈全景图：性能优化、工程化与算法。" },
            href: "https://fe.aiyazone.com/",
            target: "_blank"
          },
          {
            name: "项目管理",
            info: { title: "PM", description: "PM知识体系构建，思维导图与实战经验。" },
            href: "https://pm.aiyazone.com/",
            target: "_blank"
          },
        ],
      },
      {
        title: "精选作品",
        list: [
          {
            name: "ZenParticles",
            info: { title: "Web AI", description: "使用 Gemini 生成的手势控制 3D 粒子系统。" },
            href: "https://zepa.aiyazone.com/",
            target: "_blank"
          },
          {
            name: "Sun Travel",
            info: { title: "Web App", description: "沉浸式旅游体验平台。" },
            href: "https://travel.aiyazone.com/",
            target: "_blank"
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
            target: "_blank"
          },
        ],
      },
    ]
  },
  en: {
    hero: {
      title: "AIYAZONE",
      subtitle: "Frontend Developer & Project Manager",
      intro: "Crafting digital experiences with precision and purpose. <br>Focusing on personal branding, engineering excellence, and product thinking.",
    },
    portfolioDescription: "Showcasing my technical projects and open source contributions across three categories: Digital Garden, Featured Work, and Community Projects.",
    projects: [
      {
        title: "Digital Garden",
        list: [
          {
            name: "Blog",
            info: { title: "Blog", description: "Recording inspiration, tech accumulation, and personal growth." },
            href: "https://blog.aiyazone.com/",
            target: "_blank"
          },
          {
            name: "Frontend",
            info: { title: "Engineering", description: "Frontend tech stack panorama: Performance, Engineering & Algorithms." },
            href: "https://fe.aiyazone.com/",
            target: "_blank"
          },
          {
            name: "Management",
            info: { title: "PM", description: "PM knowledge system, mind maps, and practical experience." },
            href: "https://pm.aiyazone.com/",
            target: "_blank"
          },
        ],
      },
      {
        title: "Selected Works",
        list: [
          {
            name: "ZenParticles",
            info: { title: "Web AI", description: "A real-time interactive 3D particle system controlled by hand gestures." },
            href: "https://zepa.aiyazone.com/",
            target: "_blank"
          },
          {
            name: "Sun Travel",
            info: { title: "Web App", description: "Immersive travel experience platform." },
            href: "https://travel.aiyazone.com/",
            target: "_blank"
          },
        ],
      },
      {
        title: "Community",
        list: [
          {
            name: "GitHub",
            info: { title: "Open Source", description: "Check out my open source projects and contributions." },
            href: "https://github.com/AIYAZONE/",
            target: "_blank"
          },
        ],
      },
    ]
  }
};

export default defineComponent({
  name: "Home",
  components: {
    BrandHero,
    PortfolioGrid
  },
  setup() {
    const langStore = useLangStore();
    const brandStore = useBrandStore();
    const content = computed(() => contentData[langStore.language]);
    
    // Methods
    const handleProjectClick = (project: Project) => {
      // Handle project click - could navigate to project detail page or open external link
      if (project.url) {
        window.open(project.url, '_blank');
      }
    };

    // Load brand data on component mount
    onMounted(() => {
      brandStore.loadBrandInfo();
    });
    
    return {
      content,
      brandInfo: brandStore.brandInfo,
      certifications: brandStore.certifications,
      isLoading: brandStore.isLoading,
      error: brandStore.error,
      handleProjectClick
    };
  },
});
</script>

<style lang="less" scoped>
.home-editorial {
  padding-bottom: 8rem;
  background-color: #F8F9FB; /* Cooler, lighter background */
}

/* Portfolio section */
.portfolio-section {
  padding: 4rem 0;
  background: white;
  
  .middle-box {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 1rem;
    }
    
    .section-description {
      font-size: 1.125rem;
      color: #6B7280;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }
}

@media screen and (max-width: 768px) {
  .portfolio-section .middle-box {
    padding: 0 1rem;
  }
}
</style>

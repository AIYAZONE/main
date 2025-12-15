<template>
  <div class="about-view">
    <!-- 品牌英雄区域 -->
    <section class="hero-section">
      <BrandHero 
        :title="brandInfo.title"
        :subtitle="brandInfo.subtitle"
        :intro="brandInfo.intro"
        :profile-image="brandInfo.profileImage"
        :certifications="certifications"
        :value-proposition="brandInfo.valueProposition"
      />
    </section>

    <!-- 品牌故事 -->
    <section class="story-section">
      <div class="container">
        <BrandStory 
          :story="storyData.story"
          :timeline="storyData.timeline"
          :philosophy="storyData.philosophy"
        />
      </div>
    </section>

    <!-- 技能展示 -->
    <section class="skills-section">
      <div class="container">
        <SkillShowcase />
      </div>
    </section>

    <!-- 认证展示 -->
    <section class="certifications-section">
      <div class="container">
        <CertificationDisplay :certifications="certifications" />
      </div>
    </section>

    <!-- 职业时间线 -->
    <section class="timeline-section">
      <div class="container">
        <ExperienceTimeline :experience-items="experienceItems" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBrandStore } from '../stores/brandStore';
import { useSkillStore } from '../stores/skillStore';
import BrandHero from '../components/brand/BrandHero.vue';
import BrandStory from '../components/brand/BrandStory.vue';
import SkillShowcase from '../components/skills/SkillShowcase.vue';
import CertificationDisplay from '../components/brand/CertificationDisplay.vue';
import ExperienceTimeline from '../components/skills/ExperienceTimeline.vue';

const { t } = useI18n();
const brandStore = useBrandStore();
const skillStore = useSkillStore();

// 品牌信息
const brandInfo = computed(() => ({
  title: 'AIYAZONE',
  subtitle: t('brand.subtitle'),
  intro: t('brand.intro'),
  profileImage: '/assets/images/profile.jpg',
  valueProposition: [
    t('brand.valueProposition.architecture'),
    t('brand.valueProposition.performance'),
    t('brand.valueProposition.engineering'),
    t('brand.valueProposition.management')
  ]
}));

// 认证信息
const certifications = computed(() => brandStore.certifications || []);

// 故事数据
const storyData = computed(() => ({
  story: [
    {
      id: '1',
      title: t('brandStory.journey.title'),
      content: t('brandStory.journey.content'),
      image: '/assets/images/journey.jpg',
      order: 1
    }
  ],
  timeline: [
    {
      id: '1',
      date: new Date('2014-01-01'),
      title: t('brandStory.timeline.start'),
      description: t('brandStory.timeline.startDesc'),
      type: 'milestone' as const
    }
  ],
  philosophy: [
    t('brandStory.philosophy.technical'),
    t('brandStory.philosophy.management'),
    t('brandStory.philosophy.growth')
  ]
}));

// 经验数据
const experienceItems = computed(() => skillStore.experienceItems || []);

onMounted(() => {
  // 设置页面标题
  document.title = `${t('nav.about')} - AIYAZONE`;
  
  // 加载数据
  brandStore.loadBrandInfo();
  skillStore.loadSkillsData();
});
</script>

<style scoped lang="less">
.about-view {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: 2rem 0;
}

.story-section,
.skills-section,
.certifications-section,
.timeline-section {
  padding: 4rem 0;

  &:nth-child(even) {
    background: var(--bg-secondary);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// 移动端适配
@media screen and (max-width: 767px) {
  .story-section,
  .skills-section,
  .certifications-section,
  .timeline-section {
    padding: 2rem 0;
  }
}

// 页面加载动画
.about-view {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .about-view {
    animation: none;
  }
}
</style>
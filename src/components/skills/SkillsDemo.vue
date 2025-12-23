<template>
  <div class="skills-demo">
    <h2>{{ t('skills.demo.title') }}</h2>
    
    <!-- Skills Showcase Component -->
    <section class="demo-section">
      <SkillShowcase 
        :skills="skillCategories"
        :certifications="certifications"
        :experience="experienceItems"
      />
    </section>

    <!-- Skills Radar Component -->
    <section class="demo-section">
      <SkillRadar 
        :categories="skillCategories"
        :max-level="10"
        :title="t('skills.radar.title')"
        :size="450"
      />
    </section>

    <!-- Experience Timeline Component -->
    <section class="demo-section">
      <ExperienceTimeline 
        :experience-items="experienceItems"
        :title="t('skills.experience.title')"
        :highlight-current="true"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSkillStore } from '../../stores/skillStore';
import { useBrandStore } from '../../stores/brandStore';
import SkillShowcase from './SkillShowcase.vue';
import SkillRadar from './SkillRadar.vue';
import ExperienceTimeline from './ExperienceTimeline.vue';

const { t } = useI18n();

// Stores
const skillStore = useSkillStore();
const brandStore = useBrandStore();

// Reactive data
const skillCategories = ref(skillStore.skillCategories);
const experienceItems = ref(skillStore.experienceItems);
const certifications = ref(brandStore.certifications);

// Load data on mount
onMounted(async () => {
  await Promise.all([
    skillStore.loadSkillsData(),
    brandStore.loadBrandInfo()
  ]);
  
  // Update reactive refs
  skillCategories.value = skillStore.skillCategories;
  experienceItems.value = skillStore.experienceItems;
  certifications.value = brandStore.certifications;
});
</script>

<style scoped lang="less">
.skills-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-section {
  margin-bottom: 4rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

h2 {
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 700;
}
</style>
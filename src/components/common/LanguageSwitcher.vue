<template>
  <div class="language-switcher">
    <button
      v-for="locale in localeConfig"
      :key="locale.code"
      @click="switchToLocale(locale.code)"
      :class="['locale-btn', { active: currentLocale === locale.code }]"
      :aria-label="`Switch to ${locale.name}`"
    >
      <span class="flag">{{ locale.flag }}</span>
      <span class="name">{{ locale.name }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../../stores/uiStore';
import { localeConfig } from '../../i18n';
import type { Locale } from '../../types/common';

const uiStore = useUIStore();

const currentLocale = computed(() => uiStore.currentLocale);

const switchToLocale = (locale: Locale) => {
  uiStore.setLocale(locale);
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.locale-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.locale-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.locale-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.flag {
  font-size: 1rem;
}

.name {
  font-weight: 500;
}
</style>
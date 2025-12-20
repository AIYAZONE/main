<template>
  <div class="language-switcher">
    <button
      v-for="locale in localeConfig"
      :key="locale.code"
      @click="switchToLocale(locale.code)"
      :class="['locale-btn', { active: currentLocale === locale.code }]"
      :aria-label="`Switch to ${locale.name}`"
    >
      <span class="name">{{ getLocaleLabel(locale.code) }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'LanguageSwitcher' });
</script>

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

const getLocaleLabel = (locale: Locale) => {
  if (locale === 'zh') return '中文';
  return 'EN';
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0;
  padding: 0.25rem;
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.locale-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.75rem;
  min-width: 56px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  font-family: var(--brand-font-mono);
  color: var(--brand-text-secondary);
}

.locale-btn:hover {
  background: rgba(0, 0, 0, 0.03);
  color: var(--brand-midnight);
}

.locale-btn.active {
  background: rgba(0, 0, 0, 0.05);
  color: var(--brand-midnight);
}

.name {
  font-weight: 500;
}
</style>

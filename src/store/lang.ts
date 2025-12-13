import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLangStore = defineStore('lang', () => {
  const language = ref<'zh' | 'en'>('zh');

  const toggleLang = () => {
    language.value = language.value === 'zh' ? 'en' : 'zh';
  };

  return {
    language,
    toggleLang,
  };
});

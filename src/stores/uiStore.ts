import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';
import type { Locale } from '../types/common';
import { switchLanguage, getCurrentLocale } from '../i18n';

export const useUIStore = defineStore('ui', () => {
  // State
  const currentLocale = ref<Locale>(getCurrentLocale());
  const isMobileMenuOpen = ref(false);
  const isLoading = ref(false);
  const notifications = ref<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>>([]);

  // Actions
  const setLocale = (locale: Locale) => {
    currentLocale.value = locale;
    switchLanguage(locale);
  };

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
  };

  const setGlobalLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const addNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 5000
  ) => {
    const id = Date.now().toString();
    notifications.value.push({
      id,
      type,
      message,
      duration
    });

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAllNotifications = () => {
    notifications.value = [];
  };

  // Convenience methods for different notification types
  const showSuccess = (message: string, duration?: number) => {
    return addNotification('success', message, duration);
  };

  const showError = (message: string, duration?: number) => {
    return addNotification('error', message, duration);
  };

  const showWarning = (message: string, duration?: number) => {
    return addNotification('warning', message, duration);
  };

  const showInfo = (message: string, duration?: number) => {
    return addNotification('info', message, duration);
  };

  return {
    // State (readonly)
    currentLocale: readonly(currentLocale),
    isMobileMenuOpen: readonly(isMobileMenuOpen),
    isLoading: readonly(isLoading),
    notifications: readonly(notifications),
    
    // Actions
    setLocale,
    toggleMobileMenu,
    closeMobileMenu,
    setGlobalLoading,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
});
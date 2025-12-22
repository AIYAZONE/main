<template>
  <div class="contact-view">
    <div class="contact-hero">
      <div class="middle-box">
        <div class="hero-title" role="heading" aria-level="1">
          <div class="hero-line">{{ t('contact.hero.getIn') }}</div>
          <div class="hero-line hero-line--accent">{{ t('contact.hero.touch') }}</div>
        </div>
        <div class="hero-subtitle">{{ t("contact.subtitle") }}</div>
      </div>
    </div>
    <div class="contact-content">
      <div class="middle-box">
        <div class="panel panel--primary">
          <div class="panel-kicker">{{ t("contact.title") }}</div>
          <div class="contact-details-list">
            <div class="contact-detail">
              <div class="contact-detail-label">
                {{ t("contact.email", "邮箱") }}
              </div>
              <div class="contact-detail-value">aiyazone@163.com</div>
            </div>
            <div class="contact-detail">
              <div class="contact-detail-label">GitHub</div>
              <div class="contact-detail-value">github.com/AIYAZONE</div>
            </div>
            <div class="contact-detail">
              <div class="contact-detail-label">
                {{ $t("contact.wechat", "微信") }}
              </div>
              <div class="contact-detail-value">AIYAZONE2045</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

onMounted(() => {
  document.title = `${t("contact.title")} - AIYAZONE`;
});
</script>

<style scoped lang="less">
.contact-view {
  min-height: 100vh;
}

.contact-hero {
  padding: var(--brand-space-huge) 0 var(--brand-space-xl);
}

.hero-title {
  font-size: clamp(4rem, 8vw, 8rem);
  line-height: 0.9;
  margin-bottom: 2rem;
}

.hero-line {
  display: block;
}

.hero-line--accent {
  font-family: var(--brand-font-display);
  font-style: italic;
  background: var(--brand-gradient-gold);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--brand-text-secondary);
  max-width: 520px;
  line-height: 1.6;
}

.contact-content {
  padding-bottom: var(--brand-space-huge);
}

.panel {
  position: relative;
  background: var(--brand-canvas-day);
  border: 1px solid var(--brand-border);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: var(--brand-shadow-card);
  overflow: hidden;
  transition: transform var(--brand-transition-base),
    box-shadow var(--brand-transition-base), border-color var(--brand-transition-base);
}

.panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--brand-gradient-gold);
  opacity: 0.9;
}

.panel-kicker {
  font-family: var(--brand-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-text-tertiary);
  margin-bottom: 1rem;
}

.contact-details-list {
  display: grid;
  gap: 1rem;
}

.contact-detail {
  position: relative;
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 1.25rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid var(--brand-border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: transform var(--brand-transition-base),
    box-shadow var(--brand-transition-base), border-color var(--brand-transition-base),
    background var(--brand-transition-base);
  overflow: hidden;
}

.contact-detail::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--brand-gradient-gold);
  opacity: 0.75;
}

.contact-detail:hover {
  transform: translateY(-4px);
  border-color: var(--brand-border-hover);
  box-shadow: var(--brand-shadow-float);
  background: rgba(255, 255, 255, 0.75);
}

.contact-detail-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  font-family: var(--brand-font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-text-tertiary);
  line-height: 1.6;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.02);
}

.contact-detail-value {
  font-family: var(--brand-font-mono);
  font-size: 1rem;
  color: var(--brand-text-primary);
  line-height: 1.6;
  word-break: break-word;
  letter-spacing: 0.01em;
}

@media screen and (max-width: 1024px) {
  .panel {
    padding: 2rem;
  }

  .contact-detail {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}

@media screen and (max-width: 768px) {
  .panel {
    border-radius: 10px;
    padding: 1.5rem;
  }

  .contact-detail {
    border-radius: 10px;
    padding: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel,
  .contact-detail {
    transition: none;
  }

  .contact-detail:hover {
    transform: none;
  }
}
</style>

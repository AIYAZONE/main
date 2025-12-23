<template>
  <div class="home-editorial">
    <BrandHero
      :title="t('brand.name')"
      :subtitle="t('brand.subtitle')"
      :intro="t('brand.intro', { experience: brandInfo?.experience || 10 })"
      :profile-image="brandInfo?.profileImage"
      :certifications="certifications"
      :value-proposition="heroValueProposition || []"
    />

    <section class="home-section home-section--focus">
      <div class="middle-box">
        <div class="section-header">
          <h2 class="section-title">{{ t("home.focus.title") }}</h2>
          <p class="section-description">{{ t("home.focus.subtitle") }}</p>
        </div>

        <div class="focus-grid">
          <div v-for="item in focusItems" :key="item.title" class="focus-card">
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
            <h2 class="section-title">{{ t("home.now.title") }}</h2>
            <p class="section-description">{{ t("home.now.subtitle") }}</p>
          </div>
          <div class="section-header__right">
            <div class="now-chips">
              <span v-for="chip in nowChips" :key="chip" class="now-chip">{{
                chip
              }}</span>
            </div>
          </div>
        </div>

        <div class="now-grid">
          <div v-for="item in nowItems" :key="item.title" class="now-item">
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
            <div class="cta-kicker">{{ t("home.cta.kicker") }}</div>
            <div class="cta-title">{{ t("home.cta.title") }}</div>
            <div class="cta-subtitle">{{ t("home.cta.subtitle") }}</div>
          </div>
          <div class="cta-card__actions">
            <router-link to="/portfolio" class="cta-btn cta-btn--primary">{{
              t("home.cta.actions.portfolio")
            }}</router-link>
            <router-link to="/career" class="cta-btn">{{
              t("home.cta.actions.career")
            }}</router-link>
            <router-link to="/contact" class="cta-btn">{{
              t("home.cta.actions.contact")
            }}</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBrandStore } from "../stores/brandStore";
import BrandHero from "../components/brand/BrandHero.vue";

const { t, tm } = useI18n();
const brandStore = useBrandStore();

const brandInfo = computed(() => brandStore.brandInfo);
const certifications = computed(() => brandStore.certifications);

const heroValueProposition = computed(() => tm('brand.valueProposition') as string[]);

const focusItems = computed(() => [
  {
    icon: "🏗️",
    title: t("home.focus.items.architecture.title"),
    description: t("home.focus.items.architecture.description"),
    tags: tm("home.focus.items.architecture.tags") as string[],
  },
  {
    icon: "⚡️",
    title: t("home.focus.items.performance.title"),
    description: t("home.focus.items.performance.description"),
    tags: tm("home.focus.items.performance.tags") as string[],
  },
  {
    icon: "🧭",
    title: t("home.focus.items.delivery.title"),
    description: t("home.focus.items.delivery.description"),
    tags: tm("home.focus.items.delivery.tags") as string[],
  },
]);

const nowChips = computed(() => tm("home.now.chips") as string[]);

const nowItems = computed(() => [
  {
    kicker: t("home.now.items.brandSystem.kicker"),
    title: t("home.now.items.brandSystem.title"),
    description: t("home.now.items.brandSystem.description"),
  },
  {
    kicker: t("home.now.items.engineering.kicker"),
    title: t("home.now.items.engineering.title"),
    description: t("home.now.items.engineering.description"),
  },
  {
    kicker: t("home.now.items.learning.kicker"),
    title: t("home.now.items.learning.title"),
    description: t("home.now.items.learning.description"),
  },
]);

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
    border-color var(--brand-transition-base), background var(--brand-transition-base),
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

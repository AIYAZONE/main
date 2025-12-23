<template>
  <section class="brand-hero">
    <div class="middle-box">
      <div class="hero-grid">
        <!-- Left: Text Content -->
        <div class="hero-text-column">
          <div class="hero-meta">
            <span class="meta-label">{{ $t('brand.metaLabel') }}</span>
            <div class="meta-line"></div>
          </div>

          <h1 class="hero-title">
            <span class="title-line">{{ title }}</span>
          </h1>

          <p class="hero-subtitle">{{ subtitle }}</p>

          <div class="hero-intro" v-html="intro"></div>

          <!-- Value Proposition -->
          <div
            class="value-proposition"
            v-if="valueProposition && valueProposition.length > 0"
          >
            <div class="value-tags">
              <span
                v-for="(value, index) in valueProposition"
                :key="index"
                class="value-tag"
              >
                {{ value }}
              </span>
            </div>
          </div>

          <!-- Certifications -->
          <div
            class="certifications-preview"
            v-if="certifications && certifications.length > 0"
          >
            <div class="cert-badges">
              <span
                v-for="cert in certifications"
                :key="cert.id"
                class="cert-badge"
                :title="cert.name"
              >
                {{ getCertificationAbbr(cert.name) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="hero-visual-column">
          <div class="image-container">
            <img
              v-if="profileImage"
              :src="profileImage"
              :alt="title"
              class="hero-image"
            />
            <div class="image-overlay"></div>
          </div>

          <!-- Rotating Badge -->
          <div class="rotating-badge">
            <svg viewBox="0 0 100 100" width="120" height="120">
              <defs>
                <path
                  id="circle"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text font-size="11">
                <textPath xlink:href="#circle">
                  AIYAZONE • EST. 2025 • PREMIUM DESIGN •
                </textPath>
              </text>
            </svg>
            <div class="badge-center">A</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background Decor -->
    <div class="hero-glow"></div>
  </section>
</template><script setup lang="ts">
import { defineComponent } from "vue";
import type { Certification } from "../../types/brand";

defineOptions({
  name: "BrandHero"
});

interface Props {title: string;
  subtitle: string;
  intro: string;
  profileImage?: string;
  certifications?: readonly Certification[];
  valueProposition?: readonly string[];
}

const props = withDefaults(defineProps<Props>(), {
  profileImage: "",
  certifications: () => [],
  valueProposition: () => [],
});

const getCertificationAbbr = (certName: string): string => {
  if (certName.includes("PMP")) return "PMP";
  if (certName.includes("ACP")) return "ACP";
  if (certName.includes("CSM")) return "CSM";
  if (certName.includes("PSM")) return "PSM";

  return certName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 3);
};
</script>

<style lang="less" scoped>
.brand-hero {
  position: relative;
  padding: var(--brand-space-huge) 0 var(--brand-space-xl);
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  align-items: center;

  .hero-grid {
    display: grid;
    grid-template-columns: 7fr 5fr;
    gap: var(--brand-space-lg);
    align-items: center;
    position: relative;
    z-index: 2;
  }

  /* Left Column */
  .hero-text-column {
    display: flex;
    flex-direction: column;
    gap: var(--brand-space-md);

    .hero-meta {
      display: flex;
      align-items: center;
      gap: 1rem;

      .meta-label {
        font-family: var(--brand-font-mono);
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--brand-text-tertiary);
      }

      .meta-line {
        height: 1px;
        width: 40px;
        background: var(--brand-gold-start);
      }
    }

    .hero-title {
      font-family: var(--brand-font-display);
      font-size: clamp(3.5rem, 5vw + 1rem, 6rem);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.03em;
      color: var(--brand-midnight);

      .title-line {
        display: block;
        background: linear-gradient(135deg, var(--brand-midnight) 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .hero-subtitle {
      font-family: var(--brand-font-body);
      font-size: 1.5rem;
      font-weight: 300;
      color: var(--brand-text-secondary);
      max-width: 90%;
    }

    .hero-intro {
      font-family: var(--brand-font-body);
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--brand-text-secondary);
      max-width: 85%;
      border-left: 2px solid var(--brand-gold-start);
      padding-left: 1.5rem;
    }

    .value-proposition {
      margin-top: 1rem;

      .value-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;

        .value-tag {
          font-family: var(--brand-font-mono);
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--brand-border-hover);
          border-radius: 4px;
          color: var(--brand-text-secondary);
          transition: all 0.3s ease;

          &:hover {
            border-color: var(--brand-electric);
            color: var(--brand-electric);
            transform: translateY(-2px);
          }
        }
      }
    }

    .certifications-preview {
      .cert-badges {
        display: flex;
        gap: 1rem;

        .cert-badge {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--brand-midnight);
          color: var(--brand-gold-start);
          font-family: var(--brand-font-mono);
          font-size: 0.7rem;
          border-radius: 50%;
          border: 1px solid var(--brand-gold-start);
          transition: all 0.3s var(--brand-ease-bouncy);

          &:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
          }
        }
      }
    }
  }

  /* Right Column */
  .hero-visual-column {
    position: relative;
    height: 100%;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;

    .image-container {
      position: relative;
      width: 100%;
      max-width: 400px;
      aspect-ratio: 3/4;
      border-radius: 2px; /* Slight roundness */
      overflow: hidden;

      .hero-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(20%);
        transition: all 0.6s var(--brand-ease-premium);
      }

      &:hover .hero-image {
        filter: grayscale(0%);
        transform: scale(1.05);
      }
    }

    .rotating-badge {
      position: absolute;
      top: 10%;
      right: 0;
      animation: rotate 20s linear infinite;

      svg {
        fill: var(--brand-midnight);
        letter-spacing: 0.2em;
        font-family: var(--brand-font-mono);
        font-weight: 700;
        text-transform: uppercase;
      }

      .badge-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: var(--brand-font-display);
        font-size: 2rem;
        color: var(--brand-electric);
      }
    }
  }

  /* Background Glow */
  .hero-glow {
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 60vw;
    height: 60vw;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .brand-hero .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;

    .hero-text-column {
      align-items: center;

      .hero-intro {
        border-left: none;
        padding-left: 0;
        text-align: center;
      }

      .value-tags,
      .cert-badges {
        justify-content: center;
      }
    }

    .hero-visual-column {
      min-height: 400px;
      order: -1; /* Image on top on mobile */

      .rotating-badge {
        right: 10%;
      }
    }
  }
}
</style>

<template>
  <footer class="brand-footer">
    <!-- Huge Background Text -->
    <div class="big-text-bg" aria-hidden="true">{{ t('brand.title') }}</div>

    <div class="middle-box">
      <div class="footer-content">
        <div class="footer-left">
          <p class="copyright">&copy; {{ year }} {{ t('brand.title') }}. {{ t('footer.allRightsReserved') }}</p>
        </div>

        <div class="footer-right">
          <div class="social-links">
            <a href="https://github.com/brucewang" target="_blank" rel="noopener">{{ t('footer.github') }}</a>
            <a href="mailto:hello@aiyazone.cn">{{ t('footer.email') }}</a>
          </div>
          
          <div class="legal-links">
            <a :href="siteLink" class="site-link">{{ t('brand.title') }}</a>
            <span class="sep">/</span>
            <a :href="beianLink" target="_blank" rel="nofollow">{{ icpInfo }}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

defineComponent({
  name: "Footer",
});

const { t } = useI18n();
const year = computed(() => new Date().getFullYear());
const siteLink = ref("");
const icpInfo = computed(() => {
  if (siteLink.value.indexOf("aiyazone.cn") > 0) {
    return t('footer.icp.aiyazone');
  }
  return t('footer.icp.default');
});
const beianLink = "https://beian.miit.gov.cn/";

onMounted(() => {
  siteLink.value = location.origin + "/";
});
</script>

<style lang="less" scoped>
.brand-footer {
  position: relative;
  padding: 8rem 0 4rem;
  background-color: var(--brand-canvas-day);
  overflow: hidden;
  margin-top: 4rem;

  .big-text-bg {
    position: absolute;
    bottom: -2vw;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--brand-font-display);
    font-size: 15vw;
    font-weight: 700;
    line-height: 1;
    color: var(--brand-midnight);
    opacity: 0.03;
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  .middle-box {
    position: relative;
    z-index: 1;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 2rem;
    border-top: 1px solid var(--brand-border);

    .footer-left {
      .copyright {
        font-family: var(--brand-font-mono);
        font-size: 0.75rem;
        color: var(--brand-text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1rem;

      .social-links {
        display: flex;
        gap: 2rem;

        a {
          font-family: var(--brand-font-body);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--brand-text-secondary);
          text-decoration: none;
          position: relative;
          transition: color 0.3s ease;

          &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background-color: var(--brand-electric);
            transition: width 0.3s ease;
          }

          &:hover {
            color: var(--brand-midnight);
            &::after {
              width: 100%;
            }
          }
        }
      }

      .legal-links {
        font-family: var(--brand-font-mono);
        font-size: 0.7rem;
        color: var(--brand-text-tertiary);

        a {
          color: var(--brand-text-tertiary);
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: var(--brand-text-secondary);
          }
        }

        .sep {
          margin: 0 0.5rem;
          opacity: 0.5;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .brand-footer {
    padding: 4rem 0 2rem;
    
    .footer-content {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      text-align: center;
      
      .footer-right {
        align-items: center;
      }
    }
    
    .big-text-bg {
      font-size: 20vw;
      bottom: 10%;
    }
  }
}
</style>

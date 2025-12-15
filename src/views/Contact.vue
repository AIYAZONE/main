<template>
  <div class="contact-view">
    <!-- 页面头部 -->
    <section class="contact-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">{{ $t('contact.title') }}</h1>
          <p class="page-subtitle">{{ $t('contact.subtitle') }}</p>
        </div>
      </div>
    </section>

    <!-- 联系内容 -->
    <section class="contact-content">
      <div class="container">
        <div class="contact-grid">
          <!-- 联系表单 -->
          <div class="contact-form-section">
            <div class="section-header">
              <h2 class="section-title">{{ $t('contact.form.title') }}</h2>
              <p class="section-description">{{ $t('contact.form.description') }}</p>
            </div>
            <ContactForm />
          </div>

          <!-- 联系信息 -->
          <div class="contact-info-section">
            <div class="section-header">
              <h2 class="section-title">{{ $t('contact.info.title') }}</h2>
              <p class="section-description">{{ $t('contact.info.description') }}</p>
            </div>

            <!-- 联系方式 -->
            <div class="contact-methods">
              <div class="contact-method">
                <div class="method-icon">📧</div>
                <div class="method-content">
                  <h3 class="method-title">{{ $t('contact.email') }}</h3>
                  <a href="mailto:contact@aiyazone.com" class="method-link">
                    contact@aiyazone.com
                  </a>
                  <p class="method-description">{{ $t('contact.emailDescription') }}</p>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">💼</div>
                <div class="method-content">
                  <h3 class="method-title">LinkedIn</h3>
                  <a 
                    href="https://linkedin.com/in/aiyazone" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="method-link"
                  >
                    linkedin.com/in/aiyazone
                  </a>
                  <p class="method-description">{{ $t('contact.linkedinDescription') }}</p>
                </div>
              </div>

              <div class="contact-method">
                <div class="method-icon">💬</div>
                <div class="method-content">
                  <h3 class="method-title">{{ $t('contact.wechat') }}</h3>
                  <span class="method-link">AIYAZONE2024</span>
                  <p class="method-description">{{ $t('contact.wechatDescription') }}</p>
                </div>
              </div>
            </div>

            <!-- 社交媒体 -->
            <div class="social-section">
              <h3 class="social-title">{{ $t('contact.social.title') }}</h3>
              <SocialIntegration />
            </div>

            <!-- 响应时间承诺 -->
            <div class="response-info">
              <div class="info-card">
                <div class="info-icon">⏰</div>
                <div class="info-content">
                  <h4 class="info-title">{{ $t('contact.responseTime.title') }}</h4>
                  <p class="info-description">{{ $t('contact.responseTime.description') }}</p>
                </div>
              </div>

              <div class="info-card">
                <div class="info-icon">🎯</div>
                <div class="info-content">
                  <h4 class="info-title">{{ $t('contact.preferredContact.title') }}</h4>
                  <p class="info-description">{{ $t('contact.preferredContact.description') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ContactForm from '../components/contact/ContactForm.vue';
import SocialIntegration from '../components/social/SocialIntegration.vue';

const { t } = useI18n();

onMounted(() => {
  // 设置页面标题
  document.title = `${t('contact.title')} - AIYAZONE`;
});
</script>

<style scoped lang="less">
.contact-view {
  min-height: 100vh;
  background: var(--bg-primary);
}

.contact-header {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .header-content {
    max-width: 600px;
    margin: 0 auto;

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .page-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      line-height: 1.6;
      margin: 0;
    }
  }
}

.contact-content {
  padding: 4rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .section-header {
    margin-bottom: 2rem;

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .section-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }
  }
}

.contact-info-section {
  .contact-methods {
    margin-bottom: 3rem;

    .contact-method {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--bg-secondary);
      border-radius: 12px;
      margin-bottom: 1rem;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--brand-shadow-md);
      }

      .method-icon {
        font-size: 2rem;
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 8px;
      }

      .method-content {
        flex: 1;

        .method-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.25rem 0;
        }

        .method-link {
          color: var(--brand-primary);
          text-decoration: none;
          font-weight: 500;
          display: block;
          margin-bottom: 0.5rem;

          &:hover {
            text-decoration: underline;
          }
        }

        .method-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }
      }
    }
  }

  .social-section {
    margin-bottom: 3rem;

    .social-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }
  }

  .response-info {
    .info-card {
      display: flex;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--bg-secondary);
      border-radius: 8px;
      border-left: 4px solid var(--brand-primary);
      margin-bottom: 1rem;

      .info-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .info-content {
        .info-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.25rem 0;
        }

        .info-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 991px) {
  .contact-content {
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
}

@media screen and (max-width: 767px) {
  .contact-header {
    padding: 2rem 0;

    .header-content {
      .page-title {
        font-size: 2rem;
      }

      .page-subtitle {
        font-size: 1rem;
      }
    }
  }

  .contact-content {
    padding: 2rem 0;

    .contact-grid {
      gap: 2rem;
    }

    .section-header {
      margin-bottom: 1.5rem;

      .section-title {
        font-size: 1.25rem;
      }
    }
  }

  .contact-info-section {
    .contact-methods {
      .contact-method {
        padding: 1rem;
        flex-direction: column;
        text-align: center;

        .method-icon {
          align-self: center;
        }
      }
    }
  }
}

// 页面加载动画
.contact-view {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .contact-view {
    animation: none;
  }

  .contact-method:hover {
    transform: none;
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .contact-info-section {
    .info-card {
      border-left-width: 6px;
    }
  }
}
</style>
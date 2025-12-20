<template>
  <div class="contact-view">
    <!-- Editorial Header -->
    <header class="contact-header">
      <div class="middle-box">
        <h1 class="page-title">
          <span class="block">GET IN</span>
          <span class="block italic text-gradient-gold">TOUCH</span>
        </h1>
        <p class="page-subtitle">{{ $t('contact.subtitle') }}</p>
      </div>
    </header>

    <!-- Content Grid -->
    <section class="contact-content">
      <div class="middle-box">
        <div class="contact-grid">
          <!-- Left: Contact Methods -->
          <div class="contact-methods">
            <div class="method-card">
              <span class="method-label">EMAIL</span>
              <a href="mailto:contact@aiyazone.com" class="method-value">contact@aiyazone.com</a>
            </div>
            
            <div class="method-card">
              <span class="method-label">SOCIAL</span>
              <div class="social-links">
                <a href="https://github.com/AIYAZONE" target="_blank" class="social-link">GitHub</a>
                <a href="https://linkedin.com/in/aiyazone" target="_blank" class="social-link">LinkedIn</a>
                <span class="social-link" title="AIYAZONE2024">WeChat</span>
              </div>
            </div>

            <div class="method-card">
              <span class="method-label">AVAILABILITY</span>
              <p class="method-text">{{ $t('contact.responseTime.description') }}</p>
            </div>
          </div>

          <!-- Right: Contact Form -->
          <div class="contact-form-wrapper">
            <div class="form-header">
              <h2 class="form-title">{{ $t('contact.form.title') }}</h2>
            </div>
            <ContactForm />
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

const { t } = useI18n();

onMounted(() => {
  document.title = `${t('contact.title')} - AIYAZONE`;
});
</script>

<style scoped lang="less">
.contact-view {
  min-height: 100vh;
}

.contact-header {
  padding: var(--brand-space-huge) 0 var(--brand-space-xl);
  
  .page-title {
    font-size: clamp(4rem, 8vw, 8rem);
    line-height: 0.9;
    margin-bottom: 2rem;
    
    .block {
      display: block;
    }
    
    .italic {
      font-family: var(--brand-font-display);
      font-style: italic;
    }
  }
  
  .page-subtitle {
    font-size: 1.25rem;
    color: var(--brand-text-secondary);
    max-width: 500px;
  }
}

.contact-content {
  padding-bottom: var(--brand-space-huge);
  
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 6rem;
    
    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      
      .method-card {
        padding-top: 1.5rem;
        border-top: 1px solid var(--brand-border);
        
        .method-label {
          display: block;
          font-family: var(--brand-font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--brand-text-tertiary);
          margin-bottom: 1rem;
        }
        
        .method-value {
          font-family: var(--brand-font-display);
          font-size: 1.5rem;
          color: var(--brand-text-primary);
          text-decoration: none;
          transition: color 0.3s ease;
          
          &:hover {
            color: var(--brand-electric);
          }
        }
        
        .method-text {
          color: var(--brand-text-secondary);
          line-height: 1.6;
        }
        
        .social-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          
          .social-link {
            font-size: 1.1rem;
            color: var(--brand-text-primary);
            text-decoration: none;
            cursor: pointer;
            transition: color 0.3s ease;
            
            &:hover {
              color: var(--brand-electric);
            }
          }
        }
      }
    }
    
    .contact-form-wrapper {
      background: var(--brand-canvas-day);
      border: 1px solid var(--brand-border);
      padding: 3rem;
      border-radius: 2px;
      
      .form-header {
        margin-bottom: 2rem;
        
        .form-title {
          font-size: 2rem;
          font-family: var(--brand-font-display);
        }
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .contact-content .contact-grid {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
}
</style>

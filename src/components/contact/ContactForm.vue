<template>
  <div class="contact-form">
    <div class="form-header">
      <h2 class="form-title">{{ t("contact.title") }}</h2>
      <p class="form-description">
        {{ t("contact.description", "欢迎与我联系，我会尽快回复您的消息。") }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="contact-form-content" novalidate>
      <!-- 姓名字段 -->
      <div class="form-group">
        <label for="name" class="form-label">
          {{ t("contact.name") }}
          <span class="required-indicator" :aria-label="t('contact.required')">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          :class="{ 'form-input--error': errors.name }"
          :placeholder="t('contact.namePlaceholder')"
          :aria-describedby="errors.name ? 'name-error' : undefined"
          :aria-invalid="errors.name ? 'true' : 'false'"
          required
          autocomplete="name"
          @blur="validateField('name')"
          @input="clearFieldError('name')"
        />
        <div v-if="errors.name" id="name-error" class="form-error" role="alert">
          <span class="form-error-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          {{ errors.name }}
        </div>
      </div>

      <!-- 邮箱字段 -->
      <div class="form-group">
        <label for="email" class="form-label">
          {{ t("contact.email") }}
          <span class="required-indicator" :aria-label="t('contact.required')">*</span>
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          :class="{ 'form-input--error': errors.email }"
          :placeholder="t('contact.emailPlaceholder', '请输入您的邮箱地址')"
          :aria-describedby="errors.email ? 'email-error' : undefined"
          :aria-invalid="errors.email ? 'true' : 'false'"
          required
          autocomplete="email"
          @blur="validateField('email')"
          @input="clearFieldError('email')"
        />
        <div v-if="errors.email" id="email-error" class="form-error" role="alert">
          <span class="form-error-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          {{ errors.email }}
        </div>
      </div>

      <!-- 主题字段 -->
      <div class="form-group">
        <label for="subject" class="form-label">
          {{ t("contact.subject") }}
          <span class="required-indicator" :aria-label="t('contact.required')">*</span>
        </label>
        <input
          id="subject"
          v-model="formData.subject"
          type="text"
          class="form-input"
          :class="{ 'form-input--error': errors.subject }"
          :placeholder="t('contact.subjectPlaceholder', '请输入邮件主题')"
          :aria-describedby="errors.subject ? 'subject-error' : undefined"
          :aria-invalid="errors.subject ? 'true' : 'false'"
          required
          @blur="validateField('subject')"
          @input="clearFieldError('subject')"
        />
        <div v-if="errors.subject" id="subject-error" class="form-error" role="alert">
          <span class="form-error-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          {{ errors.subject }}
        </div>
      </div>

      <!-- 类别字段 -->
      <div class="form-group">
        <label for="category" class="form-label">
          {{ t("contact.category") }}
        </label>
        <select
          id="category"
          v-model="formData.category"
          class="form-select"
          :class="{ 'form-select--error': errors.category }"
          :aria-describedby="errors.category ? 'category-error' : undefined"
          @change="clearFieldError('category')"
        >
          <option value="">{{ t("contact.selectCategory", "请选择联系类别") }}</option>
          <option value="business">{{ t("contact.categories.business") }}</option>
          <option value="collaboration">
            {{ t("contact.categories.collaboration") }}
          </option>
          <option value="general">{{ t("contact.categories.general") }}</option>
          <option value="feedback">
            {{ t("contact.categories.feedback", "反馈建议") }}
          </option>
          <option value="other">{{ t("contact.categories.other", "其他") }}</option>
        </select>
        <div v-if="errors.category" id="category-error" class="form-error" role="alert">
          <span class="form-error-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          {{ errors.category }}
        </div>
      </div>

      <!-- 消息字段 -->
      <div class="form-group">
        <label for="message" class="form-label">
          {{ t("contact.message") }}
          <span class="required-indicator" :aria-label="t('contact.required')">*</span>
        </label>
        <textarea
          id="message"
          v-model="formData.message"
          class="form-textarea"
          :class="{ 'form-textarea--error': errors.message }"
          :placeholder="t('contact.messagePlaceholder', '请输入您的消息内容...')"
          :aria-describedby="errors.message ? 'message-error' : 'message-help'"
          :aria-invalid="errors.message ? 'true' : 'false'"
          required
          rows="6"
          @blur="validateField('message')"
          @input="clearFieldError('message')"
        ></textarea>
        <div v-if="!errors.message" id="message-help" class="form-help">
          {{
            t(
              "contact.messageHelp",
              "请详细描述您的需求或问题，这将帮助我更好地为您提供帮助。"
            )
          }}
        </div>
        <div v-if="errors.message" id="message-error" class="form-error" role="alert">
          <span class="form-error-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          {{ errors.message }}
        </div>
        <div class="character-count">
          {{ formData.message.length }}/{{ maxMessageLength }}
        </div>
      </div>

      <!-- 隐私政策同意 -->
      <div class="form-group">
        <label class="form-checkbox-label">
          <input
            v-model="formData.agreeToPrivacy"
            type="checkbox"
            class="form-checkbox"
            :class="{ 'form-checkbox--error': errors.agreeToPrivacy }"
            :aria-describedby="errors.agreeToPrivacy ? 'privacy-error' : undefined"
            required
            @change="clearFieldError('agreeToPrivacy')"
          />
          <span class="checkbox-indicator"></span>
          <span class="checkbox-text">
            {{ t("contact.privacyAgreement", "我同意") }}
            <a href="/privacy" target="_blank" class="privacy-link">
              {{ t("contact.privacyPolicy", "隐私政策") }}
            </a>
            {{ t("contact.privacyAgreementSuffix", "并允许处理我的个人信息") }}
            <span class="required-indicator" :aria-label="t('contact.required')">*</span>
          </span>
        </label>
        <div
          v-if="errors.agreeToPrivacy"
          id="privacy-error"
          class="form-error"
          role="alert"
        >
          <span class="form-error-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          {{ errors.agreeToPrivacy }}
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <TouchButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isSubmitting"
          :disabled="!isFormValid || isSubmitting"
          class="submit-button"
        >
          <template v-if="!isSubmitting">
            <span class="button-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 6h16v12H4z" />
                <path d="m22 7-10 7L2 7" />
              </svg>
            </span>
            {{ t("contact.send") }}
          </template>
          <template v-else>
            {{ t("contact.sending", "发送中...") }}
          </template>
        </TouchButton>

        <button
          type="button"
          class="reset-button"
          :disabled="isSubmitting"
          @click="resetForm"
        >
          {{ t("common.reset") }}
        </button>
      </div>

      <!-- 表单状态消息 -->
      <div
        v-if="submitStatus"
        class="form-status"
        :class="`form-status--${submitStatus.type}`"
        role="alert"
      >
        <div class="status-icon">
          <svg
            v-if="submitStatus.type === 'success'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m22 4-10 10-3-3" />
          </svg>
          <svg
            v-else-if="submitStatus.type === 'error'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div class="status-content">
          <h4 class="status-title">{{ submitStatus.title }}</h4>
          <p class="status-message">{{ submitStatus.message }}</p>
        </div>
      </div>
    </form>

    <!-- 其他联系方式 -->
    <div class="alternative-contact">
      <h3 class="alt-contact-title">
        {{ t("contact.alternativeContact", "其他联系方式") }}
      </h3>
      <div class="contact-methods">
        <a
          href="mailto:aiyazone@163.com"
          class="contact-method"
          :aria-label="t('contact.emailDirect', '直接发送邮件')"
        >
          <span class="method-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 6h16v12H4z" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </span>
          <span class="method-text">aiyazone@163.com</span>
        </a>

        <a
          href="https://github.com/AIYAZONE"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-method"
          aria-label="GitHub"
        >
          <span class="method-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M8 8h8" />
              <path d="M9 12h6" />
              <path d="M10 16h4" />
              <path d="M7 3h10l4 4v14H3V3h4Z" />
              <path d="M7 3v6h10V3" />
            </svg>
          </span>
          <span class="method-text">GitHub</span>
        </a>
      </div>

      <div class="response-time">
        <p class="response-info">
          <span class="info-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 7v6l4 2" />
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          {{ t("contact.responseTime", "通常在24小时内回复") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { TouchButton } from "../ui";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  agreeToPrivacy: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  category?: string;
  message?: string;
  agreeToPrivacy?: string;
}

interface SubmitStatus {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

const { t } = useI18n();

const maxMessageLength = 2000;
const isSubmitting = ref(false);
const submitStatus = ref<SubmitStatus | null>(null);

const formData = reactive<ContactFormData>({
  name: "",
  email: "",
  subject: "",
  category: "",
  message: "",
  agreeToPrivacy: false,
});

const errors = reactive<FormErrors>({});

const isFormValid = computed(() => {
  return (
    formData.name.trim() &&
    formData.email.trim() &&
    isValidEmail(formData.email) &&
    formData.subject.trim() &&
    formData.message.trim() &&
    formData.message.length <= maxMessageLength &&
    formData.agreeToPrivacy &&
    Object.keys(errors).length === 0
  );
});

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateField = (fieldName: keyof ContactFormData) => {
  clearFieldError(fieldName);

  switch (fieldName) {
    case "name":
      if (!formData.name.trim()) {
        errors.name = t("errors.validation.required");
      } else if (formData.name.trim().length < 2) {
        errors.name = t("errors.validation.minLength", { min: 2 });
      }
      break;

    case "email":
      if (!formData.email.trim()) {
        errors.email = t("errors.validation.required");
      } else if (!isValidEmail(formData.email)) {
        errors.email = t("errors.validation.email");
      }
      break;

    case "subject":
      if (!formData.subject.trim()) {
        errors.subject = t("errors.validation.required");
      } else if (formData.subject.trim().length < 5) {
        errors.subject = t("errors.validation.minLength", { min: 5 });
      }
      break;

    case "message":
      if (!formData.message.trim()) {
        errors.message = t("errors.validation.required");
      } else if (formData.message.trim().length < 10) {
        errors.message = t("errors.validation.minLength", { min: 10 });
      } else if (formData.message.length > maxMessageLength) {
        errors.message = t("errors.validation.maxLength", { max: maxMessageLength });
      }
      break;

    case "agreeToPrivacy":
      if (!formData.agreeToPrivacy) {
        errors.agreeToPrivacy = t("contact.privacyRequired", "请同意隐私政策");
      }
      break;
  }
};

const clearFieldError = (fieldName: keyof ContactFormData) => {
  if (errors[fieldName]) {
    delete errors[fieldName];
  }
};

const validateForm = (): boolean => {
  // 清除之前的错误
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof FormErrors];
  });

  // 验证所有字段
  (Object.keys(formData) as Array<keyof ContactFormData>).forEach((field) => {
    validateField(field);
  });

  return Object.keys(errors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    submitStatus.value = {
      type: "error",
      title: t("contact.validationError", "表单验证失败"),
      message: t("contact.validationErrorMessage", "请检查并修正表单中的错误"),
    };
    return;
  }

  isSubmitting.value = true;
  submitStatus.value = null;

  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 这里应该调用实际的API
    console.log("Form submitted:", formData);

    submitStatus.value = {
      type: "success",
      title: t("contact.submitSuccess", "消息发送成功"),
      message: t("contact.submitSuccessMessage", "感谢您的联系！我会尽快回复您的消息。"),
    };

    // 重置表单
    resetForm();
  } catch (error) {
    console.error("Form submission error:", error);
    submitStatus.value = {
      type: "error",
      title: t("contact.submitError", "发送失败"),
      message: t(
        "contact.submitErrorMessage",
        "抱歉，消息发送失败。请稍后重试或使用其他联系方式。"
      ),
    };
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    agreeToPrivacy: false,
  });

  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof FormErrors];
  });

  submitStatus.value = null;
};
</script>

<style scoped lang="less">
.contact-form {
  --bg-primary: var(--brand-canvas-day);
  --bg-secondary: rgba(0, 0, 0, 0.02);
  --text-primary: var(--brand-text-primary);
  --text-secondary: var(--brand-text-secondary);
  --border-color: var(--brand-border);
  --accent-gold: var(--brand-gold-start);
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  .form-header {
    text-align: center;
    margin-bottom: 2rem;

    .form-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .form-description {
      color: var(--text-secondary);
      font-size: 1.1rem;
      line-height: 1.6;
    }
  }

  .contact-form-content {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid var(--border-color);
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.95rem;

    .required-indicator {
      color: #ef4444;
      margin-left: 0.25rem;
    }
  }

  .form-input,
  .form-textarea,
  .form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.3s ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--accent-gold);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: var(--text-secondary);
      opacity: 0.7;
    }

    &--error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }

  .form-select {
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.75rem calc(50% - 0.35em),
      right 0.75rem calc(50% + 0.35em);
    background-repeat: no-repeat, no-repeat;
    background-size: 1.1em 1.1em, 1.1em 1.1em;
    padding-right: 2.75rem;
  }

  .form-checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
    font-size: 0.95rem;
    line-height: 1.5;

    .form-checkbox {
      position: absolute;
      opacity: 0;
      pointer-events: none;

      &:checked + .checkbox-indicator {
        background: var(--accent-gold);
        border-color: var(--accent-gold);

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }

      &:focus + .checkbox-indicator {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &--error + .checkbox-indicator {
        border-color: #ef4444;
      }
    }

    .checkbox-indicator {
      position: relative;
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-primary);
      transition: all 0.2s ease;
      flex-shrink: 0;
      margin-top: 0.125rem;

      &::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 6px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) scale(0);
        opacity: 0;
        transition: all 0.2s ease;
      }
    }

    .checkbox-text {
      color: var(--text-primary);

      .privacy-link {
        color: var(--accent-gold);
        text-decoration: underline;

        &:hover {
          text-decoration: none;
        }
      }

      .required-indicator {
        color: #ef4444;
        margin-left: 0.25rem;
      }
    }
  }

  .form-error {
    margin-top: 0.5rem;
    color: #ef4444;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .form-error-icon {
    width: 1rem;
    height: 1rem;
    display: grid;
    place-items: center;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  .form-help {
    margin-top: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .character-count {
    margin-top: 0.5rem;
    text-align: right;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;

    .submit-button {
      flex: 1;
    }

    .reset-button {
      padding: 0.75rem 1.5rem;
      background: none;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;

      &:hover:not(:disabled) {
        border-color: var(--accent-gold);
        color: var(--text-primary);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  .form-status {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    gap: 0.75rem;

    &--success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid #10b981;
    }

    &--error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid #ef4444;
    }

    &--info {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid var(--accent-gold);
    }

    .status-icon {
      width: 1.5rem;
      height: 1.5rem;
      display: grid;
      place-items: center;
      flex-shrink: 0;

      svg {
        width: 1.4rem;
        height: 1.4rem;
      }
    }

    .status-content {
      flex: 1;

      .status-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: var(--text-primary);
      }

      .status-message {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.4;
      }
    }
  }

  .alternative-contact {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid var(--border-color);

    .alt-contact-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .contact-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;

      .contact-method {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--bg-primary);
        border-radius: 8px;
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);

        &:hover {
          border-color: var(--accent-gold);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &:hover .method-icon {
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.25) 0%,
            rgba(212, 175, 55, 0.12) 100%
          );
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.12), 0 10px 22px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px) scale(1.02);
        }

        &:hover .method-icon svg {
          transform: scale(1.06);
        }

        &:focus-visible {
          outline: 2px solid var(--accent-gold);
          outline-offset: 4px;
        }

        .method-icon {
          width: 2.25rem;
          height: 2.25rem;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
            background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease,
            color 0.35s ease;

          svg {
            width: 1.15rem;
            height: 1.15rem;
            transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        }

        .method-text {
          font-weight: 500;
        }
      }
    }

    .response-time {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);

      .response-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;

        .info-icon {
          width: 1.25rem;
          height: 1.25rem;
          display: grid;
          place-items: center;
          color: var(--brand-midnight);

          svg {
            width: 1.1rem;
            height: 1.1rem;
          }
        }
      }
    }
  }
}

// 移动端优化
@media screen and (max-width: 767px) {
  .contact-form {
    padding: 1rem;

    .contact-form-content,
    .alternative-contact {
      padding: 1.5rem;
    }

    .form-actions {
      flex-direction: column;

      .reset-button {
        order: -1;
      }
    }

    .contact-methods {
      grid-template-columns: 1fr;
    }

    .form-checkbox-label {
      align-items: flex-start;
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .contact-form {
    .form-input,
    .form-textarea,
    .form-select {
      border-width: 3px;
    }

    .checkbox-indicator {
      border-width: 3px;
    }
  }
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  .contact-form {
    .form-select {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%9ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-form {
    .contact-method,
    .method-icon,
    .method-icon svg {
      transition: none;
    }

    .contact-method:hover,
    .contact-method:hover .method-icon,
    .contact-method:hover .method-icon svg {
      transform: none;
    }
  }
}
</style>

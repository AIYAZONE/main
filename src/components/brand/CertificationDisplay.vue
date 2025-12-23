<template>
  <section class="certification-display">
    <div class="middle-box">
      <div class="section-header">
        <h2 class="certifications-title">
          {{ t("certifications.title", "Professional Certifications") }}
        </h2>
        <p class="section-subtitle">
          {{
            t("certifications.subtitle", "Validated expertise and continuous learning")
          }}
        </p>
      </div>

      <div class="certifications-grid">
        <div v-for="cert in certifications" :key="cert.id" class="cert-card">
          <div class="card-inner">
            <!-- Certificate Image -->
            <div class="cert-image">
              <img
                v-if="cert.imageUrl"
                :src="cert.imageUrl"
                :alt="`${cert.name} certificate`"
                loading="lazy"
                @error="handleImageError"
              />
              <div v-else class="cert-placeholder">
                <span class="cert-icon">🏆</span>
              </div>
            </div>

            <!-- Certificate Info -->
            <div class="cert-info">
              <h3 class="cert-name">{{ cert.name }}</h3>
              <p class="cert-issuer">{{ cert.issuer }}</p>

              <div class="cert-details">
                <div class="cert-date">
                  <span class="label">{{ t("certifications.issued", "Issued") }}:</span>
                  <span class="value">{{ formatDate(cert.issueDate) }}</span>
                </div>

                <div v-if="cert.expiryDate" class="cert-expiry">
                  <span class="label">{{ t("certifications.expires", "Expires") }}:</span>
                  <span class="value">{{ formatDate(cert.expiryDate) }}</span>
                </div>

                <div class="cert-credential">
                  <span class="label"
                    >{{ t("certifications.credential", "Credential ID") }}:</span
                  >
                  <span class="value credential-id">{{ cert.credentialId }}</span>
                </div>
              </div>

              <!-- Verification Link -->
              <div class="cert-actions">
                <a
                  :href="cert.verificationUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="verify-link"
                  :aria-label="`Verify ${cert.name} certification`"
                >
                  <span class="verify-icon">🔗</span>
                  {{ t("certifications.verify", "Verify Certificate") }}
                  <span class="external-icon">↗</span>
                </a>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="cert-status">
              <span class="status-badge" :class="getStatusClass(cert)">
                {{ getStatusText(cert) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="certifications.length === 0" class="no-certifications">
        <div class="empty-icon">📜</div>
        <h3 class="empty-title">
          {{ t("certifications.empty.title", "No Certifications") }}
        </h3>
        <p class="empty-description">
          {{
            t(
              "certifications.empty.description",
              "Certifications will appear here when available."
            )
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { Certification } from "../../types/brand";

interface Props {
  certifications: readonly Certification[];
}

const props = withDefaults(defineProps<Props>(), {
  certifications: () => [],
});

const { t } = useI18n();

// Format date for display
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

// Get certification status
const getStatusClass = (cert: Certification): string => {
  if (!cert.expiryDate) return "active"; // No expiry means always active

  const now = new Date();
  const expiry = new Date(cert.expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry < 90) return "expiring";
  return "active";
};

const getStatusText = (cert: Certification): string => {
  const statusClass = getStatusClass(cert);

  switch (statusClass) {
    case "expired":
      return "Expired";
    case "expiring":
      return "Expiring Soon";
    case "active":
    default:
      return "Active";
  }
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";

  // Show placeholder instead
  const placeholder = img.parentElement?.querySelector(".cert-placeholder");
  if (placeholder) {
    (placeholder as HTMLElement).style.display = "flex";
  }
};
</script>

<style lang="less" scoped>
.certification-display {
  padding: 4rem 0;
  background-color: #ffffff;

  .section-header {
    text-align: center;
    margin-bottom: 3rem;

    .certifications-title {
      font-family: var(--font-serif);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .section-subtitle {
      font-family: var(--font-sans);
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }

  .certifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    .cert-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        border-color: #3b82f6;
      }

      .card-inner {
        padding: 2rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .cert-image {
        width: 80px;
        height: 80px;
        margin-bottom: 1.5rem;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .cert-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          .cert-icon {
            font-size: 2rem;
          }
        }
      }

      .cert-info {
        flex: 1;

        .cert-name {
          font-family: var(--font-sans);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .cert-issuer {
          font-family: var(--font-sans);
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .cert-details {
          margin-bottom: 1.5rem;

          .cert-date,
          .cert-expiry,
          .cert-credential {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f3f4f6;

            &:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }

            .label {
              font-family: var(--font-sans);
              font-size: 0.9rem;
              color: var(--text-secondary);
              font-weight: 500;
            }

            .value {
              font-family: var(--font-sans);
              font-size: 0.9rem;
              color: var(--text-primary);
              font-weight: 600;

              &.credential-id {
                font-family: monospace;
                font-size: 0.8rem;
                background: #f3f4f6;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
              }
            }
          }
        }

        .cert-actions {
          margin-top: auto;

          .verify-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-family: var(--font-sans);
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.3s ease;

            &:hover {
              background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }

            .verify-icon {
              font-size: 1rem;
            }

            .external-icon {
              font-size: 0.8rem;
              opacity: 0.8;
            }
          }
        }
      }

      .cert-status {
        position: absolute;
        top: 1rem;
        right: 1rem;

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;

          &.active {
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
            border: 1px solid rgba(16, 185, 129, 0.2);
          }

          &.expiring {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
            border: 1px solid rgba(245, 158, 11, 0.2);
          }

          &.expired {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            border: 1px solid rgba(239, 68, 68, 0.2);
          }
        }
      }
    }
  }

  .no-certifications {
    text-align: center;
    padding: 4rem 2rem;

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    .empty-title {
      font-family: var(--font-sans);
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .empty-description {
      font-family: var(--font-sans);
      font-size: 1rem;
      color: var(--text-secondary);
      max-width: 400px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }
}

@media screen and (max-width: 768px) {
  .certification-display {
    padding: 3rem 0;

    .section-header {
      margin-bottom: 2rem;

      .section-title {
        font-size: 2rem;
      }

      .section-subtitle {
        font-size: 1rem;
      }
    }

    .certifications-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;

      .certification-card .card-inner {
        padding: 1.5rem;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .certification-display {
    .certifications-grid {
      .certification-card {
        .card-inner {
          padding: 1.25rem;
        }

        .cert-info {
          .cert-details {
            .cert-date,
            .cert-expiry,
            .cert-credential {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.25rem;
            }
          }
        }
      }
    }
  }
}
</style>

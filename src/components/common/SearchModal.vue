<template>
  <div class="search-modal-overlay" @click="handleOverlayClick">
    <div
      class="search-modal"
      role="dialog"
      aria-labelledby="search-title"
      aria-modal="true"
    >
      <div class="search-header">
        <h2 id="search-title" class="search-title">{{ t("common.search") }}</h2>
        <button
          class="search-close"
          @click="$emit('close')"
          :aria-label="t('common.close')"
        >
          ✕
        </button>
      </div>

      <div class="search-content">
        <div class="search-input-wrapper">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="t('portfolio.searchPlaceholder')"
            @input="handleSearch"
            @keydown.escape="$emit('close')"
          />
          <div class="search-icon">🔍</div>
        </div>

        <div class="search-results" v-if="searchResults.length > 0">
          <h3 class="results-title">
            {{ t("accessibility.searchResults", { count: searchResults.length }) }}
          </h3>
          <ul class="results-list">
            <li v-for="result in searchResults" :key="result.id" class="result-item">
              <router-link :to="result.path" class="result-link" @click="$emit('close')">
                <div class="result-icon">{{ result.icon }}</div>
                <div class="result-content">
                  <h4 class="result-title">{{ t(result.title) }}</h4>
                  <p class="result-description">{{ t(result.description) }}</p>
                </div>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="search-empty" v-else-if="searchQuery && !isSearching">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">{{ t("accessibility.noSearchResults") }}</h3>
          <p class="empty-description">{{ t("portfolio.tryDifferentFilters") }}</p>
        </div>

        <div class="search-suggestions" v-else>
          <h3 class="suggestions-title">{{ t("search.suggestions") }}</h3>
          <div class="suggestion-tags">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="suggestion-tag"
              @click="searchQuery = suggestion"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({ name: "SearchModal" });
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  type: "page" | "project" | "skill";
}

const emit = defineEmits<{
  close: [];
}>();

const { t, tm } = useI18n();
const router = useRouter();

const searchInput = ref<HTMLInputElement>();
const searchQuery = ref("");
const searchResults = ref<SearchResult[]>([]);
const isSearching = ref(false);

const suggestions = computed(() => tm("search.suggestions") as string[]);

// 模拟搜索数据
const searchData: SearchResult[] = [
  {
    id: "about",
    title: "nav.about",
    description: "nav.aboutDesc",
    path: "/about",
    icon: "👤",
    type: "page",
  },
  {
    id: "portfolio",
    title: "nav.portfolio",
    description: "nav.portfolioDesc",
    path: "/portfolio",
    icon: "💼",
    type: "page",
  },
  {
    id: "career",
    title: "nav.career",
    description: "nav.careerDesc",
    path: "/career",
    icon: "🚀",
    type: "page",
  },
  {
    id: "swot",
    title: "career.swot.title",
    description: "career.swot.description",
    path: "/career/swot",
    icon: "📊",
    type: "page",
  },
  {
    id: "learning",
    title: "career.learning.title",
    description: "career.learning.description",
    path: "/career/learning",
    icon: "📚",
    type: "page",
  },
];

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // 模拟搜索延迟
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase();
    searchResults.value = searchData.filter(
      (item) =>
        t(item.title).toLowerCase().includes(query) ||
        t(item.description).toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
    isSearching.value = false;
  }, 200);
};

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit("close");
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    emit("close");
  }
};

onMounted(async () => {
  await nextTick();
  searchInput.value?.focus();
  document.addEventListener("keydown", handleKeydown);
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped lang="less">
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 1rem 1rem;
  overflow-y: auto;
}

.search-modal {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--brand-shadow-xl);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;

  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);

    .search-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .search-close {
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      font-size: 1.25rem;
      transition: all 0.2s ease;

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }

      &:focus {
        outline: 2px solid var(--brand-primary);
        outline-offset: 2px;
      }
    }
  }

  .search-content {
    padding: 1.5rem;
    max-height: calc(80vh - 80px);
    overflow-y: auto;

    .search-input-wrapper {
      position: relative;
      margin-bottom: 1.5rem;

      .search-input {
        width: 100%;
        padding: 1rem 1rem 1rem 3rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
        background: var(--bg-secondary);
        color: var(--text-primary);
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        &::placeholder {
          color: var(--text-tertiary);
        }
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.25rem;
        color: var(--text-secondary);
        pointer-events: none;
      }
    }

    .search-results {
      .results-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin: 0 0 1rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .results-list {
        list-style: none;
        margin: 0;
        padding: 0;

        .result-item {
          margin-bottom: 0.5rem;

          .result-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: 8px;
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.2s ease;

            &:hover {
              background: rgba(59, 130, 246, 0.1);
              transform: translateY(-1px);
            }

            &:focus {
              outline: 2px solid var(--brand-primary);
              outline-offset: 2px;
            }

            .result-icon {
              font-size: 1.5rem;
              flex-shrink: 0;
            }

            .result-content {
              flex: 1;

              .result-title {
                font-size: 1rem;
                font-weight: 600;
                margin: 0 0 0.25rem 0;
              }

              .result-description {
                font-size: 0.9rem;
                color: var(--text-secondary);
                margin: 0;
                line-height: 1.4;
              }
            }
          }
        }
      }
    }

    .search-empty {
      text-align: center;
      padding: 2rem 0;

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      .empty-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
      }

      .empty-description {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .search-suggestions {
      .suggestions-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
      }

      .suggestion-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .suggestion-tag {
          padding: 0.5rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: var(--brand-primary);
            color: white;
            border-color: var(--brand-primary);
          }

          &:focus {
            outline: 2px solid var(--brand-primary);
            outline-offset: 2px;
          }
        }
      }
    }
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 移动端适配
@media screen and (max-width: 767px) {
  .search-modal-overlay {
    padding: 5vh 0.5rem 0.5rem;
  }

  .search-modal {
    .search-header {
      padding: 1rem;
    }

    .search-content {
      padding: 1rem;

      .search-input-wrapper {
        .search-input {
          padding: 0.875rem 0.875rem 0.875rem 2.5rem;
          font-size: 0.95rem;
        }

        .search-icon {
          left: 0.875rem;
          font-size: 1.1rem;
        }
      }

      .search-results {
        .results-list {
          .result-item {
            .result-link {
              padding: 0.875rem;
              gap: 0.75rem;

              .result-icon {
                font-size: 1.25rem;
              }

              .result-content {
                .result-title {
                  font-size: 0.95rem;
                }

                .result-description {
                  font-size: 0.85rem;
                }
              }
            }
          }
        }
      }
    }
  }
}

// 减少动画模式
@media (prefers-reduced-motion: reduce) {
  .search-modal {
    animation: none;
  }

  .result-link:hover {
    transform: none;
  }
}
</style>

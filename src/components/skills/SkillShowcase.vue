<template>
  <div class="skill-showcase">
    <div class="skill-showcase__header">
      <h2 class="skill-showcase__title skills-title">{{ $t("skills.title") }}</h2>
      <div class="skill-showcase__filters">
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          :class="[
            'skill-showcase__filter-btn',
            'filter-btn',
            { 'skill-showcase__filter-btn--active': activeFilter === filter.value },
          ]"
          @click="setActiveFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="skill-showcase__content">
      <div v-if="loading" class="skill-showcase__loading">
        {{ $t("common.loading") }}
      </div>

      <div v-else-if="error" class="skill-showcase__error">
        <p>{{ error }}</p>
        <button @click="retryLoad" class="skill-showcase__retry-btn">
          {{ $t("common.retry") }}
        </button>
      </div>

      <div v-else class="skill-showcase__categories">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="skill-category"
        >
          <div class="skill-category__header">
            <h3 class="skill-category__title">{{ category.name }}</h3>
            <span class="skill-category__count">
              {{ category.skills.length }} {{ $t("skills.title") }}
            </span>
          </div>

          <div class="skill-category__skills">
            <div
              v-for="skill in category.skills"
              :key="skill.id"
              class="skill-item"
              @click="selectSkill(skill)"
              :class="{ 'skill-item--selected': selectedSkill?.id === skill.id }"
            >
              <div class="skill-item__header">
                <h4 class="skill-item__name">{{ skill.name }}</h4>
                <div class="skill-item__level">
                  <div class="skill-level-bar">
                    <div
                      class="skill-level-bar__fill"
                      :style="{ width: `${(skill.level / 10) * 100}%` }"
                    ></div>
                  </div>
                  <span class="skill-level-text">Level {{ skill.level }}/10</span>
                </div>
              </div>

              <div class="skill-item__meta">
                <span class="skill-item__experience">
                  {{ skill.yearsOfExperience }} {{ $t("skills.yearsExp") }}
                </span>
                <span class="skill-item__projects">
                  {{ skill.projects.length }} {{ $t("skills.projects") }}
                </span>
              </div>

              <p class="skill-item__description">{{ skill.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skill Detail Modal -->
    <div v-if="selectedSkill" class="skill-modal" @click="closeModal">
      <div class="skill-modal__content" @click.stop>
        <button class="skill-modal__close" @click="closeModal">×</button>

        <div class="skill-modal__header">
          <h3 class="skill-modal__title">{{ selectedSkill.name }}</h3>
          <div class="skill-modal__level">
            <div class="skill-level-bar skill-level-bar--large">
              <div
                class="skill-level-bar__fill"
                :style="{ width: `${(selectedSkill.level / 10) * 100}%` }"
              ></div>
            </div>
            <span class="skill-level-text skill-level-text--large">
              {{ selectedSkill.level }}/10
            </span>
          </div>
        </div>

        <div class="skill-modal__body">
          <div class="skill-modal__meta">
            <div class="skill-meta-item">
              <span class="skill-meta-item__label">{{ $t("skills.yearsExp") }}:</span>
              <span class="skill-meta-item__value"
                >{{ selectedSkill.yearsOfExperience }} {{ $t("skills.years") }}</span
              >
            </div>
            <div class="skill-meta-item">
              <span class="skill-meta-item__label">{{ $t("skills.relatedProjects") }}:</span>
              <span class="skill-meta-item__value"
                >{{ selectedSkill.projects.length }} {{ $t("skills.count") }}</span
              >
            </div>
          </div>

          <div class="skill-modal__description">
            <h4>{{ $t("skills.skillDescription") }}</h4>
            <p>{{ selectedSkill.description }}</p>
          </div>

          <div class="skill-modal__projects">
            <h4>{{ $t("skills.relatedProjects") }}</h4>
            <ul class="skill-projects-list">
              <li
                v-for="project in selectedSkill.projects"
                :key="project"
                class="skill-projects-list__item"
              >
                {{ project }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useSkillStore } from "../../stores/skillStore";
import type { SkillCategory, Skill } from "../../types/skills";
import type { Certification } from "../../types/brand";

// Props
interface Props {
  skills?: readonly SkillCategory[];
  certifications?: readonly Certification[];
  experience?: readonly any[];
}

const props = withDefaults(defineProps<Props>(), {
  skills: () => [],
  certifications: () => [],
  experience: () => [],
});

// Composables
const { t } = useI18n();
const skillStore = useSkillStore();

// Reactive state
const activeFilter = ref<string>("all");
const selectedSkill = ref<Skill | null>(null);

// Computed properties
const loading = computed(() => skillStore.isLoading);
const error = computed(() => skillStore.error);

const skillCategories = computed(() => {
  // Use props if provided, otherwise use store data
  return props.skills.length > 0 ? props.skills : skillStore.skillCategories;
});

const filterOptions = computed(() => [
  { value: "all", label: t("skills.allSkills") },
  { value: "frontend", label: t("skills.categories.frontend.name") },
  { value: "management", label: t("skills.categories.management.name") },
  { value: "leadership", label: t("skills.categories.leadership.name") },
]);

const filteredCategories = computed(() => {
  if (activeFilter.value === "all") {
    return skillCategories.value;
  }
  return skillCategories.value.filter((category) => category.type === activeFilter.value);
});

// Methods
const setActiveFilter = (filter: string) => {
  activeFilter.value = filter;
};

const selectSkill = (skill: Skill) => {
  selectedSkill.value = skill;
};

const closeModal = () => {
  selectedSkill.value = null;
};

const retryLoad = async () => {
  await skillStore.loadSkillsData();
};

// Lifecycle
onMounted(async () => {
  // Only load data if not provided via props and store is empty
  if (props.skills.length === 0 && skillStore.skillCategories.length === 0) {
    await skillStore.loadSkillsData();
  }
});

// Watch for prop changes
watch(
  () => props.skills,
  (newSkills) => {
    if (newSkills.length > 0) {
      skillStore.setSkillCategories(newSkills);
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
.skill-showcase {
  padding: 2rem 0;

  &__header {
    margin-bottom: 2rem;
    text-align: center;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1.5rem;
  }

  &__filters {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__filter-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--color-border);
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    border-radius: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &--active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }
  }

  &__loading,
  &__error {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary);
  }

  &__retry-btn {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: var(--color-primary-dark);
    }
  }

  &__categories {
    display: grid;
    gap: 2rem;
  }
}

.skill-category {
  background: var(--color-bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  &__count {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    background: var(--color-bg-tertiary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
  }

  &__skills {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

.skill-item {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &--selected {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  &__name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    flex: 1;
  }

  &__level {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 80px;
  }

  &__meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
  }

  &__experience,
  &__projects {
    background: var(--color-bg-tertiary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  &__description {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0;
  }
}

.skill-level-bar {
  width: 50px;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;

  &--large {
    width: 100px;
    height: 8px;
  }

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-success), var(--color-primary));
    transition: width 0.3s ease;
  }
}

.skill-level-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);

  &--large {
    font-size: 1rem;
  }
}

.skill-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;

  &__content {
    background: var(--color-bg-primary);
    border-radius: 1rem;
    padding: 2rem;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  &__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;

    &:hover {
      background: var(--color-bg-tertiary);
    }
  }

  &__header {
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 1rem 0;
  }

  &__level {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__body {
    h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.75rem 0;
    }
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-radius: 0.5rem;
  }

  &__description {
    margin-bottom: 1.5rem;

    p {
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin: 0;
    }
  }

  &__projects {
    .skill-projects-list {
      list-style: none;
      padding: 0;
      margin: 0;

      &__item {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-secondary);

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.skill-meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__label {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  &__value {
    font-size: 1rem;
    color: var(--color-text-primary);
    font-weight: 600;
  }
}

// Responsive design
@media (max-width: 768px) {
  .skill-showcase {
    &__title {
      font-size: 2rem;
    }

    &__filters {
      gap: 0.5rem;
    }

    &__filter-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }

  .skill-category {
    padding: 1rem;

    &__skills {
      grid-template-columns: 1fr;
    }
  }

  .skill-item {
    padding: 1rem;

    &__header {
      flex-direction: column;
      gap: 0.75rem;
    }

    &__level {
      align-self: flex-start;
    }

    &__meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .skill-modal {
    padding: 0.5rem;

    &__content {
      padding: 1.5rem;
    }

    &__meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>

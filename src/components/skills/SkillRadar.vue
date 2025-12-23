<template>
  <div class="skill-radar">
    <div class="skill-radar__header">
      <h3 class="skill-radar__title">{{ title || t('skills.radar.title') }}</h3>
      <div class="skill-radar__controls">
        <button
          v-for="view in viewModes"
          :key="view.value"
          :class="[
            'skill-radar__view-btn',
            { 'skill-radar__view-btn--active': currentView === view.value },
          ]"
          @click="setView(view.value)"
        >
          {{ view.label }}
        </button>
      </div>
    </div>

    <div class="skill-radar__content">
      <div v-if="currentView === 'radar'" class="skill-radar__chart-container">
        <canvas
          ref="radarCanvas"
          class="skill-radar__canvas"
          :width="canvasSize"
          :height="canvasSize"
        ></canvas>
        <div class="skill-radar__legend">
          <div
            v-for="(category, index) in processedCategories"
            :key="category.id"
            class="skill-radar__legend-item"
          >
            <div
              class="skill-radar__legend-color"
              :style="{ backgroundColor: getColor(index) }"
            ></div>
            <span class="skill-radar__legend-label">{{ category.name }}</span>
            <span class="skill-radar__legend-value"
              >{{ category.averageLevel.toFixed(1) }}/10</span
            >
          </div>
        </div>
      </div>

      <div v-else-if="currentView === 'matrix'" class="skill-radar__matrix">
        <div class="skill-matrix">
          <div class="skill-matrix__header">
            <div class="skill-matrix__cell skill-matrix__cell--header">{{ t("skills.radar.columns.skill") }}</div>
            <div class="skill-matrix__cell skill-matrix__cell--header">{{ t("skills.radar.columns.category") }}</div>
            <div class="skill-matrix__cell skill-matrix__cell--header">{{ t("skills.radar.columns.proficiency") }}</div>
            <div class="skill-matrix__cell skill-matrix__cell--header">{{ t("skills.radar.columns.experience") }}</div>
            <div class="skill-matrix__cell skill-matrix__cell--header">{{ t("skills.radar.columns.projects") }}</div>
          </div>
          <div class="skill-matrix__body">
            <div v-for="skill in allSkills" :key="skill.id" class="skill-matrix__row">
              <div class="skill-matrix__cell">{{ skill.name }}</div>
              <div class="skill-matrix__cell">
                <span class="skill-category-tag" :data-type="skill.categoryType">
                  {{ skill.categoryName }}
                </span>
              </div>
              <div class="skill-matrix__cell">
                <div class="skill-level-indicator">
                  <div class="skill-level-bar">
                    <div
                      class="skill-level-bar__fill"
                      :style="{ width: `${(skill.level / 10) * 100}%` }"
                    ></div>
                  </div>
                  <span class="skill-level-text">{{ skill.level }}/10</span>
                </div>
              </div>
              <div class="skill-matrix__cell">
                {{ skill.yearsOfExperience }} {{ t("skills.radar.units.years") }}
              </div>
              <div class="skill-matrix__cell">
                {{ skill.projects.length }} {{ t("skills.radar.units.count") }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="skill-radar__bars">
        <div class="skill-bars">
          <div
            v-for="(category, index) in processedCategories"
            :key="category.id"
            class="skill-bar"
          >
            <div class="skill-bar__header">
              <h4 class="skill-bar__title">{{ category.name }}</h4>
              <span class="skill-bar__value"
                >{{ category.averageLevel.toFixed(1) }}/10</span
              >
            </div>
            <div class="skill-bar__container">
              <div
                class="skill-bar__fill"
                :style="{
                  width: `${(category.averageLevel / 10) * 100}%`,
                  backgroundColor: getColor(index),
                }"
              ></div>
            </div>
            <div class="skill-bar__skills">
              <span
                v-for="skill in category.topSkills"
                :key="skill.id"
                class="skill-bar__skill-tag"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { SkillCategory, Skill } from "../../types/skills";

// Props
interface Props {
  categories: readonly SkillCategory[];
  maxLevel?: number;
  title?: string;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxLevel: 10,
  size: 400,
});

const { t } = useI18n();

// Reactive state
const radarCanvas = ref<HTMLCanvasElement | null>(null);
const currentView = ref<"radar" | "matrix" | "bars">("radar");

// Computed properties
const canvasSize = computed(() => props.size);

const viewModes = computed(() => [
  { value: "radar", label: t("skills.radar.views.radar") },
  { value: "bars", label: t("skills.radar.views.bars") },
  { value: "matrix", label: t("skills.radar.views.matrix") },
]);

const processedCategories = computed(() => {
  return props.categories.map((category) => {
    const averageLevel =
      category.skills.length > 0
        ? category.skills.reduce((sum, skill) => sum + skill.level, 0) /
          category.skills.length
        : 0;

    const topSkills = [...category.skills].sort((a, b) => b.level - a.level).slice(0, 3);

    return {
      ...category,
      averageLevel,
      topSkills,
      skillCount: category.skills.length,
    };
  });
});

const allSkills = computed(() => {
  return props.categories
    .flatMap((category) =>
      category.skills.map((skill) => ({
        ...skill,
        categoryName: category.name,
        categoryType: category.type,
      }))
    )
    .sort((a, b) => b.level - a.level);
});

// Methods
const setView = (view: string) => {
  currentView.value = view as "radar" | "matrix" | "bars";
  if (view === "radar") {
    nextTick(() => {
      drawRadarChart();
    });
  }
};

const getColor = (index: number): string => {
  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#84CC16", // Lime
  ];
  return colors[index % colors.length];
};

const drawRadarChart = () => {
  if (!radarCanvas.value) return;

  const canvas = radarCanvas.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvasSize.value;
  const center = size / 2;
  const radius = center - 60;
  const categories = processedCategories.value;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Draw background grid
  drawGrid(ctx, center, radius, categories.length);

  // Draw data
  drawData(ctx, center, radius, categories);

  // Draw labels
  drawLabels(ctx, center, radius, categories);
};

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  segments: number
) => {
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1;

  // Draw concentric circles
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(center, center, (radius * i) / 5, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Draw radial lines
  for (let i = 0; i < segments; i++) {
    const angle = (i * 2 * Math.PI) / segments - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + radius * Math.cos(angle), center + radius * Math.sin(angle));
    ctx.stroke();
  }

  // Draw level indicators
  ctx.fillStyle = "#9CA3AF";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  for (let i = 1; i <= 5; i++) {
    const levelRadius = (radius * i) / 5;
    const level = (props.maxLevel * i) / 5;
    ctx.fillText(level.toString(), center + levelRadius + 5, center - 5);
  }
};

const drawData = (
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  categories: any[]
) => {
  if (categories.length === 0) return;

  const points: { x: number; y: number }[] = [];

  // Calculate points
  categories.forEach((category, index) => {
    const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
    const value = (category.averageLevel / props.maxLevel) * radius;
    const x = center + value * Math.cos(angle);
    const y = center + value * Math.sin(angle);
    points.push({ x, y });
  });

  // Draw filled area
  ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
  ctx.strokeStyle = "#3B82F6";
  ctx.lineWidth = 2;

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw points
  ctx.fillStyle = "#3B82F6";
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
};

const drawLabels = (
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  categories: any[]
) => {
  ctx.fillStyle = "#374151";
  ctx.font = "14px sans-serif";

  categories.forEach((category, index) => {
    const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
    const labelRadius = radius + 30;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);

    // Adjust text alignment based on position
    if (x < center) {
      ctx.textAlign = "right";
    } else if (x > center) {
      ctx.textAlign = "left";
    } else {
      ctx.textAlign = "center";
    }

    ctx.fillText(category.name, x, y + 5);
  });
};

// Lifecycle
onMounted(() => {
  if (currentView.value === "radar") {
    nextTick(() => {
      drawRadarChart();
    });
  }
});

// Watch for prop changes
watch(
  () => props.categories,
  () => {
    if (currentView.value === "radar") {
      nextTick(() => {
        drawRadarChart();
      });
    }
  },
  { deep: true }
);

watch(currentView, (newView) => {
  if (newView === "radar") {
    nextTick(() => {
      drawRadarChart();
    });
  }
});
</script>

<style scoped lang="less">
.skill-radar {
  background: var(--color-bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  &__controls {
    display: flex;
    gap: 0.5rem;
  }

  &__view-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-primary);
    color: var(--color-text-secondary);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;

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

  &__content {
    min-height: 400px;
  }

  &__chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  &__canvas {
    border-radius: 0.5rem;
    background: var(--color-bg-primary);
  }

  &__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--color-bg-primary);
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
  }

  &__legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  &__legend-label {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  &__legend-value {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }
}

.skill-matrix {
  background: var(--color-bg-primary);
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--color-border);

  &__header {
    display: grid;
    grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr;
    background: var(--color-bg-tertiary);
  }

  &__body {
    max-height: 400px;
    overflow-y: auto;
  }

  &__row {
    display: grid;
    grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr;
    border-bottom: 1px solid var(--color-border);

    &:hover {
      background: var(--color-bg-secondary);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__cell {
    padding: 0.75rem;
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    &--header {
      font-weight: 600;
      color: var(--color-text-primary);
      background: var(--color-bg-tertiary);
    }
  }
}

.skill-category-tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;

  &[data-type="frontend"] {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }

  &[data-type="management"] {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  &[data-type="leadership"] {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }
}

.skill-level-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.skill-level-bar {
  flex: 1;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;

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
  min-width: 35px;
}

.skill-bars {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-bar {
  background: var(--color-bg-primary);
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  &__value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__container {
    height: 12px;
    background: var(--color-bg-tertiary);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  &__fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.6s ease;
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__skill-tag {
    padding: 0.25rem 0.75rem;
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
}

// Responsive design
@media (max-width: 768px) {
  .skill-radar {
    padding: 1rem;

    &__header {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }

    &__controls {
      justify-content: center;
    }

    &__canvas {
      width: 100% !important;
      height: auto !important;
      max-width: 350px;
    }

    &__legend {
      flex-direction: column;
      align-items: stretch;
    }

    &__legend-item {
      justify-content: space-between;
    }
  }

  .skill-matrix {
    &__header,
    &__row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    &__cell {
      padding: 0.5rem;
      border-bottom: 1px solid var(--color-border);

      &--header {
        display: none;
      }

      &:before {
        content: attr(data-label);
        font-weight: 600;
        color: var(--color-text-secondary);
        margin-right: 0.5rem;
        min-width: 80px;
        display: inline-block;
      }
    }
  }

  .skill-bar {
    padding: 1rem;

    &__header {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    &__skills {
      justify-content: center;
    }
  }
}
</style>

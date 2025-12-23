<template>
  <div class="swot-analysis">
    <div class="swot-header">
      <h2 class="swot-title">{{ t('career.swot.title') }}</h2>
      <p class="swot-description">{{ t('career.swot.description') }}</p>
      <div class="swot-controls">
        <button 
          v-for="mode in visualModes" 
          :key="mode.value"
          :class="['mode-btn', { active: currentMode === mode.value }]"
          @click="setMode(mode.value)"
        >
          {{ t(mode.label) }}
        </button>
      </div>
    </div>

    <div class="swot-content">
      <!-- Quadrant View -->
      <div v-if="currentMode === 'quadrant'" class="swot-quadrant">
        <div class="quadrant-grid">
          <div class="quadrant strengths">
            <h3 class="quadrant-title">{{ t('career.swot.strengths') }}</h3>
            <div class="quadrant-items">
              <div 
                v-for="item in analysis?.strengths" 
                :key="item.id"
                :class="['swot-item', `impact-${item.impact}`]"
              >
                <h4 class="item-title">{{ item.title }}</h4>
                <p class="item-description">{{ item.description }}</p>
                <span class="item-impact">{{ t(`career.swot.impact.${item.impact}`) }}</span>
              </div>
            </div>
          </div>

          <div class="quadrant weaknesses">
            <h3 class="quadrant-title">{{ t('career.swot.weaknesses') }}</h3>
            <div class="quadrant-items">
              <div 
                v-for="item in analysis?.weaknesses" 
                :key="item.id"
                :class="['swot-item', `impact-${item.impact}`]"
              >
                <h4 class="item-title">{{ item.title }}</h4>
                <p class="item-description">{{ item.description }}</p>
                <span class="item-impact">{{ t(`career.swot.impact.${item.impact}`) }}</span>
              </div>
            </div>
          </div>

          <div class="quadrant opportunities">
            <h3 class="quadrant-title">{{ t('career.swot.opportunities') }}</h3>
            <div class="quadrant-items">
              <div 
                v-for="item in analysis?.opportunities" 
                :key="item.id"
                :class="['swot-item', `impact-${item.impact}`]"
              >
                <h4 class="item-title">{{ item.title }}</h4>
                <p class="item-description">{{ item.description }}</p>
                <span class="item-impact">{{ t(`career.swot.impact.${item.impact}`) }}</span>
              </div>
            </div>
          </div>

          <div class="quadrant threats">
            <h3 class="quadrant-title">{{ t('career.swot.threats') }}</h3>
            <div class="quadrant-items">
              <div 
                v-for="item in analysis?.threats" 
                :key="item.id"
                :class="['swot-item', `impact-${item.impact}`]"
              >
                <h4 class="item-title">{{ item.title }}</h4>
                <p class="item-description">{{ item.description }}</p>
                <span class="item-impact">{{ t(`career.swot.impact.${item.impact}`) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Radar Chart View -->
      <div v-else-if="currentMode === 'radar'" class="swot-radar">
        <div class="radar-container">
          <canvas ref="radarCanvas" width="400" height="400"></canvas>
        </div>
        <div class="radar-legend">
          <div class="legend-item" v-for="category in radarCategories" :key="category.key">
            <span :class="['legend-color', category.key]"></span>
            <span class="legend-label">{{ t(category.label) }}</span>
          </div>
        </div>
      </div>

      <!-- Matrix View -->
      <div v-else-if="currentMode === 'matrix'" class="swot-matrix">
        <div class="matrix-container">
          <div class="matrix-axis">
            <div class="axis-label y-axis">{{ t('career.swot.matrix.internal') }}</div>
            <div class="axis-label x-axis">{{ t('career.swot.matrix.external') }}</div>
          </div>
          <div class="matrix-grid">
            <div class="matrix-cell positive internal">
              <h4>{{ t('career.swot.strengths') }}</h4>
              <div class="matrix-items">
                <span v-for="item in analysis?.strengths" :key="item.id" class="matrix-item">
                  {{ item.title }}
                </span>
              </div>
            </div>
            <div class="matrix-cell positive external">
              <h4>{{ t('career.swot.opportunities') }}</h4>
              <div class="matrix-items">
                <span v-for="item in analysis?.opportunities" :key="item.id" class="matrix-item">
                  {{ item.title }}
                </span>
              </div>
            </div>
            <div class="matrix-cell negative internal">
              <h4>{{ t('career.swot.weaknesses') }}</h4>
              <div class="matrix-items">
                <span v-for="item in analysis?.weaknesses" :key="item.id" class="matrix-item">
                  {{ item.title }}
                </span>
              </div>
            </div>
            <div class="matrix-cell negative external">
              <h4>{{ t('career.swot.threats') }}</h4>
              <div class="matrix-items">
                <span v-for="item in analysis?.threats" :key="item.id" class="matrix-item">
                  {{ item.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis Results -->
    <div class="swot-analysis-results" v-if="analysis?.analysis">
      <div class="analysis-section">
        <h3>{{ t('career.swot.keyInsights') }}</h3>
        <ul class="insights-list">
          <li v-for="insight in analysis.analysis.keyInsights" :key="insight">
            {{ insight }}
          </li>
        </ul>
      </div>

      <div class="analysis-section">
        <h3>{{ t('career.swot.recommendations') }}</h3>
        <ul class="recommendations-list">
          <li v-for="recommendation in analysis.analysis.strategicRecommendations" :key="recommendation">
            {{ recommendation }}
          </li>
        </ul>
      </div>

      <div class="analysis-section">
        <h3>{{ t('career.swot.actionItems') }}</h3>
        <div class="action-items">
          <div 
            v-for="action in analysis.analysis.actionItems" 
            :key="action.id"
            :class="['action-item', `priority-${action.priority}`, `status-${action.status}`]"
          >
            <h4 class="action-title">{{ action.title }}</h4>
            <p class="action-description">{{ action.description }}</p>
            <div class="action-meta">
              <span class="action-priority">{{ t(`career.swot.priority.${action.priority}`) }}</span>
              <span class="action-status">{{ t(`career.swot.status.${action.status}`) }}</span>
              <span v-if="hasValidDeadline(action.deadline)" class="action-deadline">
                {{ t('career.swot.deadline') }}: {{ formatDate(action.deadline) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SWOTData } from '../../types/career';

type VisualMode = 'quadrant' | 'radar' | 'matrix';

interface Props {
  analysis: SWOTData | null;
  visualMode?: VisualMode;
}

const props = withDefaults(defineProps<Props>(), {
  visualMode: 'quadrant'
});

const { t } = useI18n();

const currentMode = ref<VisualMode>(props.visualMode);
const radarCanvas = ref<HTMLCanvasElement>();

const visualModes: Array<{ value: VisualMode; label: string }> = [
  { value: 'quadrant', label: 'career.swot.modes.quadrant' },
  { value: 'radar', label: 'career.swot.modes.radar' },
  { value: 'matrix', label: 'career.swot.modes.matrix' }
];

const radarCategories = [
  { key: 'technical', label: 'career.swot.categories.technical' },
  { key: 'management', label: 'career.swot.categories.management' },
  { key: 'market', label: 'career.swot.categories.market' },
  { key: 'personal', label: 'career.swot.categories.personal' }
];

const setMode = (mode: VisualMode) => {
  currentMode.value = mode;
};

const hasValidDeadline = (deadline: unknown): deadline is Date => {
  if (!(deadline instanceof Date)) return false;
  return Number.isFinite(deadline.getTime());
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const drawRadarChart = () => {
  if (!radarCanvas.value || !props.analysis) return;

  const canvas = radarCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 50;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate category scores
  const categoryScores = radarCategories.reduce((acc, category) => {
    const strengths = props.analysis!.strengths.filter(item => item.category === category.key);
    const weaknesses = props.analysis!.weaknesses.filter(item => item.category === category.key);
    const opportunities = props.analysis!.opportunities.filter(item => item.category === category.key);
    const threats = props.analysis!.threats.filter(item => item.category === category.key);

    const strengthScore = strengths.reduce((sum, item) => sum + getImpactScore(item.impact), 0);
    const weaknessScore = weaknesses.reduce((sum, item) => sum + getImpactScore(item.impact), 0);
    const opportunityScore = opportunities.reduce((sum, item) => sum + getImpactScore(item.impact), 0);
    const threatScore = threats.reduce((sum, item) => sum + getImpactScore(item.impact), 0);

    // Calculate net score (positive - negative)
    const netScore = (strengthScore + opportunityScore) - (weaknessScore + threatScore);
    // Normalize to 0-10 scale
    const normalizedScore = Math.max(0, Math.min(10, (netScore + 10) / 2));

    acc[category.key] = normalizedScore;
    return acc;
  }, {} as Record<string, number>);

  // Draw radar grid
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Draw axes
  const angleStep = (2 * Math.PI) / radarCategories.length;
  radarCategories.forEach((category, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const labelX = centerX + Math.cos(angle) * (radius + 20);
    const labelY = centerY + Math.sin(angle) * (radius + 20);
    ctx.fillText(t(category.label), labelX, labelY);
  });

  // Draw data polygon
  ctx.strokeStyle = '#007bff';
  ctx.fillStyle = 'rgba(0, 123, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();

  radarCategories.forEach((category, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const score = categoryScores[category.key] || 0;
    const distance = (score / 10) * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    // Draw data points
    ctx.fillStyle = '#007bff';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = 'rgba(0, 123, 255, 0.2)';
  ctx.fill();
};

const getImpactScore = (impact: 'high' | 'medium' | 'low'): number => {
  switch (impact) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

watch(() => currentMode.value, async (newMode) => {
  if (newMode === 'radar') {
    await nextTick();
    drawRadarChart();
  }
});

watch(() => props.analysis, async () => {
  if (currentMode.value === 'radar') {
    await nextTick();
    drawRadarChart();
  }
});

onMounted(() => {
  if (currentMode.value === 'radar') {
    drawRadarChart();
  }
});
</script>

<style scoped lang="less">
.swot-analysis {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .swot-header {
    text-align: center;
    margin-bottom: 3rem;

    .swot-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--brand-text-primary);
      margin-bottom: 1rem;
      font-family: var(--brand-font-display);
    }

    .swot-description {
      font-size: 1.1rem;
      color: var(--brand-text-secondary);
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .swot-controls {
      display: flex;
      justify-content: center;
      gap: 1rem;

      .mode-btn {
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--brand-border);
        background: transparent;
        color: var(--brand-text-primary);
        border-radius: 8px;
        cursor: pointer;
        transition: all var(--brand-transition-base);
        font-weight: 500;
        font-family: var(--brand-font-body);

        &:hover {
          border-color: var(--brand-electric);
          color: var(--brand-electric);
          background: rgba(59, 130, 246, 0.05);
        }

        &.active {
          border-color: var(--brand-midnight);
          background: var(--brand-midnight);
          color: white;
          box-shadow: var(--brand-shadow-card);
        }
      }
    }
  }

  .swot-content {
    margin-bottom: 3rem;
  }

  // Quadrant View Styles
  .swot-quadrant {
    .quadrant-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      min-height: 600px;

      .quadrant {
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid var(--brand-border);
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        transition: transform var(--brand-transition-base);

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--brand-shadow-card);
        }

        &.strengths {
          border-top: 4px solid #28a745;
        }

        &.weaknesses {
          border-top: 4px solid #dc3545;
        }

        &.opportunities {
          border-top: 4px solid #007bff;
        }

        &.threats {
          border-top: 4px solid #ffc107;
        }

        .quadrant-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
          font-family: var(--brand-font-display);
          color: var(--brand-text-primary);
        }

        .quadrant-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .swot-item {
          padding: 1rem;
          background: #ffffff;
          border-radius: 8px;
          border-left: 4px solid transparent;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);

          &.impact-high {
            border-left-color: #dc3545;
          }

          &.impact-medium {
            border-left-color: #ffc107;
          }

          &.impact-low {
            border-left-color: #28a745;
          }

          .item-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--brand-text-primary);
          }

          .item-description {
            font-size: 0.9rem;
            color: var(--brand-text-secondary);
            margin-bottom: 0.5rem;
            line-height: 1.5;
          }

          .item-impact {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
            background: var(--brand-canvas-day);
            color: var(--brand-text-secondary);
            border: 1px solid var(--brand-border);
          }
        }
      }
    }
  }

  // Radar View Styles
  .swot-radar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    .radar-container {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid var(--brand-border);
      box-shadow: var(--brand-shadow-card);
    }

    .radar-legend {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;

          &.technical { background: #007bff; }
          &.management { background: #28a745; }
          &.market { background: #ffc107; }
          &.personal { background: #dc3545; }
        }

        .legend-label {
          font-size: 0.9rem;
          color: var(--brand-text-primary);
        }
      }
    }
  }

  // Matrix View Styles
  .swot-matrix {
    .matrix-container {
      position: relative;
      background: #ffffff;
      border-radius: 12px;
      padding: 3rem;
      border: 1px solid var(--brand-border);
      box-shadow: var(--brand-shadow-card);

      .matrix-axis {
        .axis-label {
          position: absolute;
          font-weight: 600;
          color: var(--brand-text-secondary);

          &.y-axis {
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
          }

          &.x-axis {
            right: 1rem;
            top: 50%;
            transform: translateY(-50%) rotate(90deg);
          }
        }
      }

      .matrix-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        min-height: 500px;

        .matrix-cell {
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid var(--brand-border);
          transition: transform var(--brand-transition-base);

          &:hover {
            transform: scale(1.02);
            box-shadow: var(--brand-shadow-card);
          }

          &.positive.internal {
            background: linear-gradient(135deg, rgba(40, 167, 69, 0.05), rgba(40, 167, 69, 0.02));
            border-color: #28a745;
          }

          &.positive.external {
            background: linear-gradient(135deg, rgba(0, 123, 255, 0.05), rgba(0, 123, 255, 0.02));
            border-color: #007bff;
          }

          &.negative.internal {
            background: linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(220, 53, 69, 0.02));
            border-color: #dc3545;
          }

          &.negative.external {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.05), rgba(255, 193, 7, 0.02));
            border-color: #ffc107;
          }

          h4 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            text-align: center;
            color: var(--brand-text-primary);
          }

          .matrix-items {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .matrix-item {
              padding: 0.5rem;
              background: #ffffff;
              border-radius: 4px;
              font-size: 0.9rem;
              text-align: center;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              color: var(--brand-text-secondary);
            }
          }
        }
      }
    }
  }

  // Analysis Results Styles
  .swot-analysis-results {
    background: #ffffff;
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid var(--brand-border);
    box-shadow: var(--brand-shadow-card);
    margin-top: 3rem;

    .analysis-section {
      margin-bottom: 2rem;

      &:last-child {
        margin-bottom: 0;
      }

      h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--brand-text-primary);
        font-family: var(--brand-font-display);
      }

      .insights-list,
      .recommendations-list {
        list-style: none;
        padding: 0;

        li {
          padding: 1rem;
          margin-bottom: 0.75rem;
          background: var(--brand-canvas-day);
          border-radius: 6px;
          border-left: 4px solid var(--brand-midnight);
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--brand-text-secondary);
        }
      }

      .action-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .action-item {
          padding: 1.5rem;
          background: var(--brand-canvas-day);
          border-radius: 8px;
          border-left: 4px solid transparent;
          transition: transform var(--brand-transition-base);

          &:hover {
            transform: translateX(4px);
          }

          &.priority-high {
            border-left-color: #dc3545;
          }

          &.priority-medium {
            border-left-color: #ffc107;
          }

          &.priority-low {
            border-left-color: #28a745;
          }

          .action-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--brand-text-primary);
          }

          .action-description {
            font-size: 0.9rem;
            color: var(--brand-text-secondary);
            margin-bottom: 1rem;
            line-height: 1.5;
          }

          .action-meta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;

            span {
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: 500;
              background: #ffffff;
              color: var(--brand-text-secondary);
              border: 1px solid var(--brand-border);
            }
          }
        }
      }
    }
  }

  // Responsive Design
  @media (max-width: 768px) {
    padding: 1rem;

    .swot-header {
      .swot-title {
        font-size: 2rem;
      }

      .swot-controls {
        flex-direction: column;
        align-items: center;

        .mode-btn {
          width: 200px;
        }
      }
    }

    .swot-quadrant .quadrant-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .swot-matrix .matrix-container {
      padding: 1.5rem;

      .matrix-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .radar-legend {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  panel: {
    type: Object,
    required: true,
  },
})

const metricMap = computed(() => {
  const map = Object.create(null)
  for (const metric of props.panel.metrics ?? []) {
    const key = metric.key.split(' ')[0]
    map[key] = metric
  }
  return map
})
</script>

<template>
  <section class="ocsa-detail-panel">
    <header class="ocsa-detail-panel__header">
      <div>
        <p class="ocsa-detail-panel__eyebrow">OCSA 산출 상세</p>
        <h2 class="ocsa-detail-panel__title">{{ panel.title }}</h2>
      </div>

      <div class="ocsa-detail-panel__formula-info">
        <button type="button" class="ocsa-detail-panel__info-button" aria-label="OCSA 수식 보기">
          !
        </button>

        <div class="ocsa-detail-panel__tooltip">
          <p class="ocsa-detail-panel__tooltip-title">OCSA 산출식</p>
          <p class="ocsa-detail-panel__tooltip-formula">
            D =
            <span class="ocsa-detail-panel__token ocsa-detail-panel__token--primary">V1({{ metricMap.V1?.value }})</span>
            × 0.32 +
            <span class="ocsa-detail-panel__token ocsa-detail-panel__token--warning">V2({{ metricMap.V2?.value }})</span>
            × 0.28 +
            <span class="ocsa-detail-panel__token ocsa-detail-panel__token--success">V3({{ metricMap.V3?.value }})</span>
            × 0.22 +
            <span class="ocsa-detail-panel__token ocsa-detail-panel__token--danger">V4({{ metricMap.V4?.value }})</span>
            × 0.18
          </p>
        </div>
      </div>
    </header>

    <div class="ocsa-detail-panel__metrics">
      <article
        v-for="metric in panel.metrics"
        :key="metric.key"
        class="ocsa-detail-panel__metric"
      >
        <p class="ocsa-detail-panel__metric-label">{{ metric.key }}</p>
        <strong class="ocsa-detail-panel__metric-value" :class="`ocsa-detail-panel__metric-value--${metric.tone}`">{{ metric.value }}</strong>
        <p class="ocsa-detail-panel__metric-desc">{{ metric.description }}</p>
        <div class="ocsa-detail-panel__metric-bar">
          <div :class="`ocsa-detail-panel__metric-fill ocsa-detail-panel__metric-fill--${metric.tone}`" :style="{ width: metric.barWidth }"></div>
        </div>
      </article>
    </div>

    <section class="ocsa-detail-panel__formula">
      <div class="ocsa-detail-panel__formula-head">
        <span>OCSA 최종 난이도</span>
        <span class="ocsa-detail-panel__confidence">검증 신뢰도 {{ panel.confidence }}</span>
      </div>
      <div class="ocsa-detail-panel__result">
        <div>
          <p>최종 등급</p>
        </div>
        <strong>{{ panel.grade }}</strong>
      </div>
    </section>
  </section>
</template>

<style scoped>
.ocsa-detail-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 12px;
  min-height: 0;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
  overflow: hidden;
}

.ocsa-detail-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.ocsa-detail-panel__eyebrow {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-primary-600);
}

.ocsa-detail-panel__title {
  margin-top: 4px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.ocsa-detail-panel__formula-info {
  position: relative;
}

.ocsa-detail-panel__info-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border-default);
  border-radius: 50%;
  background: #fff;
  color: var(--color-primary-600);
  font-size: 14px;
  font-weight: 800;
  cursor: default;
}

.ocsa-detail-panel__tooltip {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 10;
  width: 360px;
  padding: 14px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: var(--shadow-soft);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease;
}

.ocsa-detail-panel__formula-info:hover .ocsa-detail-panel__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.ocsa-detail-panel__tooltip-title {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
  color: var(--color-primary-600);
}

.ocsa-detail-panel__tooltip-formula {
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-default);
}

.ocsa-detail-panel__token {
  font-weight: 800;
}

.ocsa-detail-panel__token--primary { color: var(--color-primary-600); }
.ocsa-detail-panel__token--warning { color: var(--color-warning); }
.ocsa-detail-panel__token--success { color: var(--color-mint-500); }
.ocsa-detail-panel__token--danger { color: var(--color-danger); }

.ocsa-detail-panel__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-content: start;
  gap: 10px;
  min-height: 0;
}

.ocsa-detail-panel__metric {
  display: grid;
  gap: 7px;
  padding: 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
}

.ocsa-detail-panel__metric-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.ocsa-detail-panel__metric-value {
  font-size: 32px;
  line-height: 1;
}

.ocsa-detail-panel__metric-value--primary { color: var(--color-primary-600); }
.ocsa-detail-panel__metric-value--warning { color: var(--color-warning); }
.ocsa-detail-panel__metric-value--success { color: var(--color-mint-500); }
.ocsa-detail-panel__metric-value--danger { color: var(--color-danger); }

.ocsa-detail-panel__metric-desc {
  font-size: 12px;
  color: var(--color-text-muted);
}

.ocsa-detail-panel__metric-bar {
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--color-primary-100);
}

.ocsa-detail-panel__metric-fill { height: 100%; }
.ocsa-detail-panel__metric-fill--primary { background: var(--color-primary-600); }
.ocsa-detail-panel__metric-fill--warning { background: var(--color-warning); }
.ocsa-detail-panel__metric-fill--success { background: var(--color-mint-500); }
.ocsa-detail-panel__metric-fill--danger { background: var(--color-danger); }

.ocsa-detail-panel__formula {
  display: grid;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: var(--color-primary-800);
  color: #fff;
}

.ocsa-detail-panel__formula-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  font-weight: 700;
}

.ocsa-detail-panel__confidence {
  color: var(--color-mint-200);
}

.ocsa-detail-panel__result {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.ocsa-detail-panel__result p {
  font-size: 14px;
  color: #d8d3ff;
}

.ocsa-detail-panel__result strong {
  font-size: 38px;
  line-height: 1;
  color: #ffd84f;
}

@media (max-width: 1500px) {
  .ocsa-detail-panel__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .ocsa-detail-panel__header {
    align-items: stretch;
    flex-direction: column;
  }

  .ocsa-detail-panel__tooltip {
    left: 0;
    right: auto;
    width: min(360px, 90vw);
  }

  .ocsa-detail-panel__metrics {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
defineProps({
  report: { type: Object, required: true },
})

function barPercent(current, target) {
  return Math.min(100, Math.round((current / target) * 100))
}
</script>

<template>
  <div class="ar">
    <span class="ar__label">🤖 AI GAP 분석 리포트</span>

    <!-- Summary -->
    <div class="ar__summary">
      <p class="ar__summary-text">{{ report.summary }}</p>
      <span class="ar__confidence">데이터 신뢰도 {{ report.confidence }}</span>
    </div>

    <!-- Gap Cards -->
    <div class="ar__gaps">
      <div
        v-for="gap in report.gaps"
        :key="gap.id"
        class="ar__gap"
        :style="{ borderLeftColor: gap.color }"
      >
        <div class="ar__gap-top">
          <span class="ar__gap-priority" :style="{ background: gap.color + '20', color: gap.color }">
            {{ gap.priorityIcon }} {{ gap.priority }}
          </span>
          <span class="ar__gap-skill">{{ gap.skillName }}</span>
        </div>
        <span class="ar__gap-score">
          현재 {{ gap.current }} → 목표 {{ gap.target }} (Gap +{{ gap.gap }})
        </span>
        <div class="ar__gap-bar">
          <div
            class="ar__gap-bar-fill"
            :style="{ width: barPercent(gap.current, gap.target) + '%', background: gap.color }"
          ></div>
        </div>
        <span class="ar__gap-rec">{{ gap.recommendation }}</span>
      </div>
    </div>

    <!-- S+ Prediction -->
    <div class="ar__prediction">
      <span class="ar__prediction-title">📅 예상 S+ 달성</span>
      <p class="ar__prediction-normal">
        현재 성장률 유지 시: <strong>{{ report.prediction.normalDate }}</strong>
      </p>
      <p class="ar__prediction-fast">
        가속 훈련 시: {{ report.prediction.acceleratedDate }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.ar {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ar__label {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* ── Summary ───────────────────────────────────────────── */
.ar__summary {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 20px;
}

.ar__summary-text {
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  margin: 0 0 8px;
}

.ar__confidence {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* ── Gap Cards ─────────────────────────────────────────── */
.ar__gaps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ar__gap {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-left: 4px solid;
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ar__gap-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ar__gap-priority {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: var(--radius-2xs);
}

.ar__gap-skill {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-strong);
}

.ar__gap-score {
  font-size: 13px;
  color: var(--color-text-default);
}

.ar__gap-bar {
  width: 100%;
  height: 6px;
  background: var(--color-neutral-200);
  border-radius: 3px;
  overflow: hidden;
}

.ar__gap-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.ar__gap-rec {
  font-size: 13px;
  color: var(--color-primary-700);
  font-weight: 500;
}

/* ── Prediction ────────────────────────────────────────── */
.ar__prediction {
  background: var(--color-success-soft);
  border: 1px solid var(--color-status-approved-border);
  border-radius: var(--radius-md);
  padding: 18px 20px;
}

.ar__prediction-title {
  font-size: 13px;
  font-weight: 600;
  color: #166534;
}

.ar__prediction-normal {
  font-size: 16px;
  color: #14532d;
  margin: 8px 0 4px;
  line-height: 1.5;
}

.ar__prediction-fast {
  font-size: 13px;
  color: #16a34a;
  margin: 0;
}
</style>

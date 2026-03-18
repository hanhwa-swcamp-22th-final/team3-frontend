<script setup>
import { computed } from 'vue'
import { API_CHART, KAFKA_CHART, BATCH_HISTORY, ERROR_SUMMARY } from '@/mocks/admin/record/logData.js'

// ── API 라인 차트 SVG 경로 ───────────────────────────
const W = 380
const H = 70
const PAD = 10

const apiPolyline = computed(() => {
  const pts = API_CHART.points
  const min = 0
  const max = 150
  return pts.map((v, i) => {
    const x = PAD + (i / (pts.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2)
    return `${x},${y}`
  }).join(' ')
})

const apiThresholdY = computed(() => {
  const min = 0; const max = 150
  return H - PAD - ((API_CHART.threshold - min) / (max - min)) * (H - PAD * 2)
})

// ── Kafka 바 차트 ────────────────────────────────────
const kafkaMax = computed(() => Math.max(...KAFKA_CHART.bars))
</script>

<template>
  <div class="monitor-panel">
    <span class="panel-title">📊 시스템 모니터링</span>

    <!-- API 응답시간 라인 차트 -->
    <div class="chart-block">
      <span class="chart-label">{{ API_CHART.label }}</span>
      <svg class="chart-svg" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none">
        <!-- 임계선 -->
        <line
          :x1="PAD" :y1="apiThresholdY"
          :x2="W - PAD" :y2="apiThresholdY"
          stroke="#EF476F" stroke-width="1" stroke-dasharray="4,3"
        />
        <!-- 영역 채우기 -->
        <polygon
          :points="`${PAD},${H - PAD} ${apiPolyline} ${W - PAD},${H - PAD}`"
          fill="rgba(91, 79, 207, 0.1)"
        />
        <!-- 라인 -->
        <polyline
          :points="apiPolyline"
          fill="none"
          stroke="#5B4FCF"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>
      <span class="chart-sub">{{ API_CHART.sub }}</span>
    </div>

    <!-- Kafka 처리량 바 차트 -->
    <div class="chart-block">
      <span class="chart-label">{{ KAFKA_CHART.label }}</span>
      <div class="bar-chart">
        <div
          v-for="(bar, i) in KAFKA_CHART.bars"
          :key="i"
          class="bar-wrap"
        >
          <div
            class="bar"
            :style="{
              height: (bar / kafkaMax * 100) + '%',
              background: bar === kafkaMax ? '#5B4FCF' : '#00BF95',
            }"
          />
        </div>
      </div>
      <span class="chart-sub">{{ KAFKA_CHART.sub }}</span>
    </div>

    <!-- 배치 실행 이력 -->
    <div class="batch-block">
      <span class="batch-title">최근 배치 실행 이력</span>
      <div
        v-for="b in BATCH_HISTORY"
        :key="b.name"
        class="batch-row"
      >
        <span class="batch-name">{{ b.name }} {{ b.time }}</span>
        <span
          class="batch-status"
          :style="{ background: b.statusBg, color: b.statusColor }"
        >{{ b.status }}</span>
      </div>
    </div>

    <!-- 에러 요약 -->
    <div class="error-box">
      <span class="error-title">{{ ERROR_SUMMARY.title }}</span>
      <span v-for="item in ERROR_SUMMARY.items" :key="item" class="error-item">{{ item }}</span>
    </div>

  </div>
</template>

<style scoped>
.monitor-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 21.5px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-base);
  width: 462px;
  flex-shrink: 0;
  overflow-y: auto;

  box-sizing: border-box;
}

.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

/* 차트 블록 */
.chart-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.chart-label {
  font-size: 10px;
  color: var(--color-text-placeholder);
}

.chart-svg {
  width: 100%;
  height: 70px;
}

.chart-sub {
  font-size: 10px;
  color: var(--color-text-placeholder);
}

/* 바 차트 */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 70px;
  padding: 0 4px;
}

.bar-wrap {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  border-radius: 2px 2px 0 0;
  min-height: 4px;
}

/* 배치 이력 */
.batch-block {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.batch-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-placeholder);
  margin-bottom: 4px;
}

.batch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34px;
  border-bottom: 1.5px solid var(--color-border-row);
}

.batch-name {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.batch-status {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
}

/* 에러 요약 */
.error-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 13.5px 15px;
  background: var(--color-danger-bg);
  border: 1.5px solid var(--color-danger);
  border-left-width: 3px;
  border-radius: var(--radius-2xs);
  flex-shrink: 0;
}

.error-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-danger-text);
}

.error-item {
  font-size: 10px;
  color: var(--color-text-secondary);
}
</style>

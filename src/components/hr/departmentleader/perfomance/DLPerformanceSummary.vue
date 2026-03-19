<script setup>
import { computed } from 'vue'

const props = defineProps({
  summary:      { type: Object, required: true },
  teamTabs:     { type: Array,  default: () => [] },
  selectedTeam: { type: String, default: '전체' },
})

const emit = defineEmits(['update:selectedTeam'])

const progressPercent = computed(() =>
  Math.round((props.summary.evalCompleted / props.summary.evalTotal) * 100),
)

const avgLabel   = computed(() => props.selectedTeam === '전체' ? '부서 평균 점수' : '팀 평균 점수')
const deltaLabel = computed(() => props.selectedTeam === '전체' ? '전년 동기 대비'  : '부서 평균 대비')
</script>

<template>
  <section class="dl-perf-summary">
    <!-- 조직 개요 -->
    <div class="dl-perf-summary__card">
      <p class="dl-perf-summary__label">조직 개요</p>
      <div class="dl-perf-summary__org">
        <div class="dl-perf-summary__org-item">
          <span class="dl-perf-summary__big">{{ summary.totalMembers }}<span class="dl-perf-summary__unit">명</span></span>
          <span class="dl-perf-summary__sub">전체 인원</span>
        </div>
        <div class="dl-perf-summary__org-divider" />
        <div class="dl-perf-summary__org-item">
          <span class="dl-perf-summary__big">{{ summary.totalTeams }}<span class="dl-perf-summary__unit">팀</span></span>
          <span class="dl-perf-summary__sub">소속 팀</span>
        </div>
      </div>
      <!-- 팀 선택 탭 -->
      <div class="dl-perf-summary__team-tabs">
        <button
          v-for="team in teamTabs"
          :key="team"
          class="dl-perf-summary__team-tab"
          :class="{ 'dl-perf-summary__team-tab--active': selectedTeam === team }"
          @click="emit('update:selectedTeam', team)"
        >{{ team }}</button>
      </div>
    </div>

    <!-- 평가 진행률 -->
    <div class="dl-perf-summary__card">
      <div class="dl-perf-summary__progress-header">
        <p class="dl-perf-summary__label">평가 진행률</p>
        <span class="dl-perf-summary__progress-count">
          {{ summary.evalCompleted }} / {{ summary.evalTotal }}명 완료
        </span>
      </div>
      <div class="dl-perf-summary__bar-wrap">
        <div class="dl-perf-summary__bar-track">
          <div class="dl-perf-summary__bar-fill" :style="{ width: progressPercent + '%' }" />
        </div>
        <span class="dl-perf-summary__bar-pct">{{ progressPercent }}%</span>
      </div>
      <p class="dl-perf-summary__period">{{ summary.period }}</p>
    </div>

    <!-- 평균 점수 -->
    <div class="dl-perf-summary__card">
      <p class="dl-perf-summary__label">{{ avgLabel }}</p>
      <span class="dl-perf-summary__big dl-perf-summary__big--primary">
        {{ summary.deptAvg }}<span class="dl-perf-summary__unit">점</span>
      </span>
      <span
        class="dl-perf-summary__delta"
        :class="summary.deptAvgDelta >= 0 ? 'dl-perf-summary__delta--up' : 'dl-perf-summary__delta--down'"
      >
        {{ summary.deptAvgDelta >= 0 ? '▲' : '▼' }} {{ Math.abs(summary.deptAvgDelta) }} {{ deltaLabel }}
      </span>
    </div>
  </section>
</template>

<style scoped>
.dl-perf-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.dl-perf-summary__card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.dl-perf-summary__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
  margin: 0;
}

/* 조직 개요 */
.dl-perf-summary__org {
  display: flex;
  align-items: center;
  gap: 24px;
}

.dl-perf-summary__org-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dl-perf-summary__org-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border-default);
}

.dl-perf-summary__big {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800);
  line-height: 1;
}

.dl-perf-summary__big--primary {
  color: var(--color-primary-600);
}

.dl-perf-summary__unit {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-left: 2px;
}

.dl-perf-summary__sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* 팀 선택 탭 */
.dl-perf-summary__team-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.dl-perf-summary__team-tab {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 99px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  background: var(--color-bg-surface);
  cursor: pointer;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
}

.dl-perf-summary__team-tab--active {
  background: var(--color-primary-600);
  color: #fff;
  border-color: var(--color-primary-600);
}

/* 진행률 */
.dl-perf-summary__progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dl-perf-summary__progress-count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}

.dl-perf-summary__bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dl-perf-summary__bar-track {
  flex: 1;
  height: 12px;
  border-radius: 99px;
  background: var(--color-border-soft);
  overflow: hidden;
}

.dl-perf-summary__bar-fill {
  height: 100%;
  border-radius: 99px;
  background: var(--color-primary-600);
  transition: width 0.5s ease;
}

.dl-perf-summary__bar-pct {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-700);
  white-space: nowrap;
}

.dl-perf-summary__period {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 0;
}

/* 증감 */
.dl-perf-summary__delta {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}
.dl-perf-summary__delta--up   { color: #16a37a; }
.dl-perf-summary__delta--down { color: #e05a5a; }

@media (max-width: 900px) {
  .dl-perf-summary { grid-template-columns: 1fr; }
}
</style>

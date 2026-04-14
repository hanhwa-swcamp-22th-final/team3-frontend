<script setup>
import { computed } from 'vue'

const props = defineProps({
  groupAvg:    { type: Number, default: 0 },
  equipRate:   { type: String, default: '0%' },
  qualityRate: { type: String, default: '0명' },
  tierStats:   { type: Object, default: () => ({ s: 0, a: 0, b: 0, c: 0 }) },
})

const tiers = computed(() => {
  const { s, a, b, c } = props.tierStats
  const total = s + a + b + c || 1
  return [
    { label: 'S', count: s, pct: Math.round((s / total) * 100), cls: 'tier--s' },
    { label: 'A', count: a, pct: Math.round((a / total) * 100), cls: 'tier--a' },
    { label: 'B', count: b, pct: Math.round((b / total) * 100), cls: 'tier--b' },
    { label: 'C', count: c, pct: Math.round((c / total) * 100), cls: 'tier--c' },
  ]
})
</script>

<template>
  <section class="dl-kpi-card">
    <header class="dl-kpi-card__header">
      <div class="dl-kpi-card__title-row">
        <span class="dl-kpi-card__dot">●</span>
        <span class="dl-kpi-card__title">부서 성과 현황</span>
      </div>
    </header>

    <div class="dl-kpi-card__stats">
      <div class="dl-kpi-card__stat dl-kpi-card__stat--primary">
        <span class="dl-kpi-card__stat-value">{{ groupAvg }}</span>
        <span class="dl-kpi-card__stat-label">부서 평균 점수</span>
      </div>
      <div class="dl-kpi-card__stat dl-kpi-card__stat--mint">
        <span class="dl-kpi-card__stat-value">{{ equipRate }}</span>
        <span class="dl-kpi-card__stat-label">평가율</span>
      </div>
      <div class="dl-kpi-card__stat dl-kpi-card__stat--gold">
        <span class="dl-kpi-card__stat-value">{{ qualityRate }}</span>
        <span class="dl-kpi-card__stat-label">S/A Tier</span>
      </div>
    </div>

    <div class="dl-kpi-card__tier-section">
      <p class="dl-kpi-card__tier-title">Tier 분포</p>
      <div class="dl-kpi-card__tier-list">
        <div v-for="tier in tiers" :key="tier.label" class="dl-kpi-card__tier-row">
          <span class="dl-kpi-card__tier-label" :class="tier.cls">{{ tier.label }}</span>
          <div class="dl-kpi-card__tier-bar-track">
            <div
              class="dl-kpi-card__tier-bar-fill"
              :class="tier.cls"
              :style="{ width: tier.pct + '%' }"
            />
          </div>
          <span class="dl-kpi-card__tier-count">{{ tier.count }}명</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dl-kpi-card {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dl-kpi-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dl-kpi-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dl-kpi-card__dot {
  font-size: var(--font-size-2xs);
  color: var(--color-primary-500);
}

.dl-kpi-card__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.dl-kpi-card__stats {
  display: flex;
  gap: 32px;
}

.dl-kpi-card__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dl-kpi-card__stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.dl-kpi-card__stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.dl-kpi-card__stat--primary .dl-kpi-card__stat-value { color: var(--color-primary-700); }
.dl-kpi-card__stat--mint    .dl-kpi-card__stat-value { color: var(--color-mint-500, #18c3aa); }
.dl-kpi-card__stat--gold    .dl-kpi-card__stat-value { color: #d97706; }

/* Tier 분포 */
.dl-kpi-card__tier-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dl-kpi-card__tier-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  margin: 0;
}

.dl-kpi-card__tier-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dl-kpi-card__tier-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dl-kpi-card__tier-label {
  width: 20px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-align: center;
  flex-shrink: 0;
}

.dl-kpi-card__tier-bar-track {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: var(--color-border-muted, #ede9ff);
  overflow: hidden;
}

.dl-kpi-card__tier-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.dl-kpi-card__tier-count {
  width: 36px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-align: right;
  flex-shrink: 0;
}

/* Tier 색상 */
.tier--s { color: var(--tier-s, #9c27b0); }
.tier--a { color: var(--tier-a, #e65100); }
.tier--b { color: var(--tier-b, #1565c0); }
.tier--c { color: var(--tier-c, #2e7d32); }

.dl-kpi-card__tier-bar-fill.tier--s { background: var(--tier-s, #9c27b0); }
.dl-kpi-card__tier-bar-fill.tier--a { background: var(--tier-a, #e65100); }
.dl-kpi-card__tier-bar-fill.tier--b { background: var(--tier-b, #1565c0); }
.dl-kpi-card__tier-bar-fill.tier--c { background: var(--tier-c, #2e7d32); }
</style>

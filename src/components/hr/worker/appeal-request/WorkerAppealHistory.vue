<script setup>
import { formatEvaluationPeriodLabel } from '@/utils/evaluationPeriod'

const props = defineProps({
  history: { type: Array, required: true },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])

function badgeClass(item) {
  if (item.displayBadgeTone === 'appeal') return 'badge--appeal'
  if (item.displayBadgeTone === 'completed') return 'badge--completed'
  if (item.displayBadgeTone === 'review') return 'badge--review'
  if (item.displayBadgeTone === 'appealable') return 'badge--appealable'
  return 'badge--confirmed'
}

function tierClass(tier) {
  if (tier === 'S') return 'tier--s'
  if (tier === 'A') return 'tier--a'
  if (tier === 'B') return 'tier--b'
  return 'tier--c'
}

function periodLabel(item) {
  return formatEvaluationPeriodLabel(item, { fallback: '-' })
}

function fmt(val) {
  if (val == null) return '—'
  return Number(val).toFixed(1)
}
</script>

<template>
  <div class="ah">
    <div class="ah__header">
      <h3 class="ah__title">내 이의신청 / 평가 이력</h3>
    </div>

    <div class="ah__list">
      <div
        v-for="item in history"
        :key="item.id"
        class="ah__card"
        :class="{ 'ah__card--selected': selectedId === item.id }"
        @click="emit('select', item.id)"
      >
        <div class="ah__card-top">
          <span class="ah__period">{{ periodLabel(item) }}</span>
          <span class="ah__badge" :class="badgeClass(item)">{{ item.displayBadge }}</span>
        </div>

        <div class="ah__scores">
          <div class="ah__score-item">
            <span class="ah__score-label">1차</span>
            <span class="ah__score-value">{{ fmt(item.firstScore) }}</span>
          </div>
          <div class="ah__score-divider" />
          <div class="ah__score-item">
            <span class="ah__score-label">2차</span>
            <span class="ah__score-value">{{ fmt(item.secondScore) }}</span>
          </div>
          <div class="ah__score-divider" />
          <div class="ah__score-item">
            <span class="ah__score-label">정량</span>
            <span class="ah__score-value">{{ fmt(item.quantScore) }}</span>
          </div>
        </div>

        <div class="ah__card-bottom">
          <span v-if="item.grade" class="ah__tier" :class="tierClass(item.grade)">
            {{ item.grade }}
          </span>
          <span class="ah__final-score">최종 {{ fmt(item.score) }}점</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ah {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ah__header {
  display: flex;
  align-items: center;
}

.ah__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.ah__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ah__card {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ah__card:hover {
  border-color: var(--color-primary-300);
}

.ah__card--selected {
  background: var(--color-primary-100);
  border-color: var(--color-primary-700);
  border-width: 2px;
  padding: 17px 19px;
}

.ah__card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ah__period {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.ah__badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-2xs);
}

.badge--review {
  background: var(--color-warning-soft);
  color: #92400e;
}

.badge--appeal {
  background: #e0f2fe;
  color: #075985;
}

.badge--appealable {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.badge--completed {
  background: var(--color-success-soft);
  color: #166534;
}

.badge--confirmed {
  background: var(--color-success-soft);
  color: #166534;
}

.ah__scores {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ah__score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.ah__score-label {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.ah__score-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ah__score-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border-default);
}

.ah__card-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ah__tier {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-white);
  padding: 2px 8px;
  border-radius: var(--radius-2xs);
}

.tier--s { background: var(--tier-s); }
.tier--a { background: var(--color-primary-700); }
.tier--b { background: var(--tier-b); color: #92400e; }
.tier--c { background: var(--tier-c); }

.ah__final-score {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>

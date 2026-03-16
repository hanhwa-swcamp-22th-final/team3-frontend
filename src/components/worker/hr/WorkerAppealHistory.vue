<script setup>
const props = defineProps({
  history: { type: Array, required: true },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])

function tierClass(tier) {
  if (tier === 'S') return 'tier--s'
  if (tier === 'A') return 'tier--a'
  if (tier === 'B') return 'tier--b'
  return 'tier--c'
}

function diffClass(val) {
  return val > 0 ? 'diff--up' : val < 0 ? 'diff--down' : ''
}

function diffText(val) {
  if (val > 0) return `▲${val}`
  if (val < 0) return `▼${Math.abs(val)}`
  return '—'
}

function statusBadgeClass(status) {
  if (status === '검토중') return 'badge--review'
  return 'badge--confirmed'
}
</script>

<template>
  <div class="ah">
    <div class="ah__header">
      <span class="ah__icon">📊</span>
      <h3 class="ah__title">내 평가 이력</h3>
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
          <span class="ah__quarter">{{ item.quarter }}</span>
          <span class="ah__badge" :class="statusBadgeClass(item.statusBadge)">
            {{ item.statusBadge }}
          </span>
        </div>
        <div class="ah__card-score">
          <span class="ah__score">{{ item.score }}</span>
          <span class="ah__tier" :class="tierClass(item.tier)">{{ item.tier }}</span>
          <span class="ah__diff" :class="diffClass(item.diff)">{{ diffText(item.diff) }}</span>
        </div>
        <span class="ah__status-text">{{ item.statusText }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ah {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ah__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ah__icon {
  font-size: 16px;
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
  border-radius: 14px;
  padding: 20px 22px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ah__card:hover {
  border-color: var(--color-primary-300);
}

.ah__card--selected {
  background: var(--color-primary-100);
  border-color: var(--color-primary-700);
  border-width: 2px;
  padding: 19px 21px;
}

.ah__card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.ah__quarter {
  font-size: 13px;
  color: var(--color-text-muted);
}

.ah__badge {
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
}

.badge--review {
  background: #fef3c7;
  color: #92400e;
}

.badge--confirmed {
  background: #dcfce7;
  color: #166534;
}

.ah__card-score {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.ah__score {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1;
}

.ah__tier {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 6px;
}

.tier--s {
  background: #00BF95;
}

.tier--a {
  background: var(--color-primary-700);
}

.tier--b {
  background: #FFD166;
  color: #92400e;
}

.tier--c {
  background: #EF476F;
}

.ah__diff {
  font-size: 14px;
  font-weight: 700;
}

.diff--up {
  color: #00BF95;
}

.diff--down {
  color: var(--color-danger);
}

.ah__status-text {
  font-size: 13px;
  color: var(--color-text-muted);
}

.ah__card--selected .ah__status-text {
  color: var(--color-primary-700);
}
</style>

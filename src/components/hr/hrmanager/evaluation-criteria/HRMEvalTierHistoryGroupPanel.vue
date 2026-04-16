<script setup>
const TIER_ORDER = ['S', 'A', 'B', 'C']

defineProps({
  groups: { type: Array, default: () => [] },
})

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function groupStatusLabel(group) {
  if (group.deleted) return '삭제'
  if (group.active) return '현재 적용'
  return '이전 값'
}

function orderedItems(items = []) {
  return [...items].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))
}
</script>

<template>
  <article class="eval-history-card">
    <div class="eval-history-card__header">
      <p class="eval-history-card__title">Tier 승급 기준점 변경 이력</p>
      <p class="eval-history-card__caption">저장 단위로 묶어서 표시합니다.</p>
    </div>

    <div v-if="!groups.length" class="eval-history-card__empty">표시할 변경 이력이 없습니다.</div>

    <div v-else class="eval-history-card__group-list">
      <section v-for="group in groups" :key="group.versionKey" class="eval-history-group">
        <div class="eval-history-group__meta">
          <div>
            <p class="eval-history-group__meta-label">저장 시각</p>
            <p class="eval-history-group__meta-value">{{ formatDateTime(group.updatedAt || group.createdAt) }}</p>
          </div>
          <span :class="['eval-history-card__badge', { 'is-active': group.active, 'is-deleted': group.deleted }]">
            {{ groupStatusLabel(group) }}
          </span>
        </div>

        <div class="eval-history-group__grid">
          <div v-for="item in orderedItems(group.items)" :key="item.tierConfigId" class="eval-history-group__row">
            <span class="eval-history-group__tier">{{ item.tier }}</span>
            <span class="eval-history-group__point">{{ item.tierConfigPromotionPoint }}</span>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.eval-history-card {
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.eval-history-card__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.eval-history-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}
.eval-history-card__caption {
  font-size: var(--font-size-xs);
  color: var(--color-text-subtle);
}
.eval-history-card__empty {
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-text-subtle);
}
.eval-history-card__group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.eval-history-group {
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.eval-history-group__meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.eval-history-group__meta-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-subtle);
}
.eval-history-group__meta-value {
  margin-top: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
}
.eval-history-group__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.eval-history-group__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--color-bg-app);
  font-size: var(--font-size-sm);
}
.eval-history-group__tier {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}
.eval-history-group__point {
  font-weight: var(--font-weight-semibold);
}
.eval-history-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}
.eval-history-card__badge.is-active {
  background: #e3fbef;
  color: #007a60;
}
.eval-history-card__badge.is-deleted {
  background: #fdecec;
  color: var(--color-danger);
}
</style>

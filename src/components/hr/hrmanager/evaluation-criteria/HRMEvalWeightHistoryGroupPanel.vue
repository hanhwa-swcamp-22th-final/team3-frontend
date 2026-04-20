<script setup>
const CATEGORY_LABELS = {
  PRODUCTIVITY: '생산 목표 달성',
  EQUIPMENT_RESPONSE: '설비 대응',
  PROCESS_INNOVATION: '공정 개선/혁신',
  KNOWLEDGE_SHARING: '지식 공유',
}

const WEIGHT_ORDER = [
  'SA:PRODUCTIVITY',
  'SA:EQUIPMENT_RESPONSE',
  'SA:PROCESS_INNOVATION',
  'SA:KNOWLEDGE_SHARING',
  'BC:PRODUCTIVITY',
  'BC:EQUIPMENT_RESPONSE',
  'BC:PROCESS_INNOVATION',
  'BC:KNOWLEDGE_SHARING',
]

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

function orderKey(item) {
  return `${item.tierGroup}:${item.categoryCode}`
}

function orderedItems(items = []) {
  return [...items].sort((a, b) => WEIGHT_ORDER.indexOf(orderKey(a)) - WEIGHT_ORDER.indexOf(orderKey(b)))
}
</script>

<template>
  <article class="eval-history-card">
    <div class="eval-history-card__header">
      <p class="eval-history-card__title">직급군별 평가 비중 변경 이력</p>
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
          <div v-for="item in orderedItems(group.items)" :key="item.evaluationWeightConfigId" class="eval-history-group__row">
            <div class="eval-history-group__labels">
              <span class="eval-history-group__tier">{{ item.tierGroup }}</span>
              <span class="eval-history-group__category">{{ CATEGORY_LABELS[item.categoryCode] ?? item.categoryCode }}</span>
            </div>
            <span class="eval-history-group__point">{{ item.weightPercent }}%</span>
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
  border-radius: 16px;
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
  border-radius: 14px;
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
  border-radius: 16px;
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
  border-radius: 12px;
  background: var(--color-bg-app);
  gap: 12px;
}
.eval-history-group__labels {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.eval-history-group__tier {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}
.eval-history-group__category {
  font-size: var(--font-size-sm);
}
.eval-history-group__point {
  font-weight: var(--font-weight-semibold);
}
.eval-history-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
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

@media (max-width: 768px) {
  .eval-history-group__grid {
    grid-template-columns: 1fr;
  }
}
</style>

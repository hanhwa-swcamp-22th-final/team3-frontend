<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
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

function statusLabel(item) {
  if (item.deleted) return '삭제'
  if (item.active) return '현재 적용'
  return '이전 값'
}
</script>

<template>
  <article class="eval-history-card">
    <p class="eval-history-card__title">Tier 승급 기준점 변경 이력</p>

    <table class="eval-history-card__table">
      <thead>
        <tr>
          <th>Tier</th>
          <th>기준점</th>
          <th>상태</th>
          <th>저장 시각</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.tierConfigId">
          <td>{{ item.tier }}</td>
          <td>{{ item.tierConfigPromotionPoint }}</td>
          <td>
            <span :class="['eval-history-card__badge', { 'is-active': item.active, 'is-deleted': item.deleted }]">
              {{ statusLabel(item) }}
            </span>
          </td>
          <td>{{ formatDateTime(item.updatedAt || item.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
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
.eval-history-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}
.eval-history-card__table {
  width: 100%;
  border-collapse: collapse;
}
.eval-history-card__table th,
.eval-history-card__table td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--color-border-default);
  text-align: left;
  font-size: var(--font-size-sm);
}
.eval-history-card__table th {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
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

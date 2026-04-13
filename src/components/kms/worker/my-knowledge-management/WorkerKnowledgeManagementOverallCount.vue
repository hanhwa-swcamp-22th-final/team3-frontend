<script setup>
defineProps({
  counts: { type: Object, required: true },
})

const cards = (counts) => [
  { key: 'total', label: '전체 문서 수', value: counts.total, tone: 'total' },
  { key: 'approved', label: '승인 완료', value: counts.approved, tone: 'approved' },
  { key: 'pending', label: '승인 대기', value: counts.pending, tone: 'pending' },
  { key: 'rejected', label: '반려', value: counts.rejected, tone: 'rejected' },
  { key: 'draft', label: '임시 저장', value: counts.draft, tone: 'draft' },
]
</script>

<template>
  <div class="koc">
    <article
      v-for="card in cards(counts)"
      :key="card.key"
      class="koc__card"
      :class="`koc__card--${card.tone}`"
    >
      <p class="koc__label">{{ card.label }}</p>
      <strong class="koc__value">{{ card.value }}</strong>
    </article>
  </div>
</template>

<style scoped>
.koc {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.koc__card {
  min-height: 96px;
  padding: 20px 22px;
  border: 1px solid;
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.koc__label {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.koc__value {
  font-size: 36px;
  font-weight: 800;
  font-family: var(--font-family-num);
  line-height: 1;
}

.koc__card--total {
  background: var(--color-primary-100);
  border-color: var(--color-primary-300);
  color: var(--color-primary-800);
}

.koc__card--approved {
  background: var(--color-status-approved-bg);
  border-color: var(--color-status-approved-border);
  color: var(--color-status-approved);
}

.koc__card--pending {
  background: var(--color-status-pending-bg);
  border-color: var(--color-status-pending-border);
  color: var(--color-status-pending);
}

.koc__card--rejected {
  background: var(--color-status-rejected-bg);
  border-color: var(--color-status-rejected-border);
  color: var(--color-status-rejected);
}

.koc__card--draft {
  background: var(--color-neutral-100);
  border-color: var(--color-border-default);
  color: var(--color-text-muted);
}

@media (max-width: 1280px) {
  .koc {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .koc {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

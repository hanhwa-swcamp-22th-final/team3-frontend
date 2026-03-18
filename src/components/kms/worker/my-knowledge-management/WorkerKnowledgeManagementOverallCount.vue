<script setup>
import { BaseStatCard } from '@/components/common/base'

defineProps({
  counts: { type: Object, required: true },
})
</script>

<template>
  <div class="koc">
    <BaseStatCard label="전체 문서 수" :value="counts.total" :helper="counts.totalSub" />
    <BaseStatCard label="승인 완료" :value="counts.approved" :helper="counts.approvedSub" />
    <BaseStatCard label="승인 대기" :value="counts.pending" :helper="counts.pendingSub" class="koc__card--warning" />
    <BaseStatCard label="임시 저장" :value="counts.draft" :helper="counts.draftSub" />
  </div>
</template>

<style scoped>
.koc {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.koc :deep(.base-stat-card__value) {
  font-size: 36px;
  font-weight: 800;
  font-family: var(--font-family-num);
  line-height: 1.2;
}

.koc__card--warning :deep(.base-stat-card__value) {
  color: var(--color-status-pending);
}
</style>

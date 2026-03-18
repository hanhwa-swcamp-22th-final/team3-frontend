<script setup>
import { BaseStatCard } from '@/components/common/base'

defineProps({
  total: { type: Number, default: 0 },
  inProgress: { type: Number, default: 0 },
  done: { type: Number, default: 0 },
})
</script>

<template>
  <div class="jc">
    <BaseStatCard label="배정 작업" :value="total" valueSuffix="건" />
    <BaseStatCard label="진행중" :value="inProgress" valueSuffix="건" class="jc__card--progress" />
    <BaseStatCard label="완료" :value="done" valueSuffix="건" class="jc__card--done" />
  </div>
</template>

<style scoped>
.jc {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.jc :deep(.base-stat-card__value) {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
}

.jc :deep(.base-stat-card__value-suffix) {
  font-size: 20px;
  font-weight: 700;
}

.jc__card--progress :deep(.base-stat-card__label) {
  color: var(--color-primary-700);
}

.jc__card--progress :deep(.base-stat-card__value) {
  color: var(--color-primary-700);
}

.jc__card--done :deep(.base-stat-card__label) {
  color: var(--color-text-muted);
}

.jc__card--done :deep(.base-stat-card__value) {
  color: var(--color-text-muted);
}
</style>

<script setup>
import { BaseProgressBar, BaseStatCard } from '@/components/common/base'

defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  delta: {
    type: String,
    default: '',
  },
  helper: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'primary',
  },
  progressValue: {
    type: Number,
    default: null,
  },
  progressTone: {
    type: String,
    default: 'success',
  },
})
</script>

<template>
  <BaseStatCard
    :label="label"
    :value="value"
    :delta="delta"
    :helper="helper"
    :tone="tone"
  >
    <template v-if="progressValue !== null">
      <div class="teamleader-metric-card__progress">
        <BaseProgressBar
          :value="progressValue"
          :tone="progressTone"
          :show-percent="false"
          size="sm"
        />
      </div>
    </template>
  </BaseStatCard>
</template>

<style scoped>
.teamleader-metric-card__progress {
  width: min(220px, 100%);
}
</style>

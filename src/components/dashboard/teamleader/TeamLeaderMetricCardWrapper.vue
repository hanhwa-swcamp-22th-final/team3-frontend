<script setup>
import BaseStatCard from '@/components/common/base/display/BaseStatCard.vue'

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
})
</script>

<template>
  <BaseStatCard
    :label="label"
    :value="value"
    :delta="delta"
    :helper="helper"
    :tone="tone"
  />
</template>

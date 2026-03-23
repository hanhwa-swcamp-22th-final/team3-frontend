<script setup>
import { BaseStatCard } from '@/components/common/base'

defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
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
    :helper="helper"
    :tone="tone"
  />
</template>

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
    variant="compact"
  />
</template>

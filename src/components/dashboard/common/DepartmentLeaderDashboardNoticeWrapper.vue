<script setup>
import BaseNoticeBanner from '@/components/common/base/display/BaseNoticeBanner.vue'

defineProps({
  badge:       { type: String, default: '' },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <BaseNoticeBanner
    :badge="badge"
    :title="title"
    :description="description"
    tone="success"
    variant="soft"
  />
</template>

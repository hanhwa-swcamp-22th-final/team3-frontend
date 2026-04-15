<script setup>
import { BaseNoticeBanner } from '@/components/common/base'

defineProps({
  badge: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <BaseNoticeBanner
    class="notice"
    :badge="badge"
    :title="title"
    :description="description"
    tone="success"
    variant="soft"
    role="button"
    tabindex="0"
    @click="emit('click')"
    @keydown.enter.prevent="emit('click')"
    @keydown.space.prevent="emit('click')"
  />
</template>

<style scoped>
.notice {
  cursor: pointer;
}
</style>

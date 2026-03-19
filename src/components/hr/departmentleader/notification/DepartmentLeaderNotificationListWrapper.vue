<script setup>
import BaseNotificationList from '@/components/common/base/data-display/BaseNotificationList.vue'

defineProps({
  items:    { type: Array,  default: () => [] },
  pageSize: { type: Number, default: 6 },
})

const emit = defineEmits(['click-action'])
</script>

<template>
  <BaseNotificationList
    :items="items"
    :page-size="pageSize"
    @click-action="emit('click-action', $event)"
  />
</template>

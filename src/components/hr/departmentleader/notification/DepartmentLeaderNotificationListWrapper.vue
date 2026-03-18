<script setup>
import BaseNotificationList from '@/components/common/base/data-display/BaseNotificationList.vue'

defineProps({
  items:    { type: Array,  default: () => [] },
  pageSize: { type: Number, default: 6 },
})
</script>

<template>
  <BaseNotificationList
    :items="items"
    :page-size="pageSize"
  />
</template>

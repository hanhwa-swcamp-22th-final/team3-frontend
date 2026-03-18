<script setup>
import BaseNotificationList from '@/components/common/base/data-display/BaseNotificationList.vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  selectedItemId: {
    type: Number,
    default: null,
  },
  pageSize: {
    type: Number,
    default: 4,
  },
})

defineEmits(['click-item', 'click-action', 'change-page'])
</script>

<template>
  <BaseNotificationList
    :items="items"
    :selected-item-id="selectedItemId"
    :page-size="pageSize"
    @click-item="$emit('click-item', $event)"
    @click-action="$emit('click-action', $event)"
    @change-page="$emit('change-page', $event)"
  />
</template>

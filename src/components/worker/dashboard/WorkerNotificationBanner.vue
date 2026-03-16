<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="notification">
    <div class="notification__header">
      <span class="notification__icon">🔥</span>
      <span class="notification__badge">중요 공지</span>
    </div>
    <p class="notification__title">{{ title }}</p>
    <p v-if="description" class="notification__desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.notification {
  background: #ffffff;
  border: 1px solid #E0DCFF;
  border-left: 4px solid #EF476F;
  border-radius: 12px;
  padding: 16px 20px;
}

.notification__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.notification__icon {
  font-size: 14px;
}

.notification__badge {
  font-size: 11px;
  font-weight: 700;
  color: #EF476F;
}

.notification__title {
  font-size: 14px;
  font-weight: 700;
  color: #2D1F6E;
  margin: 0 0 4px;
}

.notification__desc {
  font-size: 12px;
  color: #7a72a0;
  margin: 0;
  line-height: 1.5;
}
</style>

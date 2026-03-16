<script setup>
defineProps({
  filters: {
    type: Array,
    default: () => [],
  },
  activeFilter: {
    type: String,
    default: 'all',
  },
})
</script>

<template>
  <section class="notification-filter">
    <div class="notification-filter__header">
      <p class="notification-filter__eyebrow">전체 알림</p>
    </div>

    <div class="notification-filter__tabs">
      <button
        v-for="filter in filters"
        :key="filter.key"
        type="button"
        class="notification-filter__tab"
        :class="{ 'notification-filter__tab--active': filter.key === activeFilter }"
      >
        {{ filter.label }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.notification-filter {
  padding: 18px 20px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  background: var(--color-bg-surface);
}

.notification-filter__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.notification-filter__tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 14px;
  border-bottom: 1px solid #ece8ff;
}

.notification-filter__tab {
  height: 36px;
  padding: 0 2px;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: #a7a1d8;
  font-weight: 700;
  cursor: pointer;
}

.notification-filter__tab--active {
  color: var(--color-primary-700);
  border-bottom-color: var(--color-primary-600);
}
</style>

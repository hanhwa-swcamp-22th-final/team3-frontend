<script setup>
defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  activeLabel: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="period-filter">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      class="period-filter__chip"
      :class="{ 'period-filter__chip--active': option === activeLabel }"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.period-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.period-filter__chip {
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  background: var(--color-bg-surface);
  color: var(--color-primary-500);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.period-filter__chip--active {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}
</style>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  variant: {
    type: String,
    default: 'chip',
  },
  size: {
    type: String,
    default: 'md',
  },
  wrap: {
    type: Boolean,
    default: true,
  },
  showCount: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

function itemKey(item) {
  return typeof item === 'object' ? item.key : item
}

function itemLabel(item) {
  return typeof item === 'object' ? item.label : item
}

function itemCount(item) {
  return typeof item === 'object' ? item.count : null
}

function selectItem(item) {
  const key = itemKey(item)
  emit('update:modelValue', key)
  emit('change', key)
}
</script>

<template>
  <div
    class="base-filter-tabs"
    :class="[
      `base-filter-tabs--${variant}`,
      `base-filter-tabs--${size}`,
      { 'base-filter-tabs--wrap': wrap },
    ]"
  >
    <button
      v-for="item in items"
      :key="itemKey(item)"
      type="button"
      class="base-filter-tabs__item"
      :class="{ 'base-filter-tabs__item--active': itemKey(item) === modelValue }"
      @click="selectItem(item)"
    >
      <span>{{ itemLabel(item) }}</span>
      <span
        v-if="showCount && itemCount(item) !== null && itemCount(item) !== undefined"
        class="base-filter-tabs__count"
      >
        ({{ itemCount(item) }})
      </span>
    </button>
  </div>
</template>

<style scoped>
.base-filter-tabs {
  display: flex;
  gap: 10px;
}

.base-filter-tabs--wrap {
  flex-wrap: wrap;
}

.base-filter-tabs__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.base-filter-tabs--chip .base-filter-tabs__item {
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  background: var(--color-bg-surface);
  color: var(--color-primary-500);
  font-weight: 700;
}

.base-filter-tabs--chip .base-filter-tabs__item--active {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.base-filter-tabs--underline {
  gap: 18px;
  border-bottom: 1px solid #ece8ff;
}

.base-filter-tabs--underline .base-filter-tabs__item {
  height: 36px;
  padding: 0 2px;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: #a7a1d8;
  font-weight: 700;
}

.base-filter-tabs--underline .base-filter-tabs__item--active {
  color: var(--color-primary-700);
  border-bottom-color: var(--color-primary-600);
}

.base-filter-tabs--sm .base-filter-tabs__item {
  font-size: var(--font-size-xs-plus);
}

.base-filter-tabs--md .base-filter-tabs__item {
  font-size: var(--font-size-base);
}

.base-filter-tabs--lg .base-filter-tabs__item {
  font-size: var(--font-size-base-plus);
}

.base-filter-tabs__count {
  opacity: 0.9;
}
</style>


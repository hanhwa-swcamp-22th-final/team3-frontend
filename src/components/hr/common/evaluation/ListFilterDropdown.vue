<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  valueLabel: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
  open: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'select'])
</script>

<template>
  <div class="list-filter-dropdown">
    <button
      type="button"
      class="list-filter-dropdown__button"
      :class="{ 'list-filter-dropdown__button--disabled': disabled }"
      :disabled="disabled"
      @click="emit('toggle')"
    >
      <span class="list-filter-dropdown__label">{{ label }}: {{ valueLabel }}</span>
      <span class="list-filter-dropdown__chevron" :class="{ 'list-filter-dropdown__chevron--open': open }">▾</span>
    </button>
    <ul v-if="open && !disabled" class="list-filter-dropdown__menu">
      <li
        v-for="option in options"
        :key="option.value"
        class="list-filter-dropdown__option"
        :class="{ 'list-filter-dropdown__option--active': modelValue === option.value }"
        @click="emit('select', option.value)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list-filter-dropdown {
  position: relative;
  flex: 1;
  min-width: 0;
}

.list-filter-dropdown__button {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 38px;
  padding: 0 36px 0 14px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  box-sizing: border-box;
  outline: none;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;
}

.list-filter-dropdown__button:hover:not(:disabled) {
  border-color: var(--color-border-strong);
  background: var(--color-bg-surface);
}

.list-filter-dropdown__button:focus-visible:not(:disabled) {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(91, 80, 214, 0.08);
}

.list-filter-dropdown__button[disabled] {
  opacity: 1;
}

.list-filter-dropdown__button--disabled {
  cursor: not-allowed;
  color: var(--color-text-muted);
  background: var(--color-bg-surface-muted);
}

.list-filter-dropdown__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-filter-dropdown__chevron {
  position: absolute;
  right: 10px;
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.2s ease;
}

.list-filter-dropdown__chevron--open {
  transform: rotate(180deg);
}

.list-filter-dropdown__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 10;
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  box-sizing: border-box;
}

.list-filter-dropdown__option {
  padding: 10px 14px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  color: var(--color-text-default);
}

.list-filter-dropdown__option:hover {
  background: var(--color-primary-100);
}

.list-filter-dropdown__option--active {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  background: var(--color-primary-100);
}
</style>

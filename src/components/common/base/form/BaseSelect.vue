<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: {
    type: Array,
    default: () => [],
    // [{ value, label }]
  },
  placeholder: { type: String, default: '선택' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="base-select-wrap">
    <select
      class="base-select"
      :class="{ 'base-select--error': error, 'base-select--disabled': disabled }"
      :value="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <span class="base-select__arrow" aria-hidden="true">▾</span>
  </div>
</template>

<style scoped>
.base-select-wrap {
  position: relative;
  width: 100%;
}

.base-select {
  width: 100%;
  height: 40px;
  padding: 0 36px 0 12px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-strong);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.base-select:focus {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus);
}

.base-select--error {
  border-color: var(--color-danger);
}

.base-select--disabled {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.base-select__arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
  pointer-events: none;
}
</style>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    class="base-input"
    :class="{ 'base-input--error': error, 'base-input--disabled': disabled }"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
.base-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-strong);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.base-input::placeholder {
  color: var(--color-text-placeholder);
}

.base-input:focus {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus);
}

.base-input--error {
  border-color: var(--color-danger);
}

.base-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 71, 111, 0.14);
}

.base-input--disabled,
.base-input[readonly] {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-muted);
  cursor: not-allowed;
}
</style>

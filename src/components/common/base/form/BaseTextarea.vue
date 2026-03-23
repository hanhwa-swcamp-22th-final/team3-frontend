<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  rows: { type: Number, default: 4 },
  error: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <textarea
    class="base-textarea"
    :class="{ 'base-textarea--error': error, 'base-textarea--disabled': disabled }"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
.base-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-strong);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  line-height: 1.65;
  resize: vertical;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.base-textarea::placeholder {
  color: var(--color-text-placeholder);
}

.base-textarea:focus {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus);
}

.base-textarea--error {
  border-color: var(--color-danger);
}

.base-textarea--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 71, 111, 0.14);
}

.base-textarea--disabled,
.base-textarea[readonly] {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-muted);
  cursor: not-allowed;
  resize: none;
}
</style>

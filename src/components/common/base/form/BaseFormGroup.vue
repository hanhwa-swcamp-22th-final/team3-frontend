<script setup>
defineProps({
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
})
</script>

<template>
  <div class="base-form-group">
    <label v-if="label" class="base-form-group__label">
      {{ label }}
      <span v-if="required" class="base-form-group__required" aria-hidden="true">*</span>
    </label>
    <slot />
    <p v-if="error" class="base-form-group__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="base-form-group__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.base-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.base-form-group__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-strong);
}

.base-form-group__required {
  margin-left: 2px;
  color: var(--color-danger);
}

.base-form-group__error {
  font-size: var(--font-size-xs-plus);
  color: var(--color-danger);
}

.base-form-group__hint {
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
}
</style>

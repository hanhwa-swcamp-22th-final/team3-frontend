<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save-draft', 'submit'])
</script>

<template>
  <div class="eval-form__actions">
    <template v-if="!disabled">
      <button class="eval-form__btn eval-form__btn--close" @click="emit('close')">닫기</button>
      <button class="eval-form__btn eval-form__btn--save" @click="emit('save-draft')">임시저장</button>
      <button class="eval-form__btn eval-form__btn--submit" @click="emit('submit')">제출</button>
    </template>
  </div>
</template>

<style scoped>
.eval-form__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 4px;
  flex-wrap: wrap;
}

.eval-form__btn {
  height: 42px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
}

.eval-form__btn:hover {
  opacity: 0.85;
}

.eval-form__btn--close {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-default);
  border: 1px solid var(--color-border-default);
}

.eval-form__btn--save {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-default);
  border: 1px solid var(--color-border-default);
}

.eval-form__btn--submit {
  background: var(--color-primary-600);
  color: #fff;
}
</style>

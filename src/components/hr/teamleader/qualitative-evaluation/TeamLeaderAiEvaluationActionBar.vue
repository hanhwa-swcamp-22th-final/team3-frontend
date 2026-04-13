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
  <section class="evaluation-action-bar">
    <div class="evaluation-action-bar__actions">
      <button
        type="button"
        class="evaluation-action-bar__button evaluation-action-bar__button--secondary"
        :disabled="disabled"
        @click="emit('close')"
      >
        닫기
      </button>
      <button
        type="button"
        class="evaluation-action-bar__button evaluation-action-bar__button--secondary"
        :disabled="disabled"
        @click="emit('save-draft')"
      >
        임시 저장
      </button>
      <button
        type="button"
        class="evaluation-action-bar__button evaluation-action-bar__button--primary"
        :disabled="disabled"
        @click="emit('submit')"
      >
        제출
      </button>
    </div>
  </section>
</template>

<style scoped>
.evaluation-action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.evaluation-action-bar__actions {
  display: flex;
  gap: 10px;
}

.evaluation-action-bar__button {
  height: 42px;
  min-width: 74px;
  padding: 0 20px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.evaluation-action-bar__button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.evaluation-action-bar__button--secondary {
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-primary-700);
}

.evaluation-action-bar__button--primary {
  border: none;
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}

@media (max-width: 720px) {
  .evaluation-action-bar {
    justify-content: stretch;
    padding: 12px;
  }

  .evaluation-action-bar__actions {
    width: 100%;
  }

  .evaluation-action-bar__button {
    flex: 1;
  }
}
</style>

<script setup>
import { reactive } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const props = defineProps({
  defaults: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  field: props.defaults.field,
  period: props.defaults.period,
  frequency: props.defaults.frequency,
  purpose: props.defaults.purpose,
  requestDetails: props.defaults.requestDetails,
})

function handleSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <BaseFormModal
    eyebrow="Mentoring Request"
    title="멘토링 요청 등록"
    width="680px"
    confirm-text="등록"
    @close="emit('close')"
    @cancel="emit('close')"
    @confirm="handleSubmit"
  >
    <div class="request-modal__grid">
      <label>
        분야
        <input v-model="form.field" type="text" />
      </label>
      <label>
        기간
        <input v-model="form.period" type="text" />
      </label>
      <label>
        빈도
        <input v-model="form.frequency" type="text" />
      </label>
    </div>

    <label class="request-modal__full">
      목적
      <textarea v-model="form.purpose" rows="3"></textarea>
    </label>

    <label class="request-modal__full">
      요청 내용
      <textarea v-model="form.requestDetails" rows="4"></textarea>
    </label>
  </BaseFormModal>
</template>

<style scoped>
.request-modal__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
}

input,
textarea {
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 12px 14px;
  font: inherit;
  color: var(--color-text-default);
  resize: vertical;
}

.request-modal__full {
  grid-column: 1 / -1;
}

@media (max-width: 720px) {
  .request-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
import { reactive } from 'vue'

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
  <div class="request-modal">
    <div class="request-modal__backdrop" @click="emit('close')"></div>
    <section class="request-modal__dialog">
      <div class="request-modal__head">
        <div>
          <p class="request-modal__eyebrow">Mentoring Request</p>
          <h2>멘토링 요청 등록</h2>
        </div>
        <button type="button" class="request-modal__close" @click="emit('close')">×</button>
      </div>

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

      <div class="request-modal__actions">
        <button type="button" class="request-modal__ghost" @click="emit('close')">취소</button>
        <button type="button" class="request-modal__primary" @click="handleSubmit">등록</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.request-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.request-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(14, 12, 31, 0.48);
}

.request-modal__dialog {
  position: relative;
  width: min(680px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 22px;
  background: #fff;
  padding: 24px;
  display: grid;
  gap: 18px;
  box-shadow: 0 30px 80px rgba(20, 15, 60, 0.24);
}

.request-modal__head,
.request-modal__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.request-modal__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.request-modal__head h2 {
  margin-top: 6px;
  font-size: 28px;
  color: var(--color-primary-800);
}

.request-modal__close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f4f2ff;
  color: var(--color-primary-700);
  font-size: 24px;
  cursor: pointer;
}

.request-modal__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.request-modal label {
  display: grid;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.request-modal input,
.request-modal textarea {
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

.request-modal__ghost,
.request-modal__primary {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.request-modal__ghost {
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
}

.request-modal__primary {
  border: none;
  background: var(--color-primary-700);
  color: #fff;
}

@media (max-width: 720px) {
  .request-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>

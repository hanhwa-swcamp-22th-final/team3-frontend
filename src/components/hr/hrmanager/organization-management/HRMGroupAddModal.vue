<script setup>
import { ref } from 'vue'
import { GROUP_COLORS } from '@/mocks/hrmanager/organization.js'

const emit = defineEmits(['close', 'submit'])

const name        = ref('')
const description = ref('')
const color       = ref(GROUP_COLORS[0])

function handleSubmit() {
  if (!name.value.trim()) return
  emit('submit', {
    name:        name.value.trim(),
    description: description.value.trim(),
    color:       color.value,
  })
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal__title">그룹 추가</h2>

      <label class="modal__label">그룹명 <span class="modal__required">*</span></label>
      <input
        v-model="name"
        class="modal__input"
        placeholder="예: 생산본부"
        maxlength="30"
      />

      <label class="modal__label">설명</label>
      <textarea
        v-model="description"
        class="modal__textarea"
        rows="4"
      />

      <label class="modal__label">그룹 색상</label>
      <div class="modal__colors">
        <button
          v-for="c in GROUP_COLORS"
          :key="c"
          class="color-dot"
          :class="{ 'color-dot--active': color === c }"
          :style="{ background: c }"
          @click="color = c"
        />
      </div>

      <div class="modal__actions">
        <button class="modal__btn modal__btn--cancel" @click="$emit('close')">취소</button>
        <button
          class="modal__btn modal__btn--submit"
          :disabled="!name.trim()"
          @click="handleSubmit"
        >추가</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}
.modal {
  background: var(--color-bg-surface);
  border-radius: 16px;
  padding: 32px 36px;
  width: 460px;
  display: flex; flex-direction: column; gap: 10px;
  box-shadow: 0 8px 40px rgba(0,0,0,.18);
}
.modal__title {
  font-size: var(--font-size-lg); font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800);
  margin-bottom: 6px;
}
.modal__label {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  margin-top: 6px;
}
.modal__required { color: var(--color-danger); }
.modal__input {
  width: 100%; height: 42px;
  padding: 0 14px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm); color: var(--color-primary-800);
  background: var(--color-bg-app);
  box-sizing: border-box;
}
.modal__input:focus { outline: none; border-color: var(--color-primary-400); }
.modal__textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm); color: var(--color-primary-800);
  background: var(--color-bg-app);
  resize: none; box-sizing: border-box;
  font-family: inherit;
}
.modal__textarea:focus { outline: none; border-color: var(--color-primary-400); }

.modal__colors {
  display: flex; gap: 10px; flex-wrap: wrap;
  margin-top: 4px;
}
.color-dot {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2.5px solid transparent;
  cursor: pointer; flex-shrink: 0;
  transition: border-color .15s;
}
.color-dot--active { border-color: var(--color-primary-800); }

.modal__actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 12px;
}
.modal__btn {
  height: 40px; padding: 0 24px;
  border-radius: 8px; font-size: var(--font-size-base); font-weight: var(--font-weight-bold);
  cursor: pointer; border: none;
}
.modal__btn--cancel {
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  color: var(--color-primary-600);
}
.modal__btn--submit {
  background: var(--color-primary-600);
  color: var(--color-white);
}
.modal__btn--submit:disabled {
  opacity: .5; cursor: not-allowed;
}
</style>

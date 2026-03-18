<script setup>
import { ref } from 'vue'
import { BaseFormModal } from '@/components/common/base'
import { KMS_CATEGORY_OPTIONS as categoryOptions, KMS_EQUIPMENT_OPTIONS as equipmentOptions } from '@/constants'

const emit = defineEmits(['close', 'submit', 'saveDraft'])

const title = ref('')
const category = ref('')
const equipment = ref('')
const summary = ref('')
const content = ref('')

function getData() {
  return {
    title: title.value,
    category: category.value,
    equipment: equipment.value,
    summary: summary.value,
    content: content.value,
  }
}

function handleSubmit() {
  emit('submit', getData())
}

function handleSaveDraft() {
  emit('saveDraft', getData())
}
</script>

<template>
  <BaseFormModal
    title="지식 작성"
    eyebrow="Knowledge Writer"
    width="560px"
    cancelText="취소"
    draftText="임시 저장"
    confirmText="등록"
    showDraftButton
    @close="emit('close')"
    @cancel="emit('close')"
    @draft="handleSaveDraft"
    @confirm="handleSubmit"
  >
    <div class="ka__form">
      <!-- Title + Category -->
      <div class="ka__row ka__row--two">
        <div class="ka__field">
          <label class="ka__label">제목</label>
          <input
            v-model="title"
            class="ka__input"
            type="text"
            placeholder="문서 제목을 입력하세요"
          />
        </div>
        <div class="ka__field">
          <label class="ka__label">카테고리</label>
          <select v-model="category" class="ka__select">
            <option value="" disabled hidden></option>
            <option v-for="opt in categoryOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
      </div>

      <!-- Equipment -->
      <div class="ka__row">
        <div class="ka__field">
          <label class="ka__label">설비</label>
          <select v-model="equipment" class="ka__select">
            <option value="" disabled hidden></option>
            <option v-for="opt in equipmentOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
      </div>

      <!-- Summary -->
      <div class="ka__row">
        <div class="ka__field">
          <label class="ka__label">요약</label>
          <textarea
            v-model="summary"
            class="ka__textarea ka__textarea--sm"
            placeholder="핵심 요약을 입력하세요"
            rows="2"
          ></textarea>
        </div>
      </div>

      <!-- Content -->
      <div class="ka__row">
        <div class="ka__field">
          <div class="ka__label-row">
            <label class="ka__label">본문</label>
            <button class="ka__voice-btn">음성으로 작성</button>
          </div>
          <p class="ka__hint">음성 인식으로 본문을 빠르게 작성할 수 있습니다.</p>
          <textarea
            v-model="content"
            class="ka__textarea ka__textarea--lg"
            placeholder="작업 조건, 문제 원인, 해결 방법을 정리하세요"
            rows="6"
          ></textarea>
        </div>
      </div>
    </div>
  </BaseFormModal>
</template>

<style scoped>
/* ── Form ─────────────────────────────────────────────── */
.ka__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ka__row--two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.ka__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ka__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ka__label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ka__input,
.ka__select {
  padding: 10px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-default);
  background: var(--color-bg-surface);
  outline: none;
  transition: border-color 0.15s;
}

.ka__input:focus,
.ka__select:focus,
.ka__textarea:focus {
  border-color: var(--color-primary-300);
}

.ka__input::placeholder {
  color: var(--color-text-muted);
}

.ka__textarea {
  padding: 12px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-default);
  resize: none;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.ka__textarea::placeholder {
  color: var(--color-text-muted);
}

.ka__textarea--sm {
  min-height: 48px;
}

.ka__textarea--lg {
  min-height: 140px;
}

.ka__voice-btn {
  padding: 5px 14px;
  border: 1px solid var(--color-primary-300);
  border-radius: var(--radius-xs);
  background: var(--color-bg-surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-700);
  cursor: pointer;
  transition: all 0.15s;
}

.ka__voice-btn:hover {
  background: var(--color-primary-100);
}

.ka__hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}
</style>

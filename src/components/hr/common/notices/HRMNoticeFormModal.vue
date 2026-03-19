<script setup>
import { ref, watch } from 'vue'
import BaseFormModal from '@/components/common/base/overlay/BaseFormModal.vue'
import HRMNoticeTeamFilter from '@/components/hr/common/notices/HRMNoticeTeamFilter.vue'

const props = defineProps({
  editMode:    { type: Boolean, default: false },
  initialData: { type: Object,  default: () => ({}) },
})
const emit = defineEmits(['close', 'save', 'draft'])

const title       = ref(props.initialData.title   ?? '')
const content     = ref(props.initialData.content ?? '')
const attachment  = ref(props.initialData.attachment ?? '')
const isImportant = ref(props.initialData.isImportant ?? false)
const targets     = ref(props.initialData.targets    ?? [])

const showTeamFilter = ref(false)
const isDragging     = ref(false)

watch(() => props.initialData, d => {
  title.value       = d.title       ?? ''
  content.value     = d.content     ?? ''
  attachment.value  = d.attachment  ?? ''
  isImportant.value = d.isImportant ?? false
  targets.value     = d.targets     ?? []
}, { deep: true })

function buildPayload(status) {
  return {
    title:       title.value.trim(),
    content:     content.value.trim(),
    attachment:  attachment.value.trim(),
    isImportant: isImportant.value,
    targets:     targets.value,
    status,
    date: status === '임시' ? null : new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', ''),
  }
}

function handleSave()  { emit('save',  buildPayload(isImportant.value ? '중요' : '게시중')) }
function handleDraft() { emit('draft', buildPayload('임시')) }

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) attachment.value = file.name
}
</script>

<template>
  <BaseFormModal
    :title="editMode ? '공지 편집' : '새 공지 등록'"
    :confirmText="editMode ? '수정 저장' : '등록'"
    :confirmDisabled="!title.trim()"
    :showDraftButton="true"
    width="520px"
    @confirm="handleSave"
    @draft="handleDraft"
    @cancel="$emit('close')"
    @close="$emit('close')"
  >
    <div class="modal__form">

      <!-- 제목 -->
      <label class="modal__label">제목</label>
      <input v-model="title" class="modal__input" placeholder="공지 제목을 입력하세요" />

      <!-- 본문 -->
      <label class="modal__label">본문</label>
      <textarea v-model="content" class="modal__textarea" rows="7" placeholder="공지 내용을 상세히 입력해주세요" />

      <!-- 중요 공지 토글 + 공개 범위 -->
      <div class="modal__options-row">
        <label class="modal__toggle-label">
          <span class="modal__toggle-switch" :class="{ 'modal__toggle-switch--on': isImportant }" @click="isImportant = !isImportant">
            <span class="modal__toggle-knob" />
          </span>
          <span class="modal__toggle-text">중요 공지</span>
        </label>

        <div class="modal__target-group">
          <span class="modal__target-label">공개 범위 설정</span>
          <div class="modal__target-wrap">
            <button
              class="modal__target-btn"
              :class="{ 'modal__target-btn--active': targets.length > 0 }"
              @click="showTeamFilter = !showTeamFilter"
            >
              <span>{{ targets.length ? targets.join(' / ') : '선택' }}</span>
              <span class="modal__target-caret">▾</span>
            </button>
            <div v-if="showTeamFilter" class="modal__target-popup">
              <HRMNoticeTeamFilter
                v-model="targets"
                @close="showTeamFilter = false"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 첨부 파일 -->
      <label class="modal__label">첨부 파일</label>
      <div
        class="modal__dropzone"
        :class="{ 'modal__dropzone--drag': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
      >
        <span class="modal__dropzone-icon">⬆</span>
        <span class="modal__dropzone-text">파일을 끌어다 놓거나 업로드하려면 클릭하세요</span>
        <button class="modal__file-btn" type="button">파일 첨부</button>
      </div>
      <div v-if="attachment" class="modal__file-list">
        <div class="modal__file-item">
          <span>📄 {{ attachment }}</span>
          <button class="modal__file-remove" @click="attachment = ''">×</button>
        </div>
      </div>

    </div>
  </BaseFormModal>
</template>

<style scoped>
.modal__form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal__label {
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  margin-top: 4px;
}

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

/* 옵션 행 */
.modal__options-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 토글 스위치 */
.modal__toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.modal__toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px; height: 22px;
  background: var(--color-border-default);
  border-radius: 999px;
  transition: background .2s;
  cursor: pointer;
  flex-shrink: 0;
}
.modal__toggle-switch--on { background: var(--color-primary-600); }

.modal__toggle-knob {
  position: absolute;
  top: 3px; left: 3px;
  width: 16px; height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform .2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.modal__toggle-switch--on .modal__toggle-knob { transform: translateX(18px); }

.modal__toggle-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
}

/* 공개 범위 */
.modal__target-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.modal__target-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600);
  white-space: nowrap;
}

.modal__target-wrap { position: relative; }

.modal__target-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  min-width: 90px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-app);
  color: var(--color-primary-400);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}
.modal__target-btn--active {
  border-color: var(--color-primary-400);
  color: var(--color-primary-700);
}
.modal__target-caret { font-size: 11px; color: var(--color-primary-300); }

.modal__target-popup {
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
  z-index: 10;
}

/* 드래그존 */
.modal__dropzone {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1.5px dashed var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-app);
  cursor: pointer;
  transition: border-color .15s;
}
.modal__dropzone--drag {
  border-color: var(--color-primary-400);
  background: var(--color-primary-100);
}

.modal__dropzone-icon { font-size: 16px; color: var(--color-primary-300); }

.modal__dropzone-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-primary-300);
}

.modal__file-btn {
  height: 36px; padding: 0 16px; flex-shrink: 0;
  background: var(--color-primary-600); color: var(--color-white);
  border: none; border-radius: 8px; font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
  cursor: pointer;
}

/* 첨부 파일 목록 */
.modal__file-list { display: flex; flex-direction: column; gap: 4px; }
.modal__file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--color-primary-100);
  border-radius: 6px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-700);
}
.modal__file-remove {
  background: none; border: none;
  color: var(--color-primary-300);
  font-size: 16px; cursor: pointer; line-height: 1;
}
</style>

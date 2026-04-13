<script setup>
import { ref, watch } from 'vue'
import BaseFormModal from '@/components/common/base/overlay/BaseFormModal.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ko } from 'date-fns/locale'

const props = defineProps({
  editMode:    { type: Boolean, default: false },
  initialData: { type: Object,  default: () => ({}) },
})
const emit = defineEmits(['close', 'save', 'draft'])

const title           = ref(props.initialData.title   ?? '')
const content         = ref(props.initialData.content ?? '')
const attachment      = ref(props.initialData.attachment ?? '')
const isImportant     = ref(props.initialData.isImportant ?? false)
const importantEndAt  = ref(props.initialData.importantEndAt ? new Date(props.initialData.importantEndAt) : null)
const isScheduled       = ref(props.initialData.status === '예약')
const scheduledDateTime = ref(props.initialData.status === '예약' && props.initialData.date ? new Date(props.initialData.date.replace('.', '-').replace('.', '-')) : null)

const isDragging   = ref(false)
const fileInputRef = ref(null)

watch(() => props.initialData, d => {
  title.value           = d.title       ?? ''
  content.value         = d.content     ?? ''
  attachment.value      = d.attachment  ?? ''
  isImportant.value     = d.isImportant ?? false
  importantEndAt.value  = d.importantEndAt ? new Date(d.importantEndAt) : null
  isScheduled.value       = d.status === '예약'
  scheduledDateTime.value = d.status === '예약' && d.date ? new Date(d.date.replace('.', '-').replace('.', '-')) : null
}, { deep: true })

function buildPayload(status) {
  let resolvedStatus = status
  let resolvedDate = null

  if (status === '임시') {
    resolvedDate = null
  } else if (isScheduled.value && scheduledDateTime.value) {
    resolvedStatus = '예약'
    const d = scheduledDateTime.value
    const pad = n => String(n).padStart(2, '0')
    resolvedDate = `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } else {
    resolvedStatus = isImportant.value ? '중요' : '게시중'
    resolvedDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', '')
  }

  return {
    title:          title.value.trim(),
    content:        content.value.trim(),
    attachment:     attachment.value.trim(),
    isImportant:    isImportant.value,
    importantEndAt: isImportant.value ? importantEndAt.value : null,
    status:         resolvedStatus,
    date:           resolvedDate,
  }
}

function handleSave()  { emit('save',  buildPayload('게시중')) }
function handleDraft() { emit('draft', buildPayload('임시')) }

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) attachment.value = file.name
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) attachment.value = file.name
}

function openFilePicker() {
  fileInputRef.value?.click()
}
</script>

<template>
  <BaseFormModal
    :title="editMode ? '공지 수정' : '새 공지 등록'"
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

      <!-- 토글 옵션 -->
      <div class="modal__options-row">
        <label class="modal__toggle-label">
          <span class="modal__toggle-switch" :class="{ 'modal__toggle-switch--on': isImportant }" @click="isImportant = !isImportant">
            <span class="modal__toggle-knob" />
          </span>
          <span class="modal__toggle-text">중요 공지</span>
        </label>

        <!-- 등록 시에만 예약 토글 노출, 수정 시 이미 예약 상태면 토글 유지 -->
        <label v-if="!editMode || isScheduled" class="modal__toggle-label">
          <span class="modal__toggle-switch" :class="{ 'modal__toggle-switch--on': isScheduled }" @click="isScheduled = !isScheduled; if (!isScheduled) scheduledDate = ''">
            <span class="modal__toggle-knob" />
          </span>
          <span class="modal__toggle-text">예약 게시</span>
        </label>
      </div>

      <!-- 중요 공지 만료일시 -->
      <div v-if="isImportant" class="modal__schedule-row">
        <label class="modal__label">
          중요 공지 만료일시
          <span class="modal__label-hint">설정하지 않으면 수동 해제 전까지 유지됩니다</span>
        </label>
        <div class="modal__datepicker-wrap">
          <VueDatePicker
            v-model="importantEndAt"
            :locale="ko"
            :enable-time-picker="true"
            :min-date="new Date()"
            placeholder="만료일시 미설정 (무기한)"
            :teleport="false"
            class="modal__datepicker"
          />
          <button
            v-if="importantEndAt"
            class="modal__clear-btn"
            type="button"
            @click="importantEndAt = null"
          >초기화</button>
        </div>
      </div>

      <!-- 예약 날짜 피커 -->
      <div v-if="isScheduled" class="modal__schedule-row">
        <label class="modal__label">예약 게시일시</label>
        <VueDatePicker
          v-model="scheduledDateTime"
          :locale="ko"
          :enable-time-picker="true"
          :min-date="new Date()"
          placeholder="날짜와 시간을 선택하세요"
          :teleport="false"
          class="modal__datepicker"
        />
      </div>

      <!-- 첨부 파일 -->
      <label class="modal__label">첨부 파일</label>
      <input ref="fileInputRef" type="file" style="display:none" @change="onFileChange" />
      <div
        class="modal__dropzone"
        :class="{ 'modal__dropzone--drag': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="openFilePicker"
      >
        <span class="modal__dropzone-icon">⬆</span>
        <span class="modal__dropzone-text">파일을 끌어다 놓거나 클릭하세요</span>
        <button class="modal__file-btn" type="button" @click.stop="openFilePicker">파일 첨부</button>
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
.modal__schedule-row { display: flex; flex-direction: column; gap: 6px; }
.modal__label-hint {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-muted);
  margin-left: 6px;
}
.modal__datepicker-wrap { display: flex; align-items: center; gap: 8px; }
.modal__datepicker-wrap .modal__datepicker { flex: 1; }
.modal__clear-btn {
  height: 42px; padding: 0 12px; flex-shrink: 0;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-bg-surface);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  cursor: pointer;
  white-space: nowrap;
}
.modal__clear-btn:hover { border-color: var(--color-danger); color: var(--color-danger); }
.modal__datepicker { width: 100%; }
:deep(.dp__input) {
  height: 42px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  font-family: inherit;
}
:deep(.dp__input:focus) { border-color: var(--color-primary-400); }

.modal-schedule-enter-active,
.modal-schedule-leave-active { transition: all 0.2s ease; }
.modal-schedule-enter-from,
.modal-schedule-leave-to { opacity: 0; transform: translateY(-6px); }

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
  gap: 24px;
}

.modal__target-group--row {
  display: flex;
  align-items: center;
  gap: 12px;
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
.modal__target-caret {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-right: 2px solid var(--color-primary-300);
  border-bottom: 2px solid var(--color-primary-300);
  transform: rotate(45deg);
  margin-bottom: 3px;
  margin-left: auto;
  flex-shrink: 0;
}

.modal__target-popup {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
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

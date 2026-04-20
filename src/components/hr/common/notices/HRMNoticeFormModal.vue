<script setup>
import { ref, watch } from 'vue'
import BaseFormModal from '@/components/common/base/overlay/BaseFormModal.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ko } from 'date-fns/locale'

const props = defineProps({
  editMode: { type: Boolean, default: false },
  initialData: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close', 'save', 'draft'])

const title = ref(props.initialData.title ?? '')
const content = ref(props.initialData.content ?? '')
const attachment = ref(props.initialData.attachment ?? '')
const isImportant = ref(props.initialData.isImportant ?? false)
const importantEndAt = ref(props.initialData.importantEndAt ? new Date(props.initialData.importantEndAt) : null)
const isScheduled = ref(props.initialData.status === '예약')
const scheduledDateTime = ref(
  props.initialData.status === '예약' && props.initialData.date
    ? new Date(props.initialData.date.replace('.', '-').replace('.', '-'))
    : null,
)

const isDragging = ref(false)
const fileInputRef = ref(null)

watch(
  () => props.initialData,
  (d) => {
    title.value = d.title ?? ''
    content.value = d.content ?? ''
    attachment.value = d.attachment ?? ''
    isImportant.value = d.isImportant ?? false
    importantEndAt.value = d.importantEndAt ? new Date(d.importantEndAt) : null
    isScheduled.value = d.status === '예약'
    scheduledDateTime.value =
      d.status === '예약' && d.date
        ? new Date(d.date.replace('.', '-').replace('.', '-'))
        : null
  },
  { deep: true },
)

function buildPayload(status) {
  let resolvedStatus = status
  let resolvedDate = null

  if (status === '임시') {
    resolvedDate = null
  } else if (isScheduled.value && scheduledDateTime.value) {
    resolvedStatus = '예약'
    const d = scheduledDateTime.value
    const pad = (n) => String(n).padStart(2, '0')
    resolvedDate = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } else {
    resolvedStatus = isImportant.value ? '중요' : '게시중'
    resolvedDate = new Date()
      .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\. /g, '.')
      .replace('.', '')
  }

  return {
    title: title.value.trim(),
    content: content.value.trim(),
    attachment: attachment.value.trim(),
    isImportant: isImportant.value,
    importantEndAt: isImportant.value ? importantEndAt.value : null,
    status: resolvedStatus,
    date: resolvedDate,
  }
}

function handleSave() {
  emit('save', buildPayload('게시중'))
}

function handleDraft() {
  emit('draft', buildPayload('임시'))
}

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
    width="640px"
    @close="$emit('close')"
  >
    <div class="modal__form">
      <section class="modal__section">
        <label class="modal__label">제목</label>
        <input v-model="title" class="modal__input" placeholder="공지 제목을 입력하세요" />
      </section>

      <section class="modal__section">
        <label class="modal__label">본문</label>
        <textarea
          v-model="content"
          class="modal__textarea"
          rows="9"
          placeholder="공지 내용을 상세히 입력해주세요"
        />
      </section>

      <section class="modal__section modal__section--card">
        <div class="modal__section-head">
          <label class="modal__label">게시 옵션</label>
          <p class="modal__section-help">중요 공지 여부와 예약 게시 시간을 설정할 수 있습니다.</p>
        </div>

        <div class="modal__options-row">
          <label class="modal__toggle-label">
            <span
              class="modal__toggle-switch"
              :class="{ 'modal__toggle-switch--on': isImportant }"
              @click="isImportant = !isImportant"
            >
              <span class="modal__toggle-knob" />
            </span>
            <span class="modal__toggle-text">중요 공지</span>
          </label>

          <label v-if="!editMode || isScheduled" class="modal__toggle-label">
            <span
              class="modal__toggle-switch"
              :class="{ 'modal__toggle-switch--on': isScheduled }"
              @click="isScheduled = !isScheduled; if (!isScheduled) scheduledDateTime = null"
            >
              <span class="modal__toggle-knob" />
            </span>
            <span class="modal__toggle-text">예약 게시</span>
          </label>
        </div>

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
            >
              초기화
            </button>
          </div>
        </div>

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
      </section>

      <section class="modal__section modal__section--card">
        <div class="modal__section-head">
          <label class="modal__label">첨부 파일</label>
          <p class="modal__section-help">파일을 끌어다 놓거나 버튼으로 직접 선택할 수 있습니다.</p>
        </div>

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
          <div class="modal__dropzone-copy">
            <span class="modal__dropzone-text">파일을 끌어다 놓거나 클릭하세요</span>
            <span class="modal__dropzone-subtext">현재는 파일 1개만 첨부할 수 있습니다.</span>
          </div>
          <button class="modal__file-btn" type="button" @click.stop="openFilePicker">파일 첨부</button>
        </div>

        <div v-if="attachment" class="modal__file-list">
          <div class="modal__file-item">
            <span>📄 {{ attachment }}</span>
            <button class="modal__file-remove" type="button" @click="attachment = ''">×</button>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="modal__footer">
        <p class="modal__footer-note">
          {{ isScheduled ? '예약된 시간에 맞춰 자동 게시됩니다.' : '등록 후 바로 공지 목록에 반영됩니다.' }}
        </p>
        <div class="modal__footer-actions">
          <button class="modal__footer-btn modal__footer-btn--secondary" type="button" @click="handleDraft">
            임시 저장
          </button>
          <button class="modal__footer-btn modal__footer-btn--ghost" type="button" @click="$emit('close')">
            취소
          </button>
          <button
            class="modal__footer-btn modal__footer-btn--primary"
            type="button"
            :disabled="!title.trim()"
            @click="handleSave"
          >
            {{ editMode ? '수정 저장' : '등록' }}
          </button>
        </div>
      </div>
    </template>
  </BaseFormModal>
</template>

<style scoped>
.modal__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal__section--card {
  padding: 16px;
  border: 1px solid #eee9ff;
  border-radius: 16px;
  background: #fcfbff;
}

.modal__section-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}

.modal__section-help {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.5;
}

.modal__schedule-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal__label-hint {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-muted);
  margin-left: 6px;
}

.modal__datepicker-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal__datepicker-wrap .modal__datepicker {
  flex: 1;
}

.modal__clear-btn {
  height: 42px;
  padding: 0 12px;
  flex-shrink: 0;
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  background: var(--color-bg-surface);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  cursor: pointer;
  white-space: nowrap;
}

.modal__clear-btn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.modal__datepicker {
  width: 100%;
}

:deep(.dp__input) {
  height: 46px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  font-family: inherit;
}

:deep(.dp__input:focus) {
  border-color: var(--color-primary-400);
}

.modal__input {
  width: 100%;
  height: 46px;
  padding: 0 16px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  font-size: var(--font-size-base);
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  box-sizing: border-box;
}

.modal__input:focus {
  outline: none;
  border-color: var(--color-primary-400);
}

.modal__textarea {
  width: 100%;
  min-height: 180px;
  padding: 14px 16px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 14px;
  font-size: var(--font-size-base);
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.7;
}

.modal__textarea:focus {
  outline: none;
  border-color: var(--color-primary-400);
}

.modal__options-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.modal__toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.modal__toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  background: var(--color-border-default);
  border-radius: 999px;
  transition: background 0.2s;
  cursor: pointer;
  flex-shrink: 0;
}

.modal__toggle-switch--on {
  background: var(--color-primary-600);
}

.modal__toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.modal__toggle-switch--on .modal__toggle-knob {
  transform: translateX(18px);
}

.modal__toggle-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
}

.modal__dropzone {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1.5px dashed var(--color-border-default);
  border-radius: 14px;
  background: var(--color-bg-app);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.modal__dropzone--drag {
  border-color: var(--color-primary-400);
  background: var(--color-primary-100);
}

.modal__dropzone-icon {
  font-size: 16px;
  color: var(--color-primary-300);
}

.modal__dropzone-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.modal__dropzone-text {
  font-size: var(--font-size-sm);
  color: var(--color-primary-500);
  font-weight: var(--font-weight-semibold);
}

.modal__dropzone-subtext {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.modal__file-btn {
  height: 36px;
  padding: 0 16px;
  flex-shrink: 0;
  background: var(--color-primary-600);
  color: var(--color-white);
  border: none;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.modal__file-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal__file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--color-primary-100);
  border-radius: 12px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-700);
}

.modal__file-remove {
  background: none;
  border: none;
  color: var(--color-primary-300);
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
}

.modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.modal__footer-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.modal__footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.modal__footer-btn {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.modal__footer-btn--secondary {
  border: 1px solid var(--color-primary-200);
  background: #f6f3ff;
  color: var(--color-primary-700);
}

.modal__footer-btn--ghost {
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
}

.modal__footer-btn--primary {
  border: none;
  background: var(--color-primary-700);
  color: #fff;
}

.modal__footer-btn--primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .modal__dropzone,
  .modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .modal__footer-actions {
    width: 100%;
    justify-content: stretch;
  }

  .modal__footer-btn {
    flex: 1;
  }
}
</style>

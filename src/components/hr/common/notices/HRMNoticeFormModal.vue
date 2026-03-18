<script setup>
import { ref, watch } from 'vue'
import HRMNoticeTeamFilter from '@/components/hr/common/notices/HRMNoticeTeamFilter.vue'
import BaseFormModal from '@/components/common/base/overlay/BaseFormModal.vue'

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

watch(() => props.initialData, d => {
  title.value       = d.title       ?? ''
  content.value     = d.content     ?? ''
  attachment.value  = d.attachment  ?? ''
  isImportant.value = d.isImportant ?? false
  targets.value     = d.targets     ?? []
}, { deep: true })

function targetsLabel() {
  return targets.value.length ? targets.value.join(' / ') : '대상 없음'
}

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
    <!-- 중요 공지 / 공개 범위 토글 -->
    <div class="modal__toggles">
      <button
        class="modal__toggle"
        :class="{ 'modal__toggle--on': isImportant }"
        @click="isImportant = !isImportant"
      >중요 공지</button>
      <div class="modal__toggle-wrap">
        <button
          class="modal__toggle"
          :class="{ 'modal__toggle--on': targets.length > 0 }"
          @click="showTeamFilter = !showTeamFilter"
        >공개 범위{{ targets.length ? ` (${targets.length})` : '' }}</button>
        <div v-if="showTeamFilter" class="modal__toggle-popup">
          <HRMNoticeTeamFilter
            v-model="targets"
            @close="showTeamFilter = false"
          />
        </div>
      </div>
    </div>

    <!-- 제목 -->
    <label class="modal__label">제목</label>
    <input v-model="title" class="modal__input" placeholder="공지 제목을 입력하세요" />

    <!-- 노출 대상 표시 -->
    <label class="modal__label">노출 대상</label>
    <div class="modal__input modal__target-display">{{ targetsLabel() }}</div>

    <!-- 본문 -->
    <label class="modal__label">본문</label>
    <textarea v-model="content" class="modal__textarea" rows="7" placeholder="공지 내용을 입력하세요" />

    <!-- 첨부 파일 -->
    <label class="modal__label">첨부 파일</label>
    <div class="modal__file-row">
      <input v-model="attachment" class="modal__input modal__input--file" placeholder="첨부 파일 이름" readonly />
      <button class="modal__file-btn">파일 첨부</button>
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

/* 토글 */
.modal__toggles { display: flex; justify-content: flex-end; gap: 8px; }
.modal__toggle {
  height: 34px; padding: 0 16px;
  border-radius: 8px; font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: 1.5px solid var(--color-border-default);
  background: var(--color-bg-app);
  color: var(--color-primary-400);
}
.modal__toggle--on {
  background: var(--color-primary-100);
  border-color: var(--color-primary-400);
  color: var(--color-primary-700);
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

/* 노출 대상 표시 */
.modal__target-display {
  display: flex; align-items: center;
  color: var(--color-primary-600);
  pointer-events: none;
}

/* 공개 범위 토글 팝업 */
.modal__toggle-wrap { position: relative; }
.modal__toggle-popup {
  position: absolute; top: calc(100% + 6px); right: 0; z-index: 10;
}

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

/* 첨부 파일 */
.modal__file-row { display: flex; gap: 8px; }
.modal__input--file { flex: 1; }
.modal__file-btn {
  height: 42px; padding: 0 16px; flex-shrink: 0;
  background: var(--color-primary-600); color: var(--color-white);
  border: none; border-radius: 8px; font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
  cursor: pointer;
}

</style>

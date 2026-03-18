<script setup>
import { ref, watch } from 'vue'
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
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal__title">{{ editMode ? '공지 편집' : '새 공지 등록' }}</h2>

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

      <!-- 액션 -->
      <div class="modal__actions">
        <button class="modal__btn modal__btn--close"  @click="$emit('close')">닫기</button>
        <button class="modal__btn modal__btn--draft"  @click="handleDraft">임시 저장</button>
        <button
          class="modal__btn modal__btn--save"
          :disabled="!title.trim()"
          @click="handleSave"
        >{{ editMode ? '수정 저장' : '등록' }}</button>
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
  width: 520px;
  display: flex; flex-direction: column; gap: 10px;
  box-shadow: 0 8px 40px rgba(0,0,0,.18);
  max-height: 90vh; overflow-y: auto;
}
.modal__title {
  font-size: 18px; font-weight: 800;
  color: var(--color-primary-800);
  margin-bottom: 4px;
}

/* 토글 */
.modal__toggles { display: flex; justify-content: flex-end; gap: 8px; }
.modal__toggle {
  height: 34px; padding: 0 16px;
  border-radius: 8px; font-size: 13px; font-weight: 700;
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
  font-size: 12px; font-weight: 700;
  color: var(--color-primary-600);
  margin-top: 4px;
}
.modal__input {
  width: 100%; height: 42px;
  padding: 0 14px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
  font-size: 13px; color: var(--color-primary-800);
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
  font-size: 13px; color: var(--color-primary-800);
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
  border: none; border-radius: 8px; font-size: 13px; font-weight: 700;
  cursor: pointer;
}

/* 액션 */
.modal__actions {
  display: flex; justify-content: flex-end; gap: 8px;
  margin-top: 8px;
}
.modal__btn {
  height: 40px; padding: 0 20px;
  border-radius: 8px; font-size: 14px; font-weight: 700;
  cursor: pointer; border: none;
}
.modal__btn--close {
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  color: var(--color-primary-600);
}
.modal__btn--draft {
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-primary-300);
  color: var(--color-primary-600);
}
.modal__btn--save {
  background: var(--color-primary-600); color: var(--color-white);
}
.modal__btn--save:disabled { opacity: .5; cursor: not-allowed; }
</style>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  appealData: { type: Object, required: true },
})

const isReadonly = computed(() => props.appealData.status !== 'NONE')

const emit = defineEmits(['cancel', 'submit'])

const appealTitle = ref(props.appealData.title || '')
const selectedType = ref(props.appealData.appealType || 'SCORE_ERRORS')
const appealContent = ref(props.appealData.content || '')
const selectedFiles = ref([])

watch(
  () => props.appealData,
  (data) => {
    appealTitle.value = data.title || ''
    selectedType.value = data.appealType || 'SCORE_ERRORS'
    appealContent.value = data.content || ''
    selectedFiles.value = []
  },
)

const typeOptions = [
  { value: 'SCORE_ERRORS', label: '점수 오류' },
  { value: 'MISSING_ITEMS', label: '평가 항목 누락' },
  { value: 'EVALUATION_PROCEDURES', label: '평가 절차 이의' },
  { value: 'OTHERS', label: '기타' },
]

const typeLabelMap = Object.fromEntries(typeOptions.map((option) => [option.value, option.label]))

const statusLabelMap = {
  NONE: '작성 전',
  SUBMITTED: 'HR 접수 대기',
  RECEIVING: 'TL 검토 진행',
  REVIEWING: 'DL 검토 진행',
  COMPLETED: '처리 완료',
}

const reviewResultLabelMap = {
  ACKNOWLEDGE: '인용',
  ACKNOWLEDGE_IN_PART: '일부 인용',
  DISMISS: '기각',
}

const processSteps = computed(() => {
  const s = props.appealData.processStatus
  return [
    { label: '이의 신청 제출', active: s >= 1, current: s === 1 },
    { label: '담당자 검토', active: s >= 2, current: s === 2 },
    { label: '결과 통보', active: s >= 3, current: s === 3 },
  ]
})

const showToast = ref(false)

const submitLabel = computed(() => {
  return props.appealData.processStatus >= 1 ? '수정 제출' : '제출'
})

const typeLabel = computed(() => typeLabelMap[selectedType.value] ?? '기타')
const statusLabel = computed(() => statusLabelMap[props.appealData.status] ?? '이의 신청 작성')
const reviewResultLabel = computed(() => reviewResultLabelMap[props.appealData.reviewResult] ?? props.appealData.reviewResult)

function formatFileSize(size) {
  if (size == null || Number.isNaN(Number(size))) return ''
  const value = Number(size)
  if (value < 1024) return `${value}B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)}KB`
  return `${(value / (1024 * 1024)).toFixed(1)}MB`
}

function handleFileChange(event) {
  const files = Array.from(event.target.files ?? [])
  selectedFiles.value = files
}

function removeSelectedFile(index) {
  selectedFiles.value = selectedFiles.value.filter((_, fileIndex) => fileIndex !== index)
}

function handleSubmit() {
  const payload = {
    title: appealTitle.value,
    appealType: selectedType.value,
    content: appealContent.value,
    files: selectedFiles.value,
  }
  emit('submit', payload)
  if (props.appealData.processStatus >= 1) {
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2500)
  }
}
</script>

<template>
  <section class="af">
    <header class="af__header">
      <div class="af__header-copy">
        <span class="af__eyebrow">Worker Appeal</span>
        <div class="af__title-row">
          <span class="af__icon">✋</span>
          <h3 class="af__title">이의 신청서</h3>
        </div>
        <p class="af__description">
          선택한 평가 이력에 대해 근거와 함께 이의 신청을 제출할 수 있습니다. 접수 후 HR, TL, DL 검토 절차에 따라 처리됩니다.
        </p>
      </div>
      <div class="af__status-chip" :class="{ 'af__status-chip--done': props.appealData.status === 'COMPLETED' }">
        {{ statusLabel }}
      </div>
    </header>

    <div class="af__summary">
      <div class="af__summary-card">
        <span class="af__summary-label">대상 평가기간</span>
        <strong class="af__summary-value">{{ appealData.quarter || '-' }}</strong>
        <span class="af__summary-meta">현재 선택된 평가 결과를 기준으로 신청합니다.</span>
      </div>
      <div class="af__summary-card">
        <span class="af__summary-label">이의 유형</span>
        <select
          v-if="!isReadonly"
          id="appeal-type"
          v-model="selectedType"
          class="af__select"
        >
          <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <strong v-else class="af__summary-value af__summary-value--compact">{{ typeLabel }}</strong>
        <span class="af__summary-meta">
          {{ appealData.submittedDate !== '-' ? `최종 제출일 ${appealData.submittedDate}` : '아직 제출되지 않았습니다.' }}
        </span>
      </div>
    </div>

    <div class="af__body">
      <div class="af__field-grid">
        <div class="af__section">
          <label class="af__section-title" for="appeal-title">제목</label>
          <input
            id="appeal-title"
          v-model="appealTitle"
          class="af__input"
          type="text"
          placeholder="이의 신청 제목을 입력해주세요."
          :disabled="isReadonly"
          />
        </div>
      </div>

      <div class="af__section">
        <label class="af__section-title" for="appeal-content">이의 제기 내용</label>
        <textarea
          id="appeal-content"
          v-model="appealContent"
          class="af__textarea"
          rows="8"
          placeholder="이의 제기 내용을 입력해주세요."
          :disabled="isReadonly"
        ></textarea>
      </div>

      <div class="af__section">
        <label class="af__section-title" for="appeal-files">첨부파일</label>
        <input
          v-if="!isReadonly"
          id="appeal-files"
          class="af__input"
          type="file"
          multiple
          @change="handleFileChange"
        />
        <div v-if="selectedFiles.length" class="af__file-list">
          <div v-for="(file, index) in selectedFiles" :key="`${file.name}-${index}`" class="af__file-item">
            <span>{{ file.name }}</span>
            <button type="button" class="af__file-remove" @click="removeSelectedFile(index)">삭제</button>
          </div>
        </div>
        <div v-else-if="isReadonly && appealData.attachments?.length" class="af__file-list">
          <div
            v-for="attachment in appealData.attachments"
            :key="attachment.attachmentId"
            class="af__file-item"
          >
            <span>{{ attachment.fileName }}</span>
            <span class="af__file-size">{{ formatFileSize(attachment.fileSize) }}</span>
          </div>
        </div>
        <span class="af__summary-meta">
          근거 자료가 있으면 PDF, 이미지, 엑셀 파일 등을 함께 첨부할 수 있습니다.
        </span>
      </div>

      <div v-if="appealData.reviewResult" class="af__section af__section--result">
        <span class="af__section-title">검토 결과</span>
        <div class="af__result-box">
          <strong class="af__result-title">{{ reviewResultLabel }}</strong>
          <span class="af__result-text">담당자 검토 결과가 반영되었습니다.</span>
        </div>
      </div>
    </div>

    <div class="af__footer">
      <div class="af__process">
        <div class="af__process-head">
          <strong>처리 단계</strong>
          <span>예상 처리: 영업일 5일 이내</span>
        </div>
        <div class="af__process-steps">
          <template v-for="(step, i) in processSteps" :key="step.label">
            <span
              class="af__step"
              :class="{
                'af__step--done': step.active && !step.current,
                'af__step--current': step.current,
              }"
            >
              <span class="af__step-mark">
                <span v-if="step.active && !step.current" class="af__step-check">✓</span>
                <span v-else-if="step.current" class="af__step-dot">●</span>
                <span v-else class="af__step-dot af__step-dot--empty">○</span>
              </span>
              <span>{{ step.label }}</span>
            </span>
            <span v-if="i < processSteps.length - 1" class="af__step-arrow">→</span>
          </template>
        </div>
        <span class="af__process-meta">
          제출일: {{ appealData.submittedDate }} · 접수 이후 단계별 검토 상태가 반영됩니다.
        </span>
      </div>

      <div v-if="!isReadonly" class="af__actions">
        <button class="af__btn af__btn--cancel" @click="emit('cancel')">취소</button>
        <button class="af__btn af__btn--submit" @click="handleSubmit">
          {{ submitLabel }}
        </button>
      </div>
    </div>

    <Transition name="af__toast-fade">
      <div v-if="showToast" class="af__toast">수정되었습니다</div>
    </Transition>
  </section>
</template>

<style scoped>
.af {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 600px;
}

.af__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-border-soft);
}

.af__header-copy {
  display: grid;
  gap: 8px;
}

.af__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary-500);
}

.af__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.af__icon {
  font-size: 18px;
}

.af__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin: 0;
}

.af__description {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.af__status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.af__status-chip--done {
  background: var(--color-success-soft);
  color: #166534;
}

.af__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.af__summary-card {
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  border: 1px solid var(--color-border-soft);
  border-radius: 18px;
  background: #faf8ff;
}

.af__summary-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.af__summary-value {
  font-size: 18px;
  color: var(--color-primary-800);
}

.af__summary-value--compact {
  font-size: 16px;
}

.af__summary-meta {
  font-size: 13px;
  color: var(--color-text-muted);
}

.af__body {
  display: grid;
  gap: 18px;
}

.af__field-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.af__section {
  display: grid;
  gap: 10px;
}

.af__input,
.af__select {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 14px;
  color: var(--color-text-default);
  background: var(--color-bg-surface);
}

.af__input:focus,
.af__select:focus {
  outline: none;
  border-color: var(--color-primary-300);
  box-shadow: 0 0 0 3px rgba(91, 80, 214, 0.08);
}

.af__textarea {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  padding: 16px 18px;
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;
  min-height: 220px;
  background: var(--color-bg-surface);
}

.af__textarea:focus {
  outline: none;
  border-color: var(--color-primary-300);
  box-shadow: 0 0 0 3px rgba(91, 80, 214, 0.08);
}

.af__file-list {
  display: grid;
  gap: 8px;
}

.af__file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
  background: #faf8ff;
  font-size: 13px;
  color: var(--color-text-default);
}

.af__file-remove {
  border: 0;
  background: transparent;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.af__file-size {
  color: var(--color-text-muted);
  white-space: nowrap;
}

.af__section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.af__result-box {
  display: grid;
  gap: 4px;
  background: #f7f4ff;
  border: 1px solid #d9d1ff;
  border-radius: 16px;
  padding: 16px;
  color: var(--color-primary-800);
}

.af__result-title {
  font-size: 15px;
  font-weight: 700;
}

.af__result-text {
  font-size: 13px;
  line-height: 1.6;
}

.af__footer {
  display: grid;
  gap: 16px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--color-border-soft);
}

.af__process {
  display: grid;
  gap: 12px;
  padding: 18px 20px;
  border: 1px solid #f5e6a3;
  border-radius: 18px;
  background: #fff8e7;
}

.af__process-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.af__process-head strong {
  font-size: 14px;
  color: #8a5a00;
}

.af__process-head span {
  font-size: 12px;
  color: #a27000;
}

.af__process-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.af__step {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.af__step-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
}

.af__step--done {
  color: var(--tier-s);
}

.af__step--current {
  color: #d97706;
}

.af__step-check {
  font-size: 12px;
}

.af__step-dot {
  font-size: 10px;
}

.af__step-dot--empty {
  color: var(--color-text-muted);
}

.af__step-arrow {
  font-size: 13px;
  color: var(--color-text-muted);
}

.af__process-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

.af__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.af__btn {
  min-width: 96px;
  padding: 11px 22px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.af__btn--cancel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  color: var(--color-text-default);
}

.af__btn--submit {
  background: var(--color-primary-800);
  border: none;
  color: var(--color-white);
}

.af__btn--submit:hover {
  background: var(--color-primary-700);
}

.af__toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary-800);
  color: var(--color-white);
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.af__toast-fade-enter-active,
.af__toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.af__toast-fade-enter-from,
.af__toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (max-width: 1080px) {
  .af__summary,
  .af__field-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .af {
    padding: 20px;
  }

  .af__header {
    flex-direction: column;
  }

  .af__actions {
    justify-content: stretch;
  }

  .af__btn {
    flex: 1;
  }
}
</style>

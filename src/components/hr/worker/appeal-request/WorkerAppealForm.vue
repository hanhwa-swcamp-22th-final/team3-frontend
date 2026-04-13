<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  appealData: { type: Object, required: true },
  statusBadge: { type: String, default: null },
})

const isConfirmed = computed(() => props.statusBadge === '확정')

const emit = defineEmits(['cancel', 'submit'])

const appealTitle = ref(props.appealData.title || '')
const selectedType = ref(props.appealData.appealType || 'QUANTITATIVE_ERROR')
const appealContent = ref(props.appealData.content || '')

watch(
  () => props.appealData,
  (data) => {
    appealTitle.value = data.title || ''
    selectedType.value = data.appealType || 'QUANTITATIVE_ERROR'
    appealContent.value = data.content || ''
  },
)

const typeOptions = [
  { value: 'QUANTITATIVE_ERROR', label: '정량 평가 점수 오류' },
  { value: 'QUALITATIVE_ERROR', label: '정성 평가 항목 이의' },
  { value: 'EQUIPMENT_ERROR', label: '설비 보정 계수 오류' },
  { value: 'ETC', label: '기타' },
]

const processSteps = computed(() => {
  const s = props.appealData.processStatus
  return [
    { label: '제출완료', active: s >= 1, current: s === 1 },
    { label: 'HR 검토중', active: s >= 2, current: s === 2 },
    { label: '결과 통보', active: s >= 3, current: s === 3 },
  ]
})

const showToast = ref(false)

const submitLabel = computed(() => {
  return props.appealData.processStatus >= 1 ? '수정 제출' : '제출'
})

function handleSubmit() {
  const payload = {
    title: appealTitle.value,
    appealType: selectedType.value,
    content: appealContent.value,
  }
  emit('submit', payload)
  if (props.appealData.processStatus >= 1) {
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2500)
  }
}
</script>

<template>
  <div class="af">
    <div class="af__header">
      <span class="af__icon">✋</span>
      <h3 class="af__title">이의 신청 — {{ appealData.quarter }}</h3>
    </div>

    <!-- Title -->
    <div class="af__section">
      <h4 class="af__section-title">제목</h4>
      <input
        v-model="appealTitle"
        class="af__input"
        type="text"
        placeholder="이의 신청 제목을 입력해주세요."
        :disabled="isConfirmed"
      />
    </div>

    <!-- Appeal Type -->
    <div class="af__section">
      <h4 class="af__section-title">이의 제기 항목</h4>
      <select
        v-model="selectedType"
        class="af__select"
        :disabled="isConfirmed"
      >
        <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Content -->
    <div class="af__section">
      <h4 class="af__section-title">이의 제기 내용</h4>
      <textarea
        v-model="appealContent"
        class="af__textarea"
        rows="4"
        placeholder="이의 제기 내용을 입력해주세요."
        :disabled="isConfirmed"
      ></textarea>
    </div>

    <!-- Review Result (if available) -->
    <div v-if="appealData.reviewResult" class="af__section af__section--result">
      <h4 class="af__section-title">검토 결과</h4>
      <div class="af__result-box">
        {{ appealData.reviewResult }}
      </div>
    </div>

    <!-- Process Status -->
    <div class="af__process">
      <div class="af__process-steps">
        <template v-for="(step, i) in processSteps" :key="step.label">
          <span
            class="af__step"
            :class="{
              'af__step--done': step.active && !step.current,
              'af__step--current': step.current,
            }"
          >
            {{ step.label }}
            <span v-if="step.active && !step.current" class="af__step-check">✓</span>
            <span v-else-if="step.current" class="af__step-dot">●</span>
            <span v-else class="af__step-dot af__step-dot--empty">○</span>
          </span>
          <span v-if="i < processSteps.length - 1" class="af__step-arrow">→</span>
        </template>
      </div>
      <span class="af__process-meta">
        제출일: {{ appealData.submittedDate }} · 예상 처리: 영업일 5일 이내
      </span>
    </div>

    <!-- Actions -->
    <div v-if="!isConfirmed" class="af__actions">
      <button class="af__btn af__btn--cancel" @click="emit('cancel')">취소</button>
      <button class="af__btn af__btn--submit" @click="handleSubmit">
        {{ submitLabel }}
      </button>
    </div>

    <Transition name="af__toast-fade">
      <div v-if="showToast" class="af__toast">수정되었습니다</div>
    </Transition>
  </div>
</template>

<style scoped>
.af {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.af__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.af__icon {
  font-size: 16px;
}

.af__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

/* ── Form Elements ─────────────────────────────────────── */
.af__input,
.af__select {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 10px 14px;
  font-size: 14px;
  color: var(--color-text-default);
  background: var(--color-bg-surface);
}

.af__input:focus,
.af__select:focus {
  outline: none;
  border-color: var(--color-primary-300);
}

.af__textarea {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 18px;
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;
}

.af__textarea:focus {
  outline: none;
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-focus);
}

.af__section--result {
  margin-top: 10px;
}

.af__result-box {
  background: var(--color-primary-100);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-base);
  padding: 16px;
  font-size: 14px;
  color: var(--color-primary-800);
  line-height: 1.6;
}

/* ── Sections ───────────────────────────────────────────── */
.af__section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0 0 10px;
}

/* ── Process Status ─────────────────────────────────────── */
.af__process {
  background: #fef9e7;
  border: 1px solid #f5e6a3;
  border-radius: var(--radius-base);
  padding: 16px 20px;
}

.af__process-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.af__step {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
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

/* ── Actions ────────────────────────────────────────────── */
.af__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.af__btn {
  padding: 10px 28px;
  border-radius: var(--radius-sm);
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
</style>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  appealData: { type: Object, required: true },
})

const emit = defineEmits(['cancel', 'submit'])

const checkedCategories = ref([...props.appealData.categories])
const appealContent = ref(props.appealData.content)
const attachments = ref([...props.appealData.attachments])

watch(
  () => props.appealData,
  (data) => {
    checkedCategories.value = [...data.categories]
    appealContent.value = data.content
    attachments.value = [...data.attachments]
  },
)

const categoryOptions = [
  '정량 평가 점수 오류',
  '정성 평가 항목 이의',
  '설비 보정 계수 오류',
]

function toggleCategory(cat) {
  const idx = checkedCategories.value.indexOf(cat)
  if (idx >= 0) {
    checkedCategories.value.splice(idx, 1)
  } else {
    checkedCategories.value.push(cat)
  }
}

function removeFile(index) {
  attachments.value.splice(index, 1)
}

function addFile() {
  // placeholder — in production, trigger file picker
}

function quantClass(item) {
  return item.flagDown ? 'score--down' : ''
}

const processSteps = computed(() => {
  const s = props.appealData.processStatus
  return [
    { label: '제출완료', active: s >= 1, current: s === 1 },
    { label: 'HR 검토중', active: s >= 2, current: s === 2 },
    { label: '결과 통보', active: s >= 3, current: s === 3 },
  ]
})

const submitLabel = computed(() => {
  return props.appealData.processStatus >= 1 ? '수정 제출' : '제출'
})
</script>

<template>
  <div class="af">
    <div class="af__header">
      <span class="af__icon">✋</span>
      <h3 class="af__title">이의 신청 — {{ appealData.quarter }}</h3>
    </div>

    <!-- Score Summary -->
    <div class="af__scores">
      <span class="af__scores-label">현재 확정 점수</span>
      <div class="af__scores-grid">
        <div class="af__score-col">
          <span class="af__score-value" :class="{ 'score--down': appealData.scores.quantFlagDown }">
            {{ appealData.scores.quantitative }}
          </span>
          <span class="af__score-sub">
            정량
            <span v-if="appealData.scores.quantFlagDown" class="af__score-flag">▼</span>
          </span>
        </div>
        <div class="af__score-divider"></div>
        <div class="af__score-col">
          <span class="af__score-value">{{ appealData.scores.qualitative }}</span>
          <span class="af__score-sub">정성</span>
        </div>
        <div class="af__score-divider"></div>
        <div class="af__score-col">
          <span class="af__score-value af__score-value--composite">{{ appealData.scores.composite }}</span>
          <span class="af__score-sub">종합</span>
        </div>
      </div>
      <span class="af__scores-reason">이의 제기 사유: {{ appealData.reason }}</span>
    </div>

    <!-- Categories -->
    <div class="af__section">
      <h4 class="af__section-title">이의 제기 항목</h4>
      <div class="af__categories">
        <label v-for="cat in categoryOptions" :key="cat" class="af__category">
          <input
            type="checkbox"
            :checked="checkedCategories.includes(cat)"
            @change="toggleCategory(cat)"
          />
          <span>{{ cat }}</span>
        </label>
      </div>
    </div>

    <!-- Content -->
    <div class="af__section">
      <h4 class="af__section-title">이의 제기 내용</h4>
      <textarea
        v-model="appealContent"
        class="af__textarea"
        rows="4"
        placeholder="이의 제기 내용을 입력해주세요."
      ></textarea>
    </div>

    <!-- Attachments -->
    <div class="af__section">
      <h4 class="af__section-title">근거 자료 첨부</h4>
      <div class="af__attachments">
        <div v-for="(file, i) in attachments" :key="i" class="af__file">
          <span class="af__file-icon">📎</span>
          <span class="af__file-name">{{ file }}</span>
          <button class="af__file-remove" @click="removeFile(i)">X</button>
        </div>
        <button class="af__file-add" @click="addFile">+ 파일 추가</button>
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
    <div class="af__actions">
      <button class="af__btn af__btn--cancel" @click="emit('cancel')">취소</button>
      <button class="af__btn af__btn--submit" @click="emit('submit', {
        categories: checkedCategories,
        content: appealContent,
        attachments,
      })">
        {{ submitLabel }}
      </button>
    </div>
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

/* ── Score Summary ──────────────────────────────────────── */
.af__scores {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.af__scores-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.af__scores-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin: 14px 0 16px;
}

.af__score-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.af__score-divider {
  width: 1px;
  height: 48px;
  background: var(--color-border-default);
  flex-shrink: 0;
}

.af__score-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1;
}

.score--down {
  color: var(--color-text-strong);
}

.af__score-value--composite {
  color: var(--color-danger);
}

.af__score-sub {
  font-size: 13px;
  color: var(--color-text-muted);
}

.af__score-flag {
  color: var(--color-danger);
  font-size: 11px;
}

.af__scores-reason {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* ── Sections ───────────────────────────────────────────── */
.af__section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0 0 10px;
}

.af__categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 4px;
}

.af__category {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-default);
  cursor: pointer;
}

.af__category input[type='checkbox'] {
  accent-color: var(--color-primary-700);
  width: 16px;
  height: 16px;
}

.af__textarea {
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

/* ── Attachments ────────────────────────────────────────── */
.af__attachments {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.af__file {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-default);
}

.af__file-icon {
  font-size: 14px;
}

.af__file-name {
  font-weight: 500;
}

.af__file-remove {
  background: none;
  border: 1px solid var(--color-border-default);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 11px;
  color: var(--color-text-muted);
  cursor: pointer;
}

.af__file-add {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
}

.af__file-add:hover {
  color: var(--color-primary-700);
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
</style>

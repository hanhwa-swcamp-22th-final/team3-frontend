<script setup>
import { ref } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['close', 'save-draft', 'submit'])

const completedQty = ref('')
const defectQty = ref('')
const memo = ref('')

const qualityChecks = ref([
  { label: '치수 측정 결과 입력', btnLabel: '등록 완료', done: false },
  { label: '불량 사유 코드 선택', btnLabel: '등록 완료', done: false },
  { label: '사진 첨부', btnLabel: '1장 대기', done: false },
])

function toggleQuality(index) {
  qualityChecks.value[index].done = !qualityChecks.value[index].done
}

function handleSubmit() {
  emit('submit', {
    jobId: props.job.id,
    completedQty: completedQty.value,
    defectQty: defectQty.value,
    memo: memo.value,
  })
}
</script>

<template>
  <BaseFormModal
    :show-close-button="false"
    width="520px"
    cancelText="닫기"
    draftText="임시 저장"
    confirmText="완료 보고 제출"
    showDraftButton
    @close="emit('close')"
    @cancel="emit('close')"
    @draft="emit('save-draft')"
    @confirm="handleSubmit"
  >
    <template #header>
      <div class="fm__header">
        <h2 class="fm__title">작업 완료 보고</h2>
        <p class="fm__desc">
          완료 수량, 작업 이슈, 품질 체크 결과를 입력하면 작업 이력이 저장되고 TL/GL에게 즉시 공유됩니다.
        </p>
      </div>
    </template>

    <!-- Info row -->
    <div class="fm__info">
      <div class="fm__info-col">
        <span class="fm__info-label">작업 번호</span>
        <span class="fm__info-value">{{ job.orderCode }}</span>
      </div>
      <div class="fm__info-divider"></div>
      <div class="fm__info-col">
        <span class="fm__info-label">진행 시간</span>
        <span class="fm__info-value">{{ job.elapsedTime || '—' }}</span>
      </div>
      <div class="fm__info-divider"></div>
      <div class="fm__info-col">
        <span class="fm__info-label">현재 진척률</span>
        <span class="fm__info-value">{{ job.target ? Math.round((job.current / job.target) * 100) : 0 }}%</span>
      </div>
    </div>

    <!-- Quantity -->
    <div class="fm__section">
      <span class="fm__section-label">완료 수량 / 불량 수량</span>
      <div class="fm__qty-row">
        <div class="fm__qty-field">
          <span class="fm__qty-prefix">완료</span>
          <input v-model="completedQty" type="text" class="fm__input" placeholder="24EA" />
        </div>
        <span class="fm__qty-sep">/</span>
        <div class="fm__qty-field">
          <span class="fm__qty-prefix">불량</span>
          <input v-model="defectQty" type="text" class="fm__input" placeholder="1EA" />
        </div>
      </div>
    </div>

    <!-- Memo -->
    <div class="fm__section">
      <span class="fm__section-label">작업 메모</span>
      <textarea
        v-model="memo"
        class="fm__textarea"
        rows="3"
        placeholder="작업 중 발생한 이슈나 특이사항을 기록해 주세요."
      ></textarea>
    </div>

    <!-- Quality checks -->
    <div class="fm__section">
      <span class="fm__section-label">품질 체크</span>
      <div class="fm__checks">
        <div v-for="(item, i) in qualityChecks" :key="i" class="fm__check">
          <span class="fm__check-text">{{ item.label }}</span>
          <button
            class="fm__check-btn"
            :class="{ 'fm__check-btn--done': item.done }"
            @click="toggleQuality(i)"
          >
            {{ item.btnLabel }}
          </button>
        </div>
      </div>
    </div>
  </BaseFormModal>
</template>

<style scoped>
/* Override BaseModal header wrapper for full-bleed dark banner */
:deep(.base-modal__head) {
  display: block;
  margin: -24px -24px 0;
  padding: 0;
}

.fm__header {
  background: var(--color-primary-800);
  padding: 28px 24px;
  border-radius: 22px 22px 0 0;
}

.fm__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-white);
  margin: 0 0 8px;
}

.fm__desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

/* ── Info ────────────────────────────────────────────────── */
.fm__info {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 0;
}

.fm__info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.fm__info-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.fm__info-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.fm__info-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border-default);
}

/* ── Sections ───────────────────────────────────────────── */
.fm__section {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 14px 18px;
}

.fm__section-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* ── Quantity ───────────────────────────────────────────── */
.fm__qty-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.fm__qty-field {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fm__qty-prefix {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
}

.fm__qty-sep {
  font-size: 16px;
  color: var(--color-text-muted);
}

.fm__input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-strong);
  font-family: inherit;
}

.fm__input:focus {
  outline: none;
  border-color: var(--color-primary-300);
}

/* ── Textarea ───────────────────────────────────────────── */
.fm__textarea {
  width: 100%;
  margin-top: 8px;
  border: none;
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;
}

.fm__textarea:focus {
  outline: none;
}

/* ── Quality checks ─────────────────────────────────────── */
.fm__checks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.fm__check {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-sm);
}

.fm__check-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-default);
}

.fm__check-btn {
  padding: 5px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-700);
  cursor: pointer;
}

.fm__check-btn--done {
  background: var(--color-success-soft);
  border-color: #bbf7d0;
  color: #166534;
}
</style>

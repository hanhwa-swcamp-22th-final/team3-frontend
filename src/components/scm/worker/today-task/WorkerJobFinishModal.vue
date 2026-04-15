<script setup>
import { ref } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['close', 'save-draft', 'submit'])

const memo = ref('')

function handleSubmit() {
  emit('submit', {
    jobId: props.job.id,
    memo: memo.value,
  })
}

function handleDraft() {
  emit('save-draft', {
    jobId: props.job.id,
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
    @draft="handleDraft"
    @confirm="handleSubmit"
  >
    <template #header>
      <div class="fm__header">
        <h2 class="fm__title">작업 완료 보고</h2>
        <p class="fm__desc">
          작업 이슈나 특이사항을 입력하면 작업 이력이 저장되고 TL/GL에게 즉시 공유됩니다.
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
</style>

<script setup>
import { ref } from 'vue'
import { BaseConfirmModal } from '@/components/common/base'

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['close', 'confirm'])

const checklist = ref([
  { label: '작업 도면 및 규격 확인', checked: false },
  { label: '설비 예열 및 공구 체결 상태 확인', checked: false },
  { label: '안전 보호구 착용', checked: false },
])

function toggleCheck(index) {
  checklist.value[index].checked = !checklist.value[index].checked
}

function handleConfirm() {
  emit('confirm', props.job)
}
</script>

<template>
  <BaseConfirmModal
    :show-close-button="false"
    width="520px"
    cancelText="취소"
    confirmText="작업 시작"
    @close="emit('close')"
    @cancel="emit('close')"
    @confirm="handleConfirm"
  >
    <template #header>
      <div class="sm__header">
        <h2 class="sm__title">작업 시작 확인</h2>
        <p class="sm__desc">
          선택한 작업을 시작하면 진행 상태가 즉시 갱신되고, 예상 소요시간 기준으로 완료 예정 시각이 계산됩니다.
          아래 작업 정보를 확인한 후 시작해 주세요.
        </p>
      </div>
    </template>

    <!-- Info row -->
    <div class="sm__info">
      <div class="sm__info-col">
        <span class="sm__info-label">작업 번호</span>
        <span class="sm__info-value">{{ job.orderCode }}</span>
      </div>
      <div class="sm__info-divider"></div>
      <div class="sm__info-col">
        <span class="sm__info-label">설비</span>
        <span class="sm__info-value">{{ job.equipment }}</span>
      </div>
      <div class="sm__info-divider"></div>
      <div class="sm__info-col">
        <span class="sm__info-label">예상 시간</span>
        <span class="sm__info-value">{{ job.estimatedTime }}</span>
      </div>
    </div>

    <!-- Job name -->
    <div class="sm__jobname">
      <span class="sm__jobname-label">작업명</span>
      <p class="sm__jobname-value">{{ job.title }}</p>
    </div>

    <!-- Checklist -->
    <div class="sm__checklist">
      <span class="sm__checklist-label">시작 전 체크</span>
      <div class="sm__checks">
        <div v-for="(item, i) in checklist" :key="i" class="sm__check">
          <span class="sm__check-text">{{ item.label }}</span>
          <button
            class="sm__check-btn"
            :class="{ 'sm__check-btn--done': item.checked }"
            @click="toggleCheck(i)"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  </BaseConfirmModal>
</template>

<style scoped>
/* Override BaseModal header wrapper for full-bleed dark banner */
:deep(.base-modal__head) {
  display: block;
  margin: -24px -24px 0;
  padding: 0;
}

.sm__header {
  background: var(--color-primary-800);
  padding: 28px 24px;
  border-radius: 22px 22px 0 0;
}

.sm__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-white);
  margin: 0 0 8px;
}

.sm__desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

/* ── Info ────────────────────────────────────────────────── */
.sm__info {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 0;
}

.sm__info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.sm__info-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.sm__info-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.sm__info-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border-default);
}

/* ── Job name ───────────────────────────────────────────── */
.sm__jobname {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 14px 18px;
}

.sm__jobname-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.sm__jobname-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-strong);
  margin: 6px 0 0;
}

/* ── Checklist ──────────────────────────────────────────── */
.sm__checklist {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 18px;
}

.sm__checklist-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.sm__checks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.sm__check {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-sm);
}

.sm__check-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-default);
}

.sm__check-btn {
  padding: 5px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-700);
  cursor: pointer;
}

.sm__check-btn--done {
  background: var(--color-success-soft);
  border-color: #bbf7d0;
  color: #166534;
}
</style>

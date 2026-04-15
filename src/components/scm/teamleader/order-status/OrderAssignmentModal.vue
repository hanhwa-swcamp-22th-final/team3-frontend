<script setup>
import { computed, ref, watch } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const props = defineProps({
  open: { type: Boolean, default: false },
  order: { type: Object, default: null },
  candidates: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  submitting: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const selectedTechnicianId = ref(null)
const MATCHING_MODE_LABELS = {
  EFFICIENCY_TYPE: '최적형 배정',
  GROWTH_TYPE: '도전형 배정',
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      selectedTechnicianId.value = props.candidates[0]?.employeeId ?? null
    }
  }
)

watch(
  () => props.candidates,
  (candidates) => {
    if (!candidates.some((candidate) => candidate.employeeId === selectedTechnicianId.value)) {
      selectedTechnicianId.value = candidates[0]?.employeeId ?? null
    }
  },
  { deep: true }
)

const selectedCandidate = computed(() =>
  props.candidates.find((candidate) => candidate.employeeId === selectedTechnicianId.value) ?? null
)

function matchingModeLabel(candidate) {
  return MATCHING_MODE_LABELS[candidate?.matchingMode] ?? '배정 유형 미정'
}

function handleSubmit() {
  if (!props.order?.orderId || !selectedTechnicianId.value) return
  emit('submit', {
    orderId: props.order.orderId,
    technicianId: selectedTechnicianId.value,
  })
}
</script>

<template>
  <BaseFormModal
    width="560px"
    cancelText="닫기"
    confirmText="배정 확정"
    :confirmDisabled="!order?.orderId || !selectedTechnicianId || submitting"
    @close="emit('close')"
    @cancel="emit('close')"
    @confirm="handleSubmit"
  >
    <template #header>
      <div class="assignment-modal__header">
        <h2 class="assignment-modal__title">작업자 배정</h2>
        <p class="assignment-modal__desc">선택한 주문에 배정할 작업자를 고릅니다.</p>
      </div>
    </template>

    <div v-if="order" class="assignment-modal__order">
      <div>
        <span class="assignment-modal__label">주문번호</span>
        <strong>{{ order.orderCode }}</strong>
      </div>
      <div>
        <span class="assignment-modal__label">품목</span>
        <strong>{{ order.title }}</strong>
      </div>
      <div>
        <span class="assignment-modal__label">상태</span>
        <strong>{{ order.statusLabel }}</strong>
      </div>
    </div>

    <div v-if="!order?.orderId" class="assignment-modal__warning">
      현재 주문 목록 API에 `orderId`가 없어 배정 요청을 직접 보낼 수 없습니다.
    </div>
    <div v-else-if="loading" class="assignment-modal__empty">후보 작업자를 불러오는 중입니다.</div>
    <div v-else-if="!candidates.length" class="assignment-modal__empty">배정 가능한 작업자가 없습니다.</div>
    <div v-else class="assignment-modal__list">
      <label
        v-for="candidate in candidates"
        :key="candidate.employeeId"
        class="assignment-modal__candidate"
      >
        <input
          v-model="selectedTechnicianId"
          type="radio"
          name="technician"
          :value="candidate.employeeId"
        />
        <div class="assignment-modal__candidate-body">
          <div class="assignment-modal__candidate-row">
            <strong>{{ candidate.employeeName }}</strong>
            <span class="assignment-modal__tier">{{ candidate.tier }}</span>
          </div>
          <div class="assignment-modal__candidate-row assignment-modal__candidate-row--meta">
            <span>OCSA {{ candidate.score ?? '-' }}</span>
            <span>적합도 {{ candidate.suitabilityScore ?? '-' }}</span>
            <span class="assignment-modal__mode">{{ matchingModeLabel(candidate) }}</span>
          </div>
        </div>
      </label>
    </div>

    <div v-if="selectedCandidate" class="assignment-modal__summary">
      <span>선택 작업자</span>
      <strong>{{ selectedCandidate.employeeName }}</strong>
    </div>
  </BaseFormModal>
</template>

<style scoped>
.assignment-modal__header { display: grid; gap: 6px; }
.assignment-modal__title { font-size: 22px; font-weight: 800; color: var(--color-primary-800); }
.assignment-modal__desc { font-size: 13px; color: var(--color-text-muted); }
.assignment-modal__order {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface-muted);
}
.assignment-modal__order div { display: grid; gap: 4px; }
.assignment-modal__label { font-size: 11px; color: var(--color-text-muted); }
.assignment-modal__warning,
.assignment-modal__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 18px;
  border: 1px dashed var(--color-border-default);
  border-radius: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
}
.assignment-modal__warning { color: var(--color-danger); background: #fff4f6; }
.assignment-modal__list { display: grid; gap: 10px; max-height: 280px; overflow-y: auto; }
.assignment-modal__candidate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  padding: 14px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
}
.assignment-modal__candidate-body { display: grid; gap: 6px; }
.assignment-modal__candidate-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.assignment-modal__candidate-row--meta { font-size: 12px; color: var(--color-text-muted); }
.assignment-modal__tier {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: 12px;
  font-weight: 700;
}
.assignment-modal__mode {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f6f3ff;
  color: var(--color-primary-700);
  font-weight: 800;
}
.assignment-modal__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-primary-50);
  color: var(--color-primary-800);
}
</style>

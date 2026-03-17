<script setup>
import { ref, computed } from 'vue'
import HRMEvalWeightPanel from '@/components/hrmanager/hr/HRMEvalWeightPanel.vue'
import HRMEvalTierPanel   from '@/components/hrmanager/hr/HRMEvalTierPanel.vue'
import HRMEvalQuantPanel  from '@/components/hrmanager/hr/HRMEvalQuantPanel.vue'
import {
  defaultQuantWeight  as DEFAULT_QUANT_WEIGHT,
  defaultThresholds   as DEFAULT_THRESHOLDS,
  defaultQuantItems   as DEFAULT_QUANT_ITEMS,
} from '@/mocks/hrmanager/evaluationCriteria.js'

const quantWeight  = ref(DEFAULT_QUANT_WEIGHT)
const thresholds   = ref({ ...DEFAULT_THRESHOLDS })
const quantItems   = ref(DEFAULT_QUANT_ITEMS.map(item => ({ ...item })))

const quantItemsTotal = computed(() =>
  quantItems.value.reduce((sum, item) => sum + item.weight, 0)
)

function handleReset() {
  quantWeight.value = DEFAULT_QUANT_WEIGHT
  thresholds.value  = { ...DEFAULT_THRESHOLDS }
  quantItems.value  = DEFAULT_QUANT_ITEMS.map(item => ({ ...item }))
}

function handleTempSave() {
  alert('임시 저장되었습니다.')
}

function handleApply() {
  if (quantItemsTotal.value !== 100) {
    alert('정량 세부 항목 합계가 100%여야 합니다.')
    return
  }
  alert('변경사항이 적용되었습니다.')
}
</script>

<template>
  <section class="eval-view">

    <div class="eval-view__banner">
      ⚠ 평가 기준 변경 시 전체 테크니션 점수에 즉시 반영됩니다. 신중하게 설정해주세요.
    </div>

    <div class="eval-view__panels">
      <HRMEvalWeightPanel
        :quant-weight="quantWeight"
        @update:quant-weight="quantWeight = $event"
      />
      <HRMEvalTierPanel
        :thresholds="thresholds"
        @update:thresholds="thresholds = $event"
      />
      <HRMEvalQuantPanel
        :items="quantItems"
        @update:items="quantItems = $event"
      />
    </div>

    <div class="eval-view__actions">
      <button class="eval-view__btn eval-view__btn--reset"  @click="handleReset">초기화</button>
      <button class="eval-view__btn eval-view__btn--temp"   @click="handleTempSave">임시 저장</button>
      <button class="eval-view__btn eval-view__btn--apply"  @click="handleApply">변경사항 적용</button>
    </div>

  </section>
</template>

<style scoped>
.eval-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: auto;
  min-height: 0;
}
.eval-view__banner {
  padding: 14px 20px;
  background: var(--color-primary-100);
  border: 1px solid var(--color-primary-200);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-600);
}
.eval-view__panels {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: start;
}
.eval-view__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.eval-view__btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}
.eval-view__btn--reset {
  background: var(--color-danger);
  color: var(--color-white);
}
.eval-view__btn--temp {
  background: var(--color-bg-surface);
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-300);
}
.eval-view__btn--apply {
  background: var(--color-primary-600);
  color: var(--color-white);
}
</style>

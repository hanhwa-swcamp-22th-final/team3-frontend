<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import HRMEvalWeightPanel from '@/components/hr/hrmanager/evaluation-criteria/HRMEvalWeightPanel.vue'
import HRMEvalTierPanel from '@/components/hr/hrmanager/evaluation-criteria/HRMEvalTierPanel.vue'
import HRMEvalWeightHistoryGroupPanel from '@/components/hr/hrmanager/evaluation-criteria/HRMEvalWeightHistoryGroupPanel.vue'
import HRMEvalTierHistoryGroupPanel from '@/components/hr/hrmanager/evaluation-criteria/HRMEvalTierHistoryGroupPanel.vue'
import { BaseToast } from '@/components/common/base/overlay'
import { HR_API_BASE } from '@/constants'
import { useAuthStore } from '@/stores/auth'

const DEFAULT_TIER_CONFIGS = [
  { tier: 'S', tierConfigPromotionPoint: 100 },
  { tier: 'A', tierConfigPromotionPoint: 80 },
  { tier: 'B', tierConfigPromotionPoint: 60 },
  { tier: 'C', tierConfigPromotionPoint: 0 },
]

const DEFAULT_CATEGORY_WEIGHTS = [
  { tierGroup: 'SA', categoryCode: 'PRODUCTIVITY', weightPercent: 20 },
  { tierGroup: 'SA', categoryCode: 'EQUIPMENT_RESPONSE', weightPercent: 40 },
  { tierGroup: 'SA', categoryCode: 'PROCESS_INNOVATION', weightPercent: 30 },
  { tierGroup: 'SA', categoryCode: 'KNOWLEDGE_SHARING', weightPercent: 10 },
  { tierGroup: 'BC', categoryCode: 'PRODUCTIVITY', weightPercent: 60 },
  { tierGroup: 'BC', categoryCode: 'EQUIPMENT_RESPONSE', weightPercent: 20 },
  { tierGroup: 'BC', categoryCode: 'PROCESS_INNOVATION', weightPercent: 10 },
  { tierGroup: 'BC', categoryCode: 'KNOWLEDGE_SHARING', weightPercent: 10 },
]

const tierConfigs = ref(DEFAULT_TIER_CONFIGS.map((item) => ({ ...item })))
const categoryWeights = ref(DEFAULT_CATEGORY_WEIGHTS.map((item) => ({ ...item })))
const tierConfigHistoryGroups = ref([])
const categoryWeightHistoryGroups = ref([])
const loading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
const authStore = useAuthStore()

let toastTimer = null

function fetchEvaluationCriteria() {
  return axios.get(`${HR_API_BASE}/api/v1/hr/evaluation/criteria`, {
    headers: { Authorization: `Bearer ${authStore.accessToken}` },
  })
}

function updateEvaluationCriteria(payload) {
  return axios.put(`${HR_API_BASE}/api/v1/hr/evaluation/criteria`, payload, {
    headers: { Authorization: `Bearer ${authStore.accessToken}` },
  })
}

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

function mergeTierConfigs(items = []) {
  return DEFAULT_TIER_CONFIGS.map((defaultItem) => {
    const found = items.find((item) => item.tier === defaultItem.tier)
    return found
      ? {
          tier: found.tier,
          tierConfigPromotionPoint: Number(found.tierConfigPromotionPoint ?? defaultItem.tierConfigPromotionPoint),
        }
      : { ...defaultItem }
  })
}

function mergeCategoryWeights(items = []) {
  return DEFAULT_CATEGORY_WEIGHTS.map((defaultItem) => {
    const found = items.find(
      (item) =>
        item.tierGroup === defaultItem.tierGroup &&
        item.categoryCode === defaultItem.categoryCode,
    )
    return found
      ? {
          tierGroup: found.tierGroup,
          categoryCode: found.categoryCode,
          weightPercent: Number(found.weightPercent ?? defaultItem.weightPercent),
        }
      : { ...defaultItem }
  })
}

const weightTotals = computed(() =>
  categoryWeights.value.reduce((acc, item) => {
    acc[item.tierGroup] = (acc[item.tierGroup] || 0) + Number(item.weightPercent || 0)
    return acc
  }, {}),
)

function handleReset() {
  tierConfigs.value = DEFAULT_TIER_CONFIGS.map((item) => ({ ...item }))
  categoryWeights.value = DEFAULT_CATEGORY_WEIGHTS.map((item) => ({ ...item }))
  showToast('평가 기준을 기본값으로 되돌렸습니다.')
}

async function loadCriteria() {
  loading.value = true
  try {
    const response = await fetchEvaluationCriteria()
    const payload = response?.data?.data ?? {}
    tierConfigs.value = mergeTierConfigs(payload.tierConfigs)
    categoryWeights.value = mergeCategoryWeights(payload.categoryWeights)
    tierConfigHistoryGroups.value = payload.tierConfigHistoryGroups ?? []
    categoryWeightHistoryGroups.value = payload.categoryWeightHistoryGroups ?? []
  } catch (error) {
    tierConfigs.value = DEFAULT_TIER_CONFIGS.map((item) => ({ ...item }))
    categoryWeights.value = DEFAULT_CATEGORY_WEIGHTS.map((item) => ({ ...item }))
    tierConfigHistoryGroups.value = []
    categoryWeightHistoryGroups.value = []
    showToast('평가 기준 조회에 실패해 기본값으로 표시합니다.', 'error')
  } finally {
    loading.value = false
  }
}

async function handleApply() {
  if (weightTotals.value.SA !== 100 || weightTotals.value.BC !== 100) {
    showToast('Tier 그룹별 가중치 합계는 100이어야 합니다.', 'error')
    return
  }

  try {
    await updateEvaluationCriteria({
      tierConfigs: tierConfigs.value.map((item) => ({
        tier: item.tier,
        tierConfigPromotionPoint: Number(item.tierConfigPromotionPoint),
      })),
      categoryWeights: categoryWeights.value.map((item) => ({
        tierGroup: item.tierGroup,
        categoryCode: item.categoryCode,
        weightPercent: Number(item.weightPercent),
      })),
    })
    showToast('평가 기준을 저장했습니다.')
    await loadCriteria()
  } catch (error) {
    showToast('평가 기준 저장에 실패했습니다.', 'error')
  }
}

onMounted(() => {
  loadCriteria()
})
</script>

<template>
  <section class="eval-view">
    <div class="eval-view__banner">
      직급군별 평가 비중과 Tier 승급 기준점을 관리합니다.
    </div>

    <div class="eval-view__panels">
      <HRMEvalWeightPanel
        :weights="categoryWeights"
        :loading="loading"
        @update:weights="categoryWeights = $event"
      />
      <HRMEvalTierPanel
        :items="tierConfigs"
        :loading="loading"
        @update:items="tierConfigs = $event"
      />
    </div>

    <div class="eval-view__actions">
      <button class="eval-view__btn eval-view__btn--reset" :disabled="loading" @click="handleReset">
        초기화
      </button>
      <button class="eval-view__btn eval-view__btn--apply" :disabled="loading" @click="handleApply">
        {{ loading ? '불러오는 중...' : '저장' }}
      </button>
    </div>

    <div class="eval-view__history">
      <HRMEvalWeightHistoryGroupPanel :groups="categoryWeightHistoryGroups" />
      <HRMEvalTierHistoryGroupPanel :groups="tierConfigHistoryGroups" />
    </div>
  </section>

  <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
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
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600);
}
.eval-view__panels {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}
.eval-view__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.eval-view__history {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}
.eval-view__btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
}
.eval-view__btn:disabled {
  opacity: 0.65;
  cursor: default;
}
.eval-view__btn--reset {
  background: var(--color-danger);
  color: var(--color-white);
}
.eval-view__btn--apply {
  background: var(--color-primary-600);
  color: var(--color-white);
}

@media (max-width: 1200px) {
  .eval-view__panels {
    grid-template-columns: 1fr;
  }
  .eval-view__history {
    grid-template-columns: 1fr;
  }
}
</style>

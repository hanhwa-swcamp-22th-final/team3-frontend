<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_BASE } from '@/constants'
import HRMMetricCard       from '@/components/hr/hrmanager/kpi-report/HRMMetricCard.vue'
import HRMPromotionList    from '@/components/hr/hrmanager/promotion-review/HRMPromotionList.vue'
import HRMPromotionDetail  from '@/components/hr/hrmanager/promotion-review/HRMPromotionDetail.vue'

const loading    = ref(true)
const summary    = ref(null)
const candidates = ref([])
const activeTab  = ref('전체')
const selectedId = ref(null)

const tabs = computed(() => {
  const sTierCount = candidates.value.filter(c => c.targetTier === 'S').length
  const aTierCount = candidates.value.filter(c => c.targetTier === 'A').length
  return [`전체(${candidates.value.length})`, `S-Tier(${sTierCount})`, `A-Tier(${aTierCount})`]
})

const filteredList = computed(() => {
  if (activeTab.value.startsWith('전체')) return candidates.value
  if (activeTab.value.startsWith('S-Tier')) return candidates.value.filter(c => c.targetTier === 'S')
  if (activeTab.value.startsWith('A-Tier')) return candidates.value.filter(c => c.targetTier === 'A')
  return candidates.value
})

const selectedItem = computed(() =>
  candidates.value.find(c => c.id === selectedId.value)
)

async function fetchJson(url) {
  const res = await fetch(url)
  return res.json()
}

onMounted(async () => {
  try {
    const [summaryData, candidatesData] = await Promise.all([
      fetchJson(`${API_BASE}/promotionSummary`),
      fetchJson(`${API_BASE}/promotionCandidates`),
    ])
    summary.value    = summaryData[0] ?? null
    candidates.value = candidatesData
    if (candidatesData.length > 0) selectedId.value = candidatesData[0].id
  } catch (e) {
    console.error('승급심사 데이터 로딩 실패:', e)
  } finally {
    loading.value = false
  }
})

function handleHold(id) {
  alert(`${candidates.value.find(c => c.id === id)?.name} 보류 처리`)
}

function handleConfirm(id) {
  alert(`${candidates.value.find(c => c.id === id)?.name} 승급 확정`)
}
</script>

<template>
  <section class="promo-view">
    <div v-if="loading" class="promo-view__loading">불러오는 중...</div>

    <template v-else>
      <!-- 지표 카드 -->
      <section class="promo-view__metrics" v-if="summary">
        <HRMMetricCard
          label="S-TIER 심사대상"
          :value="`${summary.sTierCount}명`"
          :delta="`▲${summary.sTierDelta} 전분기비`"
          tone="primary"
        />
        <HRMMetricCard
          label="A-TIER 심사대상"
          :value="`${summary.aTierCount}명`"
          :delta="`▲${summary.aTierDelta}`"
          tone="primary"
        />
        <HRMMetricCard
          label="이번분기 승급확정"
          :value="`${summary.confirmedCount}명`"
          tone="success"
        />
        <HRMMetricCard
          label="승급률"
          :value="`${summary.promotionRate}%`"
          :delta="`전분기 ${summary.prevPromotionRate}%`"
          tone="success"
        />
      </section>

      <!-- 목록 + 상세 -->
      <div class="promo-view__content">
        <HRMPromotionList
          :list="filteredList"
          :tabs="tabs"
          :active-tab="activeTab"
          :selected-id="selectedId"
          @tab-change="activeTab = $event"
          @select="selectedId = $event"
          @confirm="handleConfirm"
        />
        <HRMPromotionDetail
          v-if="selectedItem"
          :item="selectedItem"
          @hold="handleHold"
          @confirm="handleConfirm"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.promo-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: auto;
  min-height: 0;
}
.promo-view__loading {
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 15px;
}
.promo-view__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.promo-view__content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex: 1;
  min-height: 0;
}
</style>

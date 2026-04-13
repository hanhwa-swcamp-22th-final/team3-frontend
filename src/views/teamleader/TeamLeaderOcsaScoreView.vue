<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderOcsaOrderList from '@/components/scm/teamleader/ocsa-score/TeamLeaderOcsaOrderList.vue'
import TeamLeaderOcsaDetailPanel from '@/components/scm/teamleader/ocsa-score/TeamLeaderOcsaDetailPanel.vue'
import TeamLeaderOcsaTechnicianList from '@/components/scm/teamleader/ocsa-score/TeamLeaderOcsaTechnicianList.vue'
import { getOrders, getOcsaSummary, getOrderOcsa, getTechnicians } from '@/services/teamLeaderScmApi'

const FILTER_CONFIGS = [
  { key: 'all', label: '전체' },
  { key: 'D5',  label: 'D5' },
  { key: 'D4',  label: 'D4' },
  { key: 'D3',  label: 'D3' },
  { key: 'D2',  label: 'D2 이하' },
]

const GRADE_TONE = { D5: 'danger', D4: 'warning', D3: 'primary', D2: 'success', D1: 'success' }

const activeFilter    = ref('all')
const orders          = ref([])
const ocsaSummary     = ref(null)
const selectedOrderId = ref(null)
const ocsa            = ref(null)
const technicians     = ref([])
const ocsaLoading     = ref(false)

// ── 요약 카드 ──────────────────────────────────────────────────────────
const summaryCards = computed(() => [
  { label: '분석 주문 수', value: `${ocsaSummary.value?.analyzedOrderCount ?? 0}건`, tone: 'primary' },
  { label: '평균 난이도',  value: avgGradeLabel.value,                               tone: 'primary' },
  { label: '최고 난이도',  value: ocsaSummary.value?.maxDifficultyGrade ?? '-',      tone: 'danger'  },
  { label: '기술자 수',    value: `${technicians.value.length}명`,                   tone: 'success' },
])

const avgGradeLabel = computed(() => {
  const score = ocsaSummary.value?.avgDifficultyScore
  if (score == null) return '-'
  const grade = score >= 90 ? 'D5' : score >= 70 ? 'D4' : score >= 50 ? 'D3' : score >= 30 ? 'D2' : 'D1'
  return `${grade} (${score.toFixed(1)})`
})

// ── 주문 목록: OCSA 분석 완료된 것만 ──────────────────────────────────
const OCSA_STATUSES = ['ANALYZED', 'INPROGRESS', 'COMPLETED']

const analyzedOrders = computed(() =>
  orders.value.filter((o) => OCSA_STATUSES.includes(o.status) && o.difficultyGrade != null)
)

const filteredOrders = computed(() => {
  const list = analyzedOrders.value
  if (activeFilter.value === 'all') return list
  if (activeFilter.value === 'D2')  return list.filter((o) => ['D1', 'D2'].includes(o.difficultyGrade))
  return list.filter((o) => o.difficultyGrade === activeFilter.value)
})

const filters = computed(() =>
  FILTER_CONFIGS.map((f) => {
    const count = f.key === 'all'
      ? analyzedOrders.value.length
      : f.key === 'D2'
        ? analyzedOrders.value.filter((o) => ['D1', 'D2'].includes(o.difficultyGrade)).length
        : analyzedOrders.value.filter((o) => o.difficultyGrade === f.key).length
    return { ...f, label: `${f.label}(${count})` }
  })
)

function mapOrder(o) {
  const today = new Date(); today.setHours(0,0,0,0)
  const diff  = o.dueDate
    ? Math.ceil((new Date(`${o.dueDate}T00:00:00`) - today) / 86400000)
    : null
  const deadline = diff == null ? '납기 미정' : diff <= 0 ? 'D-DAY' : `D-${diff}`
  return {
    id:        o.orderId,
    code:      o.orderNumber,
    title:     o.itemName,
    grade:     o.difficultyGrade,
    deadline,
    gradeTone: GRADE_TONE[o.difficultyGrade] ?? 'primary',
  }
}

const mappedOrders = computed(() => filteredOrders.value.map(mapOrder))

const selectedOrder = computed(() =>
  mappedOrders.value.find((o) => o.id === selectedOrderId.value) ?? mappedOrders.value[0] ?? null
)

// ── OCSA 상세 패널 ────────────────────────────────────────────────────
const detailPanel = computed(() => {
  const order = selectedOrder.value
  if (!order || !ocsa.value) return null

  const { v1ProcessComplexity: v1, v2QualityPrecision: v2,
          v3CapacityRequirements: v3, v4SpaceTimeUrgency: v4,
          alphaNovlety: alpha, difficultyScore: score, difficultyGrade: grade } = ocsa.value

  const fmt  = (v) => (v != null ? Number(v).toFixed(2) : '-')
  const bar  = (v) => `${Math.min(100, Math.round((Number(v) / 10) * 100))}%`
  const conf = score != null ? (Math.min(99, 85 + Number(score) * 0.14)).toFixed(0) + '%' : '-'
  const formula = (v1 != null)
    ? `D = V1(${fmt(v1)})×0.25 + V2(${fmt(v2)})×0.25 + V3(${fmt(v3)})×0.25 + V4(${fmt(v4)})×0.25 + α(${fmt(alpha)}) = ${fmt(score)}`
    : '-'

  return {
    title: `${order.code} ${order.title}`,
    confidence: conf,
    formula,
    grade,
    metrics: [
      { key: 'V1 공정 복잡도', value: fmt(v1), description: `납기 ${order.deadline} · 공정 복잡도 지수`, barWidth: bar(v1 ?? 0), tone: 'primary' },
      { key: 'V2 품질 정밀도', value: fmt(v2), description: '허용 공차 및 품질 요구 수준',                barWidth: bar(v2 ?? 0), tone: 'warning' },
      { key: 'V3 역량 요구도', value: fmt(v3), description: '배정 기술자 숙련도 요구 지수',               barWidth: bar(v3 ?? 0), tone: 'success' },
      { key: 'V4 긴박도',     value: fmt(v4), description: '납기 긴박도 및 수량 부하 지수',              barWidth: bar(v4 ?? 0), tone: 'danger'  },
    ],
  }
})

// ── 기술자 추천 목록 ──────────────────────────────────────────────────
const technicianItems = computed(() =>
  technicians.value
    .slice()
    .sort((a, b) => Number(b.suitability ?? 0) - Number(a.suitability ?? 0))
    .map((t) => ({
      id:         t.employeeId,
      name:       t.employeeName,
      tier:       t.tier,
      avatar:     t.employeeName?.[0] ?? '?',
      avatarTone: { S: 'purple', A: 'purple', B: 'gold', C: 'slate' }[t.tier] ?? 'slate',
      score:      t.suitability != null ? `${(Number(t.suitability) * 100).toFixed(1)}%` : '-',
    }))
)

// ── 이벤트 핸들러 ────────────────────────────────────────────────────
function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
  const first = filteredOrders.value[0]
  if (first) selectedOrderId.value = first.orderId
}

function handleSelectOrder(orderId) {
  selectedOrderId.value = orderId
}

// ── OCSA 상세 로드 (선택 주문 변경 시) ────────────────────────────────
watch(selectedOrderId, async (id) => {
  if (!id) { ocsa.value = null; return }
  ocsaLoading.value = true
  try {
    ocsa.value = await getOrderOcsa(id)
  } catch {
    ocsa.value = null
  } finally {
    ocsaLoading.value = false
  }
})

// ── 초기 데이터 로드 ─────────────────────────────────────────────────
onMounted(async () => {
  const [allOrders, summary, techs] = await Promise.all([
    getOrders(),
    getOcsaSummary(),
    getTechnicians(),
  ])
  orders.value      = Array.isArray(allOrders) ? allOrders : []
  ocsaSummary.value = summary
  technicians.value = Array.isArray(techs) ? techs : []

  const first = orders.value.find((o) => OCSA_STATUSES.includes(o.status) && o.difficultyGrade != null)
  if (first) selectedOrderId.value = first.orderId
})
</script>

<template>
  <section class="teamleader-ocsa-view">
    <BaseStatCardGrid class="teamleader-ocsa-view__summary" :cards="summaryCards" />

    <section class="teamleader-ocsa-view__content">
      <TeamLeaderOcsaOrderList
        :filters="filters"
        :active-filter="activeFilter"
        :orders="mappedOrders"
        :selected-id="selectedOrderId"
        :page-size="6"
        @change-filter="handleFilterChange"
        @select-order="handleSelectOrder"
      />

      <div class="teamleader-ocsa-view__right">
        <TeamLeaderOcsaDetailPanel v-if="detailPanel" :panel="detailPanel" />
        <div v-else-if="ocsaLoading" class="teamleader-ocsa-view__placeholder">OCSA 분석 데이터를 불러오는 중...</div>
        <div v-else class="teamleader-ocsa-view__placeholder">주문을 선택하면 OCSA 분석 결과가 표시됩니다.</div>
        <TeamLeaderOcsaTechnicianList :items="technicianItems" :page-size="3" />
      </div>
    </section>
  </section>
</template>

<style scoped>
.teamleader-ocsa-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 14px 10px 18px;
  background: var(--color-bg-app);
  overflow: hidden;
}

.teamleader-ocsa-view__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.teamleader-ocsa-view__content {
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.45fr);
  gap: 16px;
  align-items: stretch;
  min-height: 0;
}

.teamleader-ocsa-view__right {
  display: grid;
  gap: 16px;
  min-height: 0;
}

.teamleader-ocsa-view__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--color-border-default);
  border-radius: 14px;
  color: var(--color-text-muted);
  font-size: 14px;
}

@media (max-width: 1240px) {
  .teamleader-ocsa-view__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .teamleader-ocsa-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-ocsa-view {
    padding: 12px;
  }
  .teamleader-ocsa-view__summary {
    grid-template-columns: 1fr;
  }
}
</style>

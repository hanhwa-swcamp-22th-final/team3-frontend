<script setup>
import { computed, onMounted, ref } from 'vue'
import TeamLeaderScmSummaryCard from '@/components/scm/teamleader/order-status/TeamLeaderScmSummaryCard.vue'
import TeamLeaderScmFilterBar from '@/components/scm/teamleader/order-status/TeamLeaderScmFilterBar.vue'
import TeamLeaderScmPipelineBoard from '@/components/scm/teamleader/order-status/TeamLeaderScmPipelineBoard.vue'
import TeamLeaderScmUrgentPanel from '@/components/scm/teamleader/order-status/TeamLeaderScmUrgentPanel.vue'
import TeamLeaderScmLineSummaryCard from '@/components/scm/teamleader/order-status/TeamLeaderScmLineSummaryCard.vue'
import { getOrders, getOrderSummary, getUrgentOrders } from '@/services/teamLeaderScmApi'

const activeFilter  = ref('all')
const loading       = ref(true)
const orders        = ref([])
const urgentOrders  = ref([])
const orderSummary  = ref(null)

const scmFilters = [
  { key: 'all',        label: '전체' },
  { key: 'REGISTERED', label: '접수' },
  { key: 'ANALYZED',   label: '배정 대기' },
  { key: 'INPROGRESS', label: '생산중' },
  { key: 'COMPLETED',  label: '완료' },
]

const summaryCards = computed(() => [
  { label: '전체 주문',   value: `${orderSummary.value?.totalCount ?? 0}건`,        tone: 'primary' },
  { label: '진행중',      value: `${orderSummary.value?.inProgressCount ?? 0}건`,   tone: 'primary' },
  { label: '납기 위험',   value: `${orderSummary.value?.deadlineRiskCount ?? 0}건`, tone: 'danger' },
  { label: '평균 달성률', value: `${orderSummary.value?.achievementRate ?? 0}%`,    tone: 'success' },
])

const footerCards = computed(() => [
  { id: 1, title: '접수',     percent: `${orderSummary.value?.registeredCount ?? 0}건`,  count: 'REGISTERED', tone: 'primary', icon: '접' },
  { id: 2, title: '배정 대기', percent: `${orderSummary.value?.analyzedCount ?? 0}건`,   count: 'ANALYZED',   tone: 'warning', icon: '대' },
  { id: 3, title: '생산중',   percent: `${orderSummary.value?.inProgressCount ?? 0}건`,  count: 'INPROGRESS', tone: 'danger',  icon: '생' },
  { id: 4, title: '완료',     percent: `${orderSummary.value?.completedCount ?? 0}건`,   count: 'COMPLETED',  tone: 'mint',    icon: '완' },
])

function formatDeadlineLabel(dueDate) {
  if (!dueDate) return '납기 미정'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((new Date(`${dueDate}T00:00:00`) - today) / 86400000)
  if (diff <= 0) return 'D-DAY'
  return `D-${diff}`
}

function getStatusTone(status) {
  const map = { ANALYZED: 'warning', INPROGRESS: 'danger', COMPLETED: 'success' }
  return map[status] ?? 'primary'
}

function getStatusMeta(order) {
  switch (order.status) {
    case 'ANALYZED':
      return { columnKey: 'queued',    line: `납기 ${formatDeadlineLabel(order.dueDate)}`, daysLabel: '분석 완료',   statusLabel: '배정 대기' }
    case 'INPROGRESS':
      return { columnKey: 'producing', line: `납기 ${formatDeadlineLabel(order.dueDate)}`, daysLabel: order.technicianId ? `작업자 #${order.technicianId}` : '작업 진행중', statusLabel: '생산중' }
    case 'COMPLETED':
      return { columnKey: 'done',      line: '완료 보고',                                  daysLabel: '출하 또는 검수 완료', statusLabel: '완료' }
    default:
      return { columnKey: 'received',  line: `납기 ${formatDeadlineLabel(order.dueDate)}`, daysLabel: '분석 대기',   statusLabel: '접수' }
  }
}

function mapOrderToCard(order) {
  const meta = getStatusMeta(order)
  return {
    id:          order.orderId ?? order.orderNumber,
    orderId:     order.orderId ?? null,
    orderCode:   order.orderNumber,
    title:       order.itemName,
    line:        meta.line,
    daysLabel:   meta.daysLabel,
    tone:        getStatusTone(order.status),
    actionLabel: null,
    actionDisabled: true,
    status:      order.status,
    statusLabel: meta.statusLabel,
    dueDate:     order.dueDate,
    columnKey:   meta.columnKey,
  }
}

const filteredColumns = computed(() => {
  const columns = [
    { key: 'received',  label: '접수',     items: [] },
    { key: 'queued',    label: '배정 대기', items: [] },
    { key: 'producing', label: '생산중',    items: [] },
    { key: 'done',      label: '완료',      items: [] },
  ]
  const visible = activeFilter.value === 'all'
    ? orders.value
    : orders.value.filter((o) => o.status === activeFilter.value)

  visible.map(mapOrderToCard).forEach((item) => {
    columns.find((c) => c.key === item.columnKey)?.items.push(item)
  })
  return columns
})

const filteredUrgentOrders = computed(() =>
  urgentOrders.value
    .filter((o) => activeFilter.value === 'all' || o.status === activeFilter.value)
    .map((o) => {
      const meta = getStatusMeta(o)
      return {
        id:            o.orderId ?? o.orderNumber,
        deadlineLabel: `${formatDeadlineLabel(o.dueDate)} ${o.status === 'ANALYZED' ? '배정 필요' : '긴급'}`,
        title:         o.itemName,
        progress:      o.status === 'INPROGRESS' ? '진행중' : meta.statusLabel,
        progressWidth: o.status === 'INPROGRESS' ? '65%' : o.status === 'ANALYZED' ? '20%' : '100%',
        helper:        o.technicianId ? `작업자 #${o.technicianId}` : '작업자 배정 필요',
        tone:          getStatusTone(o.status),
      }
    })
)

async function loadData() {
  loading.value = true
  try {
    const [allOrders, summary, urgent] = await Promise.all([
      getOrders(),
      getOrderSummary(),
      getUrgentOrders(),
    ])
    orders.value       = Array.isArray(allOrders) ? allOrders : []
    orderSummary.value = summary
    urgentOrders.value = Array.isArray(urgent) ? urgent : []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <section class="dl-scm-orders-view">
    <section class="dl-scm-orders-view__summary">
      <TeamLeaderScmSummaryCard
        v-for="card in summaryCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :tone="card.tone"
      />
    </section>

    <TeamLeaderScmFilterBar
      :filters="scmFilters"
      :active-filter="activeFilter"
      @change-filter="activeFilter = $event"
    />

    <section class="dl-scm-orders-view__content">
      <TeamLeaderScmPipelineBoard :columns="filteredColumns" />
      <TeamLeaderScmUrgentPanel :orders="filteredUrgentOrders" :show-action="false" />
    </section>

    <section class="dl-scm-orders-view__footer">
      <TeamLeaderScmLineSummaryCard
        v-for="item in footerCards"
        :key="item.id"
        :title="item.title"
        :percent="item.percent"
        :count="item.count"
        :tone="item.tone"
        :icon="item.icon"
      />
    </section>
  </section>
</template>

<style scoped>
.dl-scm-orders-view {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
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

.dl-scm-orders-view__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.dl-scm-orders-view__content {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 0.95fr);
  gap: 16px;
  align-items: stretch;
  min-height: 0;
}

.dl-scm-orders-view__footer {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
}

@media (max-width: 1240px) {
  .dl-scm-orders-view__summary,
  .dl-scm-orders-view__footer { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dl-scm-orders-view__content { grid-template-columns: 1fr; }
}

@media (max-width: 720px) {
  .dl-scm-orders-view { padding: 12px; }
  .dl-scm-orders-view__summary,
  .dl-scm-orders-view__footer { grid-template-columns: 1fr; }
}
</style>

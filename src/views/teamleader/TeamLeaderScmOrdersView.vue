<script setup>
import { computed, onMounted, ref } from 'vue'
import { BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderScmFilterBar from '@/components/scm/teamleader/order-status/TeamLeaderScmFilterBar.vue'
import TeamLeaderScmPipelineBoard from '@/components/scm/teamleader/order-status/TeamLeaderScmPipelineBoard.vue'
import TeamLeaderScmUrgentPanel from '@/components/scm/teamleader/order-status/TeamLeaderScmUrgentPanel.vue'
import TeamLeaderScmLineSummaryCard from '@/components/scm/teamleader/order-status/TeamLeaderScmLineSummaryCard.vue'
import OrderAssignmentModal from '@/components/scm/teamleader/order-status/OrderAssignmentModal.vue'
import {
  createAssignment,
  getAssignmentCandidates,
  getOrders,
  getOrderSummary,
  getUrgentOrders,
} from '@/services/teamLeaderScmApi'

const activeFilter = ref('all')
const loading = ref(true)
const orders = ref([])
const urgentOrders = ref([])
const orderSummary = ref(null)
const assignmentCandidates = ref([])
const assignmentModalOpen = ref(false)
const selectedOrder = ref(null)
const candidateLoading = ref(false)
const assignmentSubmitting = ref(false)

const scmFilters = [
  { key: 'all', label: '전체' },
  { key: 'REGISTERED', label: '접수' },
  { key: 'ANALYZED', label: '배정 대기' },
  { key: 'INPROGRESS', label: '생산중' },
  { key: 'COMPLETED', label: '완료' },
]

const scmSummaryCards = computed(() => [
  { label: '전체 주문', value: `${orderSummary.value?.totalCount ?? 0}건`, tone: 'primary' },
  { label: '진행중', value: `${orderSummary.value?.inProgressCount ?? 0}건`, tone: 'primary' },
  { label: '납기 위험', value: `${orderSummary.value?.deadlineRiskCount ?? 0}건`, tone: 'danger' },
  {
    label: '평균 달성률',
    value: `${orderSummary.value?.achievementRate ?? 0}%`,
    tone: 'success',
  },
])

const footerCards = computed(() => [
  { id: 1, title: '접수', percent: `${orderSummary.value?.registeredCount ?? 0}건`, count: 'REGISTERED', tone: 'primary', icon: '접' },
  { id: 2, title: '배정 대기', percent: `${orderSummary.value?.analyzedCount ?? 0}건`, count: 'ANALYZED', tone: 'warning', icon: '대' },
  { id: 3, title: '생산중', percent: `${orderSummary.value?.inProgressCount ?? 0}건`, count: 'INPROGRESS', tone: 'danger', icon: '생' },
  { id: 4, title: '완료', percent: `${orderSummary.value?.completedCount ?? 0}건`, count: 'COMPLETED', tone: 'mint', icon: '완' },
])

function formatDeadlineLabel(dueDate) {
  if (!dueDate) return '납기 미정'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dueDate}T00:00:00`)
  const diff = Math.ceil((target - today) / 86400000)
  if (diff <= 0) return 'D-DAY'
  return `D-${diff}`
}

function getStatusTone(status) {
  switch (status) {
    case 'ANALYZED':
      return 'warning'
    case 'INPROGRESS':
      return 'danger'
    case 'COMPLETED':
      return 'success'
    case 'REGISTERED':
    default:
      return 'primary'
  }
}

function getStatusMeta(order) {
  switch (order.status) {
    case 'ANALYZED':
      return {
        columnKey: 'queued',
        line: `납기 ${formatDeadlineLabel(order.dueDate)}`,
        daysLabel: '분석 완료',
        actionLabel: order.orderId ? '작업자 배정' : null,
        actionDisabled: !order.orderId,
        statusLabel: '배정 대기',
      }
    case 'INPROGRESS':
      return {
        columnKey: 'producing',
        line: `납기 ${formatDeadlineLabel(order.dueDate)}`,
        daysLabel: order.technicianName || (order.technicianId ? `작업자 #${order.technicianId}` : '작업 진행중'),
        actionLabel: null,
        actionDisabled: true,
        statusLabel: '생산중',
      }
    case 'COMPLETED':
      return {
        columnKey: 'done',
        line: '완료 보고',
        daysLabel: '출하 또는 검수 완료',
        actionLabel: null,
        actionDisabled: true,
        statusLabel: '완료',
      }
    case 'REGISTERED':
    default:
      return {
        columnKey: 'received',
        line: `납기 ${formatDeadlineLabel(order.dueDate)}`,
        daysLabel: '분석 대기',
        actionLabel: null,
        actionDisabled: true,
        statusLabel: '접수',
      }
  }
}

function mapOrderToCard(order) {
  const meta = getStatusMeta(order)
  return {
    id: order.orderId ?? order.orderNumber,
    orderId: order.orderId ?? null,
    orderCode: order.orderNumber,
    title: order.itemName,
    line: meta.line,
    daysLabel: meta.daysLabel,
    tone: getStatusTone(order.status),
    actionLabel: meta.actionLabel,
    actionDisabled: meta.actionDisabled,
    status: order.status,
    statusLabel: meta.statusLabel,
    dueDate: order.dueDate,
    technicianId: order.technicianId ?? null,
    technicianName: order.technicianName ?? null,
    columnKey: meta.columnKey,
  }
}

const filteredColumns = computed(() => {
  const columns = [
    { key: 'received', label: '접수', items: [] },
    { key: 'queued', label: '배정 대기', items: [] },
    { key: 'producing', label: '생산중', items: [] },
    { key: 'done', label: '완료', items: [] },
  ]

  const visibleOrders =
    activeFilter.value === 'all'
      ? orders.value
      : orders.value.filter((order) => order.status === activeFilter.value)

  visibleOrders.map(mapOrderToCard).forEach((item) => {
    columns.find((column) => column.key === item.columnKey)?.items.push(item)
  })

  return columns
})

const filteredUrgentOrders = computed(() =>
  urgentOrders.value
    .filter((order) => activeFilter.value === 'all' || order.status === activeFilter.value)
    .map((order) => {
      const daysLabel = formatDeadlineLabel(order.dueDate)
      const statusLabel = getStatusMeta(order).statusLabel
      return {
        id: order.orderId ?? order.orderNumber,
        deadlineLabel: `${daysLabel} ${order.status === 'ANALYZED' ? '배정 필요' : '긴급'}`,
        title: order.itemName,
        progress: order.status === 'INPROGRESS' ? '진행중' : statusLabel,
        progressWidth: order.status === 'INPROGRESS' ? '65%' : order.status === 'ANALYZED' ? '20%' : '100%',
        helper: order.technicianName || (order.technicianId ? `작업자 #${order.technicianId}` : '작업자 배정 필요'),
        tone: getStatusTone(order.status),
      }
    })
)

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
}

async function loadOrderData() {
  loading.value = true
  try {
    const [allOrders, summary, urgent] = await Promise.all([
      getOrders(),
      getOrderSummary(),
      getUrgentOrders(),
    ])
    orders.value = Array.isArray(allOrders) ? allOrders : []
    orderSummary.value = summary
    urgentOrders.value = Array.isArray(urgent) ? urgent : []
  } finally {
    loading.value = false
  }
}

async function handleAssignmentClick(item) {
  selectedOrder.value = item
  assignmentModalOpen.value = true
  candidateLoading.value = true
  try {
    const candidates = await getAssignmentCandidates({ orderId: item.orderId })
    assignmentCandidates.value = Array.isArray(candidates) ? candidates : []
  } finally {
    candidateLoading.value = false
  }
}

async function handleAssignmentSubmit(payload) {
  assignmentSubmitting.value = true
  try {
    await createAssignment(payload.orderId, payload.technicianId)
    assignmentModalOpen.value = false
    selectedOrder.value = null
    await loadOrderData()
  } finally {
    assignmentSubmitting.value = false
  }
}

function closeAssignmentModal() {
  assignmentModalOpen.value = false
  selectedOrder.value = null
}

onMounted(loadOrderData)
</script>

<template>
  <section class="teamleader-scm-orders-view">
    <BaseStatCardGrid class="teamleader-scm-orders-view__summary" :cards="scmSummaryCards" />

    <TeamLeaderScmFilterBar
      :filters="scmFilters"
      :active-filter="activeFilter"
      @change-filter="handleFilterChange"
    />

    <section class="teamleader-scm-orders-view__content">
      <TeamLeaderScmPipelineBoard :columns="filteredColumns" @item-action="handleAssignmentClick" />
      <TeamLeaderScmUrgentPanel :orders="filteredUrgentOrders" :show-action="false" />
    </section>

    <section class="teamleader-scm-orders-view__footer">
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

    <OrderAssignmentModal
      v-if="assignmentModalOpen"
      :open="assignmentModalOpen"
      :order="selectedOrder"
      :candidates="assignmentCandidates"
      :loading="candidateLoading"
      :submitting="assignmentSubmitting"
      @close="closeAssignmentModal"
      @submit="handleAssignmentSubmit"
    />
  </section>
</template>

<style scoped>
.teamleader-scm-orders-view {
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

.teamleader-scm-orders-view__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.teamleader-scm-orders-view__content {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 0.95fr);
  gap: 16px;
  align-items: stretch;
  min-height: 0;
}

.teamleader-scm-orders-view__footer {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
}

@media (max-width: 1240px) {
  .teamleader-scm-orders-view__summary,
  .teamleader-scm-orders-view__footer {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .teamleader-scm-orders-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-scm-orders-view {
    padding: 12px;
  }

  .teamleader-scm-orders-view__summary,
  .teamleader-scm-orders-view__footer {
    grid-template-columns: 1fr;
  }
}
</style>

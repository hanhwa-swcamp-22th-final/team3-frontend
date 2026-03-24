<script setup>
import { computed, ref } from 'vue'
import { BaseFilterTabs, BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderTaskMatchingDashboardPanel from '@/components/scm/teamleader/task-matching/TeamLeaderTaskMatchingDashboardPanel.vue'
import TeamLeaderTaskMatchingAssignmentPanel from '@/components/scm/teamleader/task-matching/TeamLeaderTaskMatchingAssignmentPanel.vue'
import {
  taskMatchingSummaryCards,
  taskMatchingTabs,
  taskMatchingOrders,
  taskMatchingLineStatuses,
  taskMatchingTimelineRows,
  taskMatchingAlerts,
  taskMatchingAssignmentStats,
  taskMatchingCandidates,
} from '@/mocks/teamleader/taskMatching'

const activeTab = ref('dashboard')
const localOrders = ref(taskMatchingOrders.map((item) => ({ ...item })))
const localAlerts = ref(taskMatchingAlerts.map((item) => ({ ...item })))
const localLineStatuses = ref(
  taskMatchingLineStatuses.map((line) => ({
    ...line,
    assignments: line.assignments.map((assignment) => ({ ...assignment })),
  }))
)
const localTimelineRows = ref(
  taskMatchingTimelineRows.map((row) => ({
    ...row,
    bars: row.bars.map((bar) => ({ ...bar })),
  }))
)
const assignmentStats = ref({ ...taskMatchingAssignmentStats })
const selectedOrderId = ref(taskMatchingOrders.find((item) => item.status !== '배정 완료')?.id ?? null)
const assignedCandidateId = ref(null)

const pendingOrders = computed(() => localOrders.value.filter((item) => item.status !== '배정 완료'))

const selectedOrder = computed(() => {
  return pendingOrders.value.find((item) => item.id === selectedOrderId.value) ?? pendingOrders.value[0] ?? null
})

const summaryCards = computed(() => {
  const pendingCount = pendingOrders.value.length

  return taskMatchingSummaryCards.map((card) => {
    if (card.label !== '미배정 오더') {
      return card
    }

    return {
      ...card,
      value: `${pendingCount}건`,
      helper: pendingCount === 0 ? '모든 오더 배정 완료' : card.helper,
      tone: pendingCount === 0 ? 'success' : card.tone,
    }
  })
})

const sortedCandidates = computed(() => {
  return [...taskMatchingCandidates].sort((a, b) => Number(b.fit.replace('%', '')) - Number(a.fit.replace('%', '')))
})

function changeTab(tabKey) {
  activeTab.value = tabKey
}

function selectOrder(orderId) {
  selectedOrderId.value = orderId
  assignedCandidateId.value = null
}

function openAssignmentOrder(orderId) {
  selectOrder(orderId)
  activeTab.value = 'assignment'
}

function assignCandidate(candidateId) {
  assignedCandidateId.value = candidateId
}

function updateLineStatuses(order, candidate) {
  localLineStatuses.value = localLineStatuses.value.map((line) => {
    if (line.title !== order.line) {
      return line
    }

    const nextAssignments = [
      {
        techId: candidate.id,
        techName: candidate.name,
        tier: candidate.tier.split('-')[0],
        orderCode: `${order.code} ${order.title.split(' - ')[0]}`,
        progress: '배정 완료',
      },
      ...line.assignments.filter((assignment) => assignment.orderCode !== `${order.code} ${order.title.split(' - ')[0]}`),
    ].slice(0, 3)

    return {
      ...line,
      assignments: nextAssignments,
    }
  })
}

function updateTimelineRows(order) {
  localTimelineRows.value = localTimelineRows.value.map((row) => {
    if (row.label !== order.line) {
      return row
    }

    return {
      ...row,
      bars: [
        ...row.bars,
        {
          left: '62%',
          width: '18%',
          tone: 'mint',
          label: order.code,
        },
      ].slice(-3),
    }
  })
}

function confirmAssignment({ orderId, candidateId }) {
  assignedCandidateId.value = candidateId

  const order = localOrders.value.find((item) => item.id === orderId)
  const candidate = taskMatchingCandidates.find((item) => item.id === candidateId)

  if (!order || !candidate) {
    return
  }

  localOrders.value = localOrders.value.map((item) =>
    item.id === orderId
      ? {
          ...item,
          status: '배정 완료',
          assignee: candidate.name,
        }
      : item
  )

  localAlerts.value = localAlerts.value.filter((item) => item.id !== orderId)

  updateLineStatuses(order, candidate)
  updateTimelineRows(order)

  const remainingOrders = localOrders.value.filter((item) => item.status !== '배정 완료')
  assignmentStats.value = {
    ...assignmentStats.value,
    assignedToday: String(Number(assignmentStats.value.assignedToday) + 1),
    unassigned: String(remainingOrders.length),
  }

  selectedOrderId.value = remainingOrders[0]?.id ?? null
}
</script>

<template>
  <section class="teamleader-taskmatching-view">
    <BaseStatCardGrid class="teamleader-taskmatching-view__summary" :cards="summaryCards" />

    <BaseFilterTabs
      class="taskmatching-tabs"
      :items="taskMatchingTabs"
      :model-value="activeTab"
      @change="changeTab"
    />

    <TeamLeaderTaskMatchingDashboardPanel
      v-if="activeTab === 'dashboard'"
      :lines="localLineStatuses"
      :timeline-rows="localTimelineRows"
      :alerts="localAlerts"
      :selected-order-id="selectedOrderId"
      @select-order="selectOrder"
      @assign-order="openAssignmentOrder"
    />

    <TeamLeaderTaskMatchingAssignmentPanel
      v-else-if="activeTab === 'assignment'"
      :orders="pendingOrders"
      :selected-order="selectedOrder"
      :selected-order-id="selectedOrderId"
      :assignment-stats="assignmentStats"
      :candidates="sortedCandidates"
      :assigned-candidate-id="assignedCandidateId"
      @select-order="selectOrder"
      @assign-candidate="assignCandidate"
      @confirm-assignment="confirmAssignment"
    />
  </section>
</template>

<style scoped>
.teamleader-taskmatching-view {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
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
.teamleader-taskmatching-view__summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.taskmatching-tabs { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
:deep(.teamleader-taskmatching-dashboard-panel),
:deep(.assignment-panel) {
  height: 100%;
  min-height: 0;
}
@media (max-width: 1240px) { .teamleader-taskmatching-view__summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 720px) { .teamleader-taskmatching-view { padding: 12px; } .teamleader-taskmatching-view__summary { grid-template-columns: 1fr; } }
</style>

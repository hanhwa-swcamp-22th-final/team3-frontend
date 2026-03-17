<script setup>
import { computed, ref } from 'vue'
import TeamLeaderScmSummaryCard from '@/components/teamleader/scm/TeamLeaderScmSummaryCard.vue'
import TeamLeaderTaskMatchingDashboardPanel from '@/components/teamleader/scm/TeamLeaderTaskMatchingDashboardPanel.vue'
import TeamLeaderTaskMatchingAssignmentPanel from '@/components/teamleader/scm/TeamLeaderTaskMatchingAssignmentPanel.vue'
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
const selectedOrderId = ref(taskMatchingOrders[0]?.id ?? null)
const assignedCandidateId = ref(null)

const selectedOrder = computed(() => taskMatchingOrders.find((item) => item.id === selectedOrderId.value) ?? taskMatchingOrders[0])

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

function assignCandidate(candidateId) {
  assignedCandidateId.value = candidateId
}

function confirmAssignment({ candidateId }) {
  assignedCandidateId.value = candidateId
}
</script>

<template>
  <section class="teamleader-taskmatching-view">
    <section class="teamleader-taskmatching-view__summary">
      <TeamLeaderScmSummaryCard
        v-for="card in taskMatchingSummaryCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :helper="card.helper"
        :tone="card.tone"
      />
    </section>

    <section class="taskmatching-tabs">
      <button v-for="tab in taskMatchingTabs" :key="tab.key" type="button" class="taskmatching-tabs__button" :class="{ 'taskmatching-tabs__button--active': activeTab === tab.key }" @click="changeTab(tab.key)">
        {{ tab.label }}
      </button>
    </section>

    <TeamLeaderTaskMatchingDashboardPanel
      v-if="activeTab === 'dashboard'"
      :lines="taskMatchingLineStatuses"
      :timeline-rows="taskMatchingTimelineRows"
      :alerts="taskMatchingAlerts"
      :selected-order-id="selectedOrderId"
      @select-order="selectOrder"
    />

    <TeamLeaderTaskMatchingAssignmentPanel
      v-else-if="activeTab === 'assignment'"
      :orders="taskMatchingOrders"
      :selected-order="selectedOrder"
      :selected-order-id="selectedOrderId"
      :assignment-stats="taskMatchingAssignmentStats"
      :candidates="sortedCandidates"
      :assigned-candidate-id="assignedCandidateId"
      @select-order="selectOrder"
      @assign-candidate="assignCandidate"
      @confirm-assignment="confirmAssignment"
    />
  </section>
</template>

<style scoped>
.teamleader-taskmatching-view { display: grid; gap: 16px; width: 100%; min-width: 0; padding: 14px 10px 18px; background: var(--color-bg-app); }
.teamleader-taskmatching-view__summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.taskmatching-tabs { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.taskmatching-tabs__button { height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--color-border-default); background: #fff; color: var(--color-text-default); font-size: 13px; font-weight: 800; cursor: pointer; }
.taskmatching-tabs__button--active { border-color: var(--color-primary-700); background: var(--color-primary-700); color: #fff; }
@media (max-width: 1240px) { .teamleader-taskmatching-view__summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 720px) { .teamleader-taskmatching-view { padding: 12px; } .teamleader-taskmatching-view__summary { grid-template-columns: 1fr; } }
</style>


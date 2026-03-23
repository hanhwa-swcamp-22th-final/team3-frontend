<script setup>
import { computed, ref } from 'vue'
import TeamLeaderScmSummaryCard from '@/components/scm/teamleader/order-status/TeamLeaderScmSummaryCard.vue'
import TeamLeaderScmFilterBar from '@/components/scm/teamleader/order-status/TeamLeaderScmFilterBar.vue'
import TeamLeaderScmPipelineBoard from '@/components/scm/teamleader/order-status/TeamLeaderScmPipelineBoard.vue'
import TeamLeaderScmUrgentPanel from '@/components/scm/teamleader/order-status/TeamLeaderScmUrgentPanel.vue'
import TeamLeaderScmLineSummaryCard from '@/components/scm/teamleader/order-status/TeamLeaderScmLineSummaryCard.vue'
import { scmSummaryCards, scmFilters, scmBaseColumns, scmUrgentOrders, scmLineSummaries } from '@/mocks/teamleader/scmOrders'

const activeFilter = ref('all')

const filteredColumns = computed(() => {
  return scmBaseColumns.map((column) => ({
    ...column,
    items:
      activeFilter.value === 'all'
        ? column.items
        : column.items.filter((item) => item.tags.includes(activeFilter.value)),
  }))
})

const filteredUrgentOrders = computed(() => {
  return activeFilter.value === 'all'
    ? scmUrgentOrders
    : scmUrgentOrders.filter((item) => item.tags.includes(activeFilter.value))
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
}
</script>

<template>
  <section class="teamleader-scm-orders-view">
    <section class="teamleader-scm-orders-view__summary">
      <TeamLeaderScmSummaryCard
        v-for="card in scmSummaryCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :helper="card.helper"
        :tone="card.tone"
        variant="compact"
      />
    </section>

    <TeamLeaderScmFilterBar
      :filters="scmFilters"
      :active-filter="activeFilter"
      @change-filter="handleFilterChange"
    />

    <section class="teamleader-scm-orders-view__content">
      <TeamLeaderScmPipelineBoard :columns="filteredColumns" />
      <TeamLeaderScmUrgentPanel :orders="filteredUrgentOrders" />
    </section>

    <section class="teamleader-scm-orders-view__footer">
      <TeamLeaderScmLineSummaryCard
        v-for="item in scmLineSummaries"
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
.teamleader-scm-orders-view {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
  padding: 14px 10px 18px;
  background: var(--color-bg-app);
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






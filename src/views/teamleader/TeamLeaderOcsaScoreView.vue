<script setup>
import { computed, ref } from 'vue'
import TeamLeaderScmSummaryCard from '@/components/scm/teamleader/order-status/TeamLeaderScmSummaryCard.vue'
import TeamLeaderOcsaOrderList from '@/components/scm/teamleader/ocsa-score/TeamLeaderOcsaOrderList.vue'
import TeamLeaderOcsaDetailPanel from '@/components/scm/teamleader/ocsa-score/TeamLeaderOcsaDetailPanel.vue'
import TeamLeaderOcsaTechnicianList from '@/components/scm/teamleader/ocsa-score/TeamLeaderOcsaTechnicianList.vue'
import { ocsaSummaryCards, ocsaFilterConfigs, ocsaOrders, ocsaDetailMap, ocsaTechnicianRecommendationMap } from '@/mocks/teamleader/ocsaScore'

const activeFilter = ref('all')
const selectedOrderId = ref(2)


const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return ocsaOrders
  if (activeFilter.value === 'D2') return ocsaOrders.filter((order) => ['D1', 'D2'].includes(order.grade))
  return ocsaOrders.filter((order) => order.grade === activeFilter.value)
})
const filters = computed(() => {
  return ocsaFilterConfigs.map((filter) => {
    const count =
      filter.key === 'all'
        ? ocsaOrders.length
        : filter.key === 'D2'
          ? ocsaOrders.filter((order) => ['D1', 'D2'].includes(order.grade)).length
          : ocsaOrders.filter((order) => order.grade === filter.key).length

    return {
      ...filter,
      label: `${filter.label}(${count})`,
    }
  })
})

const selectedOrder = computed(() => {
  return filteredOrders.value.find((order) => order.id === selectedOrderId.value) ?? filteredOrders.value[0] ?? ocsaOrders[0]
})

const detailPanel = computed(() => {
  const order = selectedOrder.value
  const detail = ocsaDetailMap[order.id] ?? ocsaDetailMap[2]
  return {
    title: `${order.code} ${order.title}`,
    confidence: detail.confidence,
    formula: detail.formula,
    grade: detail.grade,
    metrics: detail.metrics.map((metric) => ({
      ...metric,
      description: metric.description.replace('{deadline}', order.deadline),
    })),
  }
})

const technicianRecommendations = computed(() => {
  return ocsaTechnicianRecommendationMap[selectedOrder.value.grade] ?? ocsaTechnicianRecommendationMap.D4
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
  const firstOrder = (filterKey === 'all'
    ? ocsaOrders
    : filterKey === 'D2'
      ? ocsaOrders.filter((order) => ['D1', 'D2'].includes(order.grade))
      : ocsaOrders.filter((order) => order.grade === filterKey))[0]

  if (firstOrder) {
    selectedOrderId.value = firstOrder.id
  }
}

function handleSelectOrder(orderId) {
  selectedOrderId.value = orderId
}
</script>

<template>
  <section class="teamleader-ocsa-view">
    <section class="teamleader-ocsa-view__summary">
      <TeamLeaderScmSummaryCard
        v-for="card in ocsaSummaryCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :helper="card.helper"
        :tone="card.tone"
        variant="compact"
      />
    </section>

    <section class="teamleader-ocsa-view__content">
      <TeamLeaderOcsaOrderList
        :filters="filters"
        :active-filter="activeFilter"
        :orders="filteredOrders"
        :selected-id="selectedOrderId"
        :page-size="6"
        @change-filter="handleFilterChange"
        @select-order="handleSelectOrder"
      />

      <div class="teamleader-ocsa-view__right">
        <TeamLeaderOcsaDetailPanel :panel="detailPanel" />
        <TeamLeaderOcsaTechnicianList :items="technicianRecommendations" :page-size="3" />
      </div>
    </section>
  </section>
</template>

<style scoped>
.teamleader-ocsa-view {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
  padding: 14px 10px 18px;
  background: var(--color-bg-app);
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
  align-items: start;
}

.teamleader-ocsa-view__right {
  display: grid;
  gap: 16px;
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








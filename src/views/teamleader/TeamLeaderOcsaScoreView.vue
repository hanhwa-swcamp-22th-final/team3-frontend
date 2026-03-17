<script setup>
import { computed, ref } from 'vue'
import TeamLeaderScmSummaryCard from '@/components/teamleader/scm/TeamLeaderScmSummaryCard.vue'
import TeamLeaderOcsaOrderList from '@/components/teamleader/scm/TeamLeaderOcsaOrderList.vue'
import TeamLeaderOcsaDetailPanel from '@/components/teamleader/scm/TeamLeaderOcsaDetailPanel.vue'
import TeamLeaderOcsaTechnicianList from '@/components/teamleader/scm/TeamLeaderOcsaTechnicianList.vue'

const summaryCards = [
  { label: '분석 주문 수', value: '47건', tone: 'primary' },
  { label: '평균 난이도', value: 'D3.2', tone: 'primary' },
  { label: '최고 난이도', value: 'D5', helper: '고난도 주문 포함', tone: 'danger' },
  { label: '매칭 성공률', value: '91.5%', helper: '▲ 1.8%', tone: 'success' },
]

const filterConfigs = [
  { key: 'all', label: '전체' },
  { key: 'D5', label: 'D5' },
  { key: 'D4', label: 'D4' },
  { key: 'D3', label: 'D3' },
  { key: 'D2', label: 'D2 이하' },
]

const activeFilter = ref('all')
const selectedOrderId = ref(2)

const orders = [
  { id: 1, code: 'ORD-0301', title: 'Ti-6Al-4V 항공부품', grade: 'D5', deadline: 'D-4', gradeTone: 'danger' },
  { id: 2, code: 'ORD-0302', title: '정밀 샤프트 Ø12', grade: 'D4', deadline: 'D-6', gradeTone: 'warning' },
  { id: 3, code: 'ORD-0303', title: '표준 기어 M2', grade: 'D2', deadline: 'D-14', gradeTone: 'success' },
  { id: 4, code: 'ORD-0304', title: '유압 프레스 금형', grade: 'D3', deadline: 'D-9', gradeTone: 'primary' },
  { id: 5, code: 'ORD-0305', title: '반도체 지그 정밀', grade: 'D5', deadline: 'D-3', gradeTone: 'danger' },
  { id: 6, code: 'ORD-0308', title: '정밀 기어박스', grade: 'D4', deadline: 'D-6', gradeTone: 'warning' },
  { id: 7, code: 'ORD-0309', title: '산업용 커플링', grade: 'D3', deadline: 'D-9', gradeTone: 'primary' },
  { id: 8, code: 'ORD-0311', title: '볼트 어셈블리', grade: 'D1', deadline: 'D-11', gradeTone: 'success' },
  { id: 9, code: 'ORD-0313', title: '로봇 암 브래킷', grade: 'D4', deadline: 'D-8', gradeTone: 'warning' },
  { id: 10, code: 'ORD-0314', title: '터빈 플랜지', grade: 'D5', deadline: 'D-2', gradeTone: 'danger' },
  { id: 11, code: 'ORD-0315', title: '정밀 커버 플레이트', grade: 'D2', deadline: 'D-10', gradeTone: 'success' },
  { id: 12, code: 'ORD-0316', title: '스테인리스 파이프 조립', grade: 'D3', deadline: 'D-7', gradeTone: 'primary' },
]

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders
  if (activeFilter.value === 'D2') return orders.filter((order) => ['D1', 'D2'].includes(order.grade))
  return orders.filter((order) => order.grade === activeFilter.value)
})
const filters = computed(() => {
  return filterConfigs.map((filter) => {
    const count =
      filter.key === 'all'
        ? orders.length
        : filter.key === 'D2'
          ? orders.filter((order) => ['D1', 'D2'].includes(order.grade)).length
          : orders.filter((order) => order.grade === filter.key).length

    return {
      ...filter,
      label: `${filter.label}(${count})`,
    }
  })
})

const selectedOrder = computed(() => {
  return filteredOrders.value.find((order) => order.id === selectedOrderId.value) ?? filteredOrders.value[0] ?? orders[0]
})

const detailPanel = computed(() => {
  const order = selectedOrder.value
  const detailMap = {
    1: { v1: '4.8', v2: '4.4', v3: '3.5', v4: '4.6', confidence: '0.95', formula: 'D = V1(4.8)×0.32 + V2(4.4)×0.28 + V3(3.5)×0.22 + V4(4.6)×0.18 = 4.39', grade: 'D5' },
    2: { v1: '4.2', v2: '3.8', v3: '3.1', v4: '4.0', confidence: '0.97', formula: 'D = V1(4.2)×0.32 + V2(3.8)×0.28 + V3(3.1)×0.22 + V4(4.0)×0.18 = 3.84', grade: 'D4' },
    3: { v1: '2.4', v2: '2.0', v3: '2.6', v4: '2.3', confidence: '0.91', formula: 'D = V1(2.4)×0.32 + V2(2.0)×0.28 + V3(2.6)×0.22 + V4(2.3)×0.18 = 2.31', grade: 'D2' },
    4: { v1: '3.1', v2: '3.0', v3: '2.8', v4: '3.2', confidence: '0.92', formula: 'D = V1(3.1)×0.32 + V2(3.0)×0.28 + V3(2.8)×0.22 + V4(3.2)×0.18 = 3.04', grade: 'D3' },
  }
  const detail = detailMap[order.id] ?? detailMap[2]
  return {
    title: `${order.code} ${order.title}`,
    confidence: detail.confidence,
    formula: detail.formula,
    grade: detail.grade,
    metrics: [
      { key: 'V1 제품 복잡도', value: detail.v1, description: '공정 18단계 · 허용공차 ±0.01mm', barWidth: '36%', tone: 'primary' },
      { key: 'V2 납기 긴박도', value: detail.v2, description: `${order.deadline} · 우선순위 High`, barWidth: '28%', tone: 'warning' },
      { key: 'V3 설비 가용성', value: detail.v3, description: '가용 장비 3대 · 설비지수 반영', barWidth: '30%', tone: 'success' },
      { key: 'V4 숙련도 요구', value: detail.v4, description: '최소 A-Tier · 세부 숙련도 90+ 필요', barWidth: '22%', tone: 'danger' },
    ],
  }
})

const technicianRecommendations = computed(() => {
  const recommendationMap = {
    D5: [
      { id: 1, name: '손창우', tier: 'S', avatar: '손', avatarTone: 'purple', score: '97.2%' },
      { id: 2, name: '김신우', tier: 'A', avatar: '김', avatarTone: 'purple', score: '89.4%' },
      { id: 3, name: '이지훈', tier: 'A', avatar: '이', avatarTone: 'slate', score: '82.1%' },
      { id: 4, name: '황자현', tier: 'A', avatar: '황', avatarTone: 'green', score: '80.6%' },
    ],
      D4: [
      { id: 5, name: '손창우', tier: 'S', avatar: '손', avatarTone: 'purple', score: '97.2%' },
      { id: 6, name: '김신우', tier: 'A', avatar: '김', avatarTone: 'purple', score: '89.4%' },
      { id: 7, name: '이지훈', tier: 'A', avatar: '이', avatarTone: 'slate', score: '82.1%' },
      { id: 8, name: '류민재', tier: 'A', avatar: '류', avatarTone: 'gold', score: '78.8%' },
      { id: 9, name: '문서연', tier: 'B', avatar: '문', avatarTone: 'gold', score: '72.5%' },
    ],
    D3: [
      { id: 10, name: '김신우', tier: 'A', avatar: '김', avatarTone: 'purple', score: '88.0%' },
      { id: 11, name: '박지훈', tier: 'B', avatar: '박', avatarTone: 'gold', score: '79.2%' },
      { id: 12, name: '오세훈', tier: 'B', avatar: '오', avatarTone: 'slate', score: '74.6%' },
    ],
    D2: [
      { id: 13, name: '정미래', tier: 'B', avatar: '정', avatarTone: 'gold', score: '77.8%' },
      { id: 14, name: '문서연', tier: 'B', avatar: '문', avatarTone: 'gold', score: '74.3%' },
      { id: 15, name: '서예린', tier: 'C', avatar: '서', avatarTone: 'slate', score: '69.2%' },
    ],
  }
  return recommendationMap[selectedOrder.value.grade] ?? recommendationMap.D4
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
  const firstOrder = (filterKey === 'all'
    ? orders
    : filterKey === 'D2'
      ? orders.filter((order) => ['D1', 'D2'].includes(order.grade))
      : orders.filter((order) => order.grade === filterKey))[0]

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
        v-for="card in summaryCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :helper="card.helper"
        :tone="card.tone"
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




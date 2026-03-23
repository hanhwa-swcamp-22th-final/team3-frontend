<script setup>
import { computed, ref, watch } from 'vue'
import { BaseFilterTabs } from '@/components/common/base'
import TeamLeaderFacilityStatusCard from '@/components/scm/teamleader/facility-status/TeamLeaderFacilityStatusCard.vue'
import TeamLeaderFacilityTrendPanel from '@/components/scm/teamleader/facility-status/TeamLeaderFacilityTrendPanel.vue'
import TeamLeaderFacilityHistoryPanel from '@/components/scm/teamleader/facility-status/TeamLeaderFacilityHistoryPanel.vue'
import {
  facilityStatusFilters,
  facilityStatusCards,
  facilityStatusTrend,
  facilityStatusHistory,
} from '@/mocks/teamleader/facilityStatus'

const activeFilter = ref('all')
const activeTrendFilter = ref('all')
const currentPage = ref(1)
const pageSize = 4

const filteredCards = computed(() => {
  if (activeFilter.value === 'all') return facilityStatusCards
  return facilityStatusCards.filter((card) => card.category === activeFilter.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCards.value.length / pageSize)))

const pagedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCards.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

const filteredTrend = computed(() => {
  if (activeTrendFilter.value === 'all') return facilityStatusTrend

  return {
    ...facilityStatusTrend,
    series: facilityStatusTrend.series.filter((series) => series.id.toUpperCase() === activeTrendFilter.value),
  }
})

watch(activeFilter, () => {
  currentPage.value = 1
})

watch(filteredCards, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})
</script>

<template>
  <section class="teamleader-facility-view">
    <BaseFilterTabs
      class="teamleader-facility-view__filters"
      :items="facilityStatusFilters"
      :model-value="activeFilter"
      variant="chip"
      size="sm"
      @change="activeFilter = $event"
    />

    <section class="teamleader-facility-view__top">
      <section class="teamleader-facility-view__cards-shell">
        <div class="teamleader-facility-view__grid">
          <TeamLeaderFacilityStatusCard
            v-for="card in pagedCards"
            :key="card.id"
            :card="card"
          />
        </div>

        <div class="teamleader-facility-view__pagination-slot">
          <div v-if="filteredCards.length > 0" class="teamleader-facility-view__pagination">
            <button
              v-for="page in pageNumbers"
              :key="page"
              type="button"
              class="teamleader-facility-view__page-button"
              :class="{ 'teamleader-facility-view__page-button--active': currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </section>

      <section class="teamleader-facility-view__right-column">
        <TeamLeaderFacilityTrendPanel
          :trend="filteredTrend"
          :filters="facilityStatusFilters"
          :active-filter="activeTrendFilter"
          @change-filter="activeTrendFilter = $event"
        />

        <TeamLeaderFacilityHistoryPanel :items="facilityStatusHistory" />
      </section>
    </section>
  </section>
</template>

<style scoped>
.teamleader-facility-view {
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

.teamleader-facility-view__filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.teamleader-facility-view__top {
  display: grid;
  grid-template-columns: minmax(320px, 0.92fr) minmax(0, 1.4fr);
  gap: 14px;
  align-items: stretch;
  min-height: 0;
}

.teamleader-facility-view__right-column {
  display: grid;
  gap: 14px;
  align-content: start;
  min-height: 0;
}

.teamleader-facility-view__cards-shell {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 34px;
  gap: 12px;
  min-height: 0;
}

.teamleader-facility-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  align-content: start;
  min-height: 0;
}

.teamleader-facility-view__pagination-slot {
  display: grid;
  align-items: end;
}

.teamleader-facility-view__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
}

.teamleader-facility-view__page-button {
  min-width: 34px;
  height: 34px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.teamleader-facility-view__page-button--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: #fff;
}

@media (max-width: 1180px) {
  .teamleader-facility-view__top {
    grid-template-columns: 1fr;
  }

  .teamleader-facility-view__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-facility-view {
    padding: 12px;
  }
}
</style>

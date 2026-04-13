<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { BaseFilterTabs } from '@/components/common/base'
import TeamLeaderFacilityStatusCard from '@/components/scm/teamleader/facility-status/TeamLeaderFacilityStatusCard.vue'
import TeamLeaderFacilityTrendPanel from '@/components/scm/teamleader/facility-status/TeamLeaderFacilityTrendPanel.vue'
import TeamLeaderFacilityHistoryPanel from '@/components/scm/teamleader/facility-status/TeamLeaderFacilityHistoryPanel.vue'
import { getMyTeamFacilities, getFacilityHistory, getFacilityTrends } from '@/services/teamLeaderScmApi'

const STATUS_TONE  = { OPERATING: 'mint', UNDER_INSPECTION: 'warning', STOPPED: 'danger', DISPOSED: 'soft' }
const STATUS_LABEL = { OPERATING: '가동중', UNDER_INSPECTION: '점검중', STOPPED: '정지', DISPOSED: '폐기' }
const TIER_TONE    = { S: 'primary', A: 'primary', B: 'warning', C: 'soft' }
const TREND_TONES  = ['mint', 'primary', 'warning', 'danger']

const BUCKET_COUNT    = 7
const BUCKET_INTERVAL = 4 * 3600 * 1000  // 4 h → 7 buckets span 24 h

const facilities      = ref([])
const facilityTrends  = ref({})   // { [equipmentId]: FacilityTrendsDto[] }
const facilityHistories = ref([]) // flat merged array with .facilityName added
const activeFilter    = ref('all')
const activeTrendFilter = ref('all')
const currentPage     = ref(1)
const pageSize        = 4

// ── Filter tabs (derived from real category data) ─────────────────
const facilityFilters = computed(() => {
  const cats = [...new Set(facilities.value.map((f) => f.category).filter(Boolean))]
  return [
    { key: 'all', label: `전체(${facilities.value.length})`, tone: 'default' },
    ...cats.map((cat) => ({ key: cat, label: cat, tone: 'primary' })),
  ]
})

// ── E_idx calculation ─────────────────────────────────────────────
function computeEIdx(trends, status) {
  if (status === 'DISPOSED') return null
  if (status === 'STOPPED')  return 0.2
  const base    = status === 'OPERATING' ? 0.9 : 0.5
  const cutoff  = Date.now() - 24 * 3600 * 1000
  const recent  = (trends ?? []).filter((e) => new Date(e.detectedAt).getTime() >= cutoff).length
  return Math.max(0, base - recent * 0.1)
}

// ── Relative-time formatter ───────────────────────────────────────
function relativeTime(dateStr) {
  if (!dateStr) return '-'
  const d     = new Date(dateStr)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const day   = new Date(d);  day.setHours(0, 0, 0, 0)
  const diff  = Math.round((today - day) / 86400000)
  const hhmm  = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  if (diff === 0) return `오늘 ${hhmm}`
  if (diff === 1) return `어제 ${hhmm}`
  return `${diff}일 전`
}

// ── Card list ─────────────────────────────────────────────────────
const facilityCards = computed(() =>
  facilities.value.map((f) => {
    const trends    = facilityTrends.value[f.equipmentId] ?? []
    const eIdx      = computeEIdx(trends, f.status)
    const latest    = trends[0]
    const tone      = STATUS_TONE[f.status]  ?? 'soft'
    return {
      id:        String(f.equipmentId),
      code:      `EQ-${String(f.equipmentId).padStart(3, '0')}`,
      name:      f.equipmentName,
      category:  f.category,
      status:    STATUS_LABEL[f.status] ?? f.status,
      tone,
      dotTone:   tone,
      value:     eIdx,
      operator:  f.managerName  ?? '미배정',
      initial:   f.managerName?.[0] ?? '-',
      tier:      f.managerTier  ?? '',
      tierTone:  TIER_TONE[f.managerTier] ?? 'soft',
      updatedAt: latest ? relativeTime(latest.detectedAt) : '-',
    }
  })
)

// ── Card filter + pagination ──────────────────────────────────────
const filteredCards = computed(() =>
  activeFilter.value === 'all'
    ? facilityCards.value
    : facilityCards.value.filter((c) => c.category === activeFilter.value)
)

const totalPages  = computed(() => Math.max(1, Math.ceil(filteredCards.value.length / pageSize)))
const pagedCards  = computed(() => filteredCards.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

watch(activeFilter,   () => { currentPage.value = 1 })
watch(filteredCards,  () => { if (currentPage.value > totalPages.value) currentPage.value = totalPages.value })

// ── Trend panel ───────────────────────────────────────────────────
const trendChartData = computed(() => {
  const now         = Date.now()
  const bucketTimes = Array.from({ length: BUCKET_COUNT }, (_, i) =>
    now - (BUCKET_COUNT - 1 - i) * BUCKET_INTERVAL
  )
  const labels = bucketTimes.map((t, i) => {
    if (i === BUCKET_COUNT - 1) return '지금'
    const d = new Date(t)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  })

  const series = facilities.value.map((f, idx) => {
    const trends   = facilityTrends.value[f.equipmentId] ?? []
    const half     = BUCKET_INTERVAL / 2
    const base     = STATUS_TONE[f.status] === 'danger' ? 0.2 : STATUS_TONE[f.status] === 'soft' ? 0 : 0.9
    const values   = bucketTimes.map((bt) => {
      const count = trends.filter((e) => {
        const t = new Date(e.detectedAt).getTime()
        return t >= bt - half && t <= bt + half
      }).length
      return Math.max(0, base - count * 0.2)
    })
    return {
      id:       String(f.equipmentId),
      label:    f.equipmentName,
      category: f.category,
      tone:     TREND_TONES[idx % TREND_TONES.length],
      values,
    }
  })

  return { labels, series }
})

const filteredTrend = computed(() => {
  const data = trendChartData.value
  if (activeTrendFilter.value === 'all') return data
  return { ...data, series: data.series.filter((s) => s.category === activeTrendFilter.value) }
})

// ── History panel ─────────────────────────────────────────────────
const historyItems = computed(() =>
  facilityHistories.value
    .slice()
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))
    .slice(0, 6)
    .map((h) => ({
      id:    h.eventId,
      time:  relativeTime(h.occurredAt),
      title: `${h.facilityName} ${h.eventType}: ${h.description}`,
    }))
)

// ── Data loading ──────────────────────────────────────────────────
onMounted(async () => {
  const raw = await getMyTeamFacilities().catch(() => [])
  facilities.value = Array.isArray(raw) ? raw : []
  if (facilities.value.length === 0) return

  const ids = facilities.value.map((f) => f.equipmentId)

  const [trendsResults, historiesResults] = await Promise.all([
    Promise.all(
      ids.map((id) =>
        getFacilityTrends(id)
          .then((data) => ({ id, data: Array.isArray(data) ? data : [] }))
          .catch(() => ({ id, data: [] }))
      )
    ),
    Promise.all(
      ids.map((id) => {
        const f = facilities.value.find((f) => f.equipmentId === id)
        return getFacilityHistory(id)
          .then((data) => (Array.isArray(data) ? data : []).map((h) => ({ ...h, facilityName: f?.equipmentName ?? '' })))
          .catch(() => [])
      })
    ),
  ])

  facilityTrends.value    = Object.fromEntries(trendsResults.map((r) => [r.id, r.data]))
  facilityHistories.value = historiesResults.flat()
})
</script>

<template>
  <section class="teamleader-facility-view">
    <BaseFilterTabs
      class="teamleader-facility-view__filters"
      :items="facilityFilters"
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
          :filters="facilityFilters"
          :active-filter="activeTrendFilter"
          @change-filter="activeTrendFilter = $event"
        />

        <TeamLeaderFacilityHistoryPanel :items="historyItems" />
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

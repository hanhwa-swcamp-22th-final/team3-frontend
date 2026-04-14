<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { BaseFilterTabs, BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderTaskMatchingDashboardPanel from '@/components/scm/teamleader/task-matching/TeamLeaderTaskMatchingDashboardPanel.vue'
import TeamLeaderTaskMatchingAssignmentPanel from '@/components/scm/teamleader/task-matching/TeamLeaderTaskMatchingAssignmentPanel.vue'
import {
  createAssignment,
  getAssignmentCandidates,
  getAssignmentSummary,
  getAssignmentTimeline,
  getLineWorkers,
  getLinesSummary,
  getMyTeamLinesSummary,
  getUnassignedOrders,
} from '@/services/teamLeaderScmApi'

const GRADE_LABELS = { D5: 'D5 최고난도', D4: 'D4', D3: 'D3', D2: 'D2', D1: 'D1' }
const TIER_TONES   = { S: 'mint', A: 'primary', B: 'warning', C: 'danger' }
const MATCH_TONES  = { INPROGRESS: 'primary', COMPLETE: 'mint', CONFIRM: 'soft', REJECT: 'danger' }
const MATCHING_MODE_LABELS = {
  EFFICIENCY_TYPE: '최적형 배정',
  GROWTH_TYPE: '도전형 배정',
}
const UNASSIGNED_LINE_ID = 'unassigned-line'
const DAY_START    = 8 * 60   // 08:00 in minutes from midnight
const DAY_SPAN     = 12 * 60  // 12-hour work day

function toLocalDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const taskMatchingTabs = [
  { key: 'dashboard',  label: '운영 현황' },
  { key: 'assignment', label: '주문 배정' },
]

// ── Reactive state ────────────────────────────────────────────────
const activeTab          = ref('dashboard')
const assignmentSummary  = ref(null)
const linesSummary       = ref([])
const timeline           = ref([])
const lineWorkers        = ref({})
const allOrders          = ref([])
const rawCandidates      = ref([])
const selectedOrderId    = ref(null)
const assignedCandidateId = ref(null)

function formatLineTitle(line) {
  return line.factoryLineCode
    ? `${line.factoryLineName} (${line.factoryLineCode})`
    : line.factoryLineName
}

// ── Summary cards ─────────────────────────────────────────────────
const summaryCards = computed(() => {
  const avgRate = linesSummary.value.length > 0
    ? (linesSummary.value.reduce((s, l) => s + (l.achievementRate ?? 0), 0) / linesSummary.value.length).toFixed(1)
    : 0
  const unassigned = assignmentSummary.value?.unassignedCount ?? 0
  return [
    { label: '실시간 생산 인원', value: `${assignmentSummary.value?.activeWorkerCount ?? 0}명`, helper: '활동중', tone: 'success' },
    { label: '오늘 완료 작업',   value: `${assignmentSummary.value?.todayCompletedCount ?? 0}건`, tone: 'primary' },
    { label: '라인 평균 가동률', value: `${avgRate}%`, tone: 'primary' },
    {
      label: '미배정 오더',
      value: `${unassigned}건`,
      helper: unassigned === 0 ? '모든 오더 배정 완료' : '즉시 배정 필요',
      tone: unassigned === 0 ? 'success' : 'danger',
    },
  ]
})

// ── Dashboard: line status cards ───────────────────────────────────
const lineStatuses = computed(() => {
  const today = toLocalDateKey()
  return linesSummary.value.map((line) => {
    const lineItems = timeline.value.filter((t) => t.factoryLineId === line.factoryLineId)
    const todayItems = lineItems.filter((t) => t.assignedDate === today)
    const visibleItems = todayItems.length > 0 ? todayItems : lineItems

    const seen = new Set()
    let assignments = visibleItems
      .filter((t) => { if (seen.has(t.employeeId)) return false; seen.add(t.employeeId); return true })
      .slice(0, 3)
      .map((t) => ({
        techId:    t.employeeId,
        techName:  t.employeeName ?? `#${t.employeeId}`,
        tier:      t.employeeTier ?? '-',
        orderCode: t.orderNo,
        progress:  t.matchingStatus === 'COMPLETE'    ? '완료'  :
                   t.matchingStatus === 'INPROGRESS'  ? '진행중' :
                   t.orderStatus    === 'COMPLETED'   ? '100%'  : '-',
      }))
    if (assignments.length === 0) {
      assignments = (lineWorkers.value[line.factoryLineId] ?? []).slice(0, 3).map((w) => ({
        techId:    w.employeeId,
        techName:  w.employeeName ?? `#${w.employeeId}`,
        tier:      w.employeeTier ?? '-',
        orderCode: w.equipmentName ?? '배치 설비',
        progress:  '대기',
      }))
    }

    const rate = line.achievementRate ?? 0
    const tone = rate >= 85 ? 'mint' : rate >= 60 ? 'primary' : rate >= 40 ? 'warning' : 'danger'
    return {
      id:          `line-${line.factoryLineId}`,
      title:       formatLineTitle(line),
      percent:     `${rate}%`,
      tone,
      assignments,
    }
  })
})

// ── Dashboard: timeline rows ───────────────────────────────────────
const timelineRows = computed(() => {
  const today = toLocalDateKey()
  const rows = linesSummary.value.map((line) => {
    const lineItems = timeline.value.filter((t) => t.factoryLineId === line.factoryLineId)
    const todayItems = lineItems.filter(
      (t) => t.factoryLineId === line.factoryLineId && t.assignedDate === today
    )
    const items = todayItems.length > 0 ? todayItems : lineItems
    const bars = items.slice(0, 3).map((t, idx) => makeTimelineBar(t, idx, items.length))
    return { id: line.factoryLineId, label: formatLineTitle(line), bars }
  })
  const unassignedItems = timeline.value.filter((t) => !t.factoryLineId)
  const todayUnassignedItems = unassignedItems.filter((t) => t.assignedDate === today)
  const visibleUnassignedItems = todayUnassignedItems.length > 0 ? todayUnassignedItems : unassignedItems
  if (visibleUnassignedItems.length > 0) {
    rows.unshift(
      ...visibleUnassignedItems.slice(0, 3).map((t, idx) => ({
        id: `${UNASSIGNED_LINE_ID}-${t.orderNo ?? idx}`,
        label: `배치 라인 미지정 ${idx + 1}`,
        bars: [makeTimelineBar(t, idx, visibleUnassignedItems.length)],
      }))
    )
  }
  return rows
})

function makeTimelineBar(t, idx, itemCount) {
  let left, width
  if (t.workStartAt) {
    const s = new Date(t.workStartAt)
    const e = t.workEndAt ? new Date(t.workEndAt) : new Date()
    const sMin = s.getHours() * 60 + s.getMinutes()
    const eMin = e.getHours() * 60 + e.getMinutes()
    const start = Math.max(sMin, DAY_START)
    const end = Math.min(Math.max(eMin, start + 15), DAY_START + DAY_SPAN)
    left  = `${(((start - DAY_START) / DAY_SPAN) * 100).toFixed(1)}%`
    width = `${(((end - start) / DAY_SPAN) * 100).toFixed(1)}%`
  } else {
    const seg = 100 / (itemCount + 1)
    left  = `${(seg * (idx + 1) - seg * 0.4).toFixed(1)}%`
    width = `${(seg * 0.7).toFixed(1)}%`
  }
  return { left, width, tone: MATCH_TONES[t.matchingStatus] ?? 'primary', label: t.orderNo }
}

// ── Dashboard: alerts (urgent unassigned) ─────────────────────────
const alerts = computed(() =>
  allOrders.value
    .map((o) => {
      const diff    = o.dueDate ? Math.ceil((new Date(`${o.dueDate}T00:00:00`) - new Date()) / 86400000) : null
      const deadline = diff == null ? '납기 미정' : diff <= 0 ? '남기 D-DAY' : `남기 D-${diff}`
      return {
        id:       o.orderId,
        code:     o.orderNumber,
        grade:    o.difficultyGrade ?? '-',
        deadline,
        title:    o.itemName,
        helper:   '즉시 배정 필요',
      }
    })
)

// ── Assignment: pending orders ────────────────────────────────────
const pendingOrders = computed(() =>
  allOrders.value
    .map((o) => {
      const diff    = o.dueDate ? Math.ceil((new Date(`${o.dueDate}T00:00:00`) - new Date()) / 86400000) : null
      const deadline = diff == null ? '납기 미정' : diff <= 0 ? '남기 D-DAY' : `남기 D-${diff}`
      const grade   = o.difficultyGrade ?? '-'
      return {
        id:              o.orderId,
        code:            o.orderNumber,
        title:           o.itemName,
        difficulty:      GRADE_LABELS[grade] ?? grade,
        grade,
        deadline,
        tags:            [],
        line:            '-',
        status:          '미배정',
        recommendedTechId: null,
      }
    })
)

const selectedOrder = computed(
  () => pendingOrders.value.find((o) => o.id === selectedOrderId.value) ?? pendingOrders.value[0] ?? null
)

// ── Assignment: candidates ────────────────────────────────────────
const candidates = computed(() =>
  rawCandidates.value.map((c) => ({
    id:      c.employeeId,
    name:    c.employeeName,
    initial: c.employeeName?.[0] ?? '?',
    line:    '-',
    tier:    `${c.tier}-Tier`,
    score:   c.score != null ? Number(c.score) : 0,
    fit:     c.suitabilityScore != null ? `${(Number(c.suitabilityScore) * 100).toFixed(1)}%` : '0.0%',
    tone:    TIER_TONES[c.tier] ?? 'soft',
    matchingMode: c.matchingMode,
    matchingModeLabel: MATCHING_MODE_LABELS[c.matchingMode] ?? '배정 유형 미정',
    assignmentType: c.matchingMode === 'GROWTH_TYPE' ? 'challenge' : 'optimal',
  }))
)

// ── Assignment: stats ─────────────────────────────────────────────
const assignmentStats = computed(() => ({
  assignedToday: String(assignmentSummary.value?.todayAssignedCount ?? 0),
  accuracy:      assignmentSummary.value?.accuracy != null
                   ? `${Number(assignmentSummary.value.accuracy).toFixed(1)}%`
                   : '-',
  reassigned:    '-',
  unassigned:    String(assignmentSummary.value?.unassignedCount ?? 0),
}))

// ── Event handlers ────────────────────────────────────────────────
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

async function confirmAssignment({ orderId, candidateId }) {
  assignedCandidateId.value = candidateId
  try {
    await createAssignment(orderId, candidateId)
    await loadData()
    const next = pendingOrders.value[0] ?? null
    selectedOrderId.value = next?.id ?? null
    assignedCandidateId.value = null
  } catch {
    // leave local state as-is on error
  }
}

// ── Data loading ──────────────────────────────────────────────────
async function loadData() {
  const [summary, teamLines, allLines, tl, orders] = await Promise.all([
    getAssignmentSummary().catch(() => null),
    getMyTeamLinesSummary().catch(() => []),
    getLinesSummary().catch(() => []),
    getAssignmentTimeline().catch(() => []),
    getUnassignedOrders().catch(() => []),
  ])
  const lines = Array.isArray(teamLines) && teamLines.length > 0 ? teamLines : allLines
  assignmentSummary.value  = summary
  linesSummary.value       = Array.isArray(lines)  ? lines  : []
  timeline.value           = Array.isArray(tl)     ? tl     : []
  allOrders.value          = Array.isArray(orders) ? orders : []
  await loadLineWorkers(linesSummary.value)
}

async function loadLineWorkers(lines = []) {
  const entries = await Promise.all(
    lines.map(async (line) => {
      const workers = await getLineWorkers(line.factoryLineId).catch(() => [])
      return [line.factoryLineId, Array.isArray(workers) ? workers : []]
    })
  )
  lineWorkers.value = Object.fromEntries(entries)
}

async function loadCandidates(orderId) {
  if (!orderId) {
    rawCandidates.value = []
    return
  }
  const cands = await getAssignmentCandidates({ orderId }).catch(() => [])
  rawCandidates.value      = Array.isArray(cands)  ? cands  : []
}

onMounted(async () => {
  await loadData()
  selectedOrderId.value = pendingOrders.value[0]?.id ?? null
})

watch(selectedOrderId, async (orderId) => {
  await loadCandidates(orderId)
})
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
      :lines="lineStatuses"
      :timeline-rows="timelineRows"
      :alerts="alerts"
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
      :candidates="candidates"
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

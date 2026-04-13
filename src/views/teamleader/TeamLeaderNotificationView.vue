<script setup>
import { computed, ref, onMounted } from 'vue'
import hrApi from '@/services/hrApi'
import TeamLeaderNotificationFilterBar from '@/components/hr/teamleader/notification/TeamLeaderNotificationFilterBarWrapper.vue'
import TeamLeaderNotificationList from '@/components/hr/teamleader/notification/TeamLeaderNotificationListWrapper.vue'
import TeamLeaderNotificationAssistPanel from '@/components/hr/teamleader/notification/TeamLeaderNotificationAssistPanel.vue'
import { notificationAssistPanels } from '@/mocks/teamleader/notification'

// ── 상수 ──────────────────────────────────────────
const notificationFilters = [
  { key: 'all',     label: '전체' },
  { key: 'info',    label: '평가/배정' },
  { key: 'warn',    label: '이의신청' },
  { key: 'success', label: '승급' },
  { key: 'fault',   label: '편향감지' },
]

const TYPE_MAP = {
  RESULTS:        { label: '평가결과', tone: 'info' },
  OBJECTIONS:     { label: '이의신청', tone: 'warn' },
  PROMOTION:      { label: '승급',    tone: 'success' },
  ARRANGEMENT:    { label: '배정',    tone: 'info' },
  BIAS_DETECTION: { label: '편향감지', tone: 'fault' },
}

// ── 헬퍼 ──────────────────────────────────────────
function timeAgo(isoStr) {
  if (!isoStr) return ''
  const diff = Date.now() - new Date(isoStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return '방금 전'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  return `${Math.floor(hr / 24)}일 전`
}

function normalize(n) {
  const meta = TYPE_MAP[n.notificationType] ?? { label: n.notificationType, tone: 'info' }
  return {
    id:             n.notificationRecipientId,
    notificationId: n.notificationId,
    type:           meta.label,
    tone:           meta.tone,
    title:          n.notificationTitle,
    description:    n.notificationContent,
    time:           timeAgo(n.notificationSentAt),
    unread:         !n.notificationIsRead,
    actionLabel:    n.notificationIsRead ? '보기' : '확인',
  }
}

// ── 상태 ──────────────────────────────────────────
const activeFilter           = ref('all')
const notifications          = ref([])
const selectedNotificationId = ref(null)
const activeAssistPanelId    = ref(null)
const headlineFeedback       = ref('')

// assistPanels는 SCM API 연동 전까지 mock 유지
const assistPanels = ref(
  notificationAssistPanels.map((panel) => ({
    ...panel,
    equipment:  { ...panel.equipment },
    candidates: panel.candidates.map((c) => ({ ...c })),
  }))
)

// ── API ───────────────────────────────────────────
async function fetchNotifications() {
  try {
    const res = await hrApi.get('/api/v1/hr/notifications')
    const list = res.data?.success ? res.data.data : res.data
    notifications.value = (Array.isArray(list) ? list : []).map(normalize)
  } catch (err) {
    console.error('알림 조회 실패:', err)
  }
}

async function ackNotification(item) {
  try {
    await hrApi.post(`/api/v1/hr/notifications/${item.notificationId}/ack`)
    notifications.value = notifications.value.map((n) =>
      n.id === item.id ? { ...n, unread: false, actionLabel: '보기' } : n
    )
  } catch (err) {
    console.error('알림 확인 실패:', err)
  }
}

onMounted(fetchNotifications)

// ── 필터 ──────────────────────────────────────────
const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value
  return notifications.value.filter((item) => item.tone === activeFilter.value)
})

// ── 헤드라인: 가장 최근 미확인 알림 ────────────────
const headlineNotification = computed(() =>
  notifications.value.find((n) => n.unread) ?? notifications.value[0] ?? null
)

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
}

function selectNotification(item) {
  selectedNotificationId.value = item.id
  activeAssistPanelId.value = null
  if (item.unread) ackNotification(item)
}

function handleHeadlineAction() {
  if (!headlineNotification.value) return
  selectNotification(headlineNotification.value)
  headlineFeedback.value = '선택된 알림으로 이동했습니다.'
}

function handleQuickAssign({ panel, candidate }) {
  if (!panel || !candidate) return
  assistPanels.value = assistPanels.value.map((entry) =>
    entry.id === panel.id
      ? {
          ...entry,
          equipment:  { ...entry.equipment, assignee: `현재 담당: ${candidate.name} (${candidate.tier}-Tier)`, status: '배정 완료' },
          actionLabel: '배정 완료',
        }
      : entry
  )
  headlineFeedback.value = `${panel.equipment.code} 설비를 ${candidate.name}에게 즉시 배정했습니다.`
}
</script>

<template>
  <section class="teamleader-notification-view">
    <section v-if="headlineNotification" class="teamleader-notification-view__headline">
      <div>
        <h1>{{ headlineNotification.title }}</h1>
        <p>{{ headlineNotification.description }}</p>
        <p v-if="headlineFeedback" class="teamleader-notification-view__headline-feedback">
          {{ headlineFeedback }}
        </p>
      </div>
      <button type="button" @click="handleHeadlineAction">확인</button>
    </section>

    <section class="teamleader-notification-view__content">
      <div class="teamleader-notification-view__main">
        <TeamLeaderNotificationFilterBar
          :filters="notificationFilters"
          :active-filter="activeFilter"
          @change-filter="handleFilterChange"
        />
        <TeamLeaderNotificationList
          :items="filteredNotifications"
          :selected-item-id="selectedNotificationId"
          :page-size="4"
          @click-item="selectNotification"
          @click-action="selectNotification"
        />
      </div>

      <TeamLeaderNotificationAssistPanel
        :panels="assistPanels"
        :active-panel-id="activeAssistPanelId"
        :page-size="1"
        @quick-assign="handleQuickAssign"
      />
    </section>
  </section>
</template>

<style scoped>
.teamleader-notification-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 12px 10px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  overflow: hidden;
}

.teamleader-notification-view__headline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 22px;
  border: 2px solid #ff5072;
  border-radius: 18px;
  background: #fff2f5;
}

.teamleader-notification-view__headline h1 {
  font-size: 26px;
  color: #db294d;
}

.teamleader-notification-view__headline p {
  margin-top: 6px;
  font-size: 15px;
  color: #dc627c;
}

.teamleader-notification-view__headline-feedback {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(243, 41, 79, 0.08);
  color: #bf2442;
  font-size: 13px;
  font-weight: 700;
}

.teamleader-notification-view__headline button {
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: #f3294f;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.teamleader-notification-view__content {
  display: grid;
  grid-template-columns: minmax(0, 1.95fr) minmax(300px, 1fr);
  gap: 16px;
  align-items: stretch;
  min-height: 0;
}

.teamleader-notification-view__main {
  display: grid;
  gap: 0px;
  min-height: 0;
}

@media (max-width: 1180px) {
  .teamleader-notification-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-notification-view {
    padding: 12px;
  }

  .teamleader-notification-view__headline {
    align-items: stretch;
    flex-direction: column;
  }

  .teamleader-notification-view__headline h1 {
    font-size: 21px;
  }
}
</style>

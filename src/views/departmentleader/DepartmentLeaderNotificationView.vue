<script setup>
import { computed, ref, onMounted } from 'vue'
import { hrApi } from '@/services/apiClient'
import { BaseStatCard, BaseFilterTabs, BaseNotificationList } from '@/components/common/base'

// ── 상수 ──────────────────────────────────────────
const TYPE_MAP = {
  RESULTS:        { label: '평가결과', category: 'results',     tone: 'info' },
  OBJECTIONS:     { label: '이의신청', category: 'objections',  tone: 'warn' },
  PROMOTION:      { label: '승급',    category: 'promotion',   tone: 'success' },
  BIAS_DETECTION: { label: '편향감지', category: 'bias',        tone: 'fault' },
}

const notificationFilters = [
  { key: 'all',         label: '전체',    categoryKey: null },
  { key: 'results',     label: '평가결과', categoryKey: 'results' },
  { key: 'objections',  label: '이의신청', categoryKey: 'objections' },
  { key: 'promotion',   label: '승급',    categoryKey: 'promotion' },
  { key: 'bias',        label: '편향감지', categoryKey: 'bias' },
]

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
  const meta = TYPE_MAP[n.notificationType] ?? { label: n.notificationType, category: 'etc', tone: 'info' }
  return {
    id:             n.notificationRecipientId,
    notificationId: n.notificationId,
    type:           meta.label,
    category:       meta.category,
    tone:           meta.tone,
    title:          n.notificationTitle,
    description:    n.notificationContent,
    time:           timeAgo(n.notificationSentAt),
    unread:         !n.notificationIsRead,
    actionLabel:    n.notificationIsRead ? '보기' : '확인',
  }
}

// ── 상태 ──────────────────────────────────────────
const notifications = ref([])
const summary       = ref({ totalCount: 0, unreadCount: 0 })
const activeFilter  = ref('all')

// ── API ───────────────────────────────────────────
async function fetchNotifications() {
  try {
    const [listRes, summaryRes] = await Promise.all([
      hrApi.get('/api/v1/hr/notifications'),
      hrApi.get('/api/v1/hr/notifications/summary'),
    ])
    const list = listRes.data?.success ? listRes.data.data : listRes.data
    notifications.value = (Array.isArray(list) ? list : [])
      .filter((item) => item.notificationType !== 'ARRANGEMENT')
      .map(normalize)
    summary.value = {
      ...(summaryRes.data?.success ? summaryRes.data.data : summaryRes.data),
      totalCount: notifications.value.length,
      unreadCount: notifications.value.filter((item) => item.unread).length,
    }
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
    if (summary.value.unreadCount > 0) summary.value.unreadCount--
  } catch (err) {
    console.error('알림 확인 실패:', err)
  }
}

async function hideNotification(item) {
  try {
    await hrApi.patch(`/api/v1/hr/notifications/${item.notificationId}/hide`)
    notifications.value = notifications.value.filter((n) => n.id !== item.id)
    if (summary.value.totalCount > 0) summary.value.totalCount--
    if (item.unread && summary.value.unreadCount > 0) summary.value.unreadCount--
  } catch (err) {
    console.error('알림 숨김 실패:', err)
  }
}

onMounted(fetchNotifications)

// ── 필터 ──────────────────────────────────────────
const filterTabItems = computed(() =>
  notificationFilters.map((f) => ({
    key:   f.key,
    label: f.label,
    count: f.categoryKey
      ? notifications.value.filter((i) => i.category === f.categoryKey).length
      : notifications.value.length,
  }))
)

const filteredItems = computed(() => {
  const f = notificationFilters.find((f) => f.key === activeFilter.value)
  if (!f?.categoryKey) return notifications.value
  return notifications.value.filter((i) => i.category === f.categoryKey)
})

const biasCount = computed(() =>
  notifications.value.filter((i) => i.category === 'bias').length
)

function handleClickAction(item) {
  if (item.unread) ackNotification(item)
}
</script>

<template>
  <section class="dl-notif-view">
    <!-- Metric cards -->
    <div class="dl-notif-view__metrics">
      <BaseStatCard label="전체 알림"  :value="`${summary.totalCount}건`"  tone="primary" variant="compact" />
      <BaseStatCard label="미확인"     :value="`${summary.unreadCount}건`" tone="danger"  variant="compact" />
      <BaseStatCard label="편향감지"   :value="`${biasCount}건`"           tone="danger"  variant="compact" />
    </div>

    <!-- Filter bar + list -->
    <section class="dl-notif-filter">
      <p class="dl-notif-filter__eyebrow">전체 알림</p>
      <BaseFilterTabs
        class="dl-notif-filter__tabs"
        :items="filterTabItems"
        :model-value="activeFilter"
        variant="underline"
        size="md"
        :show-count="true"
        @change="activeFilter = $event"
      />
    </section>
    <BaseNotificationList
      :items="filteredItems"
      :page-size="6"
      @click-item="handleClickAction"
      @click-action="handleClickAction"
      @dismiss-item="hideNotification"
    />
  </section>
</template>

<style scoped>
.dl-notif-view {
  width: 100%;
  min-width: 0;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dl-notif-view__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 720px) {
  .dl-notif-view__metrics { grid-template-columns: 1fr; }
}

.dl-notif-filter {
  padding: 18px 20px 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  background: var(--color-bg-surface);
}

.dl-notif-filter__eyebrow {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-300);
}

.dl-notif-filter__tabs {
  margin-top: 14px;
}
</style>

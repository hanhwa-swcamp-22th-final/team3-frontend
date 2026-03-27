<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BaseStatCard, BaseFilterTabs, BaseNotificationList } from '@/components/common/base'
import { notificationItems, notificationFilters } from '@/mocks/departmentleader/notification'

const router = useRouter()
const activeFilter = ref('all')

const filterTabItems = computed(() =>
  notificationFilters.map((f) => ({
    key:   f.key,
    label: f.label,
    count: f.categoryKey
      ? notificationItems.filter((i) => i.category === f.categoryKey).length
      : notificationItems.length,
  })),
)

const filteredItems = computed(() => {
  const f = notificationFilters.find((f) => f.key === activeFilter.value)
  if (!f || !f.categoryKey) return notificationItems.map(toBaseItem)
  return notificationItems.filter((i) => i.category === f.categoryKey).map(toBaseItem)
})

// BaseNotificationList expects item.type (not item.categoryLabel)
function toBaseItem(i) {
  return { ...i, type: i.categoryLabel }
}

function handleClickAction(item) {
  const routeMap = {
    kms:    'DLKnowledgeApproval',
    member: 'TeamCapability',
    eval:   'DepartmentLeaderDashboardEvaluation',
  }
  const routeName = routeMap[item.category]
  if (routeName) router.push({ name: routeName })
}

const totalCount  = notificationItems.length
const unreadCount = computed(() => notificationItems.filter((i) => i.unread).length)
const urgentCount = computed(() => notificationItems.filter((i) => i.category === 'fault').length)
</script>

<template>
  <section class="dl-notif-view">
    <!-- Metric cards -->
    <div class="dl-notif-view__metrics">
      <BaseStatCard label="전체 알림"  :value="`${totalCount}건`"  tone="primary" variant="compact" />
      <BaseStatCard label="미확인"     :value="`${unreadCount}건`" tone="danger"  variant="compact" />
      <BaseStatCard label="긴급"       :value="`${urgentCount}건`" tone="danger"  variant="compact" />
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
      @click-action="handleClickAction"
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

<script setup>
import { computed } from 'vue'
import DepartmentLeaderNotificationList from '@/components/hr/departmentleader/notification/DepartmentLeaderNotificationList.vue'
import { notificationItems, notificationFilters } from '@/mocks/departmentleader/notification'

const totalCount   = computed(() => notificationItems.length)
const unreadCount  = computed(() => notificationItems.filter((i) => i.unread).length)
const urgentCount  = computed(() => notificationItems.filter((i) => i.category === 'fault').length)
</script>

<template>
  <section class="dl-notif-view">
    <!-- Metric cards -->
    <div class="dl-notif-view__metrics">
      <div class="dl-notif-view__metric-card">
        <span class="dl-notif-view__metric-label">전체 알림</span>
        <span class="dl-notif-view__metric-value">{{ totalCount }}건</span>
      </div>
      <div class="dl-notif-view__metric-card">
        <span class="dl-notif-view__metric-label">미확인</span>
        <span class="dl-notif-view__metric-value dl-notif-view__metric-value--alert">{{ unreadCount }}건</span>
      </div>
      <div class="dl-notif-view__metric-card">
        <span class="dl-notif-view__metric-label">긴급</span>
        <span class="dl-notif-view__metric-value dl-notif-view__metric-value--alert">{{ urgentCount }}건</span>
      </div>
    </div>

    <!-- Notification list with built-in filter tabs -->
    <DepartmentLeaderNotificationList
      :items="notificationItems"
      :filters="notificationFilters"
      :page-size="6"
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

/* Metric cards */
.dl-notif-view__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.dl-notif-view__metric-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: var(--color-bg-surface);
}

.dl-notif-view__metric-label {
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 600;
}

.dl-notif-view__metric-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-primary-800);
}

.dl-notif-view__metric-value--alert {
  color: #e03a5a;
}

@media (max-width: 720px) {
  .dl-notif-view__metrics {
    grid-template-columns: 1fr;
  }
}
</style>

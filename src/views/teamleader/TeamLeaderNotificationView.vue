<script setup>
import { computed, ref } from 'vue'
import TeamLeaderNotificationFilterBar from '@/components/hr/teamleader/notification/TeamLeaderNotificationFilterBar.vue'
import TeamLeaderNotificationList from '@/components/hr/teamleader/notification/TeamLeaderNotificationList.vue'
import TeamLeaderNotificationAssistPanel from '@/components/hr/teamleader/notification/TeamLeaderNotificationAssistPanel.vue'
import { notificationFilters, notificationHeadlineAlert, notificationItems, notificationAssistPanels } from '@/mocks/teamleader/notification'

const activeFilter = ref('all')

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notificationItems
  }

  return notificationItems.filter((item) => item.tone === activeFilter.value)
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
}
</script>

<template>
  <section class="teamleader-notification-view">
    <section class="teamleader-notification-view__headline">
      <div>
        <h1>{{ notificationHeadlineAlert.title }}</h1>
        <p>{{ notificationHeadlineAlert.description }}</p>
      </div>
      <button type="button">{{ notificationHeadlineAlert.actionLabel }}</button>
    </section>

    <section class="teamleader-notification-view__content">
      <div class="teamleader-notification-view__main">
        <TeamLeaderNotificationFilterBar
          :filters="notificationFilters"
          :active-filter="activeFilter"
          @change-filter="handleFilterChange"
        />
        <TeamLeaderNotificationList :items="filteredNotifications" :page-size="4" />
      </div>

      <TeamLeaderNotificationAssistPanel :panels="notificationAssistPanels" :page-size="1" />
    </section>
  </section>
</template>

<style scoped>
.teamleader-notification-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px;
  box-sizing: border-box;
  background: var(--color-bg-app);
}

.teamleader-notification-view__headline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
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
  align-items: start;
}

.teamleader-notification-view__main {
  display: grid;
  gap: 0px;
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





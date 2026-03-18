<script setup>
import { computed, ref } from 'vue'
import TeamLeaderNotificationFilterBar from '@/components/hr/teamleader/notification/TeamLeaderNotificationFilterBarWrapper.vue'
import TeamLeaderNotificationList from '@/components/hr/teamleader/notification/TeamLeaderNotificationListWrapper.vue'
import TeamLeaderNotificationAssistPanel from '@/components/hr/teamleader/notification/TeamLeaderNotificationAssistPanel.vue'
import { notificationFilters, notificationHeadlineAlert, notificationItems, notificationAssistPanels } from '@/mocks/teamleader/notification'

const activeFilter = ref('all')
const notifications = ref(notificationItems.map((item) => ({ ...item })))
const assistPanels = ref(
  notificationAssistPanels.map((panel) => ({
    ...panel,
    equipment: { ...panel.equipment },
    candidates: panel.candidates.map((candidate) => ({ ...candidate })),
  }))
)
const selectedNotificationId = ref(null)
const activeAssistPanelId = ref(null)
const headlineFeedback = ref('')

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications.value
  }

  return notifications.value.filter((item) => item.tone === activeFilter.value)
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
}

function extractEquipmentCode(title = '') {
  return title.split(' - ')[0]?.trim() ?? ''
}

function findMatchingPanelId(item) {
  const equipmentCode = extractEquipmentCode(item.title)
  return assistPanels.value.find((panel) => panel.equipment.code === equipmentCode)?.id ?? null
}

function selectNotification(item) {
  selectedNotificationId.value = item.id
  activeAssistPanelId.value = findMatchingPanelId(item)
}

function handleHeadlineAction() {
  const headlineItem = notifications.value.find((item) => extractEquipmentCode(item.title) === 'WLD-01')

  if (!headlineItem) {
    return
  }

  selectNotification(headlineItem)
  headlineFeedback.value = '선택된 알림에 맞춰 우측 빠른 재배정 후보를 불러왔습니다.'
}

function handleQuickAssign({ panel, candidate }) {
  if (!panel || !candidate) {
    return
  }

  assistPanels.value = assistPanels.value.map((entry) =>
    entry.id === panel.id
      ? {
          ...entry,
          equipment: {
            ...entry.equipment,
            assignee: `현재 담당: ${candidate.name} (${candidate.tier}-Tier)`,
            status: '배정 완료',
          },
          actionLabel: '배정 완료',
        }
      : entry
  )

  notifications.value = notifications.value.map((item) =>
    extractEquipmentCode(item.title) === panel.equipment.code
      ? {
          ...item,
          type: '완료',
          title: `${panel.equipment.code} - ${candidate.name} 배정 확정`,
          description: `${panel.equipment.line} · ${candidate.scoreLabel} 기준 즉시 배정`,
          time: '방금 전',
          actionLabel: '보기',
          tone: 'success',
          unread: false,
        }
      : item
  )

  const updatedItem = notifications.value.find((item) => item.title.startsWith(`${panel.equipment.code} - `))

  if (updatedItem) {
    selectedNotificationId.value = updatedItem.id
  }

  headlineFeedback.value = `${panel.equipment.code} 설비를 ${candidate.name}에게 즉시 배정했습니다.`
}
</script>

<template>
  <section class="teamleader-notification-view">
    <section class="teamleader-notification-view__headline">
      <div>
        <h1>{{ notificationHeadlineAlert.title }}</h1>
        <p>{{ notificationHeadlineAlert.description }}</p>
        <p v-if="headlineFeedback" class="teamleader-notification-view__headline-feedback">
          {{ headlineFeedback }}
        </p>
      </div>
      <button type="button" @click="handleHeadlineAction">{{ notificationHeadlineAlert.actionLabel }}</button>
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

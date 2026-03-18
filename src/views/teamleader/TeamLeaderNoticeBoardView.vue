<script setup>
import { computed, ref } from 'vue'
import TeamLeaderNoticeFilterBar from '@/components/hr/common/notices/TeamLeaderNoticeFilterBar.vue'
import TeamLeaderNoticeList from '@/components/hr/common/notices/TeamLeaderNoticeList.vue'
import TeamLeaderNoticeDetailPanel from '@/components/hr/common/notices/TeamLeaderNoticeDetailPanel.vue'
import { noticeBoardFilters, noticeBoardItems } from '@/mocks/teamleader/noticeBoard'

const activeFilter = ref('all')
const selectedNoticeId = ref(1)

const filteredNotices = computed(() => {
  if (activeFilter.value === 'all') {
    return noticeBoardItems
  }

  if (activeFilter.value === 'hrm') {
    return noticeBoardItems.filter((notice) => notice.author.includes('HRM'))
  }

  return noticeBoardItems.filter((notice) => notice.category === activeFilter.value)
})

const selectedNotice = computed(() => {
  return filteredNotices.value.find((notice) => notice.id === selectedNoticeId.value) ?? filteredNotices.value[0]
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
  selectedNoticeId.value = filteredNotices.value[0]?.id ?? null
}

function handleSelectNotice(noticeId) {
  selectedNoticeId.value = noticeId
}
</script>

<template>
  <section class="teamleader-noticeboard-view">
    <header class="teamleader-noticeboard-view__header">
      <h1>공지 목록</h1>
      <span>총 {{ noticeBoardItems.length }}건</span>
    </header>

    <section class="teamleader-noticeboard-view__content">
      <div class="teamleader-noticeboard-view__main">
        <TeamLeaderNoticeFilterBar
          :filters="noticeBoardFilters"
          :active-filter="activeFilter"
          @change-filter="handleFilterChange"
        />
        <TeamLeaderNoticeList
          :items="filteredNotices"
          :selected-id="selectedNotice?.id"
          :page-size="3"
          @select-notice="handleSelectNotice"
        />
      </div>

      <TeamLeaderNoticeDetailPanel :notice="selectedNotice" />
    </section>
  </section>
</template>

<style scoped>
.teamleader-noticeboard-view {
  width: 100%;
  min-width: 0;
  padding: 14px 10px;
  box-sizing: border-box;
  background: var(--color-bg-app);
}

.teamleader-noticeboard-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 8px 4px;
}

.teamleader-noticeboard-view__header h1 {
  font-size: 32px;
  color: var(--color-primary-800);
}

.teamleader-noticeboard-view__header span {
  color: var(--color-primary-300);
  font-size: 15px;
  font-weight: 700;
}

.teamleader-noticeboard-view__content {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 1fr);
  gap: 16px;
  align-items: start;
}

.teamleader-noticeboard-view__main {
  display: grid;
  gap: 0;
  align-content: start;
}

@media (max-width: 1180px) {
  .teamleader-noticeboard-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-noticeboard-view {
    padding: 12px;
  }

  .teamleader-noticeboard-view__header h1 {
    font-size: 24px;
  }
}
</style>



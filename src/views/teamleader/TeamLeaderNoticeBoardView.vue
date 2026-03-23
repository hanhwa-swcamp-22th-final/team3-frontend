<script setup>
import { computed, ref } from 'vue'
import TeamLeaderNoticeFilterBar from '@/components/hr/common/notices/TeamLeaderNoticeFilterBar.vue'
import WorkerNoticeList from '@/components/hr/common/notices/WorkerNoticeList.vue'
import WorkerNoticeDetail from '@/components/hr/common/notices/WorkerNoticeDetail.vue'
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

const workerNotices = computed(() =>
  filteredNotices.value.map((notice) => ({
    id: notice.id,
    title: notice.title,
    category:
      notice.category === 'urgent'
        ? '긴급'
        : notice.category === 'education'
          ? '교육'
          : notice.category === 'inspection'
            ? '점검'
            : '전체',
    status: notice.status === '예약' ? 'scheduled' : 'active',
    statusLabel: notice.status,
    pinned: notice.pin,
    author: notice.author.replace('작성자 ', ''),
    date: notice.schedule,
    views: Number(String(notice.views).replace(/[^0-9]/g, '')) || 0,
    target: notice.target.replace('대상: ', ''),
    preview: notice.summary,
    content: notice.summary,
    attachments: notice.attachmentLabel ? notice.attachmentLabel.split(' / ') : [],
  }))
)

const selectedNotice = computed(() => {
  return workerNotices.value.find((notice) => notice.id === selectedNoticeId.value) ?? workerNotices.value[0] ?? null
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
  selectedNoticeId.value = workerNotices.value[0]?.id ?? null
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
          class="teamleader-noticeboard-view__filters"
          :filters="noticeBoardFilters"
          :active-filter="activeFilter"
          @change-filter="handleFilterChange"
        />

        <WorkerNoticeList
          :notices="workerNotices"
          :selected-id="selectedNotice?.id"
          @select="handleSelectNotice"
        />
      </div>

      <WorkerNoticeDetail v-if="selectedNotice" :notice="selectedNotice" />
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
  font-size: var(--font-size-display-md);
  color: var(--color-primary-800);
}

.teamleader-noticeboard-view__header span {
  color: var(--color-primary-300);
  font-size: var(--font-size-base-plus);
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
  gap: 16px;
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
    font-size: var(--font-size-xl);
  }
}
</style>


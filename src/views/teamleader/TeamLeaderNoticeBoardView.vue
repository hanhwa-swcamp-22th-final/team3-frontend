<script setup>
import { computed, ref } from 'vue'
import HRMNoticeListPanel from '@/components/hr/common/notices/HRMNoticeListPanel.vue'
import HRMNoticeDetailPanel from '@/components/hr/common/notices/HRMNoticeDetailPanel.vue'
import { noticeBoardItems } from '@/mocks/teamleader/noticeBoard'

const selectedNoticeId = ref(noticeBoardItems[0]?.id ?? null)

const notices = computed(() =>
  noticeBoardItems.map((notice) => ({
    id: notice.id,
    title: notice.title,
    status: notice.status,
    isImportant: notice.pin,
    author: notice.author.replace('작성자 ', ''),
    date: notice.schedule,
    views: Number(String(notice.views).replace(/[^0-9]/g, '')) || 0,
    targets: notice.target.replace('대상: ', '').split(' / '),
    content: notice.summary,
    attachment: notice.attachmentLabel ?? '',
  }))
)

const selectedNotice = computed(() => {
  return notices.value.find((notice) => notice.id === selectedNoticeId.value) ?? notices.value[0] ?? null
})

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
        <HRMNoticeListPanel
          :notices="notices"
          :selected-id="selectedNotice?.id"
          @select="handleSelectNotice"
        />
      </div>

      <HRMNoticeDetailPanel v-if="selectedNotice" :notice="selectedNotice" />
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

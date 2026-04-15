<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { hrApi } from '@/services/apiClient'
import HRMNoticeListPanel  from '@/components/hr/common/notices/HRMNoticeListPanel.vue'
import HRMNoticeDetailPanel from '@/components/hr/common/notices/HRMNoticeDetailPanel.vue'

const STATUS_MAP = { POSTING: '게시중', RESERVATION: '예약', TEMPORARY: '임시' }

function formatDate(isoStr) {
  if (!isoStr) return null
  const d = new Date(isoStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

function normalizeList(n) {
  return {
    id:          n.noticeId,
    title:       n.noticeTitle,
    author:      String(n.authorId ?? '-'),
    status:      STATUS_MAP[n.noticeStatus] ?? n.noticeStatus,
    isImportant: n.isImportant === 1,
    views:       n.noticeViews ?? 0,
    date:        formatDate(n.publishStartAt ?? n.createdAt),
  }
}

function normalizeDetail(n) {
  return {
    ...normalizeList(n),
    content:    n.noticeContent ?? '',
    attachment: n.attachments?.[0]?.fileName ?? '',
  }
}

const notices        = ref([])
const selectedId     = ref(null)
const selectedNotice = ref(null)
const route = useRoute()

async function fetchNotices() {
  try {
    const res = await hrApi.get('/api/v1/hr/notices')
    const list = res.data?.success ? res.data.data : res.data
    notices.value = (Array.isArray(list) ? list : []).map(normalizeList)
    const queryNoticeId = route.query.noticeId ? Number(route.query.noticeId) : null
    if (queryNoticeId && notices.value.some(notice => notice.id === queryNoticeId)) {
      selectedId.value = queryNoticeId
      return
    }
    if (!selectedId.value && notices.value.length) {
      selectedId.value = notices.value[0].id
    }
  } catch (err) {
    console.error('공지 목록 조회 실패:', err)
  }
}

async function fetchDetail(id) {
  if (!id) { selectedNotice.value = null; return }
  try {
    const res = await hrApi.get(`/api/v1/hr/notices/${id}`)
    const data = res.data?.success ? res.data.data : res.data
    selectedNotice.value = normalizeDetail(data)
  } catch (err) {
    console.error('공지 상세 조회 실패:', err)
  }
}

watch(selectedId, (id) => fetchDetail(id))
onMounted(fetchNotices)
</script>

<template>
  <div class="dl-noticeboard">
    <div class="notice-grid">
      <HRMNoticeListPanel
        :notices="notices"
        :selected-id="selectedId"
        :filter-tabs="['전체', '중요']"
        :allow-hide-important="true"
        @select="selectedId = $event"
      />
      <HRMNoticeDetailPanel
        :notice="selectedNotice"
        :readonly="true"
      />
    </div>
  </div>
</template>

<style scoped>
.dl-noticeboard {
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.notice-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: stretch;
  flex: 1;
  min-height: 0;
}

@media (max-width: 960px) {
  .notice-grid {
    grid-template-columns: 1fr;
  }
}
</style>

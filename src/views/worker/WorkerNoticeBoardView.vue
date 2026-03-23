<script setup>
import { ref, computed, onMounted } from 'vue'
import HRMNoticeListPanel from '@/components/hr/common/notices/HRMNoticeListPanel.vue'
import HRMNoticeDetailPanel from '@/components/hr/common/notices/HRMNoticeDetailPanel.vue'
import { workerNotices as mockNotices } from '@/mocks/worker/workerNoticeData'

const loading = ref(true)
const notices = ref([])
const selectedId = ref(null)

onMounted(() => {
  notices.value = mockNotices
  if (notices.value.length) {
    selectedId.value = notices.value[0].id
  }
  loading.value = false
})

const statusMap = { '게시중': '게시중', '게시 예정': '예약' }

const hrmNotices = computed(() => {
  return notices.value.map((n) => ({
    id: n.id,
    title: n.title,
    isImportant: n.pinned || n.category === '긴급',
    status: statusMap[n.statusLabel] || n.statusLabel,
    targets: n.target ? [n.target] : [],
    date: n.date,
    author: n.author,
    views: n.views,
    content: n.content,
    attachment: n.attachments?.length ? n.attachments.join(', ') : null,
  }))
})

const selectedNotice = computed(() => {
  return hrmNotices.value.find((n) => n.id === selectedId.value) ?? null
})

function handleSelect(id) {
  selectedId.value = id
}
</script>

<template>
  <div class="nb-content">
    <div v-if="loading" class="nb-loading">데이터를 불러오는 중...</div>

    <template v-else>
      <div class="nb-grid">
        <HRMNoticeListPanel
          v-if="hrmNotices.length"
          :notices="hrmNotices"
          :selected-id="selectedId"
          @select="handleSelect"
        />
        <HRMNoticeDetailPanel
          v-if="selectedNotice"
          :notice="selectedNotice"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.nb-content {
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

.nb-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: stretch;
  flex: 1;
  min-height: 0;
}

.nb-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>

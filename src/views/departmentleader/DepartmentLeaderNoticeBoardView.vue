<script setup>
import { ref, computed } from 'vue'
import HRMNoticeListPanel   from '@/components/hr/common/notices/HRMNoticeListPanel.vue'
import HRMNoticeDetailPanel from '@/components/hr/common/notices/HRMNoticeDetailPanel.vue'
import { dlNotices } from '@/mocks/departmentleader/noticeData'

const notices    = ref(dlNotices)
const selectedId = ref(notices.value[0]?.id ?? null)

const selectedNotice = computed(() =>
  notices.value.find((n) => n.id === selectedId.value) ?? null
)
</script>

<template>
  <div class="dl-noticeboard">
    <div class="notice-grid">
      <HRMNoticeListPanel
        :notices="notices"
        :selected-id="selectedId"
        :show-create-button="false"
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

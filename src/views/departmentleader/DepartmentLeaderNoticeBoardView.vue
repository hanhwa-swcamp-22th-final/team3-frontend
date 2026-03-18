<script setup>
import { ref, computed } from 'vue'
import WorkerNoticeList from '@/components/hr/common/notices/WorkerNoticeList.vue'
import WorkerNoticeDetail from '@/components/hr/common/notices/WorkerNoticeDetail.vue'
import { dlNotices } from '@/mocks/departmentleader/noticeData'

const notices = ref(dlNotices)
const selectedId = ref(notices.value[0]?.id ?? null)

const selectedNotice = computed(() => notices.value.find((n) => n.id === selectedId.value) ?? null)
</script>

<template>
  <div class="dl-noticeboard">
    <div class="dl-noticeboard__grid">
      <WorkerNoticeList
        :notices="notices"
        :selected-id="selectedId"
        @select="selectedId = $event"
      />
      <WorkerNoticeDetail v-if="selectedNotice" :notice="selectedNotice" />
    </div>
  </div>
</template>

<style scoped>
.dl-noticeboard {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--color-bg-app);
}

.dl-noticeboard__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 960px) {
  .dl-noticeboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>

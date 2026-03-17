<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerNoticeList from '@/components/worker/hr/WorkerNoticeList.vue'
import WorkerNoticeDetail from '@/components/worker/hr/WorkerNoticeDetail.vue'
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

const selectedNotice = computed(() => {
  return notices.value.find((n) => n.id === selectedId.value) ?? null
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
        <WorkerNoticeList
          v-if="notices.length"
          :notices="notices"
          :selected-id="selectedId"
          @select="handleSelect"
        />
        <WorkerNoticeDetail
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
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.nb-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: start;
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

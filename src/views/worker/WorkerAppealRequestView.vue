<script setup>
import { ref, computed, onMounted } from 'vue'
import { getWorkerAppealRequestData, registerAppeal, updateAppeal } from '@/services/workerHrApi'
import WorkerAppealNotification from '@/components/hr/worker/appeal-request/WorkerAppealNotification.vue'
import WorkerAppealHistory from '@/components/hr/worker/appeal-request/WorkerAppealHistory.vue'
import WorkerAppealForm from '@/components/hr/worker/appeal-request/WorkerAppealForm.vue'

const loading = ref(true)
const evalHistory = ref([])
const appealForms = ref({}) // key: qualitativeEvaluationId
const selectedId = ref(null) // qualitativeEvaluationId

onMounted(async () => {
  try {
    const { history, appeals } = await getWorkerAppealRequestData()

    evalHistory.value = history
    // Index appeals by qualitativeEvaluationId
    appeals.forEach((a) => {
      appealForms.value[a.evalHistoryId] = a
    })

    if (history.length) {
      selectedId.value = history[0].id
    }
  } catch (e) {
    console.error('Failed to load appeal data:', e)
  } finally {
    loading.value = false
  }
})

const selectedAppeal = computed(() => {
  if (!selectedId.value) return null
  // If no appeal exists for this evaluation, create a draft object
  return appealForms.value[selectedId.value] || {
    evalHistoryId: selectedId.value,
    title: '',
    content: '',
    appealType: 'QUANTITATIVE_ERROR',
    status: 'NONE',
    processStatus: 0,
    submittedDate: '-',
  }
})

const selectedStatus = computed(() => {
  if (!selectedId.value) return null
  const item = evalHistory.value.find((h) => h.id === selectedId.value)
  return item?.statusBadge ?? null
})

function handleSelect(id) {
  selectedId.value = id
}

function handleCancel() {
  // reset current selection if needed
}

async function handleSubmit(payload) {
  if (!selectedId.value) return
  const currentAppeal = appealForms.value[selectedId.value]

  try {
    if (currentAppeal && currentAppeal.appealId) {
      // Update existing appeal
      await updateAppeal(currentAppeal.appealId, {
        qualitativeEvaluationId: selectedId.value,
        appealType: payload.appealType,
        title: payload.title,
        content: payload.content,
      })
    } else {
      // Register new appeal
      await registerAppeal({
        qualitativeEvaluationId: selectedId.value,
        appealType: payload.appealType,
        title: payload.title,
        content: payload.content,
      })
    }
    // Refresh data after save
    const { history, appeals } = await getWorkerAppealRequestData()
    evalHistory.value = history
    appeals.forEach((a) => {
      appealForms.value[a.evalHistoryId] = a
    })
  } catch (e) {
    console.error('Failed to save appeal:', e)
    alert('이의 신청 저장에 실패했습니다.')
  }
}
</script>

<template>
  <div class="ar-content">
    <div v-if="loading" class="ar-loading">데이터를 불러오는 중...</div>

    <template v-else>
      <WorkerAppealNotification />

      <div class="ar-grid">
        <WorkerAppealHistory
          v-if="evalHistory.length"
          :history="evalHistory"
          :selected-id="selectedId"
          @select="handleSelect"
        />
        <WorkerAppealForm
          v-if="selectedAppeal"
          :appeal-data="selectedAppeal"
          :status-badge="selectedStatus"
          @cancel="handleCancel"
          @submit="handleSubmit"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.ar-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.ar-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 20px;
  align-items: start;
}

.ar-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>

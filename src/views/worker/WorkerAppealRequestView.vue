<script setup>
import { ref, computed, onMounted } from 'vue'
import { getWorkerAppealRequestData, registerAppeal } from '@/services/workerHrApi'
import WorkerAppealNotification from '@/components/hr/worker/appeal-request/WorkerAppealNotification.vue'
import WorkerAppealHistory from '@/components/hr/worker/appeal-request/WorkerAppealHistory.vue'
import WorkerAppealForm from '@/components/hr/worker/appeal-request/WorkerAppealForm.vue'

const loading = ref(true)
const evalHistory = ref([])
const appealForms = ref({}) // key: evaluationPeriodId
const selectedId = ref(null) // qualitativeEvaluationId

function formatPeriod(history) {
  const raw = String(history?.evalYear ?? '')
  if (raw.length === 6) {
    const year = raw.slice(0, 4)
    const month = Number(raw.slice(4, 6))
    return `${year}년 ${month}월 ${history?.evalSequence ?? ''}차`
  }
  if (history?.evalYear && history?.evalSequence != null) {
    return `${history.evalYear}년 ${history.evalSequence}차`
  }
  return '-'
}

onMounted(async () => {
  try {
    const { history, appeals } = await getWorkerAppealRequestData()

    evalHistory.value = history
    appeals.forEach((a) => {
      appealForms.value[a.evalPeriodId] = a
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
  const selectedHistory = evalHistory.value.find((h) => h.id === selectedId.value)
  if (!selectedHistory) return null
  const currentAppeal = appealForms.value[selectedHistory.evalPeriodId] || {
    evalHistoryId: selectedId.value,
    evalPeriodId: selectedHistory.evalPeriodId,
    title: '',
    content: '',
    appealType: 'SCORE_ERRORS',
    status: 'NONE',
    processStatus: 0,
    submittedDate: '-',
  }
  return {
    ...currentAppeal,
    quarter: formatPeriod(selectedHistory),
  }
})

const hasEvalHistory = computed(() =>
  evalHistory.value.some((item) => item?.id != null || item?.evalPeriodId != null)
)

function handleSelect(id) {
  selectedId.value = id
}

function handleCancel() {
  // reset current selection if needed
}

async function handleSubmit(payload) {
  if (!selectedId.value) return
  const selectedHistory = evalHistory.value.find((h) => h.id === selectedId.value)
  if (!selectedHistory?.evalPeriodId) return
  const currentAppeal = appealForms.value[selectedHistory.evalPeriodId]

  try {
    if (currentAppeal && currentAppeal.appealId) {
      alert('제출된 이의신청은 수정할 수 없습니다.')
      return
    }
    await registerAppeal({
      evaluationPeriodId: selectedHistory.evalPeriodId,
      appealType: payload.appealType,
      title: payload.title,
      content: payload.content,
    })
    // Refresh data after save
    const { history, appeals } = await getWorkerAppealRequestData()
    evalHistory.value = history
    appealForms.value = {}
    appeals.forEach((a) => {
      appealForms.value[a.evalPeriodId] = a
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
          v-if="hasEvalHistory"
          :history="evalHistory"
          :selected-id="selectedId"
          @select="handleSelect"
        />
        <WorkerAppealForm
          v-if="selectedAppeal"
          :appeal-data="selectedAppeal"
          @cancel="handleCancel"
          @submit="handleSubmit"
        />
        <div v-else class="ar-empty">
          평가 이력이 없습니다.
        </div>
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

.ar-empty {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-card);
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  font-size: 15px;
  font-weight: 600;
}
</style>

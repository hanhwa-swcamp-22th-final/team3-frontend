<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import WorkerEvaluationStatus from '@/components/worker/hr/WorkerEvaluationStatus.vue'
import WorkerQuantitativeEvaluation from '@/components/worker/hr/WorkerQuantitativeEvaluation.vue'
import WorkerQualitativeEvaluation from '@/components/worker/hr/WorkerQualitativeEvaluation.vue'
import WorkerGrowthFeedback from '@/components/worker/hr/WorkerGrowthFeedback.vue'

const API_BASE = 'http://localhost:3001'
const authStore = useAuthStore()

const loading = ref(true)
const evalStatus = ref(null)
const quantEval = ref(null)
const qualEval = ref(null)
const growthData = ref(null)

async function fetchJson(url) {
  const res = await fetch(url)
  return res.json()
}

onMounted(async () => {
  const employeeId = authStore.employee?.employee_id

  try {
    const [statusData, quantData, qualData, growthResult] = await Promise.all([
      fetchJson(`${API_BASE}/evaluationStatus?employee_id=${employeeId}`),
      fetchJson(`${API_BASE}/quantitativeEval?employee_id=${employeeId}`),
      fetchJson(`${API_BASE}/qualitativeEval?employee_id=${employeeId}`),
      fetchJson(`${API_BASE}/growthFeedback?employee_id=${employeeId}`),
    ])

    evalStatus.value = statusData[0] ?? null
    quantEval.value = quantData[0] ?? null
    qualEval.value = qualData[0] ?? null
    growthData.value = growthResult[0] ?? null
  } catch (e) {
    console.error('Failed to load evaluation data:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="eval-content">
    <div v-if="loading" class="eval-loading">데이터를 불러오는 중...</div>

    <template v-else>
      <WorkerEvaluationStatus v-if="evalStatus" :status="evalStatus" />

      <div class="eval-grid">
        <WorkerQuantitativeEvaluation v-if="quantEval" :evaluation="quantEval" />
        <WorkerQualitativeEvaluation v-if="qualEval" :evaluation="qualEval" />
        <WorkerGrowthFeedback v-if="growthData" :data="growthData" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.eval-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.eval-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: stretch;
}

.eval-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { getWorkerEvaluationData } from '@/services/workerHrApi'
import WorkerEvaluationStatus from '@/components/hr/worker/evaluation-result/WorkerEvaluationStatus.vue'
import WorkerQuantitativeEvaluation from '@/components/hr/worker/evaluation-result/WorkerQuantitativeEvaluation.vue'
import WorkerQualitativeEvaluation from '@/components/hr/worker/evaluation-result/WorkerQualitativeEvaluation.vue'
import WorkerGrowthFeedback from '@/components/hr/worker/evaluation-result/WorkerGrowthFeedback.vue'

const loading = ref(true)
const evalStatus = ref(null)
const quantEval = ref(null)
const qualEval = ref(null)
const growthData = ref(null)

onMounted(async () => {
  try {
    const data = await getWorkerEvaluationData()

    evalStatus.value = data.status
    quantEval.value = data.quantitative
    qualEval.value = data.qualitative
    growthData.value = data.feedback
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
      <WorkerEvaluationStatus :status="evalStatus" />

      <div class="eval-grid">
        <WorkerQuantitativeEvaluation :evaluation="quantEval" />
        <WorkerQualitativeEvaluation :evaluation="qualEval" />
        <WorkerGrowthFeedback :data="growthData" />
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
  font-size: var(--font-size-base-plus);
  color: var(--color-text-muted);
}
</style>

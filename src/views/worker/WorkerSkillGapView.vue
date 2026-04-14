<script setup>
import { ref, onMounted } from 'vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import WorkerSkillGapChartAndStatus from '@/components/kms/worker/skill-gap/WorkerSkillGapChartAndStatus.vue'
import WorkerSkillGapAiAnalysisReport from '@/components/kms/worker/skill-gap/WorkerSkillGapAiAnalysisReport.vue'
import WorkerCustomizedLearningRecommendations from '@/components/kms/worker/skill-gap/WorkerCustomizedLearningRecommendations.vue'

const loading = ref(true)
const currentTier = ref('C')
const targetTier = ref('B')
const skillGapSkills = ref([])
const skillGapSummary = ref({ currentOverall: 0, targetOverall: 0, totalGap: 0 })
const aiAnalysisReport = ref({
  summary: '',
  confidence: '0.00',
  gaps: [],
  prediction: {
    normalDate: '-',
    acceleratedDate: '-',
  },
})
const learningRecommendations = ref([])
const relatedKmsArticles = ref([])

onMounted(async () => {
  try {
    const response = await knowledgeArticleApi.getWorkerSkillGap()
    const data = response.data?.data ?? response.data
    currentTier.value = data.currentTier ?? 'C'
    targetTier.value = data.targetTier ?? currentTier.value
    skillGapSkills.value = data.skills
    skillGapSummary.value = data.summary
    aiAnalysisReport.value = data.report
    learningRecommendations.value = data.courses
    relatedKmsArticles.value = data.articles
  } catch (error) {
    console.error('Failed to load worker skill gap data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="sg-content">
    <div v-if="loading" class="sg-loading">데이터를 불러오는 중...</div>
    <div v-else-if="!skillGapSkills.length" class="sg-loading">스킬 데이터가 없습니다.</div>
    <div v-else class="sg-grid">
      <!-- Left: Radar Chart + Skill Status -->
      <WorkerSkillGapChartAndStatus
        :current-tier="currentTier"
        :target-tier="targetTier"
        :skills="skillGapSkills"
        :summary="skillGapSummary"
      />

      <!-- Center: AI Analysis Report -->
      <WorkerSkillGapAiAnalysisReport :report="aiAnalysisReport" />

      <!-- Right: Learning Recommendations -->
      <WorkerCustomizedLearningRecommendations
        :courses="learningRecommendations"
        :articles="relatedKmsArticles"
      />
    </div>
  </div>
</template>

<style scoped>
.sg-content {
  flex: 1;
  padding: 20px 28px 28px;
  min-width: 0;
  background: var(--color-bg-app);
}

.sg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}

.sg-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>

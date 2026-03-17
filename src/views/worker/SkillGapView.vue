<script setup>
import WorkerSkillGapChartAndStatus from '@/components/worker/kms/WorkerSkillGapChartAndStatus.vue'
import WorkerSkillGapAiAnalysisReport from '@/components/worker/kms/WorkerSkillGapAiAnalysisReport.vue'
import WorkerCustomizedLearningRecommendations from '@/components/worker/kms/WorkerCustomizedLearningRecommendations.vue'

import {
  skillGapSkills,
  skillGapSummary,
  aiAnalysisReport,
  learningRecommendations,
  relatedKmsArticles,
} from '@/mocks/worker/workerSkillGapData'
</script>

<template>
  <div class="sg-content">
    <div class="sg-grid">
      <!-- Left: Radar Chart + Skill Status -->
      <WorkerSkillGapChartAndStatus
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
</style>

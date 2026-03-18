<script setup>
import TeamLeaderAiEvaluationTargetList from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationTargetList.vue'
import TeamLeaderAiEvaluationPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationPanel.vue'
import TeamLeaderAiEvaluationActionBar from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationActionBar.vue'
import { aiEvaluationSearchPlaceholder, aiEvaluationTargets, aiEvaluationSelectedTarget } from '@/mocks/teamleader/aiEvaluation'


</script>

<template>
  <section class="teamleader-ai-evaluation-view">
    <section class="teamleader-ai-evaluation-view__content">
      <TeamLeaderAiEvaluationTargetList
        :targets="aiEvaluationTargets"
        selected-id="1"
        :search-placeholder="aiEvaluationSearchPlaceholder"
      />

      <div class="teamleader-ai-evaluation-view__form">
        <TeamLeaderAiEvaluationPanel :selected-target="aiEvaluationSelectedTarget" />
        <TeamLeaderAiEvaluationActionBar />
      </div>
    </section>
  </section>
</template>

<style scoped>
.teamleader-ai-evaluation-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px;
  background: var(--color-bg-app);
  box-sizing: border-box;
}

.teamleader-ai-evaluation-view__content {
  display: grid;
  grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: start;
}

.teamleader-ai-evaluation-view__form {
  display: grid;
  gap: 14px;
}

@media (max-width: 1120px) {
  .teamleader-ai-evaluation-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-ai-evaluation-view {
    padding: 12px;
  }
}
</style>


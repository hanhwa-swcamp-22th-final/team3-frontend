<script setup>
import { computed, ref } from 'vue'
import TeamLeaderAiEvaluationTargetList from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationTargetListWrapper.vue'
import TeamLeaderAiEvaluationPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationPanel.vue'
import TeamLeaderAiEvaluationActionBar from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationActionBar.vue'
import { aiEvaluationSearchPlaceholder, aiEvaluationTargets, aiEvaluationSelectedTarget } from '@/mocks/teamleader/aiEvaluation'

const selectedTargetId = ref(String(aiEvaluationTargets[0]?.id ?? ''))

const selectedTarget = computed(() => {
  const target = aiEvaluationTargets.find((item) => String(item.id) === selectedTargetId.value) ?? aiEvaluationTargets[0]

  if (!target) {
    return aiEvaluationSelectedTarget
  }

  return {
    ...aiEvaluationSelectedTarget,
    voiceLabel: `${target.name} 음성 초안 작성`,
    voiceDescription: `${target.name} (${target.code}) 평가 내용을 음성으로 작성하고 텍스트로 변환할 수 있습니다.`,
    convertedText: aiEvaluationSelectedTarget.convertedText.replaceAll('김신우', target.name),
  }
})

function handleSelectTarget(targetId) {
  selectedTargetId.value = targetId
}
</script>

<template>
  <section class="teamleader-ai-evaluation-view">
    <section class="teamleader-ai-evaluation-view__content">
      <TeamLeaderAiEvaluationTargetList
        :targets="aiEvaluationTargets"
        :selected-id="selectedTargetId"
        :search-placeholder="aiEvaluationSearchPlaceholder"
        @select-target="handleSelectTarget"
      />

      <div class="teamleader-ai-evaluation-view__form">
        <TeamLeaderAiEvaluationPanel :selected-target="selectedTarget" />
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

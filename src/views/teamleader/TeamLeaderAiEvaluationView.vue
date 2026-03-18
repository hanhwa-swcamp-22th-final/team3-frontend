<script setup>
import { computed, reactive, ref, watch } from 'vue'
import TeamLeaderAiEvaluationTargetList from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationTargetListWrapper.vue'
import TeamLeaderAiEvaluationPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationPanel.vue'
import TeamLeaderAiEvaluationActionBar from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationActionBar.vue'
import { aiEvaluationSearchPlaceholder, aiEvaluationTargets, aiEvaluationSelectedTarget } from '@/mocks/teamleader/aiEvaluation'

const searchQuery = ref('')
const selectedTargetId = ref(String(aiEvaluationTargets[0]?.id ?? ''))

function buildConvertedText(target) {
  return aiEvaluationSelectedTarget.convertedText.replaceAll('김신우', target.name)
}

const evaluationDrafts = reactive(
  Object.fromEntries(
    aiEvaluationTargets.map((target) => [String(target.id), buildConvertedText(target)]),
  ),
)

const filteredTargets = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) {
    return aiEvaluationTargets
  }

  return aiEvaluationTargets.filter((target) => {
    return target.name?.toLowerCase().includes(keyword)
  })
})

watch(
  filteredTargets,
  (targets) => {
    if (!targets.length) {
      selectedTargetId.value = ''
      return
    }

    const hasSelectedTarget = targets.some((target) => String(target.id) === selectedTargetId.value)

    if (!hasSelectedTarget) {
      selectedTargetId.value = String(targets[0].id)
    }
  },
  { immediate: true },
)

const selectedTarget = computed(() => {
  const target = aiEvaluationTargets.find((item) => String(item.id) === selectedTargetId.value) ?? filteredTargets.value[0]

  if (!target) {
    return aiEvaluationSelectedTarget
  }

  return {
    ...aiEvaluationSelectedTarget,
    voiceLabel: `${target.name} 음성 초안 작성`,
    voiceDescription: `${target.name} (${target.code}) 평가 내용을 음성으로 작성하고 텍스트로 변환할 수 있습니다.`,
    convertedText: evaluationDrafts[String(target.id)] ?? buildConvertedText(target),
  }
})

function handleSelectTarget(targetId) {
  selectedTargetId.value = targetId
}

function handleUpdateConvertedText(value) {
  if (!selectedTargetId.value) {
    return
  }

  evaluationDrafts[selectedTargetId.value] = value
}
</script>

<template>
  <section class="teamleader-ai-evaluation-view">
    <section class="teamleader-ai-evaluation-view__content">
      <TeamLeaderAiEvaluationTargetList
        :targets="filteredTargets"
        :selected-id="selectedTargetId"
        :search-placeholder="aiEvaluationSearchPlaceholder"
        :search-value="searchQuery"
        @select-target="handleSelectTarget"
        @update:search-value="searchQuery = $event"
      />

      <div class="teamleader-ai-evaluation-view__form">
        <TeamLeaderAiEvaluationPanel
          :selected-target="selectedTarget"
          @update:converted-text="handleUpdateConvertedText"
        />
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

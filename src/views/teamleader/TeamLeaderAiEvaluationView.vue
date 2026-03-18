<script setup>
import { computed, reactive, ref, watch } from 'vue'
import TeamLeaderAiEvaluationTargetList from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationTargetListWrapper.vue'
import TeamLeaderAiEvaluationPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationPanel.vue'
import TeamLeaderAiEvaluationActionBar from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationActionBar.vue'
import { aiEvaluationSearchPlaceholder, aiEvaluationTargets, aiEvaluationSelectedTarget } from '@/mocks/teamleader/aiEvaluation'

const searchQuery = ref('')
const selectedTargetId = ref(String(aiEvaluationTargets[0]?.id ?? ''))
const actionFeedback = ref('')
const actionFeedbackTone = ref('muted')
const guideOpen = ref(false)
const recordingState = ref('idle')
const uploadedFileName = ref('')
const uploadedText = ref('')

function buildConvertedText(target) {
  return aiEvaluationSelectedTarget.convertedText.replaceAll('김신우', target.name)
}

const evaluationDrafts = reactive(
  Object.fromEntries(
    aiEvaluationTargets.map((target) => [String(target.id), buildConvertedText(target)]),
  ),
)

const savedDrafts = reactive(
  Object.fromEntries(
    aiEvaluationTargets.map((target) => [String(target.id), buildConvertedText(target)]),
  ),
)

const submittedEvaluations = reactive({})

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

function updateFeedback(message, tone = 'muted') {
  actionFeedback.value = message
  actionFeedbackTone.value = tone
}

function handleCloseEditor() {
  if (!selectedTargetId.value) {
    return
  }

  const fallbackTarget = aiEvaluationTargets.find((target) => String(target.id) === selectedTargetId.value)
  const fallbackText = fallbackTarget ? buildConvertedText(fallbackTarget) : ''

  evaluationDrafts[selectedTargetId.value] =
    submittedEvaluations[selectedTargetId.value] ?? savedDrafts[selectedTargetId.value] ?? fallbackText

  searchQuery.value = ''
  updateFeedback('현재 대상자의 편집 내용을 마지막 저장 기준으로 되돌렸습니다.', 'muted')
}

function handleSaveDraft() {
  if (!selectedTargetId.value) {
    return
  }

  savedDrafts[selectedTargetId.value] = evaluationDrafts[selectedTargetId.value]

  const currentTarget = aiEvaluationTargets.find((target) => String(target.id) === selectedTargetId.value)
  updateFeedback(`${currentTarget?.name ?? '선택한 대상'} 평가 초안을 임시 저장했습니다.`, 'draft')
}

function handleSubmitEvaluation() {
  if (!selectedTargetId.value) {
    return
  }

  submittedEvaluations[selectedTargetId.value] = evaluationDrafts[selectedTargetId.value]

  const currentTarget = aiEvaluationTargets.find((target) => String(target.id) === selectedTargetId.value)
  updateFeedback(`${currentTarget?.name ?? '선택한 대상'} 평가 내용을 제출했습니다.`, 'submitted')
}

function buildVoiceMockText(target) {
  return `[음성 입력 mock 초안] ${target.name} 사원은 최근 설비 이상 상황에서 원인을 빠르게 확인했고, 관련 담당자와 즉시 협업해 생산 차질을 최소화했습니다. 이후 재발 방지를 위해 점검 포인트를 정리해 팀에 공유했습니다.`
}

function handleVoiceInput() {
  if (!selectedTargetId.value) {
    return
  }

  recordingState.value = recordingState.value === 'recording' ? 'ready' : 'recording'

  if (recordingState.value === 'recording') {
    updateFeedback('음성 입력 mock 상태로 전환했습니다. 다시 누르면 초안 준비 상태로 바뀝니다.', 'muted')
    return
  }

  const currentTarget = aiEvaluationTargets.find((target) => String(target.id) === selectedTargetId.value)
  uploadedText.value = currentTarget ? buildVoiceMockText(currentTarget) : ''
  updateFeedback('음성 초안이 준비되었습니다. 텍스트 변환 버튼으로 편집 영역에 반영할 수 있습니다.', 'draft')
}

async function handleFileSelected(file) {
  if (!file) {
    return
  }

  uploadedFileName.value = file.name

  if (file.type.startsWith('text/') || /\.(txt|md|log)$/i.test(file.name)) {
    uploadedText.value = await file.text()
    updateFeedback(`${file.name} 파일을 불러왔습니다. 텍스트 변환 버튼으로 초안에 반영하세요.`, 'draft')
    return
  }

  uploadedText.value = `[업로드 파일 mock] ${file.name} 파일이 선택되었습니다. 실제 변환은 후속 API 연동 단계에서 지원됩니다.`
  updateFeedback('현재는 텍스트 계열 파일을 중심으로 mock 변환을 지원합니다.', 'muted')
}

function handleConvertText() {
  if (!selectedTargetId.value) {
    return
  }

  const currentTarget = aiEvaluationTargets.find((target) => String(target.id) === selectedTargetId.value)
  const sourceText = uploadedText.value || (currentTarget ? buildVoiceMockText(currentTarget) : '')

  if (!sourceText) {
    updateFeedback('변환할 mock 음성 또는 업로드 텍스트가 없습니다.', 'muted')
    return
  }

  evaluationDrafts[selectedTargetId.value] = sourceText
  updateFeedback('텍스트 변환 결과를 편집 영역에 반영했습니다.', 'draft')
}

function handleReplayAudio() {
  if (!selectedTargetId.value) {
    return
  }

  updateFeedback('현재는 mock 단계이므로 다시 듣기 대신 준비된 초안 상태만 확인할 수 있습니다.', 'muted')
}

function handleToggleGuide() {
  guideOpen.value = !guideOpen.value
  updateFeedback(guideOpen.value ? '작성 가이드를 열었습니다.' : '작성 가이드를 닫았습니다.', 'muted')
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
          :guide-open="guideOpen"
          :recording-state="recordingState"
          :uploaded-file-name="uploadedFileName"
          @update:converted-text="handleUpdateConvertedText"
          @voice-input="handleVoiceInput"
          @file-selected="handleFileSelected"
          @convert-text="handleConvertText"
          @replay-audio="handleReplayAudio"
          @toggle-guide="handleToggleGuide"
        />
        <TeamLeaderAiEvaluationActionBar
          :disabled="!selectedTargetId"
          @close="handleCloseEditor"
          @save-draft="handleSaveDraft"
          @submit="handleSubmitEvaluation"
        />
        <p
          v-if="actionFeedback"
          class="teamleader-ai-evaluation-view__feedback"
          :class="`teamleader-ai-evaluation-view__feedback--${actionFeedbackTone}`"
        >
          {{ actionFeedback }}
        </p>
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

.teamleader-ai-evaluation-view__feedback {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 600;
}

.teamleader-ai-evaluation-view__feedback--muted {
  background: #f6f7fb;
  color: var(--color-text-muted);
}

.teamleader-ai-evaluation-view__feedback--draft {
  background: #f6f3ff;
  color: var(--color-primary-700);
}

.teamleader-ai-evaluation-view__feedback--submitted {
  background: #eefbf6;
  color: #1d7f5f;
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

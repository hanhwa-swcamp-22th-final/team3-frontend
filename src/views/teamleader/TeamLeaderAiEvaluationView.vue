<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { BaseProgressBar } from '@/components/common/base'
import { BaseToast } from '@/components/common/base/overlay'
import TeamLeaderAiEvaluationMemberListPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationMemberListPanel.vue'
import TeamLeaderAiEvaluationPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationPanel.vue'
import { fetchTlTargets, updateTlEvaluation } from '@/services/teamleader/evaluationApi'

const AVATAR_TONES = ['purple', 'green', 'gold']
const STATUS_MAP = { NO_INPUT: 'not_started', DRAFT: 'in_progress', SUBMITTED: 'submitted' }

const rawTargets = ref([])
const evalPeriodId = ref(null)
const periodInfo = ref(null)

const periodLabel = computed(() => {
  if (!periodInfo.value?.evalYear) return null
  const raw = String(periodInfo.value.evalYear)
  const year = raw.slice(0, 4)
  const month = raw.length >= 6 ? String(parseInt(raw.slice(4), 10)) : null
  const seq = periodInfo.value.evalSequence
  return month
    ? `${year}년 ${month}월 ${seq}차 평가`
    : `${year}년 ${seq}차 평가`
})

const selectedTargetId = ref('')
const guideOpen = ref(false)
const recordingState = ref('idle')
const uploadedFileName = ref('')
const uploadedText = ref('')
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

const evaluationDrafts = reactive({})
const savedDrafts = reactive({})
const submittedEvaluations = reactive({})

function mapTarget(target, index) {
  const evaluationPeriodId = target.evaluationPeriodId ?? null
  return {
    id: `${target.evaluateeId}:${evaluationPeriodId ?? 'none'}`,
    evaluateeId: String(target.evaluateeId),
    evaluationPeriodId,
    name: target.employeeName,
    code: target.employeeCode,
    tier: target.employeeTier,
    scoreHint: target.totalScore != null ? `Overall ${target.totalScore}` : target.employeeTier,
    periodHint: evaluationPeriodId ? '진행중 기간' : '기간 미지정',
    avatar: target.employeeName?.[0] ?? '?',
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
  }
}

onMounted(async () => {
  try {
    const res = await fetchTlTargets()
    const data = res.data.data
    evalPeriodId.value = data.evalPeriodId
    periodInfo.value = {
      evalYear: data.evalYear,
      evalSequence: data.evalSequence,
      startDate: data.startDate,
      endDate: data.endDate,
    }
    rawTargets.value = data.targets.map(mapTarget)
    data.targets.forEach((t) => {
      const targetKey = `${t.evaluateeId}:${t.evaluationPeriodId ?? 'none'}`
      evaluationDrafts[targetKey] = t.evalComment ?? ''
      savedDrafts[targetKey] = t.evalComment ?? ''
      if (t.status === 'SUBMITTED') {
        submittedEvaluations[targetKey] = true
      }
    })
    if (rawTargets.value.length) {
      selectedTargetId.value = rawTargets.value[0].id
    }
  } catch (e) {
    updateFeedback('평가 대상 목록을 불러오지 못했습니다.', 'muted')
  }
})

const memberListItems = computed(() =>
  rawTargets.value.map((target) => {
    const targetId = String(target.id)
    const hasSubmitted = Boolean(submittedEvaluations[targetId])
    const hasEdited = Boolean(evaluationDrafts[targetId])

    let status = 'not_started'
    if (hasSubmitted) status = 'submitted'
    else if (hasEdited) status = 'in_progress'

    return {
      ...target,
      status,
      statusDate: hasSubmitted ? '제출 완료' : hasEdited ? '초안 저장' : '작성 전',
    }
  }),
)

const submittedCount = computed(
  () => memberListItems.value.filter((target) => target.status === 'submitted').length,
)

const evaluationCompletionRate = computed(() => {
  if (!memberListItems.value.length) return 0
  return Math.round((submittedCount.value / memberListItems.value.length) * 100)
})

watch(
  memberListItems,
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
  const target = rawTargets.value.find((item) => String(item.id) === selectedTargetId.value)
  if (!target) return { voiceLabel: '', voiceDescription: '', convertedText: '' }

  return {
    voiceLabel: `${target.name} 음성 초안 작성`,
    voiceDescription: `${target.name} (${target.code}) 평가 내용을 음성으로 작성하고 텍스트로 변환할 수 있습니다.`,
    convertedText: evaluationDrafts[String(target.id)] ?? '',
  }
})

function handleSelectTarget(targetId) {
  selectedTargetId.value = targetId
}

function handleUpdateConvertedText(value) {
  if (!selectedTargetId.value) return
  evaluationDrafts[selectedTargetId.value] = value
}

function updateFeedback(message, tone = 'muted') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = {
    show: true,
    message,
    type: tone === 'muted' ? 'error' : 'success',
  }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2500)
}

function handleCloseEditor() {
  if (!selectedTargetId.value) return
  evaluationDrafts[selectedTargetId.value] = savedDrafts[selectedTargetId.value] ?? ''
  updateFeedback('현재 대상자의 편집 내용을 마지막 저장 기준으로 되돌렸습니다.', 'muted')
}

async function handleSaveDraft() {
  if (!selectedTargetId.value) return

  const currentTarget = rawTargets.value.find((t) => t.id === selectedTargetId.value)
  if (!currentTarget?.evaluationPeriodId) return
  try {
    await updateTlEvaluation(currentTarget.evaluateeId, {
      status: 'DRAFT',
      evaluationPeriodId: currentTarget.evaluationPeriodId,
      evalComment: evaluationDrafts[selectedTargetId.value] || null,
      inputMethod: 'TEXT',
    })
    savedDrafts[selectedTargetId.value] = evaluationDrafts[selectedTargetId.value]
    updateFeedback(`${currentTarget?.name ?? '선택한 대상'} 평가 초안을 임시 저장했습니다.`, 'draft')
  } catch (e) {
    updateFeedback('임시 저장에 실패했습니다.', 'muted')
  }
}

async function handleSubmitEvaluation() {
  if (!selectedTargetId.value) return

  if (submittedEvaluations[selectedTargetId.value]) {
    updateFeedback('이미 제출된 평가입니다.', 'muted')
    return
  }

  const evalComment = evaluationDrafts[selectedTargetId.value]
  if (!evalComment || evalComment.trim().length < 20) {
    updateFeedback('평가 코멘트는 20자 이상 입력해야 합니다.', 'muted')
    return
  }

  const currentTarget = rawTargets.value.find((t) => t.id === selectedTargetId.value)
  if (!currentTarget?.evaluationPeriodId) return
  try {
    await updateTlEvaluation(currentTarget.evaluateeId, {
      status: 'SUBMITTED',
      evaluationPeriodId: currentTarget.evaluationPeriodId,
      evalComment,
      inputMethod: 'TEXT',
    })
    submittedEvaluations[selectedTargetId.value] = true
    updateFeedback(`${currentTarget?.name ?? '선택한 대상'} 평가 내용을 제출했습니다.`, 'submitted')
  } catch (e) {
    if (e.response?.data?.errorCode === 'CONFLICT_008') {
      submittedEvaluations[selectedTargetId.value] = true
      updateFeedback(`${currentTarget?.name ?? '선택한 대상'} 평가는 이미 제출되었습니다.`, 'submitted')
      return
    }
    const msg = e.response?.data?.message ?? '제출에 실패했습니다.'
    updateFeedback(msg, 'muted')
  }
}

function handleVoiceInput() {
  if (!selectedTargetId.value) return
  recordingState.value = recordingState.value === 'recording' ? 'ready' : 'recording'
  if (recordingState.value === 'recording') {
    updateFeedback('음성 인식 중입니다. 다시 누르면 중지합니다.', 'muted')
  } else {
    updateFeedback('음성 초안이 준비되었습니다. 텍스트 변환 버튼으로 편집 영역에 반영할 수 있습니다.', 'draft')
  }
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
  if (!selectedTargetId.value) return

  if (!uploadedText.value) {
    updateFeedback('변환할 음성 또는 업로드 텍스트가 없습니다.', 'muted')
    return
  }

  evaluationDrafts[selectedTargetId.value] = uploadedText.value
  updateFeedback('텍스트 변환 결과를 편집 영역에 반영했습니다.', 'draft')
}

function handleReplayAudio() {
  updateFeedback('다시 듣기는 준비 중입니다.', 'muted')
}

function handleToggleGuide() {
  guideOpen.value = !guideOpen.value
  updateFeedback(guideOpen.value ? '작성 가이드를 열었습니다.' : '작성 가이드를 닫았습니다.', 'muted')
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <section class="teamleader-ai-evaluation-view">
    <section class="teamleader-ai-evaluation-view__progress-card">
      <div class="teamleader-ai-evaluation-view__progress-copy">
        <div>
          <p class="teamleader-ai-evaluation-view__progress-eyebrow">제출 완료 현황</p>
          <strong class="teamleader-ai-evaluation-view__progress-title">
            {{ submittedCount }} / {{ memberListItems.length }}명 제출 완료
          </strong>
        </div>
        <div v-if="periodLabel" class="teamleader-ai-evaluation-view__period-info">
          <span class="teamleader-ai-evaluation-view__period-badge">
            {{ periodLabel }}
          </span>
          <span class="teamleader-ai-evaluation-view__period-dates">
            {{ periodInfo.startDate }} ~ {{ periodInfo.endDate }}
          </span>
        </div>
      </div>
      <BaseProgressBar
        :value="evaluationCompletionRate"
        tone="success"
        size="md"
        label="평가 제출 진행률"
      />
    </section>

    <section class="teamleader-ai-evaluation-view__content">
      <TeamLeaderAiEvaluationMemberListPanel
        :members="memberListItems"
        :selected-id="selectedTargetId"
        @select-member="handleSelectTarget"
      />

      <TeamLeaderAiEvaluationPanel
        :selected-target="selectedTarget"
        :readonly="!!submittedEvaluations[selectedTargetId]"
        :guide-open="guideOpen"
        :recording-state="recordingState"
        :uploaded-file-name="uploadedFileName"
        :action-disabled="!selectedTargetId"
        @update:converted-text="handleUpdateConvertedText"
        @voice-input="handleVoiceInput"
        @file-selected="handleFileSelected"
        @convert-text="handleConvertText"
        @replay-audio="handleReplayAudio"
        @toggle-guide="handleToggleGuide"
        @close="handleCloseEditor"
        @save-draft="handleSaveDraft"
        @submit="handleSubmitEvaluation"
      />
    </section>
    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
  </section>
</template>

<style scoped>
.teamleader-ai-evaluation-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 12px 10px;
  background: var(--color-bg-app);
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}

.teamleader-ai-evaluation-view__progress-card {
  display: grid;
  gap: 10px;
  padding: 14px 18px;
  margin-bottom: 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.teamleader-ai-evaluation-view__progress-copy {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.teamleader-ai-evaluation-view__progress-eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary-500);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
}

.teamleader-ai-evaluation-view__progress-title {
  color: var(--color-primary-800);
  font-size: var(--font-size-base-plus);
  font-weight: var(--font-weight-bold);
}

.teamleader-ai-evaluation-view__period-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.teamleader-ai-evaluation-view__period-badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.teamleader-ai-evaluation-view__period-dates {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.teamleader-ai-evaluation-view__content {
  display: grid;
  grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: stretch;
  min-height: 0;
}

@media (max-width: 1120px) {
  .teamleader-ai-evaluation-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-ai-evaluation-view {
    padding: 12px;
    height: auto;
    min-height: calc(100vh - 80px);
    overflow: auto;
  }

  .teamleader-ai-evaluation-view__progress-copy {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

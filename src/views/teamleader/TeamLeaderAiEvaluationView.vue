<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { BaseFilterTabs, BaseProgressBar } from '@/components/common/base'
import { BaseToast } from '@/components/common/base/overlay'
import ReviewerAppealDetailPanel from '@/components/hr/common/appeal/ReviewerAppealDetailPanel.vue'
import ReviewerAppealListPanel from '@/components/hr/common/appeal/ReviewerAppealListPanel.vue'
import TeamLeaderAiEvaluationMemberListPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationMemberListPanel.vue'
import TeamLeaderAiEvaluationPanel from '@/components/hr/teamleader/qualitative-evaluation/TeamLeaderAiEvaluationPanel.vue'
import { approveTlAppeal, fetchTlAppealDetail, fetchTlAppeals, fetchTlTargets, rejectTlAppeal, updateTlEvaluation } from '@/services/teamleader/evaluationApi'
import { formatEvaluationPeriodLabel } from '@/utils/evaluationPeriod'
import { formatMemberMeta } from '@/utils/hrListFormat'
import { mapStatus, statusToLabel } from '@/utils/evaluationStatus'

const AVATAR_TONES = ['purple', 'green', 'gold']
const STATUS_MAP = { NO_INPUT: 'not_started', DRAFT: 'in_progress', SUBMITTED: 'submitted' }
const activeTab = ref('evaluation')
const modeTabs = [
  { key: 'evaluation', label: '평가 관리' },
  { key: 'appeal', label: '이의신청' },
]
const APPEAL_TYPE_LABEL = {
  SCORE_ERRORS: '점수 오류',
  MISSING_ITEMS: '평가 항목 누락',
  EVALUATION_PROCEDURES: '평가 절차 이의',
  OTHERS: '기타',
}
const APPEAL_STATUS_LABEL = {
  SUBMITTED: '제출',
  RECEIVING: '접수',
  REVIEWING: '검토중',
  COMPLETED: '완료',
}
const REVIEW_RESULT_LABEL = {
  ACKNOWLEDGE: '인용',
  ACKNOWLEDGE_IN_PART: '일부 인용',
  DISMISS: '기각',
}

const rawTargets = ref([])
const evalPeriodId = ref(null)
const periodInfo = ref(null)
const appealSummaries = ref([])
const selectedAppealId = ref(null)
const selectedAppealDetail = ref(null)
const appealActionLoading = ref(false)
const appealReviewing = ref(false)
const appealDraftText = ref('')
const appealDraftInputMethod = ref('TEXT')

function unwrap(response) {
  return response.data?.data ?? response.data
}

function formatShortDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function formatScore(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? `${numeric.toFixed(1)}점` : '-'
}

function formatPeriodText(evalYear, evalSequence) {
  return formatEvaluationPeriodLabel(
    { evalYear, evalSequence },
    { fallback: '평가기간 미지정' },
  )
}

function mapAppealSummary(appeal) {
  return {
    appealId: appeal.appealId,
    appealEmployeeId: appeal.appealEmployeeId,
    evaluationPeriodId: appeal.evaluationPeriodId,
    employeeName: appeal.employeeName ?? '-',
    employeeCode: appeal.employeeCode ?? '',
    departmentName: appeal.departmentName ?? '',
    teamName: appeal.teamName ?? '',
    title: appeal.title ?? '제목 없음',
    content: appeal.content ?? '내용이 없습니다.',
    status: appeal.status ?? 'RECEIVING',
    statusLabel: APPEAL_STATUS_LABEL[appeal.status] ?? (appeal.status ?? '-'),
    appealTypeLabel: APPEAL_TYPE_LABEL[appeal.appealType] ?? (appeal.appealType ?? '-'),
    filedAtLabel: formatShortDate(appeal.filedAt),
    quantScoreLabel: '-',
    firstScoreLabel: formatScore(appeal.firstScore),
    secondScoreLabel: formatScore(appeal.secondScore),
    finalScoreLabel: formatScore(appeal.finalScore),
    periodLabel: formatPeriodText(appeal.evalYear, appeal.evalSequence),
    firstStageComment: '',
    secondStageComment: '',
  }
}

function mapAppealDetail(appeal) {
  if (!appeal) return null
  return {
    appealId: appeal.appealId,
    appealEmployeeId: appeal.appealEmployeeId,
    evaluationPeriodId: appeal.evaluationPeriodId,
    employeeName: appeal.employeeName ?? '-',
    employeeCode: appeal.employeeCode ?? '',
    departmentName: appeal.departmentName ?? '',
    teamName: appeal.teamName ?? '',
    title: appeal.title ?? '제목 없음',
    content: appeal.content ?? '내용이 없습니다.',
    status: appeal.status ?? 'RECEIVING',
    statusLabel: APPEAL_STATUS_LABEL[appeal.status] ?? (appeal.status ?? '-'),
    appealTypeLabel: APPEAL_TYPE_LABEL[appeal.appealType] ?? (appeal.appealType ?? '-'),
    reviewResultLabel: REVIEW_RESULT_LABEL[appeal.reviewResult] ?? '미처리',
    filedAtLabel: formatShortDate(appeal.filedAt),
    reviewedAtLabel: formatShortDate(appeal.reviewedAt),
    quantScoreLabel: '-',
    firstScoreLabel: formatScore(appeal.firstScore),
    secondScoreLabel: formatScore(appeal.secondScore),
    finalScoreLabel: formatScore(appeal.finalScore),
    periodLabel: formatPeriodText(appeal.evalYear, appeal.evalSequence),
    firstStageComment: appeal.firstStageComment ?? '',
    secondStageComment: appeal.secondStageComment ?? '',
  }
}

const periodLabel = computed(() => {
  if (!periodInfo.value?.evalYear) return null
  const label = formatEvaluationPeriodLabel(periodInfo.value, { fallback: null })
  return label ? `${label} 평가` : null
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
const confirmedEvaluations = reactive({})
const draftInputMethods = reactive({})

let speechRecognition = null
let speechTargetId = ''
let speechBaseDraft = ''
let speechFinalText = ''
let stoppingSpeech = false
const APPEAL_SPEECH_KEY = '__appeal__'

function speechRecognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

function mapTarget(target, index) {
  const evaluationPeriodId = target.evaluationPeriodId ?? null
  return {
    id: `${target.evaluateeId}:${evaluationPeriodId ?? 'none'}`,
    evaluateeId: String(target.evaluateeId),
    evaluationPeriodId,
    name: target.employeeName,
    code: target.employeeCode,
    departmentName: target.departmentName ?? '',
    teamName: target.teamName ?? target.departmentName ?? target.team ?? '',
    tier: target.employeeTier,
    firstStageScore: target.firstStageScore ?? null,
    totalScore: target.totalScore ?? null,
    periodHint: evaluationPeriodId ? '진행중 기간' : '기간 미지정',
    avatar: target.employeeName?.[0] ?? '?',
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
  }
}

onMounted(async () => {
  try {
    const res = await fetchTlTargets()
    const data = unwrap(res)
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
      draftInputMethods[targetKey] = t.inputMethod === 'VOICE_STT' ? 'VOICE_STT' : 'TEXT'
      const mapped = mapStatus(t.status)
      if (mapped === 'submitted') submittedEvaluations[targetKey] = true
      if (t.status === 'CONFIRMED') confirmedEvaluations[targetKey] = true
    })
    if (rawTargets.value.length) {
      selectedTargetId.value = rawTargets.value[0].id
    }
  } catch (e) {
    updateFeedback('평가 대상 목록을 불러오지 못했습니다.', 'muted')
  }

  try {
    const res = await fetchTlAppeals()
    const appeals = (unwrap(res) ?? []).map(mapAppealSummary)
    appealSummaries.value = appeals
    if (appeals.length) {
      await handleSelectAppeal(appeals[0].appealId)
    }
  } catch (e) {
    updateFeedback('이의신청 목록을 불러오지 못했습니다.', 'muted')
  }
})

const memberListItems = computed(() =>
  rawTargets.value.map((target) => {
    const targetId = String(target.id)
    const hasConfirmed = Boolean(confirmedEvaluations[targetId])
    const hasSubmitted = Boolean(submittedEvaluations[targetId])
    const hasEdited = Boolean(evaluationDrafts[targetId])

    let status = 'not_started'
    if (hasSubmitted) status = 'submitted'
    else if (hasEdited) status = 'in_progress'

    return {
      ...target,
      meta: formatMemberMeta(target.code, target.departmentName ?? '', target.teamName ?? ''),
      status,
      statusDate: statusToLabel(status, hasConfirmed ? 'CONFIRMED' : hasSubmitted ? 'SUBMITTED' : hasEdited ? 'DRAFT' : 'NO_INPUT'),
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
    expectedScore: target.firstStageScore ?? null,
  }
})

const selectedAppealReviewTarget = computed(() => {
  const detail = selectedAppealDetail.value
  if (!detail) return null
  return {
    voiceLabel: `${detail.employeeName} 이의신청 검토`,
    voiceDescription: `${detail.employeeName} (${detail.employeeCode || '-'})의 1차 평가 내용을 수정한 뒤 제출하면 DL 검토 단계로 넘어갑니다.`,
    convertedText: appealDraftText.value,
    expectedScore: null,
    summaryTitle: '이전 1차 평가 내용',
    summaryComment: detail.firstStageComment || '1차 평가 내용이 없습니다.',
  }
})

const selectedAppealInfo = computed(() => {
  const detail = selectedAppealDetail.value
  if (!detail) return null
  return {
    periodLabel: detail.periodLabel,
    typeLabel: detail.appealTypeLabel,
    title: detail.title,
    content: detail.content,
  }
})

function handleSelectTarget(targetId) {
  if (recordingState.value === 'recording') {
    stopSpeechRecognition()
  }
  selectedTargetId.value = targetId
}

async function handleSelectAppeal(appealId) {
  appealReviewing.value = false
  selectedAppealId.value = appealId
  const summary = appealSummaries.value.find((item) => item.appealId === appealId)
  if (summary) {
    selectedAppealDetail.value = { ...summary }
    appealDraftText.value = summary.firstStageComment || ''
    appealDraftInputMethod.value = 'TEXT'
  }
  try {
    const res = await fetchTlAppealDetail(appealId)
    selectedAppealDetail.value = {
      ...(summary ?? {}),
      ...mapAppealDetail(unwrap(res)),
    }
    appealDraftText.value = selectedAppealDetail.value.firstStageComment || ''
  } catch (e) {
    selectedAppealDetail.value = null
    updateFeedback('이의신청 상세를 불러오지 못했습니다.', 'muted')
  }
}

function handleStartAppealReview() {
  if (!selectedAppealDetail.value) return
  appealDraftText.value = selectedAppealDetail.value.firstStageComment || ''
  appealDraftInputMethod.value = 'TEXT'
  appealReviewing.value = true
}

function handleUpdateAppealDraft(value) {
  appealDraftText.value = value
}

function handleCloseAppealReview() {
  appealDraftText.value = selectedAppealDetail.value?.firstStageComment || ''
  appealDraftInputMethod.value = 'TEXT'
  appealReviewing.value = false
}

async function handleSaveAppealDraft() {
  const detail = selectedAppealDetail.value
  if (!detail?.appealEmployeeId || !detail.evaluationPeriodId) return
  try {
    await updateTlEvaluation(detail.appealEmployeeId, {
      status: 'DRAFT',
      evaluationPeriodId: detail.evaluationPeriodId,
      evalComment: appealDraftText.value || null,
      inputMethod: appealDraftInputMethod.value,
    })
    selectedAppealDetail.value = {
      ...detail,
      firstStageComment: appealDraftText.value,
    }
    updateFeedback('검토 초안을 임시 저장했습니다.', 'draft')
  } catch (e) {
    updateFeedback('검토 초안 저장에 실패했습니다.', 'muted')
  }
}

async function handleSubmitAppealReview() {
  const detail = selectedAppealDetail.value
  if (!selectedAppealId.value || !detail?.appealEmployeeId || !detail.evaluationPeriodId) return
  if (!appealDraftText.value || appealDraftText.value.trim().length < 20) {
    updateFeedback('평가 코멘트는 20자 이상 입력해야 합니다.', 'muted')
    return
  }
  try {
    appealActionLoading.value = true
    await updateTlEvaluation(detail.appealEmployeeId, {
      status: 'SUBMITTED',
      evaluationPeriodId: detail.evaluationPeriodId,
      evalComment: appealDraftText.value,
      inputMethod: appealDraftInputMethod.value,
    })
    await approveTlAppeal(selectedAppealId.value, {})
    const appeals = (unwrap(await fetchTlAppeals()) ?? []).map(mapAppealSummary)
    appealSummaries.value = appeals
    selectedAppealDetail.value = null
    appealReviewing.value = false
    selectedAppealId.value = appeals[0]?.appealId ?? null
    if (selectedAppealId.value) {
      await handleSelectAppeal(selectedAppealId.value)
    }
    updateFeedback('검토 내용을 제출하고 DL 검토 단계로 전달했습니다.', 'submitted')
  } catch (e) {
    updateFeedback('이의신청 처리에 실패했습니다.', 'muted')
  } finally {
    appealActionLoading.value = false
  }
}

async function handleRejectAppeal() {
  if (!selectedAppealId.value) return
  try {
    appealActionLoading.value = true
    await rejectTlAppeal(selectedAppealId.value, { reason: '팀리더 단계에서 기각되었습니다.' })
    const appeals = (unwrap(await fetchTlAppeals()) ?? []).map(mapAppealSummary)
    appealSummaries.value = appeals
    selectedAppealDetail.value = null
    appealReviewing.value = false
    selectedAppealId.value = appeals[0]?.appealId ?? null
    if (selectedAppealId.value) {
      await handleSelectAppeal(selectedAppealId.value)
    }
    updateFeedback('이의신청을 기각 처리했습니다.', 'submitted')
  } catch (e) {
    updateFeedback('이의신청 처리에 실패했습니다.', 'muted')
  } finally {
    appealActionLoading.value = false
  }
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
  if (submittedEvaluations[selectedTargetId.value]) {
    updateFeedback('이미 제출된 평가는 수정할 수 없습니다.', 'muted')
    return
  }

  const currentTarget = rawTargets.value.find((t) => t.id === selectedTargetId.value)
  if (!currentTarget?.evaluationPeriodId) return
  try {
    await updateTlEvaluation(currentTarget.evaluateeId, {
      status: 'DRAFT',
      evaluationPeriodId: currentTarget.evaluationPeriodId,
      evalComment: evaluationDrafts[selectedTargetId.value] || null,
      inputMethod: draftInputMethods[selectedTargetId.value] ?? 'TEXT',
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
      inputMethod: draftInputMethods[selectedTargetId.value] ?? 'TEXT',
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

function stopSpeechRecognition() {
  if (!speechRecognition) return
  stoppingSpeech = true
  speechRecognition.stop()
}

function ensureSpeechRecognition() {
  if (speechRecognition) return speechRecognition

  const Ctor = speechRecognitionCtor()
  if (!Ctor) return null

  speechRecognition = new Ctor()
  speechRecognition.lang = 'ko-KR'
  speechRecognition.continuous = true
  speechRecognition.interimResults = true

  speechRecognition.onresult = (event) => {
    let interimText = ''

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0]?.transcript?.trim()
      if (!transcript) continue
      if (event.results[index].isFinal) {
        speechFinalText = [speechFinalText, transcript].filter(Boolean).join(' ').trim()
      } else {
        interimText = [interimText, transcript].filter(Boolean).join(' ').trim()
      }
    }

    const composed = [speechBaseDraft, speechFinalText, interimText].filter(Boolean).join(' ').trim()
    if (speechTargetId === APPEAL_SPEECH_KEY) {
      appealDraftText.value = composed
    } else if (speechTargetId) {
      evaluationDrafts[speechTargetId] = composed
    }
  }

  speechRecognition.onerror = (event) => {
    if (event.error === 'aborted') return
    recordingState.value = 'idle'
    updateFeedback(`음성 인식에 실패했습니다. (${event.error})`, 'muted')
  }

  speechRecognition.onend = () => {
    const hasTranscript = speechFinalText.trim().length > 0
    recordingState.value = hasTranscript ? 'ready' : 'idle'

    if (speechTargetId === APPEAL_SPEECH_KEY && hasTranscript) {
      appealDraftInputMethod.value = 'VOICE_STT'
      updateFeedback('음성 초안을 검토 편집 영역에 반영했습니다.', 'draft')
    } else if (speechTargetId && hasTranscript) {
      draftInputMethods[speechTargetId] = 'VOICE_STT'
      updateFeedback('음성 초안을 편집 영역에 바로 반영했습니다.', 'draft')
    } else if (!stoppingSpeech) {
      updateFeedback('음성 입력 결과가 없습니다.', 'muted')
    }

    stoppingSpeech = false
  }

  return speechRecognition
}

function handleVoiceInput() {
  if (appealReviewing.value) {
    const recognizer = ensureSpeechRecognition()
    if (!recognizer) {
      updateFeedback('현재 브라우저는 음성 인식을 지원하지 않습니다.', 'muted')
      return
    }
    if (recordingState.value === 'recording') {
      stopSpeechRecognition()
      return
    }
    speechTargetId = APPEAL_SPEECH_KEY
    speechBaseDraft = (appealDraftText.value ?? '').trim()
    speechFinalText = ''
    stoppingSpeech = false
    uploadedText.value = ''
    uploadedFileName.value = ''
    recordingState.value = 'recording'
    try {
      recognizer.start()
      updateFeedback('이의신청 검토 음성 인식 중입니다.', 'draft')
    } catch {
      updateFeedback('음성 인식을 시작하지 못했습니다.', 'muted')
    }
    return
  }

  if (!selectedTargetId.value) return
  if (submittedEvaluations[selectedTargetId.value]) {
    updateFeedback('제출 완료된 평가는 수정할 수 없습니다.', 'muted')
    return
  }

  if (recordingState.value === 'recording') {
    stopSpeechRecognition()
    return
  }

  const recognizer = ensureSpeechRecognition()
  if (!recognizer) {
    updateFeedback('현재 브라우저는 음성 인식을 지원하지 않습니다.', 'muted')
    return
  }

  speechTargetId = selectedTargetId.value
  speechBaseDraft = (evaluationDrafts[selectedTargetId.value] ?? '').trim()
  speechFinalText = ''
  stoppingSpeech = false
  uploadedText.value = ''
  uploadedFileName.value = ''
  recordingState.value = 'recording'

  try {
    recognizer.start()
    updateFeedback('음성 인식 중입니다. 다시 누르면 중지합니다.', 'draft')
  } catch {
    updateFeedback('음성 인식을 시작하지 못했습니다.', 'muted')
  }
}

async function handleFileSelected(file) {
  if (!file) {
    return
  }

  uploadedFileName.value = file.name

  if (file.type.startsWith('text/') || /\.(txt|md|log)$/i.test(file.name)) {
    uploadedText.value = await file.text()
    if (appealReviewing.value) {
      appealDraftInputMethod.value = 'TEXT'
    } else {
      draftInputMethods[selectedTargetId.value] = 'TEXT'
    }
    updateFeedback(`${file.name} 파일을 불러왔습니다. 텍스트 변환 버튼으로 초안에 반영하세요.`, 'draft')
    return
  }

  uploadedText.value = `${file.name} 파일이 선택되었습니다. 실제 변환은 후속 API 연동 단계에서 지원됩니다.`
  updateFeedback('현재는 텍스트 계열 파일을 중심으로 변환을 지원합니다.', 'muted')
}

function handleConvertText() {
  if (!selectedTargetId.value && !appealReviewing.value) return

  if (!uploadedText.value) {
    updateFeedback('변환할 음성 또는 업로드 텍스트가 없습니다.', 'muted')
    return
  }

  if (appealReviewing.value) {
    appealDraftText.value = uploadedText.value
    appealDraftInputMethod.value = 'TEXT'
  } else {
    evaluationDrafts[selectedTargetId.value] = uploadedText.value
    draftInputMethods[selectedTargetId.value] = 'TEXT'
  }
  updateFeedback('텍스트 변환 결과를 편집 영역에 반영했습니다.', 'draft')
}

function handleReplayAudio() {
  updateFeedback('다시 듣기는 준비 중입니다.', 'muted')
}

function handleToggleGuide() {
  guideOpen.value = !guideOpen.value
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
  if (speechRecognition) {
    speechRecognition.onresult = null
    speechRecognition.onerror = null
    speechRecognition.onend = null
    speechRecognition.abort()
  }
})
</script>

<template>
  <section class="teamleader-ai-evaluation-view">
    <BaseFilterTabs
      v-model="activeTab"
      :items="modeTabs"
      variant="chip"
      size="md"
      class="teamleader-ai-evaluation-view__tabs"
    />

    <section v-if="activeTab === 'evaluation'" class="teamleader-ai-evaluation-view__content">
      <section class="teamleader-ai-evaluation-view__progress-card teamleader-ai-evaluation-view__progress-card--full">
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
        :action-disabled="!selectedTargetId || !!submittedEvaluations[selectedTargetId]"
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

    <section v-else class="teamleader-ai-evaluation-view__appeal-content">
      <ReviewerAppealListPanel
        :appeals="appealSummaries"
        :selected-id="selectedAppealId"
        role-label="TL"
        @select="handleSelectAppeal"
      />
      <template v-if="appealReviewing">
        <TeamLeaderAiEvaluationPanel
          :selected-target="selectedAppealReviewTarget ?? { voiceLabel: '', voiceDescription: '', convertedText: '' }"
          :appeal-info="selectedAppealInfo"
          progress-label="이의신청 검토 작성 현황"
          :readonly="false"
          :guide-open="guideOpen"
          :recording-state="recordingState"
          :uploaded-file-name="uploadedFileName"
          :action-disabled="appealActionLoading || !selectedAppealReviewTarget"
          @update:converted-text="handleUpdateAppealDraft"
          @voice-input="handleVoiceInput"
          @file-selected="handleFileSelected"
          @convert-text="handleConvertText"
          @replay-audio="handleReplayAudio"
          @toggle-guide="handleToggleGuide"
          @close="handleCloseAppealReview"
          @save-draft="handleSaveAppealDraft"
          @submit="handleSubmitAppealReview"
        />
      </template>
      <ReviewerAppealDetailPanel
        v-else
        :detail="selectedAppealDetail"
        role-label="TL"
        action-mode="tl"
        :loading="appealActionLoading"
        @review="handleStartAppealReview"
        @reject="handleRejectAppeal"
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
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.teamleader-ai-evaluation-view__progress-card--full {
  grid-column: 1 / -1;
  margin-bottom: 12px;
}

.teamleader-ai-evaluation-view__tabs {
  align-self: flex-start;
  margin-bottom: 12px;
  position: sticky;
  top: 0;
  z-index: 2;
  padding-bottom: 4px;
  background: var(--color-bg-app);
}

.teamleader-ai-evaluation-view__tabs :deep(.base-filter-tabs__count) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
}

.teamleader-ai-evaluation-view__tabs :deep(.base-filter-tabs__item:nth-child(2)) {
  border-color: #f3c3cb;
  color: #c24157;
  background: #fff5f6;
}

.teamleader-ai-evaluation-view__tabs :deep(.base-filter-tabs__item:nth-child(2) .base-filter-tabs__count) {
  background: rgba(194, 65, 87, 0.12);
  color: #c24157;
}

.teamleader-ai-evaluation-view__tabs :deep(.base-filter-tabs__item:nth-child(2).base-filter-tabs__item--active) {
  background: #ffe7eb;
  border-color: #e88998;
  color: #a61d38;
}

.teamleader-ai-evaluation-view__tabs :deep(.base-filter-tabs__item:nth-child(2).base-filter-tabs__item--active .base-filter-tabs__count) {
  background: #c24157;
  color: #fff;
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

.teamleader-ai-evaluation-view__appeal-content {
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

  .teamleader-ai-evaluation-view__appeal-content {
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

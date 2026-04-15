<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import EvaluationGuideModal from '@/components/hr/common/evaluation/EvaluationGuideModal.vue'
import DepartmentLeaderFirstEvaluationSummary from './DepartmentLeaderFirstEvaluationSummary.vue'
import EvalDetailLayout from '@/components/hr/common/evaluation/EvalDetailLayout.vue'

const props = defineProps({
  member: { type: Object, default: null },
  readonly: { type: Boolean, default: false },
  appealInfo: { type: Object, default: null },
  progressLabel: { type: String, default: '2차 평가 작성 현황' },
  submitLabel: { type: String, default: '최종 제출' },
})

const emit = defineEmits(['save', 'submit'])

const draftText = ref('')
const guideOpen = ref(false)
const recordingState = ref('idle')
const uploadedFileName = ref('')
const uploadedText = ref('')
const inputMethod = ref('TEXT')

let speechRecognition = null
let speechBaseDraft = ''
let speechFinalText = ''
let stoppingSpeech = false

function speechRecognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

watch(
  () => props.member,
  (member) => {
    draftText.value = member?.secondEvaluationDraft ?? ''
    guideOpen.value = false
    recordingState.value = 'idle'
    uploadedFileName.value = ''
    uploadedText.value = ''
    inputMethod.value = 'TEXT'
  },
  { immediate: true },
)

const canSubmit = computed(() => {
  const length = draftText.value.trim().length
  return length === 0 || length >= 20
})

function handleVoiceInput() {
  if (props.readonly) return

  if (recordingState.value === 'recording') {
    stopSpeechRecognition()
    return
  }

  const recognizer = ensureSpeechRecognition()
  if (!recognizer) return

  speechBaseDraft = draftText.value.trim()
  speechFinalText = ''
  stoppingSpeech = false
  uploadedText.value = ''
  uploadedFileName.value = ''
  recordingState.value = 'recording'

  try {
    recognizer.start()
  } catch {
    recordingState.value = 'idle'
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

    draftText.value = [speechBaseDraft, speechFinalText, interimText].filter(Boolean).join(' ').trim()
  }

  speechRecognition.onerror = () => {
    recordingState.value = 'idle'
  }

  speechRecognition.onend = () => {
    const hasTranscript = speechFinalText.trim().length > 0
    recordingState.value = hasTranscript ? 'ready' : 'idle'
    if (hasTranscript) {
      inputMethod.value = 'VOICE_STT'
    }
    stoppingSpeech = false
  }

  return speechRecognition
}

async function handleFileChange(file) {
  if (!file) return
  uploadedFileName.value = file.name
  if (file.type.startsWith('text/') || /\.(txt|md|log)$/i.test(file.name)) {
    uploadedText.value = await file.text()
    inputMethod.value = 'TEXT'
    return
  }
  uploadedText.value = `${file.name} 파일이 선택되었습니다. 실제 변환은 후속 API 연동 단계에서 지원됩니다.`
}

function handleConvertText() {
  if (!uploadedText.value) return
  draftText.value = uploadedText.value
  inputMethod.value = 'TEXT'
}

onBeforeUnmount(() => {
  if (speechRecognition) {
    speechRecognition.onresult = null
    speechRecognition.onerror = null
    speechRecognition.onend = null
    speechRecognition.abort()
  }
})
</script>

<template>
  <EvalDetailLayout
    v-if="member"
    :panel-props="{
      title: `${member.name} 2차 평가 작성`,
      description: `${member.name} (${member.code}) 2차 평가 내용을 음성으로 작성하고 텍스트로 변환할 수 있습니다.`,
      modelValue: draftText,
      noticeText: '팀리더 1차 평가 내용은 참고 자료입니다. 추가 보완 의견이 있을 때만 2차 평가 문장을 입력하고, 없으면 비워둔 채 제출할 수 있습니다.',
      editorPlaceholder: '추가 보완 의견이 있을 때만 입력하세요. 비워 두면 1차 점수를 그대로 유지합니다.',
      recordingState,
      uploadedFileName,
      showGuideButton: true,
      guideButtonLabel: '작성 가이드',
      guideActive: guideOpen,
      readonly,
    }"
    @update:model-value="draftText = $event"
    @voice-input="handleVoiceInput"
    @file-selected="handleFileChange"
    @convert-text="handleConvertText"
    @toggle-guide="guideOpen = !guideOpen"
  >
    <template #summary>
      <div class="eval-form__summary-stack">
        <DepartmentLeaderFirstEvaluationSummary :summary="member.firstEvaluationSummary" />
        <section v-if="appealInfo" class="eval-form__appeal-card">
          <div class="eval-form__appeal-meta">
            <div class="eval-form__appeal-meta-item">
              <p class="eval-form__appeal-eyebrow">대상 평가기간</p>
              <strong>{{ appealInfo.periodLabel }}</strong>
            </div>
            <div class="eval-form__appeal-meta-item">
              <p class="eval-form__appeal-eyebrow">이의 유형</p>
              <strong>{{ appealInfo.typeLabel }}</strong>
            </div>
          </div>
          <div class="eval-form__appeal-body">
            <p class="eval-form__appeal-eyebrow">이의신청 내용</p>
            <strong>{{ appealInfo.title }}</strong>
            <p class="eval-form__appeal-copy">{{ appealInfo.content }}</p>
          </div>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="eval-form__actions">
        <span
          class="eval-form__submit-hint"
          :class="{ 'eval-form__submit-hint--submitted': readonly }"
        >
          <strong>{{ progressLabel }}</strong>
          <span>{{ `${draftText.trim().length}자 입력 완료` }}</span>
          <span v-if="member.expectedScore != null" class="eval-form__score-hint">
            예상 점수: {{ member.expectedScore }}점
          </span>
        </span>
        <template v-if="!readonly">
          <button class="eval-form__btn eval-form__btn--save" @click="emit('save', { draftText, inputMethod })">
            임시저장
          </button>
          <button
            class="eval-form__btn eval-form__btn--submit"
            :disabled="!canSubmit"
            @click="emit('submit', { draftText, inputMethod })"
          >
            {{ submitLabel }}
          </button>
        </template>
      </div>
    </template>
  </EvalDetailLayout>

  <EvaluationGuideModal :open="guideOpen" @close="guideOpen = false" />

  <EvalDetailLayout
    v-if="!member"
    :empty="true"
    empty-title="팀원을 선택하세요."
    empty-description="좌측 목록에서 팀원을 선택하면 2차 평가 상세가 표시됩니다."
  />
</template>

<style scoped>
.eval-form__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 4px;
  flex-wrap: wrap;
}

.eval-form__summary-stack {
  display: grid;
  gap: 14px;
}

.eval-form__appeal-card {
  display: grid;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid #e8e2ff;
  background: #faf8ff;
}

.eval-form__appeal-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.eval-form__appeal-meta-item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--color-border-soft);
}

.eval-form__appeal-eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.eval-form__appeal-body {
  display: grid;
  gap: 8px;
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--color-border-soft);
}

.eval-form__appeal-copy {
  margin: 0;
  line-height: 1.7;
  color: var(--color-primary-800);
  white-space: pre-wrap;
}

.eval-form__submit-hint {
  flex: 1;
  display: grid;
  gap: 4px;
  color: #1d7f5f;
  text-align: left;
}

.eval-form__submit-hint--submitted {
  font-weight: var(--font-weight-semibold);
}

.eval-form__submit-hint strong {
  font-size: 15px;
}

.eval-form__submit-hint span {
  font-size: 13px;
}

.eval-form__score-hint {
  color: var(--color-primary-700);
  font-weight: var(--font-weight-semibold);
}

.eval-form__btn {
  height: 42px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
}

.eval-form__btn:hover {
  opacity: 0.85;
}

.eval-form__btn--save {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-default);
  border: 1px solid var(--color-border-default);
}

.eval-form__btn--submit {
  background: var(--color-primary-600);
  color: #fff;
}

.eval-form__btn--submit:disabled {
  background: var(--color-border-default);
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 1;
}

@media (max-width: 900px) {
  .eval-form__appeal-meta {
    grid-template-columns: 1fr;
  }
}
</style>

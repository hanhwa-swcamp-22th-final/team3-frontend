<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AiEvaluationFormPanel from '@/components/hr/common/evaluation/AiEvaluationFormPanel.vue'
import EvaluationGuideModal from '@/components/hr/common/evaluation/EvaluationGuideModal.vue'
import DepartmentLeaderFirstEvaluationSummary from './DepartmentLeaderFirstEvaluationSummary.vue'

const props = defineProps({
  member: { type: Object, default: null },
  readonly: { type: Boolean, default: false },
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

const canSubmit = computed(() => draftText.value.trim().length >= 20)

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
  <AiEvaluationFormPanel
    v-if="member"
    class="department-evaluation-form-panel"
    :title="`${member.name} 2차 평가 작성`"
    :description="`${member.name} (${member.code}) 2차 평가 내용을 음성으로 작성하고 텍스트로 변환할 수 있습니다.`"
    :model-value="draftText"
    :notice-text="'팀리더 1차 평가 내용과 AI 권고 점수는 참고 자료입니다. 음성 입력 또는 파일 업로드로 초안을 만든 뒤 아래 편집 영역에서 2차 평가 문장을 직접 완성하세요.'"
    :editor-placeholder="'2차 평가 의견을 입력하세요. 1차 평가 내용 검토, 종합 판단, 보완 의견이 드러나도록 작성합니다.'"
    :recording-state="recordingState"
    :uploaded-file-name="uploadedFileName"
    :show-guide-button="true"
    :guide-button-label="'작성 가이드'"
    :guide-active="guideOpen"
    :readonly="readonly"
    @update:model-value="draftText = $event"
    @voice-input="handleVoiceInput"
    @file-selected="handleFileChange"
    @convert-text="handleConvertText"
    @toggle-guide="guideOpen = !guideOpen"
  >
    <template #summary>
      <DepartmentLeaderFirstEvaluationSummary :summary="member.firstEvaluationSummary" />
    </template>

    <template #footer>
      <div class="eval-form__actions">
        <span
          class="eval-form__submit-hint"
          :class="{ 'eval-form__submit-hint--submitted': readonly }"
        >
          <strong>2차 평가 작성 현황</strong>
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
            최종 제출
          </button>
        </template>
      </div>
    </template>
  </AiEvaluationFormPanel>

  <EvaluationGuideModal :open="guideOpen" @close="guideOpen = false" />

  <section v-if="!member" class="eval-form eval-form--empty">
    <p>좌측 목록에서 팀원을 선택하세요.</p>
  </section>
</template>

<style scoped>
.eval-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.eval-form--empty {
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

.department-evaluation-form-panel {
  overflow-y: auto;
  min-height: 600px;
  max-height: calc(100vh - 200px);
}

.eval-form__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 4px;
  flex-wrap: wrap;
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
</style>

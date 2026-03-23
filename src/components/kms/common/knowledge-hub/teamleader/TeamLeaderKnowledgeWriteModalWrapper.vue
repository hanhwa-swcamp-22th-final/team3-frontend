<script setup>
import { computed, reactive, ref } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({ categories: [], equipments: [] }),
  },
})

const emit = defineEmits(['close', 'submit', 'draft'])

const form = reactive({
  title: '',
  category: '정밀가공',
  equipment: 'MCH-01',
  summary: '',
  content: '',
})

const isRecording = ref(false)
const speechMessage = ref('음성 인식으로 본문을 빠르게 작성할 수 있습니다.')

const supportsSpeechRecognition = computed(() => {
  if (typeof window === 'undefined') {
    return false
  }

  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
})

function createRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'ko-KR'
  recognition.continuous = true
  recognition.interimResults = true
  return recognition
}

function toggleVoiceInput() {
  if (!supportsSpeechRecognition.value) {
    speechMessage.value = '현재 브라우저에서는 음성 인식을 지원하지 않습니다.'
    return
  }

  if (isRecording.value) {
    window.__teamLeaderKnowledgeRecognition?.stop()
    return
  }

  const recognition = createRecognition()
  if (!recognition) {
    speechMessage.value = '음성 인식 준비에 실패했습니다.'
    return
  }

  let finalTranscript = ''
  speechMessage.value = '음성을 듣고 있습니다. 말씀하신 내용이 본문에 반영됩니다.'
  isRecording.value = true
  window.__teamLeaderKnowledgeRecognition = recognition

  recognition.onresult = (event) => {
    let interimTranscript = ''

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0].transcript

      if (event.results[index].isFinal) {
        finalTranscript += `${transcript.trim()}\n`
      } else {
        interimTranscript += transcript
      }
    }

    form.content = `${finalTranscript}${interimTranscript}`.trim()
  }

  recognition.onerror = () => {
    speechMessage.value = '음성 인식 중 오류가 발생했습니다. 다시 시도해 주세요.'
    isRecording.value = false
  }

  recognition.onend = () => {
    if (isRecording.value) {
      speechMessage.value = '음성 입력이 종료되었습니다. 필요하면 다시 시작해 주세요.'
    }
    isRecording.value = false
  }

  recognition.start()
}

function resetForm() {
  form.title = ''
  form.category = props.options.categories[0] ?? ''
  form.equipment = props.options.equipments[0] ?? ''
  form.summary = ''
  form.content = ''
  speechMessage.value = '음성 인식으로 본문을 빠르게 작성할 수 있습니다.'
}

function submitForm() {
  emit('submit', { ...form })
  resetForm()
}

function saveDraft() {
  emit('draft', { ...form })
  resetForm()
}
</script>

<template>
  <BaseFormModal
    eyebrow="Knowledge Writer"
    title="지식 작성"
    width="760px"
    confirm-text="등록"
    :show-draft-button="true"
    draft-text="임시 저장"
    @close="emit('close')"
    @cancel="emit('close')"
    @draft="saveDraft"
    @confirm="submitForm"
  >
    <div class="write-modal__grid">
      <label>
        제목
        <input v-model="form.title" type="text" placeholder="문서 제목을 입력하세요" />
      </label>
      <label>
        카테고리
        <select v-model="form.category">
          <option v-for="category in options.categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </label>
      <label>
        설비
        <select v-model="form.equipment">
          <option v-for="equipment in options.equipments" :key="equipment" :value="equipment">{{ equipment }}</option>
        </select>
      </label>
    </div>

    <label class="write-modal__full">
      요약
      <textarea v-model="form.summary" rows="3" placeholder="핵심 요약을 입력하세요"></textarea>
    </label>

    <label class="write-modal__full">
      <div class="write-modal__field-head">
        <span>본문</span>
        <button
          type="button"
          class="write-modal__voice-button"
          :class="{ 'write-modal__voice-button--active': isRecording }"
          @click="toggleVoiceInput"
        >
          {{ isRecording ? '음성 입력 종료' : '음성으로 작성' }}
        </button>
      </div>
      <p class="write-modal__voice-message">{{ speechMessage }}</p>
      <textarea v-model="form.content" rows="8" placeholder="작업 조건, 문제 원인, 해결 방법을 정리하세요"></textarea>
    </label>
  </BaseFormModal>
</template>

<style scoped>
.write-modal__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
}

input,
select,
textarea {
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 12px 14px;
  font: inherit;
  color: var(--color-text-default);
  resize: vertical;
}

.write-modal__full {
  grid-column: 1 / -1;
}

.write-modal__field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.write-modal__voice-button {
  height: 34px;
  padding: 0 12px;
  border: 1px solid var(--color-primary-200);
  border-radius: 999px;
  background: #f6f3ff;
  color: var(--color-primary-700);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.write-modal__voice-button--active {
  border-color: #ff7a98;
  background: #fff1f4;
  color: #db2952;
}

.write-modal__voice-message {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

@media (max-width: 720px) {
  .write-modal__grid {
    grid-template-columns: 1fr;
  }

  .write-modal__field-head {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

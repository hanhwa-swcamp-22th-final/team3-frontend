<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({ categories: [], equipments: [] }),
  },
})

const emit = defineEmits(['close', 'submit'])

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

function submitForm() {
  emit('submit', { ...form })
  form.title = ''
  form.category = props.options.categories[0] ?? ''
  form.equipment = props.options.equipments[0] ?? ''
  form.summary = ''
  form.content = ''
  speechMessage.value = '음성 인식으로 본문을 빠르게 작성할 수 있습니다.'
}
</script>

<template>
  <div class="write-modal">
    <div class="write-modal__backdrop" @click="emit('close')"></div>
    <section class="write-modal__dialog">
      <div class="write-modal__head">
        <div>
          <p class="write-modal__eyebrow">Knowledge Writer</p>
          <h2>지식 작성</h2>
        </div>
        <button type="button" class="write-modal__close" @click="emit('close')">×</button>
      </div>

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

      <div class="write-modal__actions">
        <button type="button" class="write-modal__ghost" @click="emit('close')">취소</button>
        <button type="button" class="write-modal__primary" @click="submitForm">등록</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.write-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.write-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(14, 12, 31, 0.48);
}

.write-modal__dialog {
  position: relative;
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 22px;
  background: #fff;
  padding: 24px;
  display: grid;
  gap: 18px;
  box-shadow: 0 30px 80px rgba(20, 15, 60, 0.24);
}

.write-modal__head,
.write-modal__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.write-modal__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.write-modal__head h2 {
  margin-top: 6px;
  font-size: 28px;
  color: var(--color-primary-800);
}

.write-modal__close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f4f2ff;
  color: var(--color-primary-700);
  font-size: 24px;
  cursor: pointer;
}

.write-modal__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.write-modal label {
  display: grid;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.write-modal input,
.write-modal select,
.write-modal textarea {
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

.write-modal__ghost,
.write-modal__primary {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.write-modal__ghost {
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
}

.write-modal__primary {
  border: none;
  background: var(--color-primary-700);
  color: #fff;
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

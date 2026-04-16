import { computed, onBeforeUnmount, ref } from 'vue'

export function useSpeechRecognition(options = {}) {
  const {
    getText = () => '',
    setText = () => {},
    idleMessage = '음성 인식으로 본문을 빠르게 작성할 수 있습니다.',
    listeningMessage = '음성을 듣고 있습니다. 말씀하신 내용이 본문에 반영됩니다.',
    endedMessage = '음성 입력이 종료되었습니다. 필요하면 다시 시작해 주세요.',
    errorMessageText = '음성 인식 중 오류가 발생했습니다. 다시 시도해 주세요.',
    unsupportedMessage = '현재 브라우저에서는 음성 인식을 지원하지 않습니다.',
  } = options

  const isRecording = ref(false)
  const speechMessage = ref(idleMessage)

  let recognition = null
  let baseText = ''
  let finalTranscript = ''

  const supportsSpeechRecognition = computed(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  })

  function createRecognition() {
    if (typeof window === 'undefined') {
      return null
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      return null
    }

    const recognizer = new SpeechRecognition()
    recognizer.lang = 'ko-KR'
    recognizer.continuous = true
    recognizer.interimResults = true
    return recognizer
  }

  function resetMessage() {
    speechMessage.value = idleMessage
  }

  function stopVoiceInput() {
    if (!recognition) {
      isRecording.value = false
      return
    }

    recognition.stop()
  }

  function startVoiceInput() {
    if (!supportsSpeechRecognition.value) {
      speechMessage.value = unsupportedMessage
      return
    }

    recognition = createRecognition()
    if (!recognition) {
      speechMessage.value = errorMessageText
      return
    }

    baseText = (getText() ?? '').trim()
    finalTranscript = ''
    isRecording.value = true
    speechMessage.value = listeningMessage

    recognition.onresult = (event) => {
      let interimTranscript = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript.trim()

        if (!transcript) {
          continue
        }

        if (event.results[index].isFinal) {
          finalTranscript = [finalTranscript, transcript].filter(Boolean).join(' ').trim()
        } else {
          interimTranscript = [interimTranscript, transcript].filter(Boolean).join(' ').trim()
        }
      }

      setText([baseText, finalTranscript, interimTranscript].filter(Boolean).join(' ').trim())
    }

    recognition.onerror = () => {
      speechMessage.value = errorMessageText
      isRecording.value = false
      recognition = null
    }

    recognition.onend = () => {
      isRecording.value = false
      speechMessage.value = endedMessage
      recognition = null
    }

    recognition.start()
  }

  function toggleVoiceInput() {
    if (isRecording.value) {
      stopVoiceInput()
      return
    }

    startVoiceInput()
  }

  onBeforeUnmount(() => {
    if (!recognition) {
      return
    }

    recognition.onresult = null
    recognition.onerror = null
    recognition.onend = null
    recognition.abort()
    recognition = null
  })

  return {
    isRecording,
    speechMessage,
    supportsSpeechRecognition,
    toggleVoiceInput,
    stopVoiceInput,
    resetMessage,
  }
}

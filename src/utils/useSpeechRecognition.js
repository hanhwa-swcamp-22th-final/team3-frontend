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
  const speechTone = ref('idle')

  let recognition = null
  let baseText = ''
  let finalTranscript = ''
  let errorOccurred = false
  let stoppedByUser = false

  function getSpeechRecognitionConstructor() {
    if (typeof window === 'undefined') {
      return null
    }

    return window.SpeechRecognition || window.webkitSpeechRecognition || null
  }

  function resolveSpeechErrorMessage(errorCode) {
    switch (errorCode) {
      case 'not-allowed':
      case 'service-not-allowed':
        return '마이크 권한이 허용되지 않았습니다. 브라우저의 마이크 권한을 확인해 주세요.'
      case 'audio-capture':
        return '마이크를 찾을 수 없습니다. 입력 장치를 확인한 뒤 다시 시도해 주세요.'
      case 'no-speech':
        return '음성이 감지되지 않았습니다. 마이크 상태를 확인하고 다시 시도해 주세요.'
      case 'network':
        return '음성 인식 서비스 연결에 실패했습니다. 네트워크 상태를 확인해 주세요.'
      case 'aborted':
        return stoppedByUser
          ? '음성 입력이 종료되었습니다. 필요하면 다시 시작해 주세요.'
          : '음성 입력이 중단되었습니다. 다시 시도해 주세요.'
      default:
        return errorMessageText
    }
  }

  const supportsSpeechRecognition = computed(() => {
    return Boolean(getSpeechRecognitionConstructor())
  })

  function createRecognition() {
    if (recognition) {
      return recognition
    }

    const SpeechRecognition = getSpeechRecognitionConstructor()
    if (!SpeechRecognition) {
      return null
    }

    recognition = new SpeechRecognition()
    recognition.lang = 'ko-KR'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      isRecording.value = true
      speechMessage.value = listeningMessage
      speechTone.value = 'active'
    }

    recognition.onresult = (event) => {
      let interimTranscript = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript?.trim()

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

    recognition.onerror = (event) => {
      errorOccurred = true
      speechMessage.value = resolveSpeechErrorMessage(event?.error)
      speechTone.value = event?.error === 'aborted' && stoppedByUser ? 'ended' : 'error'
      isRecording.value = false
    }

    recognition.onend = () => {
      isRecording.value = false

      if (finalTranscript.trim()) {
        setText([baseText, finalTranscript].filter(Boolean).join(' ').trim())
      }

      if (!errorOccurred) {
        speechMessage.value = finalTranscript.trim()
          ? endedMessage
          : '음성 입력 결과가 없습니다. 마이크 상태를 확인하고 다시 시도해 주세요.'
        speechTone.value = finalTranscript.trim() ? 'ended' : 'idle'
      }

      stoppedByUser = false
    }

    return recognition
  }

  function resetMessage() {
    speechMessage.value = idleMessage
    speechTone.value = 'idle'
  }

  function stopVoiceInput() {
    if (!recognition) {
      isRecording.value = false
      return
    }

    stoppedByUser = true
    recognition.stop()
  }

  function startVoiceInput() {
    if (!supportsSpeechRecognition.value) {
      speechMessage.value = unsupportedMessage
      speechTone.value = 'error'
      return
    }

    const recognizer = createRecognition()
    if (!recognizer) {
      speechMessage.value = errorMessageText
      speechTone.value = 'error'
      return
    }

    baseText = (getText() ?? '').trim()
    finalTranscript = ''
    errorOccurred = false
    stoppedByUser = false
    isRecording.value = false
    speechMessage.value = '마이크 권한과 음성 인식을 준비하고 있습니다.'
    speechTone.value = 'active'

    try {
      recognizer.start()
    } catch (error) {
      errorOccurred = true
      isRecording.value = false
      speechMessage.value =
        error?.name === 'InvalidStateError'
          ? '음성 입력이 이미 시작되어 있습니다. 잠시 후 다시 시도해 주세요.'
          : errorMessageText
      speechTone.value = 'error'
    }
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
    recognition.onstart = null
    recognition.onend = null
    recognition.abort()
    recognition = null
  })

  return {
    isRecording,
    speechMessage,
    speechTone,
    supportsSpeechRecognition,
    toggleVoiceInput,
    stopVoiceInput,
    resetMessage,
  }
}

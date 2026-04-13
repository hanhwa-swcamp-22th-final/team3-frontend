<script setup>
function defaultNoop() {}

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  noticeText: {
    type: String,
    default: '',
  },
  editorPlaceholder: {
    type: String,
    default: '',
  },
  recordingState: {
    type: String,
    default: 'idle',
  },
  uploadedFileName: {
    type: String,
    default: '',
  },
  showReplayButton: {
    type: Boolean,
    default: false,
  },
  showGuideButton: {
    type: Boolean,
    default: false,
  },
  guideButtonLabel: {
    type: String,
    default: '작성 가이드',
  },
  guideActive: {
    type: Boolean,
    default: false,
  },
  guideDisabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  recordingSummaryRenderer: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'voice-input',
  'file-selected',
  'convert-text',
  'replay-audio',
  'toggle-guide',
])

function handleFileChange(event) {
  const [file] = event.target.files ?? []
  emit('file-selected', file ?? null)
  event.target.value = ''
}

function renderRecordingSummary() {
  return (props.recordingSummaryRenderer ?? defaultNoop)()
}
</script>

<template>
  <section class="evaluation-form-panel">
    <header class="evaluation-form-panel__header">
      <div>
        <h2 class="evaluation-form-panel__title">{{ title }}</h2>
        <p v-if="description" class="evaluation-form-panel__description">
          {{ description }}
        </p>
      </div>
    </header>

    <slot name="summary" />

    <div class="evaluation-form-panel__toolbar">
      <div class="evaluation-form-panel__toolbar-left">
        <button
          type="button"
          class="evaluation-form-panel__tool-button"
          :class="{ 'evaluation-form-panel__tool-button--active': recordingState !== 'idle' }"
          @click="emit('voice-input')"
        >
          음성 인식 시작
        </button>
        <label class="evaluation-form-panel__tool-button">
          파일 업로드
          <input class="evaluation-form-panel__file-input" type="file" accept=".txt,.md,.log" @change="handleFileChange" />
        </label>
        <button type="button" class="evaluation-form-panel__tool-button" @click="emit('convert-text')">텍스트 변환</button>
        <button
          v-if="showReplayButton"
          type="button"
          class="evaluation-form-panel__tool-button"
          @click="emit('replay-audio')"
        >
          다시 듣기
        </button>
      </div>
      <button
        v-if="showGuideButton"
        type="button"
        class="evaluation-form-panel__guide-button"
        :class="{ 'evaluation-form-panel__guide-button--active': guideActive }"
        :disabled="guideDisabled"
        @click="emit('toggle-guide')"
      >
        {{ guideButtonLabel }}
      </button>
    </div>

    <div v-if="noticeText" class="evaluation-form-panel__notice">
      {{ noticeText }}
    </div>

    <div v-if="recordingState !== 'idle' || uploadedFileName" class="evaluation-form-panel__status-row">
      <span v-if="recordingState !== 'idle'" class="evaluation-form-panel__status-chip">
        {{ recordingState === 'recording' ? '음성 입력 mock 진행 중' : '음성 초안 준비 완료' }}
      </span>
      <span v-if="uploadedFileName" class="evaluation-form-panel__status-chip evaluation-form-panel__status-chip--file">
        업로드 파일: {{ uploadedFileName }}
      </span>
    </div>

    <textarea
      class="evaluation-form-panel__editor"
      :class="{ 'evaluation-form-panel__editor--readonly': readonly }"
      :value="modelValue"
      :placeholder="editorPlaceholder"
      :readonly="readonly"
      @input="!readonly && emit('update:modelValue', $event.target.value)"
    ></textarea>

    <div class="evaluation-form-panel__recording-zone">
      <slot name="recording-zone">
        <div v-if="recordingSummaryRenderer" class="evaluation-form-panel__recording-summary">
          <strong>{{ renderRecordingSummary().title }}</strong>
          <p>{{ renderRecordingSummary().description }}</p>
        </div>
        <div v-else class="evaluation-form-panel__recording-ring">
          <div class="evaluation-form-panel__recording-icon">🎤</div>
        </div>
      </slot>
    </div>

    <footer v-if="$slots.footer" class="evaluation-form-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.evaluation-form-panel {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.evaluation-form-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}

.evaluation-form-panel__title {
  margin: 0;
  font-size: 26px;
  color: var(--color-primary-800);
}

.evaluation-form-panel__description {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--color-text-muted);
}

.evaluation-form-panel__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-soft);
}

.evaluation-form-panel__toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.evaluation-form-panel__tool-button,
.evaluation-form-panel__guide-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  background: var(--color-bg-surface);
  color: var(--color-primary-600);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  box-sizing: border-box;
  white-space: nowrap;
  cursor: pointer;
}

.evaluation-form-panel__tool-button--active {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.evaluation-form-panel__file-input {
  display: none;
}

.evaluation-form-panel__guide-button {
  background: linear-gradient(180deg, #f0edff 0%, #d9d1ff 100%);
}

.evaluation-form-panel__guide-button--active {
  border-color: #cfc7ff;
  box-shadow: 0 0 0 3px rgba(91, 80, 214, 0.08);
}

.evaluation-form-panel__notice {
  margin-top: 14px;
  padding: 14px 16px;
  border: 1px solid #ffdca6;
  border-radius: 14px;
  background: #fff5df;
  font-size: 13px;
  line-height: 1.6;
  color: #946200;
}

.evaluation-form-panel__status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.evaluation-form-panel__status-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #e9fbf6;
  color: #168267;
  font-size: 13px;
  font-weight: 700;
}

.evaluation-form-panel__status-chip--file {
  background: #f4f2ff;
  color: var(--color-primary-700);
}

.evaluation-form-panel__editor {
  width: 100%;
  min-height: 250px;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  resize: vertical;
  font: inherit;
  line-height: 1.8;
  color: var(--color-primary-800);
  box-sizing: border-box;
}

.evaluation-form-panel__editor--readonly {
  background: linear-gradient(135deg, #f8f7ff 0%, #f1effe 100%);
  border-color: #e0dbff;
  color: #6e68b2;
  cursor: default;
  resize: none;
  outline: none;
}

.evaluation-form-panel__editor--readonly:focus {
  border-color: #e0dbff;
  outline: none;
  box-shadow: none;
}

.evaluation-form-panel__recording-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 132px;
  margin-top: 14px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(174, 236, 227, 0.5) 0%, rgba(232, 251, 247, 0.85) 100%);
}

.evaluation-form-panel__recording-ring {
  width: 106px;
  height: 106px;
  border-radius: 50%;
  border: 4px solid rgba(16, 147, 127, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.evaluation-form-panel__recording-icon {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #08c8a7;
  font-size: 34px;
}

.evaluation-form-panel__recording-summary {
  text-align: center;
  color: #168267;
}

.evaluation-form-panel__recording-summary strong {
  display: block;
  margin-bottom: 6px;
  font-size: 18px;
}

.evaluation-form-panel__recording-summary p {
  margin: 0;
}

.evaluation-form-panel__footer {
  display: grid;
  gap: 14px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-soft);
}

@media (max-width: 720px) {
  .evaluation-form-panel__header,
  .evaluation-form-panel__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

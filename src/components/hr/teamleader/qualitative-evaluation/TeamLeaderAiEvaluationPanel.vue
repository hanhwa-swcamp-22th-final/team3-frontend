<script setup>
import { BaseModal } from '@/components/common/base'

defineProps({
  selectedTarget: {
    type: Object,
    required: true,
  },
  guideOpen: {
    type: Boolean,
    default: false,
  },
  recordingState: {
    type: String,
    default: 'idle',
  },
  uploadedFileName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'update:converted-text',
  'voice-input',
  'file-selected',
  'convert-text',
  'replay-audio',
  'toggle-guide',
])

const structureSteps = [
  '언제 어떤 상황이 있었는지',
  '대상자가 어떤 행동을 했는지',
  '그 결과가 생산성, 품질, 협업에 어떤 영향을 줬는지',
  '다음 평가를 위한 보완점이 무엇인지',
]

const structureKeywords = ['상황', '행동', '결과', '보완점']

const checklistItems = [
  '실제 업무 사례가 1건 이상 포함되었는가',
  '행동 주체와 수행 내용이 분명하게 드러나는가',
  '생산성, 품질, 협업 등 결과가 문장에 들어갔는가',
  '모호한 인상평가 대신 업무 사실 중심으로 썼는가',
]

function handleFileChange(event) {
  const [file] = event.target.files ?? []
  emit('file-selected', file ?? null)
  event.target.value = ''
}
</script>

<template>
  <section class="evaluation-form-panel">
    <header class="evaluation-form-panel__header">
      <div>
        <h2 class="evaluation-form-panel__title">{{ selectedTarget.voiceLabel }}</h2>
        <p class="evaluation-form-panel__description">
          {{ selectedTarget.voiceDescription }}
        </p>
      </div>
      <button type="button" class="evaluation-form-panel__voice-chip" @click="emit('voice-input')">
        음성 입력
      </button>
    </header>

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
        <button type="button" class="evaluation-form-panel__tool-button" @click="emit('replay-audio')">다시 듣기</button>
      </div>
      <button
        type="button"
        class="evaluation-form-panel__guide-button"
        :class="{ 'evaluation-form-panel__guide-button--active': guideOpen }"
        @click="emit('toggle-guide')"
      >
        작성 가이드
      </button>
    </div>

    <div class="evaluation-form-panel__notice">
      음성 인식 결과가 누락되거나 문장이 비문으로 바뀔 수 있습니다.
      변환 결과는 초안으로만 사용하고 아래 패널에서 최종 평가 문장을 직접 수정하세요.
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
      :value="selectedTarget.convertedText"
      @input="emit('update:converted-text', $event.target.value)"
    ></textarea>

    <div class="evaluation-form-panel__recording-zone">
      <div class="evaluation-form-panel__recording-ring">
        <div class="evaluation-form-panel__recording-icon">🎤</div>
      </div>
    </div>
  </section>

  <BaseModal
    v-if="guideOpen"
    title="작성 가이드"
    eyebrow="Guide"
    width="880px"
    max-height="calc(100vh - 56px)"
    @close="emit('toggle-guide')"
  >
    <section class="evaluation-guide">
      <header class="evaluation-guide__header">
        <p class="evaluation-guide__subtitle">음성 인식 불량 시 참고하는 보조 페이지</p>
      </header>

      <div class="evaluation-guide__notice">
        음성 인식 결과는 초안일 뿐입니다. 실제 사례, 행동, 결과가 누락되었으면 아래 가이드를 참고해
        직접 문장을 완성해야 합니다.
      </div>

      <section class="evaluation-guide__card">
        <h4>권장 작성 구조</h4>
        <p>
          <span v-for="(step, index) in structureSteps" :key="step">
            {{ index + 1 }}. {{ step }}<span v-if="index < structureSteps.length - 1"> </span>
          </span>
        </p>
        <div class="evaluation-guide__chips">
          <span v-for="keyword in structureKeywords" :key="keyword">{{ keyword }}</span>
        </div>
      </section>

      <section class="evaluation-guide__card">
        <h4>좋은 예시</h4>
        <p>
          "3월 12일 야간조 설비 정지 상황에서 센서 배선 이상을 먼저 식별했고, 정비 담당자와 즉시
          협업해 18분 내 재가동을 완료했다. 이후 동일 증상 방지를 위해 점검 체크리스트를 정리해 팀에
          공유했다."
        </p>
      </section>

      <section class="evaluation-guide__card evaluation-guide__card--warn">
        <h4>피해야 할 표현</h4>
        <p>
          "일을 잘함", "책임감 있음", "문제가 있었는데 해결함"처럼 사례와 결과가 없는 추상적 문장
        </p>
      </section>

      <section class="evaluation-guide__card">
        <h4>작성 체크리스트</h4>
        <ul class="evaluation-guide__checklist">
          <li v-for="item in checklistItems" :key="item">{{ item }}</li>
        </ul>
      </section>
    </section>
  </BaseModal>
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
  font-size: 26px;
  color: var(--color-primary-800);
}

.evaluation-form-panel__description {
  margin-top: 8px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.evaluation-form-panel__voice-chip {
  height: 34px;
  padding: 0 14px;
  border: none;
  border-radius: 999px;
  background: rgba(174, 236, 227, 0.6);
  color: #10937f;
  font-weight: 700;
  cursor: pointer;
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

.evaluation-guide {
  display: grid;
  gap: 18px;
}

.evaluation-guide__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0dbff;
}

.evaluation-guide__subtitle {
  font-size: 14px;
  color: #7d76c6;
}

.evaluation-guide__notice {
  padding: 20px 24px;
  border: 1px solid #ffd886;
  border-radius: 24px;
  background: #fff6e6;
  font-size: 16px;
  line-height: 1.7;
  color: #b17400;
}

.evaluation-guide__card {
  padding: 22px 24px;
  border: 1px solid #dcd6ff;
  border-radius: 24px;
  background: #fff;
}

.evaluation-guide__card h4 {
  margin-bottom: 14px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.evaluation-guide__card p {
  font-size: 15px;
  line-height: 1.8;
  color: #6e68b2;
}

.evaluation-guide__card--warn {
  border-color: #ffc6d2;
  background: #fff1f4;
}

.evaluation-guide__card--warn h4 {
  color: #cf4f71;
}

.evaluation-guide__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.evaluation-guide__chips span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  background: #edf3ff;
  color: #2f67bf;
  font-weight: 700;
}

.evaluation-guide__checklist {
  display: grid;
  gap: 14px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.evaluation-guide__checklist li {
  position: relative;
  padding-left: 48px;
  font-size: 15px;
  line-height: 1.6;
  color: #6e68b2;
}

.evaluation-guide__checklist li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #ede9ff;
  color: #6a57d3;
  font-weight: 900;
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

@media (max-width: 720px) {
  .evaluation-form-panel__header,
  .evaluation-form-panel__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .evaluation-guide__header {
    flex-direction: column;
  }
}
</style>

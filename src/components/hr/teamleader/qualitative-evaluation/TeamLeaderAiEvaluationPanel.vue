<script setup>
import EvaluationGuideModal from '@/components/hr/common/evaluation/EvaluationGuideModal.vue'
import EvalDetailLayout from '@/components/hr/common/evaluation/EvalDetailLayout.vue'
import TeamLeaderAiEvaluationActionBar from './TeamLeaderAiEvaluationActionBar.vue'

defineProps({
  selectedTarget: { type: Object, required: true },
  guideOpen: { type: Boolean, default: false },
  recordingState: { type: String, default: 'idle' },
  uploadedFileName: { type: String, default: '' },
  actionDisabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  appealInfo: { type: Object, default: null },
  progressLabel: { type: String, default: '1차 평가 작성 현황' },
})

const emit = defineEmits([
  'update:converted-text',
  'voice-input',
  'file-selected',
  'convert-text',
  'replay-audio',
  'toggle-guide',
  'close',
  'save-draft',
  'submit',
])
</script>

<template>
  <EvalDetailLayout
    :panel-props="{
      title: selectedTarget.voiceLabel,
      description: selectedTarget.voiceDescription,
      modelValue: selectedTarget.convertedText,
      readonly,
      noticeText: '음성 인식 결과가 누락되거나 문장이 비문으로 바뀔 수 있습니다. 변환 결과는 초안으로만 사용하고 아래 패널에서 최종 평가 문장을 직접 수정하세요.',
      recordingState,
      uploadedFileName,
      showReplayButton: true,
      showGuideButton: true,
      guideActive: guideOpen,
    }"
    @update:model-value="emit('update:converted-text', $event)"
    @voice-input="emit('voice-input')"
    @file-selected="emit('file-selected', $event)"
    @convert-text="emit('convert-text')"
    @replay-audio="emit('replay-audio')"
    @toggle-guide="emit('toggle-guide')"
  >
    <template #summary>
      <section v-if="selectedTarget.summaryComment || appealInfo" class="eval-form__summary-stack">
        <div v-if="selectedTarget.summaryComment" class="eval-form__summary-card">
          <p class="eval-form__summary-eyebrow">{{ selectedTarget.summaryTitle || '이전 평가 내용' }}</p>
          <p class="eval-form__summary-copy">{{ selectedTarget.summaryComment }}</p>
        </div>
        <div v-if="appealInfo" class="eval-form__summary-card eval-form__summary-card--appeal">
          <div class="eval-form__appeal-meta">
            <div class="eval-form__appeal-meta-item">
              <p class="eval-form__summary-eyebrow">대상 평가기간</p>
              <strong>{{ appealInfo.periodLabel }}</strong>
            </div>
            <div class="eval-form__appeal-meta-item">
              <p class="eval-form__summary-eyebrow">이의 유형</p>
              <strong>{{ appealInfo.typeLabel }}</strong>
            </div>
          </div>
          <div class="eval-form__appeal-body">
            <p class="eval-form__summary-eyebrow">이의신청 내용</p>
            <strong>{{ appealInfo.title }}</strong>
            <p class="eval-form__summary-copy">{{ appealInfo.content }}</p>
          </div>
        </div>
      </section>
    </template>

    <template #footer>
      <div class="eval-form__actions">
        <div class="eval-form__submit-hint" :class="{ 'eval-form__submit-hint--submitted': readonly }">
          <strong>{{ progressLabel }}</strong>
          <span>{{ `${(selectedTarget.convertedText ?? '').trim().length}자 입력 완료` }}</span>
          <span v-if="selectedTarget.expectedScore != null" class="eval-form__score-hint">
            예상 점수: {{ selectedTarget.expectedScore }}점
          </span>
        </div>
        <TeamLeaderAiEvaluationActionBar
          :disabled="actionDisabled"
          @close="emit('close')"
          @save-draft="emit('save-draft')"
          @submit="emit('submit')"
        />
      </div>
    </template>
  </EvalDetailLayout>

  <EvaluationGuideModal :open="guideOpen" @close="emit('toggle-guide')" />
</template>

<style scoped>
.eval-form__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.eval-form__summary-stack {
  display: grid;
  gap: 14px;
  margin-bottom: 16px;
}

.eval-form__summary-card {
  display: grid;
  gap: 8px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid #e8e2ff;
  background: #faf8ff;
}

.eval-form__summary-card--appeal {
  gap: 14px;
}

.eval-form__summary-eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.eval-form__summary-copy {
  margin: 0;
  line-height: 1.7;
  color: var(--color-primary-800);
  white-space: pre-wrap;
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

.eval-form__appeal-meta-item strong,
.eval-form__appeal-body strong {
  color: var(--color-primary-800);
}

.eval-form__appeal-body {
  display: grid;
  gap: 8px;
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--color-border-soft);
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

@media (max-width: 900px) {
  .eval-form__appeal-meta {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
import AiEvaluationFormPanel from '@/components/hr/common/evaluation/AiEvaluationFormPanel.vue'
import EvaluationGuideModal from '@/components/hr/common/evaluation/EvaluationGuideModal.vue'
import TeamLeaderAiEvaluationActionBar from './TeamLeaderAiEvaluationActionBar.vue'

defineProps({
  selectedTarget: { type: Object, required: true },
  guideOpen: { type: Boolean, default: false },
  recordingState: { type: String, default: 'idle' },
  uploadedFileName: { type: String, default: '' },
  actionDisabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
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
  <AiEvaluationFormPanel
    class="tl-evaluation-form-panel"
    :title="selectedTarget.voiceLabel"
    :description="selectedTarget.voiceDescription"
    :model-value="selectedTarget.convertedText"
    :readonly="readonly"
    :notice-text="'음성 인식 결과가 누락되거나 문장이 비문으로 바뀔 수 있습니다. 변환 결과는 초안으로만 사용하고 아래 패널에서 최종 평가 문장을 직접 수정하세요.'"
    :recording-state="recordingState"
    :uploaded-file-name="uploadedFileName"
    :show-replay-button="true"
    :show-guide-button="true"
    :guide-active="guideOpen"
    @update:model-value="emit('update:converted-text', $event)"
    @voice-input="emit('voice-input')"
    @file-selected="emit('file-selected', $event)"
    @convert-text="emit('convert-text')"
    @replay-audio="emit('replay-audio')"
    @toggle-guide="emit('toggle-guide')"
  >
    <template #footer>
      <div class="eval-form__actions">
        <div class="eval-form__submit-hint" :class="{ 'eval-form__submit-hint--submitted': readonly }">
          <strong>1차 평가 작성 현황</strong>
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
  </AiEvaluationFormPanel>

  <EvaluationGuideModal :open="guideOpen" @close="emit('toggle-guide')" />
</template>

<style scoped>
.tl-evaluation-form-panel {
  overflow-y: auto;
  min-height: 600px;
  max-height: calc(100vh - 200px);
}

.eval-form__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
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
</style>

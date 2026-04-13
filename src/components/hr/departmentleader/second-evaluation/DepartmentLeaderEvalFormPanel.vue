<script setup>
import { computed, ref, watch } from 'vue'
import AiEvaluationFormPanel from '@/components/hr/common/evaluation/AiEvaluationFormPanel.vue'
import DepartmentLeaderFirstEvaluationSummary from './DepartmentLeaderFirstEvaluationSummary.vue'

const props = defineProps({
  member: { type: Object, default: null },
})

const emit = defineEmits(['save', 'submit'])

const draftText = ref('')
const recordingState = ref('idle')
const uploadedFileName = ref('')
const uploadedText = ref('')

watch(
  () => props.member,
  (member) => {
    draftText.value = member?.secondEvaluationDraft ?? ''
    recordingState.value = 'idle'
    uploadedFileName.value = ''
    uploadedText.value = ''
  },
  { immediate: true },
)

const canSubmit = computed(() => draftText.value.trim().length >= 20)

function handleVoiceInput() {
  recordingState.value = recordingState.value === 'recording' ? 'ready' : 'recording'
  if (recordingState.value === 'recording') {
    uploadedText.value = ''
  } else {
    uploadedText.value =
      '음성 입력 mock 초안입니다. 1차 평가 내용과 현업 관찰 내용을 바탕으로 2차 평가 의견을 정리한 뒤 최종 문장을 직접 보완하세요.'
  }
}

async function handleFileChange(file) {
  if (!file) return

  uploadedFileName.value = file.name
  if (file.type.startsWith('text/') || /\.(txt|md|log)$/i.test(file.name)) {
    uploadedText.value = await file.text()
    return
  }

  uploadedText.value = `[업로드 파일 mock] ${file.name} 파일이 선택되었습니다. 실제 변환은 후속 API 연동 단계에서 지원됩니다.`
}

function handleConvertText() {
  if (!uploadedText.value) return
  draftText.value = uploadedText.value
}
</script>

<template>
  <AiEvaluationFormPanel
    v-if="member"
    class="department-evaluation-form-panel"
    :title="`${member.name} 2차 평가 작성`"
    :description="`${member.code} | ${member.team} | ${member.experience}`"
    :model-value="draftText"
    :notice-text="'팀리더 1차 평가 내용과 AI 권고 점수는 참고 자료입니다. 음성 입력 또는 파일 업로드로 초안을 만든 뒤 아래 편집 영역에서 2차 평가 문장을 직접 완성하세요.'"
    :editor-placeholder="'2차 평가 의견을 입력하세요. 1차 평가 내용 검토, 종합 판단, 보완 의견이 드러나도록 작성합니다.'"
    :recording-state="recordingState"
    :uploaded-file-name="uploadedFileName"
    :show-guide-button="true"
    :guide-button-label="'1차 평가 참고'"
    :guide-disabled="true"
    :recording-summary-renderer="() => ({ title: '2차 평가 작성 현황', description: `${draftText.trim().length}자 입력 완료` })"
    @update:model-value="draftText = $event"
    @voice-input="handleVoiceInput"
    @file-selected="handleFileChange"
    @convert-text="handleConvertText"
  >
    <template #summary>
      <DepartmentLeaderFirstEvaluationSummary :summary="member.firstEvaluationSummary" />
    </template>

    <template #footer>
      <div class="eval-form__actions">
        <span class="eval-form__submit-hint" :class="{ 'eval-form__submit-hint--ready': canSubmit }">
          {{ canSubmit ? '제출 가능한 상태입니다. 검토 후 최종 제출하세요.' : '2차 평가는 20자 이상 입력해야 제출할 수 있습니다.' }}
        </span>
        <button class="eval-form__btn eval-form__btn--save" @click="emit('save', draftText)">
          임시저장
        </button>
        <button
          class="eval-form__btn eval-form__btn--submit"
          :disabled="!canSubmit"
          @click="emit('submit', draftText)"
        >
          최종 제출
        </button>
      </div>
    </template>
  </AiEvaluationFormPanel>

  <section v-else class="eval-form eval-form--empty">
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
  font-size: var(--font-size-xs);
  color: #e05a5a;
  text-align: left;
}

.eval-form__submit-hint--ready {
  color: #1d7f5f;
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

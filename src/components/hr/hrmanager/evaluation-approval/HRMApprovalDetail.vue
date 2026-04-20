<script setup>
import { ref, watch } from 'vue'
import EvalDetailLayout from '@/components/hr/common/evaluation/EvalDetailLayout.vue'

const props = defineProps({
  item:     { type: Object,  required: true },
  readonly: { type: Boolean, default: false },
  held:     { type: Boolean, default: false },
  mode:     { type: String,  default: 'appeal' },
})
const emit = defineEmits(['approve', 'reject', 'hold'])

const confirmComment = ref('')

watch(() => props.item?.id, () => {
  confirmComment.value = ''
})
</script>

<template>
  <!-- 평가 확정 모드 — DL 스타일 AiEvaluationFormPanel 사용 -->
  <EvalDetailLayout
    v-if="mode === 'evaluation'"
    :panel-props="{
      title: `${item.name} 평가 확정`,
      description: [item.department, item.team].filter(Boolean).join(' > ') || item.meta || '',
      modelValue: item.detail?.secondStageComment ?? '',
      showToolbar: false,
      showEditor: false,
      readonly: true,
    }"
  >
    <template #summary>
      <section class="hrm-eval-summary">
        <div class="hrm-eval-summary__header">
          <div>
            <p class="hrm-eval-summary__eyebrow">평가 요약</p>
            <h3 class="hrm-eval-summary__title">평가 내용 및 점수</h3>
          </div>
            <div class="hrm-eval-summary__scores">
              <div class="hrm-eval-summary__score">
                <strong>{{ item.detail?.firstStageScore ?? '-' }}</strong>
                <span>1차</span>
            </div>
            <div class="hrm-eval-summary__score hrm-eval-summary__score--second">
              <strong>{{ item.detail?.secondStageScore ?? '-' }}</strong>
              <span>2차</span>
            </div>
          </div>
        </div>
        <div class="hrm-eval-summary__comment-card">
          <p class="hrm-eval-summary__comment-label">팀리더 정성 평가 (1차)</p>
          <p class="hrm-eval-summary__comment">
            {{ item.detail?.firstStageComment || '1차 평가 내용이 없습니다.' }}
          </p>
        </div>
        <div class="hrm-eval-summary__comment-card hrm-eval-summary__comment-card--second">
          <p class="hrm-eval-summary__comment-label hrm-eval-summary__comment-label--second">부서장 정성 평가 (2차)</p>
          <p class="hrm-eval-summary__comment">
            {{ item.detail?.secondStageComment || '2차 평가 내용이 없습니다.' }}
          </p>
        </div>
        <div
          v-if="readonly && item.detail?.hrConfirmComment"
          class="hrm-eval-summary__comment-card hrm-eval-summary__comment-card--final"
        >
          <p class="hrm-eval-summary__comment-label hrm-eval-summary__comment-label--final">HR 최종 확정 코멘트</p>
          <p class="hrm-eval-summary__comment">
            {{ item.detail.hrConfirmComment }}
          </p>
        </div>
      </section>
    </template>

    <template #footer>
      <template v-if="!readonly">
        <div class="hrm-confirm-comment">
          <label class="hrm-confirm-comment__label">최종 확정 코멘트</label>
          <textarea
            v-model="confirmComment"
            class="hrm-confirm-comment__input"
            placeholder="필요한 경우 최종 확정 코멘트를 입력하세요"
            rows="3"
          />
          <p class="hrm-confirm-comment__hint">입력하면 20자 이상이어야 하며, 비워두고 바로 최종 확정할 수 있습니다.</p>
        </div>
        <div class="hrm-eval-actions">
          <button class="hrm-btn hrm-btn--approve" @click="emit('approve', confirmComment)">최종 확정</button>
        </div>
      </template>
      <div v-else class="hrm-processed-result" :style="{ background: item.processedBg, color: item.processedColor }">
        <span class="hrm-processed-result__label">{{ item.processedLabel }} 처리 완료</span>
      </div>
    </template>
  </EvalDetailLayout>

  <!-- 이의신청 모드 -->
  <EvalDetailLayout
    v-else
    :panel-props="{
      title: `${item.name} 신청 내역`,
      description: item.detail?.dept || item.meta || '이의신청 검토',
      showToolbar: false,
      showEditor: false,
      readonly: true,
    }"
  >
    <template #summary>
      <section class="hrm-eval-summary hrm-eval-summary--appeal">
        <div class="hrm-eval-summary__header">
          <div>
            <p class="hrm-eval-summary__eyebrow">평가 요약</p>
            <h3 class="hrm-eval-summary__title">평가 내용 및 점수</h3>
          </div>
            <div class="hrm-eval-summary__scores">
              <div class="hrm-eval-summary__score">
                <strong>{{ item.detail.firstStageScore ?? '-' }}</strong>
                <span>1차</span>
            </div>
            <div class="hrm-eval-summary__score hrm-eval-summary__score--second">
              <strong>{{ item.detail.secondStageScore ?? '-' }}</strong>
              <span>2차</span>
            </div>
          </div>
        </div>
        <div class="hrm-eval-summary__comment-card">
          <p class="hrm-eval-summary__comment-label">팀리더 정성 평가 (1차)</p>
          <p class="hrm-eval-summary__comment">
            {{ item.detail.firstStageComment || '1차 평가 내용이 없습니다.' }}
          </p>
        </div>
        <div class="hrm-eval-summary__comment-card hrm-eval-summary__comment-card--second">
          <p class="hrm-eval-summary__comment-label hrm-eval-summary__comment-label--second">부서장 정성 평가 (2차)</p>
          <p class="hrm-eval-summary__comment">
            {{ item.detail.secondStageComment || '2차 평가 내용이 없습니다.' }}
          </p>
        </div>
      </section>
    </template>

    <template #footer>
      <div class="hrm-appeal-footer">
        <div class="hrm-appeal-request-card">
          <div class="hrm-appeal-request-card__meta">
            <div class="hrm-appeal-request-card__meta-item">
              <p class="hrm-confirm-comment__label">대상 평가기간</p>
              <p class="hrm-appeal-request-card__meta-value">{{ item.detail.quarter || '-' }}</p>
            </div>
            <div class="hrm-appeal-request-card__meta-item">
              <p class="hrm-confirm-comment__label">이의 유형</p>
              <p class="hrm-appeal-request-card__meta-value">{{ item.detail.reason || '-' }}</p>
            </div>
          </div>
          <p class="hrm-confirm-comment__label">이의신청 내용</p>
          <strong class="hrm-appeal-request-card__title">{{ item.detail.appealTitle || '제목 없음' }}</strong>
          <p class="hrm-appeal-request-card__content">{{ item.detail.content || '신청 내용이 없습니다.' }}</p>
        </div>

        <div v-if="!readonly && item.rawStatus === 'SUBMITTED'" class="hrm-eval-actions">
          <button class="hrm-btn hrm-btn--reject" @click="$emit('reject')">거절</button>
          <button class="hrm-btn hrm-btn--approve" @click="$emit('approve')">접수</button>
        </div>
        <div v-else-if="!readonly && item.rawStatus === 'COMPLETED'" class="hrm-eval-actions">
          <button class="hrm-btn hrm-btn--approve" @click="$emit('approve')">최종 확정</button>
        </div>
        <div v-else-if="held" class="hrm-processed-result" :style="{ background: item.processedBg, color: item.processedColor }">
          <span class="hrm-processed-result__label">접수 완료</span>
          <span v-if="item.processedReason" class="hrm-processed-result__reason">사유: {{ item.processedReason }}</span>
        </div>
        <div v-else class="hrm-processed-result" :style="{ background: item.processedBg, color: item.processedColor }">
          <span class="hrm-processed-result__label">{{ item.processedLabel }} 처리 완료</span>
          <span v-if="item.processedReason" class="hrm-processed-result__reason">사유: {{ item.processedReason }}</span>
        </div>
      </div>
    </template>
  </EvalDetailLayout>
</template>

<style scoped>
/* 평가 요약 카드 (summary slot) */
.hrm-eval-summary {
  display: grid;
  gap: 14px;
  margin-bottom: 16px;
  padding: 18px;
  border: 1px solid #dcd6ff;
  border-radius: 20px;
  background: #faf8ff;
}

.hrm-eval-summary__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hrm-eval-summary__eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.hrm-eval-summary__title {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary-800);
}

.hrm-eval-summary__scores {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: stretch;
}

.hrm-eval-summary__score {
  width: 84px;
  min-width: 84px;
  min-height: 78px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e1dbff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.hrm-eval-summary__score strong {
  display: block;
  font-size: 20px;
  color: var(--color-primary-800);
  line-height: 1;
}

.hrm-eval-summary__score span {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1;
}

.hrm-eval-summary__score--second {
  border-color: #bdd5f8;
}

.hrm-eval-summary__score--second strong {
  color: #1d5dbf;
}

.hrm-eval-summary__comment-card {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e8e2ff;
}

.hrm-eval-summary__comment-card--second {
  border-color: #c7deff;
}

.hrm-eval-summary__comment-card--final {
  border-color: #d8d1ff;
  background: #f5f1ff;
}

.hrm-eval-summary--appeal .hrm-eval-summary__header {
  align-items: center;
}

.hrm-appeal-footer {
  display: grid;
  gap: 14px;
}

.hrm-appeal-request-card {
  padding: 14px 16px;
  border: 1px solid #e8e2ff;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
}

.hrm-appeal-request-card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.hrm-appeal-request-card__meta-item {
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  border-radius: 18px;
  background: #faf8ff;
  border: 1px solid var(--color-border-soft);
}

.hrm-appeal-request-card__meta-value {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary-800);
  font-weight: 700;
}

.hrm-appeal-request-card :deep(.hrm-confirm-comment__label) {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.hrm-appeal-request-card__title {
  display: block;
  margin-top: 4px;
  color: var(--color-primary-800);
  font-size: 15px;
}

.hrm-appeal-request-card__content {
  margin: 8px 0 0;
  line-height: 1.7;
  color: var(--color-primary-800);
}

.hrm-eval-summary__comment-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #6a57d3;
}

.hrm-eval-summary__comment-label--second {
  color: #3a7bd5;
}

.hrm-eval-summary__comment-label--final {
  color: #5f50d6;
}

.hrm-eval-summary__comment {
  margin: 0;
  line-height: 1.7;
  color: var(--color-primary-800);
}

/* 최종 확정 코멘트 */
.hrm-confirm-comment {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hrm-confirm-comment__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}

.hrm-confirm-comment__input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-family: inherit;
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  resize: vertical;
  line-height: 1.6;
  box-sizing: border-box;
}

.hrm-confirm-comment__input:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.hrm-confirm-comment__hint {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

/* footer 액션 */
.hrm-eval-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.hrm-badge {
  display: inline-flex; align-items: center; height: 18px; padding: 0 8px;
  border-radius: 3px; font-size: var(--font-size-xs); font-weight: 900; white-space: nowrap;
}

.hrm-processed-result {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex; flex-direction: column; gap: 4px;
}
.hrm-processed-result__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-align: center;
}
.hrm-processed-result__reason {
  font-size: var(--font-size-xs);
  opacity: 0.8;
  text-align: center;
}

.hrm-btn {
  height: 40px; padding: 0 16px; border-radius: 4px;
  font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); cursor: pointer; border: 1.5px solid transparent;
}
.hrm-btn--reject  { background: #de152d; border-color: var(--color-danger); color: var(--color-white); }
.hrm-btn--reject:hover  { background: #c0103e; }
.hrm-btn--hold    { background: var(--color-bg-surface); border-color: var(--tier-b); color: #a07000; }
.hrm-btn--hold:hover    { background: var(--color-warning-soft); }
.hrm-btn--approve { background: var(--color-primary-600); border-color: var(--color-primary-500); color: var(--color-white); padding: 0 20px; }
.hrm-btn--approve:hover { background: var(--color-primary-700); }
</style>

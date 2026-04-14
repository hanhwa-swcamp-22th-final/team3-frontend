<script setup>
import { ref, watch } from 'vue'
import AiEvaluationFormPanel from '@/components/hr/common/evaluation/AiEvaluationFormPanel.vue'

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
  <AiEvaluationFormPanel
    v-if="mode === 'evaluation'"
    class="hrm-evaluation-panel"
    :title="`${item.name} 평가 확정`"
    :description="[item.department, item.team].filter(Boolean).join(' > ') || item.meta || ''"
    :model-value="item.detail?.secondStageComment ?? ''"
    :show-toolbar="false"
    :show-editor="false"
    :readonly="true"
  >
    <template #summary>
      <section class="hrm-eval-summary">
        <div class="hrm-eval-summary__header">
          <div>
            <p class="hrm-eval-summary__eyebrow">평가 요약</p>
            <h3 class="hrm-eval-summary__title">평가 내용 및 점수</h3>
          </div>
          <div class="hrm-eval-summary__scores">
            <div class="hrm-eval-summary__score hrm-eval-summary__score--quant">
              <strong>{{ item.detail?.quantScore ?? '-' }}</strong>
              <span>정량</span>
            </div>
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
      </section>
    </template>

    <template #footer>
      <template v-if="!readonly">
        <div class="hrm-confirm-comment">
          <label class="hrm-confirm-comment__label">최종 확정 코멘트</label>
          <textarea
            v-model="confirmComment"
            class="hrm-confirm-comment__input"
            placeholder="최종 확정 의견을 입력하세요. (선택)"
            rows="3"
          />
        </div>
        <div class="hrm-eval-actions">
          <button class="hrm-btn hrm-btn--approve" @click="emit('approve', confirmComment)">최종 확정</button>
        </div>
      </template>
      <div v-else class="hrm-processed-result" :style="{ background: item.processedBg, color: item.processedColor }">
        <span class="hrm-processed-result__label">{{ item.processedLabel }} 처리 완료</span>
      </div>
    </template>
  </AiEvaluationFormPanel>

  <!-- 이의신청 모드 -->
  <article v-else class="hrm-detail">
    <div class="hrm-detail__top">
      <div class="hrm-detail__avatar">{{ item.detail.avatar }}</div>
      <div class="hrm-detail__name-block">
        <p class="hrm-detail__name">{{ item.name.split('').join(' ') }}</p>
        <p class="hrm-detail__dept">{{ item.detail.dept }}</p>
      </div>
      <span class="hrm-badge" :style="{ background: item.typeBg, color: item.typeColor }">{{ item.detail.evalType }}</span>
    </div>

    <div class="hrm-score-box">
      <div class="hrm-score-item">
        <p class="hrm-score-label">정량 점수</p>
        <p class="hrm-score-value">{{ item.detail.quantScore }}</p>
        <p class="hrm-score-diff">{{ item.detail.quantDiff }}</p>
      </div>
      <div class="hrm-score-item">
        <p class="hrm-score-label">정성 점수</p>
        <p class="hrm-score-value">{{ item.detail.qualScore }}</p>
        <p class="hrm-score-diff">{{ item.detail.qualDiff }}</p>
      </div>
      <div class="hrm-score-item">
        <p class="hrm-score-label">종합</p>
        <p class="hrm-score-value hrm-score-value--total">{{ item.detail.totalScore }}</p>
        <p class="hrm-score-diff">{{ item.detail.totalDiff }}</p>
      </div>
    </div>

    <div class="hrm-ai-box">
      <p class="hrm-ai-box__title">🤖 AI 분석 요약</p>
      <div class="hrm-ai-tags">
        <span v-for="tag in item.detail.aiTags" :key="tag" class="hrm-ai-tag">{{ tag }}</span>
      </div>
      <p class="hrm-ai-box__trust">데이터 신뢰도 {{ item.detail.dataTrust }}</p>
    </div>

    <div class="hrm-appeal-box">
      <div class="hrm-appeal-box__row">
        <span class="hrm-appeal-box__label">대상 분기</span>
        <span class="hrm-appeal-box__value">{{ item.detail.quarter }}</span>
      </div>
      <div class="hrm-appeal-box__row">
        <span class="hrm-appeal-box__label">신청 사유</span>
        <span class="hrm-appeal-box__value hrm-appeal-box__value--reason">{{ item.detail.reason }}</span>
      </div>
      <p class="hrm-appeal-box__content">{{ item.detail.content }}</p>
      <div v-if="item.detail.attachments?.length" class="hrm-appeal-box__attachments">
        <span v-for="f in item.detail.attachments" :key="f" class="hrm-appeal-attachment">📎 {{ f }}</span>
      </div>
    </div>

    <div v-if="!readonly && !held" class="hrm-actions">
      <button class="hrm-btn hrm-btn--reject"  @click="$emit('reject')">반려</button>
      <button class="hrm-btn hrm-btn--hold"    @click="$emit('hold')">보류</button>
      <button class="hrm-btn hrm-btn--approve" @click="$emit('approve')">최종 승인</button>
    </div>
    <div v-else-if="held" class="hrm-held-actions">
      <div class="hrm-processed-result" :style="{ background: item.processedBg, color: item.processedColor }">
        <span class="hrm-processed-result__label">보류 처리됨</span>
        <span v-if="item.processedReason" class="hrm-processed-result__reason">사유: {{ item.processedReason }}</span>
      </div>
      <div class="hrm-actions">
        <button class="hrm-btn hrm-btn--reject"  @click="$emit('reject')">반려</button>
        <button class="hrm-btn hrm-btn--approve" @click="$emit('approve')">최종 승인</button>
      </div>
    </div>
    <div v-else class="hrm-processed-result" :style="{ background: item.processedBg, color: item.processedColor }">
      <span class="hrm-processed-result__label">{{ item.processedLabel }} 처리 완료</span>
      <span v-if="item.processedReason" class="hrm-processed-result__reason">사유: {{ item.processedReason }}</span>
    </div>
  </article>
</template>

<style scoped>
/* ── 평가 확정 패널 ── */
.hrm-evaluation-panel {
  overflow-y: auto;
  min-height: 600px;
  max-height: calc(100vh - 200px);
}

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
}

.hrm-eval-summary__score {
  min-width: 72px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e1dbff;
  text-align: center;
}

.hrm-eval-summary__score strong {
  display: block;
  font-size: 20px;
  color: var(--color-primary-800);
}

.hrm-eval-summary__score span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.hrm-eval-summary__score--quant {
  border-color: #b9f0df;
}

.hrm-eval-summary__score--quant strong {
  color: #0d7f63;
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

.hrm-eval-summary__comment-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #6a57d3;
}

.hrm-eval-summary__comment-label--second {
  color: #3a7bd5;
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
  font-size: var(--font-size-xs);
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

/* footer 액션 */
.hrm-eval-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

/* ── 이의신청 패널 ── */
.hrm-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 24px;
  padding: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.hrm-detail__top { display: flex; align-items: center; gap: 14px; }
.hrm-detail__avatar {
  width: 52px;
  height: 52px;
  background: var(--color-primary-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: 900;
  color: var(--color-white);
  flex-shrink: 0;
}
.hrm-detail__name-block { flex: 1; min-width: 0; }
.hrm-detail__name { font-size: var(--font-size-lg); font-weight: 900; color: var(--color-primary-800); line-height: 1.4; }
.hrm-detail__dept { font-size: var(--font-size-xs); color: #a89ed8; }

.hrm-badge {
  display: inline-flex; align-items: center; height: 18px; padding: 0 8px;
  border-radius: 3px; font-size: var(--font-size-xs); font-weight: 900; white-space: nowrap;
}

.hrm-score-box {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  background: var(--color-bg-app);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
}

.hrm-score-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.hrm-score-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}

.hrm-score-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-regular);
  color: var(--color-primary-800);
  line-height: 1;
  font-family: 'Inter', sans-serif;
}

.hrm-score-value--total { color: var(--tier-s); }
.hrm-score-diff { font-size: var(--font-size-2xs); color: #7a6fa8; }

.hrm-ai-box {
  padding: 16px;
  background: var(--color-primary-100);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; display: flex; flex-direction: column; gap: 8px;
}
.hrm-ai-box__title { font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); color: var(--color-primary-600); }
.hrm-ai-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.hrm-ai-tag {
  display: inline-block; padding: 2px 8px; height: 19px;
  background: var(--color-success-soft); color: var(--color-info);
  font-size: var(--font-size-2xs); font-weight: var(--font-weight-bold); border-radius: 3px; line-height: 15px;
}
.hrm-ai-box__trust { font-size: var(--font-size-xs); color: #7a6fa8; }

.hrm-appeal-box {
  padding: 14px 16px;
  background: #fff8f9;
  border: 1.5px solid #f5c0cc;
  border-radius: 8px;
  display: flex; flex-direction: column; gap: 8px;
}
.hrm-appeal-box__row { display: flex; align-items: baseline; gap: 10px; }
.hrm-appeal-box__label {
  font-size: var(--font-size-xs); color: #a89ed8;
  white-space: nowrap; flex-shrink: 0; min-width: 60px;
}
.hrm-appeal-box__value { font-size: var(--font-size-sm); color: var(--color-primary-800); }
.hrm-appeal-box__value--reason { font-weight: var(--font-weight-bold); color: #c0103e; }
.hrm-appeal-box__content {
  font-size: var(--font-size-sm); color: #7a6fa8;
  line-height: 1.6; padding-top: 4px;
  border-top: 1px solid #f5c0cc;
}
.hrm-appeal-box__attachments { display: flex; flex-wrap: wrap; gap: 6px; }
.hrm-appeal-attachment {
  display: inline-block; padding: 2px 8px; height: 20px;
  background: #fee2e2; color: #991b1b;
  font-size: var(--font-size-2xs); font-weight: var(--font-weight-bold);
  border-radius: 3px; line-height: 16px;
}

.hrm-actions { display: flex; justify-content: flex-end; gap: 8px; }
.hrm-held-actions { display: flex; flex-direction: column; gap: 10px; }

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

<script setup>
import EvalDetailLayout from '@/components/hr/common/evaluation/EvalDetailLayout.vue'

const props = defineProps({
  detail: {
    type: Object,
    default: null,
  },
  roleLabel: {
    type: String,
    default: '평가자',
  },
  actionMode: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['approve', 'reject', 'review'])

function canReview(detail, actionMode) {
  if (!detail || !actionMode) return false
  return detail.status !== 'COMPLETED'
}
</script>

<template>
  <EvalDetailLayout
    :empty="!detail"
    :panel-props="detail ? {
      title: `${detail.employeeName} 신청 내역`,
      description: `${roleLabel} 이의신청 검토`,
      showToolbar: false,
      showEditor: false,
      readonly: true,
    } : {}"
    empty-title="이의신청을 선택하세요."
    empty-description="좌측 목록에서 검토할 대상을 선택하면 상세 내용이 표시됩니다."
  >
    <template #summary>
      <section v-if="detail" class="reviewer-appeal-detail__summary">
        <div class="reviewer-appeal-detail__header">
          <div>
            <p class="reviewer-appeal-detail__eyebrow">평가 요약</p>
            <h3 class="reviewer-appeal-detail__title">평가 내용 및 점수</h3>
          </div>
          <span
            class="reviewer-appeal-detail__status"
            :class="`reviewer-appeal-detail__status--${detail.status.toLowerCase()}`"
          >
            {{ detail.statusLabel }}
          </span>
        </div>

        <div class="reviewer-appeal-detail__scores">
          <div class="reviewer-appeal-detail__score reviewer-appeal-detail__score--quant">
            <strong>{{ detail.quantScoreLabel ?? '-' }}</strong>
            <span>정량</span>
          </div>
          <div class="reviewer-appeal-detail__score">
            <strong>{{ detail.firstScoreLabel }}</strong>
            <span>1차</span>
          </div>
          <div class="reviewer-appeal-detail__score reviewer-appeal-detail__score--second">
            <strong>{{ detail.secondScoreLabel }}</strong>
            <span>2차</span>
          </div>
        </div>

        <div class="reviewer-appeal-detail__comment-card">
          <p class="reviewer-appeal-detail__comment-label">팀리더 정성 평가 (1차)</p>
          <p class="reviewer-appeal-detail__comment">
            {{ detail.firstStageComment || '1차 평가 내용이 없습니다.' }}
          </p>
        </div>

        <div class="reviewer-appeal-detail__comment-card reviewer-appeal-detail__comment-card--second">
          <p class="reviewer-appeal-detail__comment-label reviewer-appeal-detail__comment-label--second">부서장 정성 평가 (2차)</p>
          <p class="reviewer-appeal-detail__comment">
            {{ detail.secondStageComment || '2차 평가 내용이 없습니다.' }}
          </p>
        </div>
      </section>
    </template>

    <template #footer>
      <div v-if="detail" class="reviewer-appeal-detail__footer">
        <div class="reviewer-appeal-detail__request-card">
          <div class="reviewer-appeal-detail__request-header">
            <div>
              <p class="reviewer-appeal-detail__request-eyebrow">이의신청 정보</p>
              <h4 class="reviewer-appeal-detail__request-heading">신청 내용 확인</h4>
            </div>
            <span class="reviewer-appeal-detail__request-badge">{{ detail.appealTypeLabel }}</span>
          </div>

          <div class="reviewer-appeal-detail__meta">
            <div class="reviewer-appeal-detail__meta-item">
              <p class="reviewer-appeal-detail__meta-label">대상 평가기간</p>
              <p class="reviewer-appeal-detail__meta-value">{{ detail.periodLabel }}</p>
            </div>
            <div class="reviewer-appeal-detail__meta-item">
              <p class="reviewer-appeal-detail__meta-label">이의 유형</p>
              <p class="reviewer-appeal-detail__meta-value">{{ detail.appealTypeLabel }}</p>
            </div>
          </div>

          <div class="reviewer-appeal-detail__request-body">
            <p class="reviewer-appeal-detail__meta-label">이의신청 내용</p>
            <strong class="reviewer-appeal-detail__request-title">{{ detail.title }}</strong>
            <p class="reviewer-appeal-detail__request-content">{{ detail.content }}</p>
          </div>
        </div>

        <div v-if="canReview(detail, actionMode)" class="reviewer-appeal-detail__actions">
          <template v-if="actionMode === 'tl'">
            <button class="reviewer-appeal-detail__btn reviewer-appeal-detail__btn--reject" :disabled="loading" @click="emit('reject')">
              기각
            </button>
            <button class="reviewer-appeal-detail__btn reviewer-appeal-detail__btn--approve" :disabled="loading" @click="emit('review')">
              검토
            </button>
          </template>
          <template v-else-if="actionMode === 'dl'">
            <button class="reviewer-appeal-detail__btn reviewer-appeal-detail__btn--reject" :disabled="loading" @click="emit('reject')">
              일부 인용
            </button>
            <button class="reviewer-appeal-detail__btn reviewer-appeal-detail__btn--approve" :disabled="loading" @click="emit('review')">
              검토
            </button>
          </template>
        </div>
      </div>
    </template>
  </EvalDetailLayout>
</template>

<style scoped>
.reviewer-appeal-detail__summary {
  display: grid;
  gap: 14px;
  margin-bottom: 16px;
  padding: 18px;
  border: 1px solid #dcd6ff;
  border-radius: 20px;
  background: #faf8ff;
}

.reviewer-appeal-detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.reviewer-appeal-detail__eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.reviewer-appeal-detail__title {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary-800);
}

.reviewer-appeal-detail__scores {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.reviewer-appeal-detail__score {
  min-width: 72px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e1dbff;
  text-align: center;
}

.reviewer-appeal-detail__score strong {
  display: block;
  font-size: 20px;
  color: var(--color-primary-800);
}

.reviewer-appeal-detail__score span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.reviewer-appeal-detail__score--quant {
  border-color: #b9f0df;
}

.reviewer-appeal-detail__score--quant strong {
  color: #0d7f63;
}

.reviewer-appeal-detail__score--second {
  border-color: #bdd5f8;
}

.reviewer-appeal-detail__score--second strong {
  color: #1d5dbf;
}

.reviewer-appeal-detail__comment-card {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e8e2ff;
}

.reviewer-appeal-detail__comment-card--second {
  border-color: #c7deff;
}

.reviewer-appeal-detail__comment-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #6a57d3;
}

.reviewer-appeal-detail__comment-label--second {
  color: #3a7bd5;
}

.reviewer-appeal-detail__comment {
  margin: 0;
  line-height: 1.7;
  color: var(--color-primary-800);
}

.reviewer-appeal-detail__status {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.reviewer-appeal-detail__status--receiving {
  background: #eef2ff;
  color: #4f46e5;
}

.reviewer-appeal-detail__status--reviewing {
  background: #fef3c7;
  color: #92400e;
}

.reviewer-appeal-detail__status--completed {
  background: #dcfce7;
  color: #166534;
}

.reviewer-appeal-detail__footer {
  display: grid;
  gap: 14px;
}

.reviewer-appeal-detail__request-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #e8e2ff;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(250, 248, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.reviewer-appeal-detail__request-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.reviewer-appeal-detail__request-eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.reviewer-appeal-detail__request-heading {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary-800);
}

.reviewer-appeal-detail__request-badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f1edff;
  color: #5f50d6;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.reviewer-appeal-detail__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.reviewer-appeal-detail__meta-item {
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  border-radius: 18px;
  background: #faf8ff;
  border: 1px solid var(--color-border-soft);
}

.reviewer-appeal-detail__meta-label {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.reviewer-appeal-detail__meta-value {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.reviewer-appeal-detail__request-body {
  display: grid;
  gap: 8px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #eee9ff;
}

.reviewer-appeal-detail__request-title {
  display: block;
  color: var(--color-primary-800);
  font-size: 16px;
  line-height: 1.5;
}

.reviewer-appeal-detail__request-content {
  margin: 0;
  line-height: 1.7;
  color: #564d7a;
  white-space: pre-wrap;
  word-break: keep-all;
}

.reviewer-appeal-detail__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.reviewer-appeal-detail__btn {
  border: 0;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.reviewer-appeal-detail__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reviewer-appeal-detail__btn--reject {
  background: #fee2e2;
  color: #991b1b;
}

.reviewer-appeal-detail__btn--approve {
  background: #e9e5ff;
  color: #5b21b6;
}

@media (max-width: 960px) {
  .reviewer-appeal-detail__header {
    flex-direction: column;
  }

  .reviewer-appeal-detail__request-header,
  .reviewer-appeal-detail__meta {
    grid-template-columns: 1fr;
    display: grid;
  }

  .reviewer-appeal-detail__request-badge {
    justify-self: start;
  }
}
</style>

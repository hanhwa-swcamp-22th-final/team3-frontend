<script setup>
defineProps({
  item:     { type: Object,  required: true },
  readonly: { type: Boolean, default: false },
  held:     { type: Boolean, default: false },
})
defineEmits(['approve', 'reject', 'hold'])
</script>

<template>
  <article class="hrm-detail">
    <!-- 상단: 아바타 + 이름 + 타입 뱃지 -->
    <div class="hrm-detail__top">
      <div class="hrm-detail__avatar">{{ item.detail.avatar }}</div>
      <div class="hrm-detail__name-block">
        <p class="hrm-detail__name">{{ item.name.split('').join(' ') }}</p>
        <p class="hrm-detail__dept">{{ item.detail.dept }}</p>
      </div>
      <span
        class="hrm-badge"
        :style="{ background: item.typeBg, color: item.typeColor }"
      >{{ item.detail.evalType }}</span>
    </div>

    <!-- 점수 박스 -->
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

    <!-- AI 분석 -->
    <div class="hrm-ai-box">
      <p class="hrm-ai-box__title">🤖 AI 분석 요약</p>
      <div class="hrm-ai-tags">
        <span v-for="tag in item.detail.aiTags" :key="tag" class="hrm-ai-tag">{{ tag }}</span>
      </div>
      <p class="hrm-ai-box__trust">데이터 신뢰도 {{ item.detail.dataTrust }}</p>
    </div>

    <!-- 이의신청 내용 -->
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

    <!-- 액션 버튼 -->
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
.hrm-detail {
  flex: 1; display: flex; flex-direction: column; gap: 16px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px; padding: 20px;
}

.hrm-detail__top { display: flex; align-items: center; gap: 14px; }
.hrm-detail__avatar {
  width: 52px; height: 52px;
  background: var(--color-primary-600);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-lg); font-weight: 900; color: var(--color-white); flex-shrink: 0;
}
.hrm-detail__name { font-size: var(--font-size-lg); font-weight: 900; color: var(--color-primary-800); line-height: 1.4; }
.hrm-detail__dept { font-size: var(--font-size-xs); color: #a89ed8; }
.hrm-badge {
  display: inline-flex; align-items: center; height: 18px; padding: 0 8px;
  border-radius: 3px; font-size: var(--font-size-xs); font-weight: 900; white-space: nowrap;
}

.hrm-score-box {
  display: flex; gap: 24px; padding: 16px 20px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px;
}
.hrm-score-item { display: flex; flex-direction: column; gap: 2px; }
.hrm-score-label { font-size: var(--font-size-xs); color: #a89ed8; }
.hrm-score-value { font-size: var(--font-size-2xl); font-weight: var(--font-weight-regular); color: var(--color-primary-800); line-height: 1; font-family: 'Inter', sans-serif; }
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

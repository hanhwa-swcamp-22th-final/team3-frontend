<script setup>
defineProps({
  item: { type: Object, required: true },
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

    <!-- 라인장 코멘트 -->
    <div class="hrm-comment-box">
      <div class="hrm-comment-box__header">
        <div class="hrm-comment-box__avatar">{{ item.detail.avatar }}</div>
        <span class="hrm-comment-box__role">라인장 코멘트</span>
        <span class="hrm-comment-box__date">· {{ item.detail.commentDate }}</span>
      </div>
      <p class="hrm-comment-box__text">"{{ item.detail.comment }}"</p>
    </div>

    <!-- 이의신청 여부 -->
    <div class="hrm-objection">
      <p v-if="!item.detail.objection" class="hrm-objection__none">이의신청 내역 없음</p>
      <p v-else class="hrm-objection__exists">이의신청 접수됨</p>
    </div>

    <!-- 액션 버튼 -->
    <div class="hrm-actions">
      <button class="hrm-btn hrm-btn--reject"  @click="$emit('reject')">반려</button>
      <button class="hrm-btn hrm-btn--hold"    @click="$emit('hold')">보류</button>
      <button class="hrm-btn hrm-btn--approve" @click="$emit('approve')">최종 승인</button>
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

.hrm-comment-box {
  padding: 15px; background: var(--color-bg-surface);
  border: 1.5px solid var(--color-primary-600);
  border-radius: 4px; display: flex; flex-direction: column; gap: 6px;
}
.hrm-comment-box__header { display: flex; align-items: center; gap: 6px; }
.hrm-comment-box__avatar {
  width: 24px; height: 24px; background: #1a8060; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); color: var(--color-white); flex-shrink: 0;
}
.hrm-comment-box__role,
.hrm-comment-box__date { font-size: var(--font-size-2xs); color: #a89ed8; }
.hrm-comment-box__text { font-size: var(--font-size-sm); color: #7a6fa8; line-height: 1.5; }

.hrm-objection { text-align: center; padding: 8px 0; }
.hrm-objection__none   { font-size: var(--font-size-xs); color: #a89ed8; }
.hrm-objection__exists { font-size: var(--font-size-xs); color: #c0103e; font-weight: var(--font-weight-bold); }

.hrm-actions { display: flex; justify-content: flex-end; gap: 8px; }
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

<script setup>
import { BaseButton } from '@/components/common/base'

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  reviewNote: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:review-note', 'approve', 'hold', 'reject'])

function reviewClass(value) {
  if (value === '없음') return 'review__metric-value--safe'
  return 'review__metric-value--number'
}
</script>

<template>
  <section class="review">
    <div v-if="item" class="review__content">
      <div class="review__head">
        <div>
          <p class="review__eyebrow">문서 상세</p>
          <h2>{{ item.title }}</h2>
        </div>
        <span class="review__date">{{ item.date }}</span>
      </div>

      <div class="review__author">
        <span class="review__avatar">{{ item.authorInitial }}</span>
        <div>
          <div class="review__author-row">
            <strong>{{ item.author }}</strong>
            <span class="review__tier">{{ item.authorTier }}</span>
          </div>
          <p>{{ item.line }} · 경력 {{ item.workCount }}건</p>
        </div>
      </div>

      <article class="review__article-card">
        <div class="review__meta-row">
          <span class="review__badge">{{ item.category }}</span>
          <span class="review__badge review__badge--soft">{{ item.equipment }}</span>
          <span class="review__badge review__badge--soft">{{ item.tier }}등급</span>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.summary }}</p>
        <div class="review__attachment">{{ item.attachment }}</div>
      </article>

      <section class="review__ai">
        <p class="review__section-title">AI 자동 검토 결과</p>
        <div class="review__metrics">
          <article class="review__metric-card">
            <span>{{ item.aiReview.duplication.label }}</span>
            <strong class="review__metric-value review__metric-value--number">{{ item.aiReview.duplication.value }}</strong>
            <small>{{ item.aiReview.duplication.helper }}</small>
          </article>
          <article class="review__metric-card">
            <span>{{ item.aiReview.reliability.label }}</span>
            <strong class="review__metric-value review__metric-value--number">{{ item.aiReview.reliability.value }}</strong>
            <small>{{ item.aiReview.reliability.helper }}</small>
          </article>
          <article class="review__metric-card">
            <span>{{ item.aiReview.harmfulness.label }}</span>
            <strong class="review__metric-value" :class="reviewClass(item.aiReview.harmfulness.value)">{{ item.aiReview.harmfulness.value }}</strong>
            <small>{{ item.aiReview.harmfulness.helper }}</small>
          </article>
        </div>
        <p class="review__overall">종합 의견: {{ item.aiReview.overall }}</p>
      </section>

      <label class="review__comment">
        심사 코멘트 (선택)
        <textarea
          :value="reviewNote"
          rows="3"
          @input="emit('update:review-note', $event.target.value)"
        ></textarea>
      </label>

      <div class="review__actions">
        <BaseButton variant="secondary" @click="emit('reject', item)">반려</BaseButton>
        <BaseButton variant="secondary" @click="emit('hold', item)">보류</BaseButton>
        <BaseButton @click="emit('approve', item)">승인</BaseButton>
      </div>
    </div>

    <div v-else class="review__empty">왼쪽 목록에서 승인할 문서를 선택하세요.</div>
  </section>
</template>

<style scoped>
.review {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
  padding: 16px;
  min-width: 0;
  box-sizing: border-box;
}

.review__content {
  display: grid;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.review__head,
.review__author,
.review__author-row,
.review__actions,
.review__meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review__eyebrow,
.review__section-title,
.review__comment {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.review__head h2 {
  margin-top: 6px;
  font-size: 24px;
  color: var(--color-primary-800);
}

.review__date,
.review__author p,
.review__attachment,
.review__overall,
.review__metric-card small {
  font-size: 12px;
  color: var(--color-text-muted);
}

.review__author {
  justify-content: flex-start;
  padding-bottom: 10px;
  border-bottom: 1px solid #ece7ff;
}

.review__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-700);
  color: #fff;
  font-weight: 800;
}

.review__author strong,
.review__article-card h3 {
  font-size: 15px;
  color: var(--color-primary-800);
}

.review__tier,
.review__badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.review__tier {
  background: #e8fbf7;
  color: #10a58b;
}

.review__badge {
  background: #efeaff;
  color: var(--color-primary-700);
}

.review__badge--soft {
  background: #f4f4fb;
  color: var(--color-text-muted);
}

.review__article-card,
.review__ai,
.review__comment {
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 10px;
}

.review__article-card p {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-default);
}

.review__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.review__metric-card {
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 4px;
  text-align: center;
}

.review__metric-card span {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.review__metric-value {
  font-size: 28px;
  font-weight: 800;
}

.review__metric-value--number {
  color: #18b9a7;
}

.review__metric-value--safe {
  color: #18b9a7;
}

.review__comment {
  color: var(--color-primary-800);
}

.review__comment textarea {
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 10px 12px;
  font: inherit;
  color: var(--color-text-default);
  resize: vertical;
}

.review__actions {
  justify-content: flex-end;
  gap: 10px;
}

.review__empty {
  height: 100%;
  min-height: 0;
  display: grid;
  place-items: center;
  border: 1px dashed var(--color-border-default);
  border-radius: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
}

@media (max-width: 860px) {
  .review__metrics {
    grid-template-columns: 1fr;
  }

  .review__head,
  .review__actions,
  .review__meta-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

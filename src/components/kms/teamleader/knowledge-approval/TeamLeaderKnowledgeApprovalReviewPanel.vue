<script setup>
import { BaseButton } from '@/components/common/base'

defineProps({
  item: {
    type: Object,
    default: null,
  },
  reviewNote: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:review-note', 'approve', 'hold', 'reject'])
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

      <section v-if="item.isHeld" class="review__held-banner">
        현재 이 문서는 임시저장 상태입니다.
      </section>

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

      <label class="review__comment">
        심사 코멘트 (선택)
        <textarea
          :value="reviewNote"
          rows="3"
          @input="emit('update:review-note', $event.target.value)"
        ></textarea>
        <p v-if="errorMessage" class="review__comment-error">{{ errorMessage }}</p>
        <p v-else class="review__comment-help">
          `반려`는 10자 이상, `임시저장`은 비어 있지 않은 코멘트가 필요합니다.
        </p>
      </label>

      <section
        v-if="item.approverName && item.reviewComment"
        class="review__hold-info"
      >
        <p class="review__section-title">최근 임시저장 정보</p>
        <div class="review__hold-meta">
          <strong>{{ item.approverName }}</strong>
          <span v-if="item.updatedAt">{{ item.updatedAt }}</span>
        </div>
        <p class="review__hold-comment">{{ item.reviewComment }}</p>
      </section>

      <div class="review__actions">
        <BaseButton variant="danger" :disabled="isSubmitting" :loading="isSubmitting" @click="emit('reject', item)">반려</BaseButton>
        <BaseButton variant="secondary" :disabled="isSubmitting" :loading="isSubmitting" @click="emit('hold', item)">임시저장</BaseButton>
        <BaseButton :disabled="isSubmitting" :loading="isSubmitting" @click="emit('approve', item)">승인</BaseButton>
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
.review__attachment {
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
.review__comment,
.review__hold-info {
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

.review__comment {
  color: var(--color-primary-800);
}

.review__hold-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.review__hold-meta strong {
  color: var(--color-primary-800);
}

.review__hold-comment {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-default);
}

.review__comment textarea {
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 10px 12px;
  font: inherit;
  color: var(--color-text-default);
  resize: vertical;
}

.review__comment-help,
.review__comment-error {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.review__comment-help {
  color: var(--color-text-muted);
}

.review__comment-error {
  color: var(--color-danger);
}

.review__held-banner {
  padding: 12px 14px;
  border-radius: 14px;
  background: #fff7e6;
  color: #a96b00;
  font-size: 13px;
  font-weight: 800;
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
  .review__head,
  .review__actions,
  .review__meta-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

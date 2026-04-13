<script setup>
defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'toggle-bookmark'])
</script>

<template>
  <div class="detail-modal">
    <div class="detail-modal__backdrop" @click="emit('close')"></div>
    <section class="detail-modal__dialog">
      <div class="detail-modal__head">
        <div>
          <p class="detail-modal__eyebrow">Knowledge Detail</p>
          <h2>{{ article.title }}</h2>
        </div>
        <div class="detail-modal__head-actions">
          <button
            type="button"
            class="detail-modal__bookmark"
            :class="{ 'detail-modal__bookmark--active': article.isBookmarked }"
            :aria-pressed="article.isBookmarked"
            @click="emit('toggle-bookmark', article)"
          >
            {{ article.isBookmarked ? '★' : '☆' }}
          </button>
          <button type="button" class="detail-modal__close" @click="emit('close')">×</button>
        </div>
      </div>

      <div class="detail-modal__meta">
        <span class="detail-modal__badge">{{ article.category }}</span>
        <span class="detail-modal__badge detail-modal__badge--soft">{{ article.equipment }}</span>
        <span v-if="article.code" class="detail-modal__code">{{ article.code }}</span>
        <span class="detail-modal__date">{{ article.date }}</span>
      </div>

      <div class="detail-modal__author">
        <span class="detail-modal__avatar">{{ article.authorInitial }}</span>
        <div>
          <div class="detail-modal__author-top">
            <strong>{{ article.author }}</strong>
            <span class="detail-modal__tier" :class="`detail-modal__tier--${String(article.authorTier ?? 'C').toLowerCase()}`">{{ article.authorTier }}</span>
          </div>
          <p>조회수 {{ article.views }}</p>
        </div>
      </div>

      <article v-if="article.isDeleted && article.deletionReason" class="detail-modal__section detail-modal__section--deleted">
        <h3>삭제 사유</h3>
        <p class="detail-modal__content">{{ article.deletionReason }}</p>
      </article>

      <article class="detail-modal__section">
        <h3>내용</h3>
        <p class="detail-modal__content">{{ article.content || article.preview }}</p>
      </article>

      <div class="detail-modal__actions">
        <button type="button" class="detail-modal__ghost" @click="emit('close')">닫기</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detail-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.detail-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(14, 12, 31, 0.48);
}

.detail-modal__dialog {
  position: relative;
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 22px;
  background: #fff;
  padding: 24px;
  display: grid;
  gap: 18px;
  box-shadow: 0 30px 80px rgba(20, 15, 60, 0.24);
}

.detail-modal__head,
.detail-modal__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.detail-modal__head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-modal__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.detail-modal__head h2 {
  margin-top: 6px;
  font-size: 28px;
  color: var(--color-primary-800);
}

.detail-modal__close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f4f2ff;
  color: var(--color-primary-700);
  font-size: 24px;
  cursor: pointer;
}

.detail-modal__bookmark {
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border-default);
  border-radius: 50%;
  background: #fff;
  color: #b8b0dc;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.detail-modal__bookmark--active {
  border-color: #f2c94c;
  background: #fff8dc;
  color: #e0a800;
}

.detail-modal__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-modal__badge {
  padding: 5px 10px;
  border-radius: 999px;
  background: #efeaff;
  color: var(--color-primary-700);
  font-size: 12px;
  font-weight: 700;
}

.detail-modal__badge--soft {
  background: #f4f4fb;
  color: var(--color-text-muted);
}

.detail-modal__code,
.detail-modal__date {
  font-size: 13px;
  color: var(--color-text-muted);
}

.detail-modal__author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #faf8ff;
}

.detail-modal__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-700);
  color: #fff;
  font-weight: 700;
}

.detail-modal__author strong,
.detail-modal__section h3 {
  font-size: 15px;
  color: var(--color-primary-800);
}

.detail-modal__author-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-modal__tier {
  padding: 2px 7px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
}

.detail-modal__tier--s { background: #00bf95; color: #fff; }
.detail-modal__tier--a { background: var(--color-primary-600); color: #fff; }
.detail-modal__tier--b { background: #ffd166; color: #2d237c; }
.detail-modal__tier--c { background: #ef476f; color: #fff; }

.detail-modal__author p {
  margin-top: 4px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.detail-modal__section {
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  background: #fff;
}

.detail-modal__section--deleted {
  border-color: var(--color-status-rejected-border, #f5b8c6);
  background: var(--color-status-rejected-bg, #fff0f4);
}

.detail-modal__content {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-default);
  white-space: pre-line;
}

.detail-modal__actions {
  justify-content: flex-end;
}

.detail-modal__ghost {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
  font-weight: 700;
  cursor: pointer;
}
</style>

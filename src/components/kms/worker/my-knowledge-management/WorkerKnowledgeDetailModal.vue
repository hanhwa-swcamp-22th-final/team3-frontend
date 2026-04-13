<script setup>
import { BaseModal } from '@/components/common/base'
import { ARTICLE_STATUS_LABEL, CATEGORY_CLASS_MAP } from '@/constants'

defineProps({
  article: { type: Object, required: true },
})

const emit = defineEmits(['close'])

function statusClass(status) {
  if (status === ARTICLE_STATUS_LABEL.APPROVED) return 'st--approved'
  if (status === ARTICLE_STATUS_LABEL.PENDING) return 'st--pending'
  if (status === ARTICLE_STATUS_LABEL.REJECTED) return 'st--rejected'
  return 'st--draft'
}

function categoryClass(cat) {
  return CATEGORY_CLASS_MAP[cat] || 'cat--default'
}
</script>

<template>
  <BaseModal
    :title="article.title"
    eyebrow="Knowledge Detail"
    width="600px"
    @close="emit('close')"
  >
    <!-- Badges -->
    <div class="kd__badges">
      <span class="kd__badge" :class="categoryClass(article.category)">
        {{ article.category }}
      </span>
      <span class="kd__badge kd__badge--equip">{{ article.equipment }}</span>
      <span class="kd__status" :class="statusClass(article.status)">
        {{ article.status }}
      </span>
    </div>

    <!-- Meta -->
    <div class="kd__meta">
      <span class="kd__date">{{ article.date }}</span>
      <span class="kd__sep">·</span>
      <span>조회수 {{ article.views }}</span>
      <span class="kd__sep">·</span>
      <span>재사용 {{ article.reuses }}회</span>
    </div>

    <!-- 반려 사유 (반려 상태일 때만 표시) -->
    <div v-if="article.status === '반려' && article.rejectionReason" class="kd__section kd__section--rejected">
      <h4 class="kd__section-title kd__section-title--rejected">반려 사유</h4>
      <p class="kd__text kd__text--rejected">{{ article.rejectionReason }}</p>
    </div>

    <!-- Summary -->
    <div class="kd__section">
      <h4 class="kd__section-title">요약</h4>
      <p class="kd__text">{{ article.summary }}</p>
    </div>

    <!-- Content -->
    <div class="kd__section">
      <h4 class="kd__section-title">본문</h4>
      <p class="kd__text kd__text--content">{{ article.content }}</p>
    </div>
  </BaseModal>
</template>

<style scoped>
/* ── Badges ───────────────────────────────────────────── */
.kd__badges {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.kd__badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: var(--radius-2xs);
}

.cat--precision {
  background: var(--color-primary-200);
  color: var(--color-primary-800);
}

.cat--inspection {
  background: var(--color-category-inspection-bg);
  color: var(--color-category-inspection);
}

.cat--quality {
  background: var(--color-category-quality-bg);
  color: var(--color-category-quality);
}

.cat--cnc {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.cat--default {
  background: var(--color-neutral-100);
  color: var(--color-text-muted);
}

.kd__badge--equip {
  background: var(--color-neutral-100);
  color: var(--color-text-strong);
  font-weight: 700;
}

.kd__status {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: var(--radius-2xs);
  border: 1px solid;
}

.st--approved {
  color: var(--color-status-approved);
  border-color: var(--color-status-approved-border);
  background: var(--color-status-approved-bg);
}

.st--pending {
  color: var(--color-status-pending);
  border-color: var(--color-status-pending-border);
  background: var(--color-status-pending-bg);
}

.st--rejected {
  color: var(--color-status-rejected);
  border-color: var(--color-status-rejected-border);
  background: var(--color-status-rejected-bg);
}

.st--draft {
  color: var(--color-text-muted);
  border-color: var(--color-border-default);
  background: var(--color-neutral-100);
}

/* ── Meta ─────────────────────────────────────────────── */
.kd__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.kd__date {
  color: var(--color-primary-600);
  font-weight: 600;
}

.kd__sep {
  color: var(--color-border-default);
}

/* ── Sections ─────────────────────────────────────────── */
.kd__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kd__section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.kd__text {
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.7;
  margin: 0;
}

.kd__text--content {
  white-space: pre-line;
  background: var(--color-bg-app);
  border-radius: var(--radius-sm);
  padding: 16px;
}

.kd__section--rejected {
  border: 1px solid var(--color-status-rejected-border, #f5b8c6);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  background: var(--color-status-rejected-bg, #fff0f4);
}

.kd__section-title--rejected {
  color: var(--color-status-rejected, #c0103e);
}

.kd__text--rejected {
  white-space: pre-line;
  color: var(--color-status-rejected, #c0103e);
}
</style>

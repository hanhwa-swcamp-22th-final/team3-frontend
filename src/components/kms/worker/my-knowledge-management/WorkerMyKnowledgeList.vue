<script setup>
import { ref, computed } from 'vue'
import { BaseFilterTabs } from '@/components/common/base'
import { CATEGORY_CLASS_MAP } from '@/constants'

const props = defineProps({
  articles: { type: Array, required: true },
})

const emit = defineEmits(['detail', 'edit'])

const categories = ['전체', '정밀가공', '설비점검', '품질관리', '승인대기', '반려']
const activeCategory = ref('전체')
const searchQuery = ref('')

const filteredArticles = computed(() => {
  let result = props.articles

  if (activeCategory.value !== '전체') {
    if (activeCategory.value === '승인대기') {
      result = result.filter((a) => a.status === '승인 대기')
    } else if (activeCategory.value === '반려') {
      result = result.filter((a) => a.status === '반려')
    } else {
      result = result.filter((a) => a.category === activeCategory.value)
    }
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.equipment.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q),
    )
  }

  return result
})

function statusClass(status) {
  if (status === '승인 완료') return 'st--approved'
  if (status === '승인 대기') return 'st--pending'
  if (status === '반려') return 'st--rejected'
  return 'st--draft'
}

function categoryClass(cat) {
  return CATEGORY_CLASS_MAP[cat] || 'cat--default'
}

function actionLabel(status) {
  if (status === '승인 완료') return '수정'
  if (status === '승인 대기') return '승인 요청'
  if (status === '반려') return '수정'
  return '수정'
}
</script>

<template>
  <div class="mkl">
    <span class="mkl__subtitle">지식 검색 및 문서 목록</span>
    <h3 class="mkl__title">내 지식 문서</h3>

    <!-- Search Bar -->
    <div class="mkl__search">
      <div class="mkl__search-box">
        <span class="mkl__search-icon">🔍</span>
        <input
          v-model="searchQuery"
          class="mkl__search-input"
          type="text"
          placeholder="제목, 설비명, 키워드로 검색"
        />
      </div>
      <button class="mkl__search-btn">검색</button>
    </div>

    <!-- Category Tabs -->
    <BaseFilterTabs
      v-model="activeCategory"
      :items="categories"
      variant="chip"
      class="mkl__tabs"
    />

    <!-- Article Cards -->
    <div class="mkl__list">
      <div v-for="article in filteredArticles" :key="article.id" class="mkl__card">
        <div class="mkl__card-top">
          <div class="mkl__card-badges">
            <span class="mkl__badge" :class="categoryClass(article.category)">
              {{ article.category }}
            </span>
            <span class="mkl__badge mkl__badge--equip">{{ article.equipment }}</span>
            <span class="mkl__status" :class="statusClass(article.status)">
              {{ article.status }}
            </span>
          </div>
          <span class="mkl__card-date">{{ article.date }}</span>
        </div>

        <h4 class="mkl__card-title">{{ article.title }}</h4>
        <p class="mkl__card-summary">{{ article.summary }}</p>

        <div class="mkl__card-bottom">
          <div class="mkl__card-meta">
            <span>조회수 {{ article.views }}</span>
            <span>댓글 {{ article.comments }}</span>
            <span>재사용 {{ article.reuses }}회</span>
          </div>
          <div class="mkl__card-actions">
            <button class="mkl__action-btn" @click="emit('detail', article)">상세</button>
            <button class="mkl__action-btn" @click="emit('edit', article)">{{ actionLabel(article.status) }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mkl {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mkl__subtitle {
  font-size: 12px;
  color: var(--color-primary-700);
  font-weight: 600;
}

.mkl__title {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-strong);
  margin: 0;
}

/* ── Search ───────────────────────────────────────────── */
.mkl__search {
  display: flex;
  gap: 10px;
  align-items: center;
}

.mkl__search-box {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 10px 16px;
  gap: 8px;
}

.mkl__search-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.mkl__search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text-default);
  background: transparent;
}

.mkl__search-input::placeholder {
  color: var(--color-text-muted);
}

.mkl__search-btn {
  padding: 10px 24px;
  background: var(--color-primary-800);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-base);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.mkl__search-btn:hover {
  background: var(--color-primary-700);
}

/* ── Tabs ─────────────────────────────────────────────── */
.mkl__tabs :deep(.base-filter-tabs__item--active) {
  background: var(--color-primary-800);
  color: var(--color-white);
  border-color: var(--color-primary-800);
}

/* ── Cards ────────────────────────────────────────────── */
.mkl__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mkl__card {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;
}

.mkl__card:hover {
  border-color: var(--color-primary-300);
}

.mkl__card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mkl__card-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.mkl__badge {
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

.mkl__badge--equip {
  background: var(--color-neutral-100);
  color: var(--color-text-strong);
  font-weight: 700;
}

.mkl__status {
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

.mkl__card-date {
  font-size: 13px;
  color: var(--color-primary-600);
  font-weight: 600;
}

.mkl__card-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-strong);
  margin: 0;
}

.mkl__card-summary {
  font-size: 13px;
  color: var(--color-text-default);
  line-height: 1.6;
  margin: 0;
}

.mkl__card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.mkl__card-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.mkl__card-actions {
  display: flex;
  gap: 8px;
}

.mkl__action-btn {
  padding: 8px 20px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  background: var(--color-bg-surface);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
  cursor: pointer;
  transition: all 0.15s;
}

.mkl__action-btn:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
}
</style>

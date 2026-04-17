<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BaseFilterTabs } from '@/components/common/base'
import { ARTICLE_STATUS_LABEL, CATEGORY_CLASS_MAP } from '@/constants'

const props = defineProps({
  articles: { type: Array, required: true },
})

const emit = defineEmits(['detail', 'edit', 'delete', 'restore'])

const categories = ['전체', '장애조치', '공정개선', '설비운영', '안전', '기타', '승인대기', '반려', '임시저장', '삭제대기']
const activeCategory = ref('전체')
const searchQuery = ref('')
const pageSize = 4
const route = useRoute()
const router = useRouter()

const filteredArticles = computed(() => {
  let result = props.articles

  if (activeCategory.value !== '전체') {
    if (activeCategory.value === '승인대기') {
      result = result.filter((a) => a.status === '승인대기')
    } else if (activeCategory.value === '반려') {
      result = result.filter((a) => a.status === '반려')
    } else if (activeCategory.value === '임시저장') {
      result = result.filter((a) => a.status === '임시저장')
    } else if (activeCategory.value === '삭제대기') {
      result = result.filter((a) => a.status === '삭제대기')
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

const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / pageSize)))
const currentPage = computed(() => Math.min(normalizePageQuery(route.query.p), totalPages.value))

const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const pageButtons = computed(() => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
})

function normalizePageQuery(value) {
  const parsed = Number.parseInt(Array.isArray(value) ? value[0] : value, 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }
  return parsed
}

function syncPageQuery(page) {
  const normalizedPage = normalizePageQuery(page)
  const nextQuery = { ...route.query }

  if (normalizedPage <= 1) {
    delete nextQuery.p
  } else {
    nextQuery.p = String(normalizedPage)
  }

  const currentQueryPage = Array.isArray(route.query.p) ? route.query.p[0] : route.query.p
  const nextQueryPage = nextQuery.p

  if ((currentQueryPage ?? undefined) === (nextQueryPage ?? undefined)) {
    return
  }

  void router.replace({ query: nextQuery })
}

watch([activeCategory, searchQuery], () => {
  syncPageQuery(1)
})

watch(filteredArticles, (articles) => {
  const nextTotal = Math.max(1, Math.ceil(articles.length / pageSize))
  if (articles.length === 0) {
    return
  }
  if (currentPage.value > nextTotal) {
    syncPageQuery(nextTotal)
  }
}, { immediate: true })

function statusClass(status) {
  if (status === '삭제대기') return 'st--deleted'
  if (status === ARTICLE_STATUS_LABEL.APPROVED) return 'st--approved'
  if (status === ARTICLE_STATUS_LABEL.PENDING) return 'st--pending'
  if (status === ARTICLE_STATUS_LABEL.REJECTED) return 'st--rejected'
  return 'st--draft'
}

function categoryClass(cat) {
  return CATEGORY_CLASS_MAP[cat] || 'cat--default'
}

function actionLabel(status) {
  if (status === ARTICLE_STATUS_LABEL.APPROVED) return '수정'
  if (status === ARTICLE_STATUS_LABEL.PENDING) return '수정'
  if (status === ARTICLE_STATUS_LABEL.REJECTED) return '수정'
  return '수정'
}

function setPage(page) {
  if (typeof page !== 'number' || Number.isNaN(page)) {
    return
  }

  const nextPage = Math.min(Math.max(page, 1), totalPages.value)
  if (nextPage === currentPage.value) {
    return
  }

  syncPageQuery(nextPage)
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
      <div
        v-for="article in pagedArticles"
        :key="article.id"
        class="mkl__card"
        :class="{ 'mkl__card--deleted': article.isDeleted }"
        tabindex="0"
        @click="emit('detail', article)"
        @keydown.enter="emit('detail', article)"
        @keydown.space.prevent="emit('detail', article)"
      >
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
            <span>수정 횟수 {{ article.reuses }}회</span>
          </div>
          <div class="mkl__card-actions">
            <button class="mkl__action-btn" @click.stop="emit('detail', article)">상세</button>
            <button
              v-if="!article.isDeleted"
              class="mkl__action-btn"
              @click.stop="emit('edit', article)"
            >
              {{ actionLabel(article.status) }}
            </button>
            <button
              v-if="!article.isDeleted && article.rawStatus !== 'APPROVED'"
              class="mkl__action-btn mkl__action-btn--delete"
              @click.stop="emit('delete', article)"
            >
              삭제
            </button>
            <button
              v-if="article.isDeleted"
              class="mkl__action-btn mkl__action-btn--restore"
              @click.stop="emit('restore', article)"
            >
              복원
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredArticles.length === 0" class="mkl__empty">조건에 맞는 문서가 없습니다.</div>
    </div>

    <div v-if="filteredArticles.length > 0" class="mkl__pagination">
      <button
        type="button"
        class="mkl__page mkl__page--nav"
        :disabled="currentPage <= 1"
        @click="setPage(currentPage - 1)"
      >
        &lt;
      </button>
      <template v-for="(page, index) in pageButtons" :key="`${page}-${index}`">
        <span v-if="page === '...'" class="mkl__ellipsis">...</span>
      <button
        v-else
        type="button"
        class="mkl__page"
        :class="{ 'mkl__page--active': currentPage === page }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
      </template>
      <button
        type="button"
        class="mkl__page mkl__page--nav"
        :disabled="currentPage >= totalPages"
        @click="setPage(currentPage + 1)"
      >
        &gt;
      </button>
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

.mkl__empty {
  min-height: 180px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
}

.mkl__card {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.mkl__card:hover,
.mkl__card:focus-visible {
  border-color: var(--color-primary-300);
  outline: none;
}

.mkl__card--deleted {
  border-color: var(--color-status-rejected-border);
  background: var(--color-status-rejected-bg);
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

.st--deleted {
  color: var(--color-status-rejected);
  border-color: var(--color-status-rejected-border);
  background: var(--color-status-rejected-bg);
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

.mkl__action-btn--delete {
  border-color: var(--color-status-rejected-border);
  color: var(--color-status-rejected);
  background: var(--color-status-rejected-bg);
}

.mkl__action-btn--delete:hover {
  border-color: var(--color-status-rejected);
  color: var(--color-status-rejected);
}

.mkl__action-btn--restore {
  border-color: var(--color-status-approved-border);
  color: var(--color-status-approved);
  background: var(--color-status-approved-bg);
}

.mkl__action-btn--restore:hover {
  border-color: var(--color-status-approved);
  color: var(--color-status-approved);
}

.mkl__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 4px;
}

.mkl__page {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.mkl__page:disabled {
  opacity: 0.45;
  cursor: default;
}

.mkl__page--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: #fff;
}

.mkl__ellipsis {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
}
</style>

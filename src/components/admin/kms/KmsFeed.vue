<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  categories:        { type: Array,  default: () => [] },
  articles:          { type: Array,  default: () => [] },
  selectedFilter:    { type: String, default: 'all' },
})
const emit = defineEmits(['filterChange', 'delete', 'restore', 'open-detail', 'toggle-bookmark'])
const showAllCategories = ref(false)
const defaultVisibleCategoryCount = 3
const searchInput = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 4
const isComposing = ref(false)

const filteredCards = computed(() => {
  let list = [...props.articles]

  if (props.selectedFilter === 'popular') {
    list = list.filter((card) => card.isPopular)
  } else if (props.selectedFilter === 'bookmarked') {
    list = list.filter((card) => card.bookmarked)
  } else if (props.selectedFilter !== 'all') {
    list = list.filter((card) => card.category === props.selectedFilter)
  }

  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) {
    return list
  }

  return list.filter((card) =>
    [card.title, card.summary, card.equipment, card.author?.name, ...(card.tags ?? [])]
      .join(' ')
      .toLowerCase()
      .includes(keyword),
  )
})

const primaryCategories = computed(() => props.categories.slice(0, defaultVisibleCategoryCount))
const hiddenCategories = computed(() => props.categories.slice(defaultVisibleCategoryCount))
const hasHiddenCategories = computed(() => hiddenCategories.value.length > 0)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredCards.value.length / pageSize)))
const pagedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCards.value.slice(start, start + pageSize)
})
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

watch(() => [props.selectedFilter, searchQuery.value], () => {
  currentPage.value = 1
})

watch(filteredCards, (cards) => {
  const nextTotal = Math.max(1, Math.ceil(cards.length / pageSize))
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal
  }
})

function setPage(page) {
  currentPage.value = page
}

function handleSearchInput(event) {
  searchInput.value = event.target.value
  if (!isComposing.value) {
    searchQuery.value = searchInput.value
  }
}

function handleCompositionStart() {
  isComposing.value = true
}

function handleCompositionEnd(event) {
  isComposing.value = false
  searchInput.value = event.target.value
  searchQuery.value = searchInput.value
}

function tierClass(tier) {
  if (tier === 'S') return 'author-tier--s'
  if (tier === 'A') return 'author-tier--a'
  if (tier === 'B') return 'author-tier--b'
  return 'author-tier--c'
}

function categoryClass(category) {
  const map = {
    장애조치: 'card-tag--precision',
    공정개선: 'card-tag--inspection',
    설비운영: 'card-tag--quality',
    안전: 'card-tag--safety',
  }
  return map[category] || 'card-tag--default'
}
</script>

<template>
  <div class="kms-feed">
    <div class="kms-feed__top">
      <div>
        <p class="kms-feed__eyebrow">지식 허브</p>
      </div>
    </div>

    <div class="feed-controls">
      <!-- 필터 탭 -->
      <div class="filter-row">
        <div class="feed-tabs-wrap">
          <div class="feed-tabs-main">
            <div class="feed-tabs">
              <button
                v-for="filter in primaryCategories"
                :key="filter.key"
                type="button"
                class="feed-tab"
                :class="{ 'feed-tab--active': selectedFilter === filter.key }"
                @click="emit('filterChange', filter.key)"
              >
                {{ filter.label }}
              </button>
            </div>

            <Transition name="feed-expand">
              <div v-if="showAllCategories" class="feed-tabs feed-tabs--expanded">
                <button
                  v-for="filter in hiddenCategories"
                  :key="filter.key"
                  type="button"
                  class="feed-tab"
                  :class="{ 'feed-tab--active': selectedFilter === filter.key }"
                  @click="emit('filterChange', filter.key)"
                >
                  {{ filter.label }}
                </button>
              </div>
            </Transition>
          </div>

          <button
            v-if="hasHiddenCategories"
            type="button"
            class="feed-more"
            @click="showAllCategories = !showAllCategories"
          >
            {{ showAllCategories ? '접기' : '+ 더보기' }}
          </button>
        </div>
      </div>

      <input
        :value="searchInput"
        class="feed-search"
        type="text"
        placeholder="지식 검색"
        @input="handleSearchInput"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      />
    </div>

    <!-- 지식 카드 목록 -->
    <div class="card-list">
      <div
        v-for="card in pagedCards"
        :key="card.id"
        class="knowledge-card"
        :class="{ 'knowledge-card--deleted': card.isDeleted }"
        @click="emit('open-detail', card)"
      >

        <!-- 카드 헤더 -->
        <div class="card-header">
          <div class="card-tags">
            <span v-if="card.isDeleted" class="card-tag card-tag--deleted">삭제대기</span>
            <span v-if="card.isPopular" class="card-tag card-tag--popular">인기</span>
            <span class="card-tag" :class="categoryClass(card.category)">{{ card.category }}</span>
            <span v-if="card.equipment" class="card-tag card-tag--equip">{{ card.equipment }}</span>
            <span
              v-for="tag in card.tags"
              :key="tag"
              class="card-tag"
              :style="tagStyle(tag)"
            >{{ tag }}</span>
          </div>
          <div class="card-header-right">
            <span class="card-date">{{ card.date }}</span>
            <button
              class="btn-bookmark"
              :class="{ 'btn-bookmark--active': card.bookmarked }"
              :aria-pressed="card.bookmarked"
              title="북마크"
              @click.stop="emit('toggle-bookmark', card)"
            >
              {{ card.bookmarked ? '★' : '☆' }}
            </button>
          </div>
        </div>

        <!-- 카드 본문 -->
        <div class="card-body">
          <span class="card-title">{{ card.title }}</span>
          <span class="card-summary">{{ card.summary }}</span>
        </div>

        <!-- 카드 푸터 -->
        <div class="card-footer">
          <div class="author-info">
            <div class="author-avatar" :style="{ background: card.author.color }">
              {{ card.author.initial }}
            </div>
            <span class="author-name">{{ card.author.name }}</span>
            <span class="author-tier" :class="tierClass(card.author.tier)">{{ card.author.tier }}</span>
          </div>
          <div class="card-meta">
            <span class="meta-item">👁 {{ card.views }}</span>
          </div>
          <div class="card-actions">
            <button
              v-if="card.isDeleted"
              type="button"
              class="card-action-btn card-action-btn--restore"
              @click.stop="emit('restore', card.id)"
            >
              복원
            </button>
            <button
              v-else
              type="button"
              class="card-action-btn card-action-btn--delete"
              @click.stop="emit('delete', card.id)"
            >
              삭제
            </button>
          </div>
        </div>

      </div>

      <div v-if="filteredCards.length === 0" class="feed-empty">
        해당 조건의 문서가 없습니다.
      </div>
    </div>

    <div v-if="filteredCards.length > 0" class="feed-pagination">
      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        class="feed-page"
        :class="{ 'feed-page--active': currentPage === page }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.kms-feed {
  height: 100%;
  min-height: 0;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  padding: 22px;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 12px;
  font-family: var(--font-family-base);
  overflow: hidden;
  box-sizing: border-box;
}

.kms-feed__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.kms-feed__eyebrow {
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-300);
}

.feed-controls {
  display: grid;
  gap: 12px;
}

.filter-row {
  display: block;
}

.feed-search {
  height: 42px;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 0 14px;
  font-size: var(--font-size-base);
  color: var(--color-text-default);
  background: var(--color-bg-surface);
}

.feed-tabs-wrap {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.feed-tabs-main {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.feed-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feed-tabs--expanded {
  min-width: 0;
  overflow: hidden;
  flex-wrap: nowrap;
  flex: 1;
}

.feed-tab {
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-text-default);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  white-space: nowrap;
}

.feed-tab--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: #fff;
}

.feed-more {
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  white-space: nowrap;
  margin-left: auto;
  flex-shrink: 0;
}

/* 지식 카드 */
.card-list {
  display: grid;
  gap: 10px;
  align-content: start;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.knowledge-card {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.knowledge-card:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 12px 24px rgba(62, 42, 156, 0.08);
  transform: translateY(-1px);
}

.knowledge-card--deleted {
  border-color: var(--color-status-rejected-border);
  background: var(--color-status-rejected-bg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  padding: 3px 8px;
  border-radius: 999px;
}

.card-tag--deleted {
  background: var(--color-status-rejected-bg);
  color: var(--color-status-rejected);
  border: 1px solid var(--color-status-rejected-border);
}

.card-tag--popular { background: #fff1cc; color: #d98c00; }
.card-tag--precision { background: #efeaff; color: var(--color-primary-700); }
.card-tag--inspection { background: #e8fbf7; color: #10937f; }
.card-tag--quality { background: #ffe8ef; color: #db2952; }
.card-tag--safety { background: #edf4ff; color: #3662c7; }
.card-tag--default,
.card-tag--equip { background: #f4f4fb; color: var(--color-text-muted); }

.card-date {
  font-size: var(--font-size-2xs);
  color: var(--color-text-muted);
}

.btn-bookmark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-bookmark--active {
  border-color: #f2c94c;
  background: #fff8dc;
  color: #e0a800;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.card-summary {
  font-size: var(--font-size-xs-plus);
  color: var(--color-text-muted);
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.author-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-inverse);
  flex-shrink: 0;
}

.author-name {
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.author-tier {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-extrabold);
}

.author-tier--s { background: #00bf95; color: #fff; }
.author-tier--a { background: var(--color-primary-600); color: #fff; }
.author-tier--b { background: #ffd166; color: #2d237c; }
.author-tier--c { background: #ef476f; color: #fff; }

.card-meta {
  display: flex;
  gap: 10px;
}

.card-actions {
  margin-left: auto;
}

.card-action-btn {
  height: 30px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.card-action-btn--delete {
  border-color: var(--color-status-rejected-border);
  color: var(--color-status-rejected);
  background: var(--color-status-rejected-bg);
}

.card-action-btn--restore {
  border-color: var(--color-status-approved-border);
  color: var(--color-status-approved);
  background: var(--color-status-approved-bg);
}

.meta-item {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.feed-empty {
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  border: 1px dashed var(--color-border-default);
  border-radius: 16px;
}

.feed-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 4px;
  flex-shrink: 0;
}

.feed-page {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-text-default);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.feed-page--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: var(--color-white);
}

.feed-expand-enter-active,
.feed-expand-leave-active {
  transition: max-width 0.28s ease, opacity 0.22s ease, transform 0.22s ease;
}

.feed-expand-enter-from,
.feed-expand-leave-to {
  max-width: 0;
  opacity: 0;
  transform: translateX(-8px);
}

.feed-expand-enter-to,
.feed-expand-leave-from {
  max-width: 480px;
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 860px) {
  .feed-tabs-wrap,
  .feed-tabs-main {
    flex-wrap: wrap;
  }

  .feed-tabs--expanded {
    flex: 0 0 100%;
    flex-wrap: wrap;
  }

  .feed-more {
    margin-left: 0;
  }

  .feed-expand-enter-to,
  .feed-expand-leave-from {
    max-width: 100%;
  }

  .card-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .card-actions {
    margin-left: 0;
  }
}
</style>

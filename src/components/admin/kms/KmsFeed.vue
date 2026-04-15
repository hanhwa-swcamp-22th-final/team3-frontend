<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  categories:        { type: Array,  default: () => [] },
  articles:          { type: Array,  default: () => [] },
  selectedFilter:    { type: String, default: 'all' },
  selectedTagFilter: { type: String, default: null },
  tagFilters:        { type: Array,  default: () => [] },
})
const emit = defineEmits(['filterChange', 'tagFilterChange', 'delete', 'restore', 'open-detail', 'toggle-bookmark'])
const showAllCategories = ref(false)
const defaultVisibleCategoryCount = 3

const TAG_PALETTE = [
  {
    bg: 'var(--color-success-soft, #dcfce7)',
    color: 'var(--color-success-text, #028a6b)',
  },
  {
    bg: 'var(--color-primary-100, #efeaff)',
    color: 'var(--color-primary-700, #5b4fcf)',
  },
  {
    bg: 'var(--color-warning-soft, #fef3c7)',
    color: 'var(--color-warning-text, #a07000)',
  },
  {
    bg: 'var(--color-danger-bg, #ffecf1)',
    color: 'var(--color-danger-text, #c0103e)',
  },
  {
    bg: 'var(--color-bg-surface-muted, #f8f7ff)',
    color: 'var(--color-text-muted, #7a6fa8)',
  },
]

const filteredCards = computed(() => {
  let list = [...props.articles]

  if (props.selectedFilter === 'popular') {
    list = list.filter((card) => card.isPopular)
  } else if (props.selectedFilter === 'bookmarked') {
    list = list.filter((card) => card.bookmarked)
  } else if (props.selectedFilter !== 'all') {
    list = list.filter((card) => card.category === props.selectedFilter)
  }

  if (props.selectedTagFilter) {
    list = list.filter((card) =>
      card.tags.some((t) => t === props.selectedTagFilter),
    )
  }

  return list
})

const primaryCategories = computed(() => props.categories.slice(0, defaultVisibleCategoryCount))
const hiddenCategories = computed(() => props.categories.slice(defaultVisibleCategoryCount))
const hasHiddenCategories = computed(() => hiddenCategories.value.length > 0)

function getPaletteIndex(tag) {
  const value = String(tag ?? '')
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % TAG_PALETTE.length
  }
  return Math.abs(hash) % TAG_PALETTE.length
}

function getKmsTagStyle(tag) {
  if (!tag) {
    return TAG_PALETTE[0]
  }
  return TAG_PALETTE[getPaletteIndex(tag)]
}

function tagStyle(tag) {
  const found = props.tagFilters.find((t) => t.key === tag)
  if (found?.bg && found?.color) return { background: found.bg, color: found.color }
  return getKmsTagStyle(tag)
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

    <!-- 필터 탭 + 태그 필터 (한 행) -->
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
      <template v-if="props.tagFilters.length > 0">
        <span
          v-for="t in props.tagFilters"
          :key="t.key"
          class="tag-chip"
          :style="selectedTagFilter === t.key
            ? { background: 'var(--color-primary-800)', color: 'var(--color-text-inverse)' }
            : { background: t.bg, color: t.color }
          "
          @click="emit('tagFilterChange', selectedTagFilter === t.key ? null : t.key)"
        >{{ t.key }}</span>
      </template>
    </div>

    <!-- 지식 카드 목록 -->
    <div class="card-list">
      <div
        v-for="card in filteredCards"
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

  </div>
</template>

<style scoped>
.kms-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: var(--font-family-base);
}

/* 필터 + 태그 한 행 */
.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
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
  background: #fff;
  color: var(--color-text-default);
  font-size: 13px;
  font-weight: 700;
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
  background: #fff;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  margin-left: auto;
  flex-shrink: 0;
}

.tag-chip {
  height: 36px;
  padding: 0 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.15s;
}

/* 지식 카드 */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.knowledge-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  background: var(--color-bg-surface, #ffffff);
  border: 1.5px solid var(--color-border-default, #e0dcff);
  border-radius: 12px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.knowledge-card:hover {
  box-shadow: 0 2px 12px rgba(45, 31, 110, 0.08);
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
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
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
  font-size: 10px;
  color: var(--color-text-muted, #a89ed8);
}

.btn-bookmark {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-muted);
  font-size: 12px;
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
  gap: 5px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-800, #2d1f6e);
}

.card-summary {
  font-size: 12px;
  color: var(--color-text-sub, #7a6fa8);
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
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-inverse);
  flex-shrink: 0;
}

.author-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary-800);
}

.author-tier {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
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
  background: #fff;
  font-size: 12px;
  font-weight: 700;
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
  font-size: 11px;
  color: var(--color-text-muted, #a89ed8);
}

.feed-empty {
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 13px;
  border: 1px dashed var(--color-border-default);
  border-radius: 12px;
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
}
</style>

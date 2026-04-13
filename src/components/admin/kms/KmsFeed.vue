<script setup>
import { computed } from 'vue'
import { KMS_TAG_FILTERS, TAG_STYLE } from '@/mocks/admin/kms/kmsData.js'
import { BaseFilterTabs } from '@/components/common/base'

const props = defineProps({
  articles:          { type: Array,  default: () => [] },
  selectedFilter:    { type: String, default: '전체' },
  selectedTagFilter: { type: String, default: null },
})
const emit = defineEmits(['filterChange', 'tagFilterChange', 'delete', 'restore', 'open-detail', 'toggle-bookmark'])

// 카테고리 탭 (백엔드 기준)
const KMS_FILTERS = [
  { key: '전체' },
  { key: '인기' },
  { key: '내 북마크' },
]

// 태그 필터 (백엔드 카테고리 기준)
const tagFilters = [
  { key: '장애조치', bg: '#E3FBEF', color: '#007A60' },
  { key: '공정개선', bg: '#F0EEFF', color: '#5B4FCF' },
  { key: '설비운영', bg: '#FFF8E0', color: '#A07000' },
  { key: '안전',     bg: '#FFECF1', color: '#C0103E' },
  { key: '기타',     bg: '#F4F4FB', color: '#7A6FA8' },
]

const filteredCards = computed(() => {
  let list = [...props.articles]

  if (props.selectedFilter === '인기') {
    list = list.filter((card) => card.isPopular)
  } else if (props.selectedFilter === '내 북마크') {
    list = list.filter((card) => card.bookmarked)
  }

  if (props.selectedTagFilter) {
    list = list.filter((card) =>
      card.tags.some((t) => t === props.selectedTagFilter),
    )
  }

  return list
})

function tagStyle(tag) {
  const found = tagFilters.find((t) => t.key === tag)
  if (found) return { background: found.bg, color: found.color }
  if (TAG_STYLE[tag]) return { background: TAG_STYLE[tag].bg, color: TAG_STYLE[tag].color }
  return { background: 'var(--color-primary-100)', color: 'var(--color-primary-600)' }
}
</script>

<template>
  <div class="kms-feed">

    <!-- 필터 탭 + 태그 필터 (한 행) -->
    <div class="filter-row">
      <BaseFilterTabs
        :items="KMS_FILTERS.map((f) => ({ key: f.key, label: f.key }))"
        :model-value="selectedFilter"
        variant="chip"
        class="kms-filter-tabs"
        @change="emit('filterChange', $event)"
      />
      <span
        v-for="t in tagFilters"
        :key="t.key"
        class="tag-chip"
        :style="selectedTagFilter === t.key
          ? { background: 'var(--color-primary-800)', color: 'var(--color-text-inverse)' }
          : { background: t.bg, color: t.color }
        "
        @click="emit('tagFilterChange', selectedTagFilter === t.key ? null : t.key)"
      >{{ t.key }}</span>
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
            <span class="author-tier" :class="`author-tier--${String(card.author.tier ?? 'C').toLowerCase()}`">{{ card.author.tier }}</span>
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

/* 필터 탭 */
.kms-filter-tabs :deep(.base-filter-tabs__item) {
  height: 32px;
  padding: 7px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 400;
  border: 1px solid var(--color-border-default, #e0dcff);
  transition: background 0.15s;
}

.kms-filter-tabs :deep(.base-filter-tabs__item--active) {
  background: var(--color-primary-800);
  color: var(--color-text-inverse);
  border-color: var(--color-primary-800);
}

/* 필터 + 태그 한 행 */
.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-chip {
  height: 28px;
  padding: 0 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
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
</style>

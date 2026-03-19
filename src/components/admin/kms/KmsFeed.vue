<script setup>
import { computed } from 'vue'
import {
  KMS_FILTERS,
  KMS_TAG_FILTERS,
  DUMMY_KNOWLEDGE,
  TAG_STYLE,
  TIER_BADGE,
} from '@/mocks/admin/kms/kmsData.js'
import BaseFilterTabs from '@/components/common/base/navigation/BaseFilterTabs.vue'

const props = defineProps({
  selectedFilter:    { type: String, default: '전체' },
  selectedTagFilter: { type: String, default: null },
})
const emit = defineEmits(['filterChange', 'tagFilterChange'])

const filteredCards = computed(() => {
  let list = [...DUMMY_KNOWLEDGE]

  // 탭 필터 적용
  if (props.selectedFilter === '인기') {
    list = list.filter(card => card.tags.includes('🔥 인기'))
  } else if (props.selectedFilter === '최신') {
    list = list.sort((a, b) => b.date.localeCompare(a.date))
  } else if (props.selectedFilter === '내 구독') {
    list = list.filter(card => card.subscribed)
  }

  // 태그 필터 적용 (AND 조합)
  if (props.selectedTagFilter) {
    list = list.filter(card =>
      card.tags.some(t => t === props.selectedTagFilter)
    )
  }

  return list
})
</script>

<template>
  <div class="kms-feed">

    <!-- 필터 탭 + 태그 필터 (한 행) -->
    <div class="filter-row">
      <BaseFilterTabs
        :items="KMS_FILTERS.map(f => ({ key: f.key, label: f.key }))"
        :model-value="selectedFilter"
        variant="chip"
        class="kms-filter-tabs"
        @change="emit('filterChange', $event)"
      />
      <span
        v-for="t in KMS_TAG_FILTERS"
        :key="t.key"
        class="tag-chip"
        :style="selectedTagFilter === t.key
          ? { background: 'var(--color-primary-800, #2d1f6e)', color: '#ffffff' }
          : { background: t.bg, color: t.color }
        "
        @click="emit('tagFilterChange', selectedTagFilter === t.key ? null : t.key)"
      >{{ t.key }}</span>
    </div>

    <!-- 지식 카드 목록 -->
    <div class="card-list">
      <div v-for="card in filteredCards" :key="card.id" class="knowledge-card">

        <!-- 카드 헤더 -->
        <div class="card-header">
          <div class="card-tags">
            <span
              v-for="tag in card.tags"
              :key="tag"
              class="card-tag"
              :style="TAG_STYLE[tag]
                ? { background: TAG_STYLE[tag].bg, color: TAG_STYLE[tag].color }
                : { background: '#f0eeff', color: '#5b4fcf' }
              "
            >{{ tag }}</span>
          </div>
          <span class="card-date">{{ card.date }}</span>
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
            <span
              class="tier-badge"
              :style="TIER_BADGE[card.author.tier]
                ? { background: TIER_BADGE[card.author.tier].bg, color: TIER_BADGE[card.author.tier].color }
                : {}"
            >{{ card.author.tier }}</span>
          </div>
          <div class="card-meta">
            <span class="meta-item">👁 {{ card.views }}</span>
            <span class="meta-item">💬 {{ card.comments }}</span>
          </div>
        </div>

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
  background: var(--color-primary-800, #2d1f6e);
  color: #ffffff;
  border-color: var(--color-primary-800, #2d1f6e);
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.card-date {
  font-size: 10px;
  color: var(--color-text-muted, #a89ed8);
  flex-shrink: 0;
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
  color: #ffffff;
  flex-shrink: 0;
}

.author-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary-800, #2d1f6e);
}

.tier-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
}

.card-meta {
  display: flex;
  gap: 10px;
}

.meta-item {
  font-size: 11px;
  color: var(--color-text-muted, #a89ed8);
}
</style>

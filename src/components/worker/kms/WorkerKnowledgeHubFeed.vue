<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  articles: { type: Array, required: true },
})

const categories = ['전체', '인기', '최신', '내 구독', '정밀가공', '설비점검', '품질관리']
const activeCategory = ref('전체')

const filteredArticles = computed(() => {
  if (activeCategory.value === '전체') return props.articles
  if (activeCategory.value === '인기') return props.articles.filter((a) => a.isPopular)
  if (activeCategory.value === '최신') return [...props.articles].sort((a, b) => b.id - a.id)
  if (activeCategory.value === '내 구독') return props.articles.filter((a) => a.authorTier === 'S')
  return props.articles.filter((a) => a.category === activeCategory.value)
})

function tierClass(tier) {
  if (tier === 'S') return 'tier--s'
  if (tier === 'A') return 'tier--a'
  if (tier === 'B') return 'tier--b'
  return 'tier--c'
}

function categoryClass(cat) {
  const map = {
    '정밀가공': 'cat--precision',
    '설비점검': 'cat--inspection',
    '품질관리': 'cat--quality',
    'CNC가공': 'cat--cnc',
  }
  return map[cat] || 'cat--default'
}
</script>

<template>
  <div class="kf">
    <span class="kf__label">📚 지식 피드</span>

    <!-- Category Tabs -->
    <div class="kf__tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        class="kf__tab"
        :class="{
          'kf__tab--active': activeCategory === cat,
          'kf__tab--domain': ['정밀가공', '설비점검', '품질관리'].includes(cat),
        }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
      <button class="kf__tab kf__tab--more">+ 더보기</button>
    </div>

    <!-- Article Cards -->
    <div class="kf__list">
      <div v-for="article in filteredArticles" :key="article.id" class="kf__card">
        <div class="kf__card-top">
          <div class="kf__card-tags">
            <span v-if="article.isPopular" class="kf__tag kf__tag--popular">🔥 인기</span>
            <span class="kf__tag" :class="categoryClass(article.category)">
              {{ article.category }}
            </span>
            <span class="kf__tag kf__tag--equip">{{ article.equipment }}</span>
          </div>
          <span class="kf__card-date">{{ article.date }}</span>
        </div>

        <h4 class="kf__card-title">{{ article.title }}</h4>
        <p class="kf__card-preview">{{ article.preview }}</p>

        <div class="kf__card-bottom">
          <div class="kf__card-author">
            <span class="kf__avatar">{{ article.authorInitial }}</span>
            <span class="kf__author-name">{{ article.author }}</span>
            <span class="kf__tier" :class="tierClass(article.authorTier)">
              {{ article.authorTier }}
            </span>
          </div>
          <div class="kf__card-meta">
            <span>👁 {{ article.views }}</span>
            <span>💬 {{ article.comments }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kf {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kf__label {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* ── Tabs ──────────────────────────────────────────────── */
.kf__tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.kf__tab {
  padding: 8px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
  cursor: pointer;
  transition: all 0.15s;
}

.kf__tab--active {
  background: var(--color-primary-800);
  color: #ffffff;
  border-color: var(--color-primary-800);
}

.kf__tab--domain:not(.kf__tab--active) {
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
}

.kf__tab--more {
  border: none;
  color: var(--color-text-muted);
  font-weight: 500;
}

/* ── Article Cards ─────────────────────────────────────── */
.kf__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kf__card {
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;
}

.kf__card:hover {
  border-color: var(--color-primary-300);
  cursor: pointer;
}

.kf__card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kf__card-tags {
  display: flex;
  gap: 6px;
  align-items: center;
}

.kf__tag {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
}

.kf__tag--popular {
  background: #FFF8E1;
  color: #F57F17;
}

.cat--precision {
  background: var(--color-primary-200);
  color: var(--color-primary-800);
}

.cat--inspection {
  background: #E0F2FE;
  color: #0277BD;
}

.cat--quality {
  background: #FCE4EC;
  color: #C62828;
}

.cat--cnc {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.cat--default {
  background: var(--color-neutral-100);
  color: var(--color-text-muted);
}

.kf__tag--equip {
  background: var(--color-neutral-100);
  color: var(--color-text-muted);
  font-weight: 600;
}

.kf__card-date {
  font-size: 13px;
  color: var(--color-primary-600);
  font-weight: 600;
}

.kf__card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.kf__card-preview {
  font-size: 13px;
  color: var(--color-text-default);
  line-height: 1.6;
  margin: 0;
}

.kf__card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.kf__card-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kf__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-700);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kf__author-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
}

.kf__tier {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  color: #ffffff;
}

.tier--s {
  background: #00BF95;
}

.tier--a {
  background: var(--color-primary-600);
}

.tier--b {
  background: #FFD166;
  color: var(--color-text-strong);
}

.tier--c {
  background: #EF476F;
}

.kf__card-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
